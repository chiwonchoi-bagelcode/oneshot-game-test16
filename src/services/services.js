// Release integration points. Every external service sits behind one of these small adapters so
// the real SDK can be dropped in later without touching game code. Nothing here ever blocks play
// or shows a popup: failures are silent and the game keeps its local save.
//
//  Auth       -> replace GuestAuth with Google Play Games / Game Center sign-in.
//                Called once at boot (app.js: boot) — returns a player id used by cloud save + analytics.
//  CloudSave  -> replace LocalOnlyCloud with Play Games Saved Games / iCloud / your backend.
//                push() is called after every save (debounced 5s, meta/save.js), pull() at boot;
//                the newer `updatedAt` wins.
//  Analytics  -> replace ConsoleSink with Firebase / GameAnalytics / Amplitude.
//                Events are defined in meta/analytics.js (EVENTS) and queued until flush().

export class GuestAuth {
  async signIn() {
    let id = null;
    try { id = localStorage.getItem('ps.playerId'); } catch (e) { /* storage blocked */ }
    if (!id) {
      id = 'guest-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
      try { localStorage.setItem('ps.playerId', id); } catch (e) { /* ignore */ }
    }
    return { playerId: id, provider: 'guest' };
  }
}

export class LocalOnlyCloud {
  // pull(): resolve with { data, updatedAt } or null when the cloud has nothing newer.
  async pull(/* playerId */) { return null; }
  // push(): fire and forget. Real implementation uploads JSON.stringify(data).
  async push(/* playerId, data, updatedAt */) { return true; }
}

export class ConsoleSink {
  constructor() { this.buffer = []; this.debug = false; }
  send(batch) {
    // Real SDK: for (const e of batch) sdk.logEvent(e.name, e.params)
    for (const e of batch) this.buffer.push(e);
    if (this.buffer.length > 500) this.buffer.splice(0, this.buffer.length - 500);
    if (this.debug) for (const e of batch) console.log('[analytics]', e.name, e.params);
  }
}

export const services = {
  auth: new GuestAuth(),
  cloud: new LocalOnlyCloud(),
  analyticsSink: new ConsoleSink(),
};
