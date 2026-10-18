// Builds out/release/index.html: every release deliverable on one page (works from file://, so the
// markdown documents are embedded at build time). node tools/make-showcase.mjs
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const rel = path.join(root, 'out/release');
const read = (p) => (fs.existsSync(path.join(rel, p)) ? fs.readFileSync(path.join(rel, p), 'utf8') : '');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// small markdown renderer: headings, lists, tables, code, bold/italic, links, paragraphs
function md(src) {
  const inline = (t) => esc(t)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, a, b) => `<a href="${b}">${a}</a>`);
  const lines = src.replace(/\r/g, '').split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (/^```/.test(l)) {
      const buf = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
      i++;
      out.push(`<pre><code>${esc(buf.join('\n'))}</code></pre>`);
      continue;
    }
    const h = l.match(/^(#{1,4})\s+(.*)/);
    if (h) { out.push(`<h${h[1].length + 1}>${inline(h[2])}</h${h[1].length + 1}>`); i++; continue; }
    if (/^\s*\|/.test(l)) {
      const rows = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) rows.push(lines[i++]);
      const cells = (r) => r.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const body = rows.filter((r, k) => !(k === 1 && /^[\s|:-]+$/.test(r)));
      out.push('<div class="tbl"><table>' + body.map((r, k) => `<tr>${cells(r).map((c) => (k === 0 ? `<th>${inline(c)}</th>` : `<td>${inline(c)}</td>`)).join('')}</tr>`).join('') + '</table></div>');
      continue;
    }
    if (/^\s*([-*·]|\d+\.)\s+/.test(l)) {
      const ordered = /^\s*\d+\./.test(l);
      const items = [];
      while (i < lines.length && /^\s*([-*·]|\d+\.)\s+/.test(lines[i])) {
        let item = lines[i].replace(/^\s*([-*·]|\d+\.)\s+/, '');
        i++;
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*([-*·]|\d+\.)\s+/.test(lines[i])) item += ' ' + lines[i++].trim();
        items.push(`<li>${inline(item)}</li>`);
      }
      out.push(ordered ? `<ol>${items.join('')}</ol>` : `<ul>${items.join('')}</ul>`);
      continue;
    }
    if (/^---+\s*$/.test(l)) { out.push('<hr>'); i++; continue; }
    if (!l.trim()) { i++; continue; }
    const para = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|```|\s*\||\s*([-*·]|\d+\.)\s+|---+\s*$)/.test(lines[i])) para.push(lines[i++]);
    out.push(`<p>${inline(para.join(' '))}</p>`);
  }
  return out.join('\n');
}

const shots = (dir) => (fs.existsSync(path.join(rel, dir)) ? fs.readdirSync(path.join(rel, dir)).filter((f) => /^\d+\.png$/.test(f)).sort((a, b) => parseInt(a) - parseInt(b)) : []);
const size = (p) => (fs.existsSync(path.join(rel, p)) ? (fs.statSync(path.join(rel, p)).size / 1e6).toFixed(1) + ' MB' : '');
const videos = [
  ['trailer.mp4', '스토어용 (한국어 화면, 자막 트랙 선택)', 'Store cut (Korean UI, selectable subtitle tracks)'],
  ['trailer-ad-ko.mp4', '광고용 · 한국어 자막 입힘', 'Ad cut · Korean captions burned in'],
  ['trailer-ad-en.mp4', '광고용 · 영어 화면 + 영어 자막', 'Ad cut · English UI + captions'],
].filter(([f]) => fs.existsSync(path.join(rel, f)));
const docs = [
  ['plan', '기획서 plan.md', read('plan.md')],
  ['report', '보고서 report.md', read('report.md')],
  ['analytics', '분석·이탈 진단 docs/analytics.md', read('docs/analytics.md')],
].filter((d) => d[2]);

const html = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>펭귄 슬라이드 출시 준비물</title>
<link rel="icon" href="icon-512.png">
<style>
:root{--bg:#eef5ff;--paper:#ffffff;--ink:#1e2350;--muted:#5d6491;--line:#cdd9f0;--accent:#ff9a2e;--accent2:#3f8ee8;--chip:#e3ecfb}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--bg:#11152e;--paper:#1b2045;--ink:#eef2ff;--muted:#a9b0dd;--line:#2f3768;--accent:#ffb35c;--accent2:#7fb6ff;--chip:#262d5c}}
:root[data-theme="dark"]{--bg:#11152e;--paper:#1b2045;--ink:#eef2ff;--muted:#a9b0dd;--line:#2f3768;--accent:#ffb35c;--accent2:#7fb6ff;--chip:#262d5c}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.6 -apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Noto Sans KR","Malgun Gothic",system-ui,sans-serif}
a{color:var(--accent2)}
header{padding:28px 16px 8px;max-width:1100px;margin:0 auto;display:flex;gap:18px;align-items:center;flex-wrap:wrap}
header img{width:84px;height:84px;border-radius:20px;border:3px solid var(--ink)}
header h1{margin:0;font-size:28px;line-height:1.2}
header p{margin:4px 0 0;color:var(--muted)}
nav{position:sticky;top:0;z-index:5;background:var(--bg);border-bottom:1px solid var(--line)}
nav .in{max-width:1100px;margin:0 auto;padding:8px 16px;display:flex;gap:6px;overflow-x:auto}
nav a{flex:0 0 auto;text-decoration:none;color:var(--ink);background:var(--chip);border-radius:999px;padding:6px 14px;font-size:14px}
main{max-width:1100px;margin:0 auto;padding:8px 16px 60px}
section{background:var(--paper);border:1px solid var(--line);border-radius:18px;padding:18px;margin:18px 0}
section>h2{margin:0 0 12px;font-size:21px}
.muted{color:var(--muted);font-size:14px}
.row{display:flex;gap:18px;flex-wrap:wrap;align-items:flex-start}
.vid{flex:1 1 300px;max-width:360px}
.vid video{width:100%;aspect-ratio:9/16;background:#000;border-radius:14px;display:block}
.vid h3{font-size:15px;margin:8px 0 2px}
.phone{flex:0 0 auto;width:min(360px,100%);aspect-ratio:9/16;border:6px solid var(--ink);border-radius:30px;overflow:hidden;background:#000}
.phone iframe{width:100%;height:100%;border:0;display:block}
.btn{display:inline-block;background:var(--accent);color:#1e2350;font-weight:700;text-decoration:none;border-radius:14px;padding:12px 18px;border:3px solid var(--ink)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}
.grid img{width:100%;border-radius:12px;border:1px solid var(--line);display:block;cursor:zoom-in}
.tabs{display:flex;gap:6px;margin:0 0 12px;flex-wrap:wrap}
.tabs button{font:inherit;font-size:14px;border:2px solid var(--ink);background:var(--paper);color:var(--ink);border-radius:999px;padding:6px 14px;cursor:pointer;min-height:40px}
.tabs button[aria-selected="true"]{background:var(--ink);color:var(--paper)}
.doc{max-height:70vh;overflow:auto;border:1px solid var(--line);border-radius:12px;padding:4px 16px;background:var(--bg)}
.doc h2{font-size:20px}.doc h3{font-size:17px}.doc h4,.doc h5{font-size:15px}
.doc code{background:var(--chip);border-radius:6px;padding:1px 5px;font-size:13px;word-break:break-word}
.doc pre{overflow:auto;background:var(--chip);padding:10px;border-radius:10px}
.tbl{overflow-x:auto}table{border-collapse:collapse;width:100%;font-size:14px}th,td{border:1px solid var(--line);padding:6px 8px;text-align:left;vertical-align:top}
.store{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px}
.feat{width:100%;max-width:1024px;border-radius:12px;border:1px solid var(--line);display:block}
.files{font-size:14px}.files li{margin:2px 0}
dialog{border:0;padding:0;background:transparent;max-width:95vw}dialog img{max-height:92vh;max-width:95vw;border-radius:12px;display:block}
dialog::backdrop{background:rgba(10,12,30,.8)}
</style>
</head>
<body>
<header>
  <img src="icon-512.png" alt="앱 아이콘">
  <div><h1>펭귄 슬라이드 <span class="muted">Penguin Slide</span></h1>
  <p>출시 준비물 확인 페이지 — 영상, 이미지, 스토어 문구, 기획서·보고서를 한 화면에서 봅니다.</p></div>
</header>
<nav><div class="in"><a href="#play">게임</a><a href="#video">홍보 영상</a><a href="#shots">스크린샷</a><a href="#art">아이콘·대표 이미지</a><a href="#store">스토어 문구</a><a href="#docs">기획서·보고서</a><a href="#files">파일 목록</a></div></nav>
<main>
<section id="play"><h2>게임 해보기</h2>
  <div class="row">
    <div class="phone"><iframe src="../index.html" title="펭귄 슬라이드 게임" loading="lazy" allow="autoplay; fullscreen"></iframe></div>
    <div style="flex:1 1 260px"><p>게임 진입점은 <code>out/index.html</code>입니다. 왼쪽 화면에서 바로 하거나 새 창으로 여세요(휴대폰 세로 화면 기준).</p>
    <p><a class="btn" href="../index.html" target="_blank" rel="noopener">새 창에서 게임 열기</a></p>
    <p class="muted">개발용 빌드(디버그 패널 포함): <a href="../dev/index.html">out/dev/index.html</a> · 레벨 에디터: <a href="../editor/index.html">out/editor/index.html</a></p></div>
  </div>
</section>
<section id="video"><h2>홍보 영상</h2>
  <p class="muted">모든 장면은 실제 게임 화면을 프레임 단위로 녹화한 것입니다(봇이 플레이어와 같은 누르기/떼기로 조작). 첫 장면은 강화 없는 첫 판입니다. 자막 파일: ${['trailer.ko.vtt', 'trailer.en.vtt', 'trailer.ko.srt', 'trailer.en.srt'].map((f) => `<a href="subtitles/${f}">${f}</a>`).join(' · ')}</p>
  <div class="row">${videos.map(([f, ko]) => `
    <div class="vid"><video controls playsinline preload="metadata" src="${f}">${f === 'trailer.mp4' ? '<track kind="subtitles" srclang="ko" label="한국어" src="subtitles/trailer.ko.vtt" default><track kind="subtitles" srclang="en" label="English" src="subtitles/trailer.en.vtt">' : ''}</video>
    <h3>${ko}</h3><div class="muted">${f} · ${size(f)} · H.264</div></div>`).join('')}
  </div>
</section>
<section id="shots"><h2>스크린샷 (1080×1920)</h2>
  <div class="tabs" role="tablist"><button role="tab" aria-selected="true" data-set="ko">한국어</button>${shots('screenshots-en').length ? '<button role="tab" aria-selected="false" data-set="en">English</button>' : ''}</div>
  <div class="grid" data-shots="ko">${shots('screenshots').map((f) => `<img src="screenshots/${f}" alt="스크린샷 ${parseInt(f)}" loading="lazy">`).join('')}</div>
  <div class="grid" data-shots="en" hidden>${shots('screenshots-en').map((f) => `<img src="screenshots-en/${f}" alt="screenshot ${parseInt(f)}" loading="lazy">`).join('')}</div>
</section>
<section id="art"><h2>아이콘 · 대표 이미지</h2>
  <div class="row"><div><img src="icon-512.png" alt="아이콘 512" style="width:192px;border-radius:36px;border:1px solid var(--line)"><div class="muted">icon-512.png (512×512)</div></div>
  <div style="flex:1 1 300px"><img class="feat" src="feature-1024x500.png" alt="대표 이미지"><div class="muted">feature-1024x500.png${fs.existsSync(path.join(rel, 'feature-1024x500-en.png')) ? ' · <a href="feature-1024x500-en.png">English</a>' : ''}</div></div></div>
</section>
<section id="store"><h2>스토어 문구</h2>
  <div class="store"><div class="doc">${md(read('store/ko.md'))}</div><div class="doc">${md(read('store/en.md'))}</div></div>
</section>
<section id="docs"><h2>기획서 · 보고서</h2>
  <div class="tabs" role="tablist">${docs.map(([id, label], k) => `<button role="tab" aria-selected="${k === 0}" data-doc="${id}">${label}</button>`).join('')}</div>
  ${docs.map(([id, , text], k) => `<div class="doc" data-docpane="${id}" ${k ? 'hidden' : ''}>${md(text)}</div>`).join('')}
</section>
<section id="files"><h2>파일 목록</h2><ul class="files">
  ${['store/ko.md', 'store/en.md', 'icon-512.png', 'feature-1024x500.png', ...shots('screenshots').map((f) => 'screenshots/' + f), ...videos.map((v) => v[0]), 'subtitles/trailer.ko.vtt', 'subtitles/trailer.en.vtt', 'subtitles/trailer.ko.srt', 'subtitles/trailer.en.srt', 'plan.md', 'report.md', 'docs/analytics.md'].filter((f) => fs.existsSync(path.join(rel, f))).map((f) => `<li><a href="${f}">${f}</a> <span class="muted">${size(f) || ''}</span></li>`).join('')}
</ul></section>
</main>
<dialog id="zoom"><img alt=""></dialog>
<script>
document.querySelectorAll('[data-set]').forEach((b) => b.addEventListener('click', () => {
  document.querySelectorAll('[data-set]').forEach((x) => x.setAttribute('aria-selected', x === b));
  document.querySelectorAll('[data-shots]').forEach((g) => { g.hidden = g.dataset.shots !== b.dataset.set; });
}));
document.querySelectorAll('[data-doc]').forEach((b) => b.addEventListener('click', () => {
  document.querySelectorAll('[data-doc]').forEach((x) => x.setAttribute('aria-selected', x === b));
  document.querySelectorAll('[data-docpane]').forEach((p) => { p.hidden = p.dataset.docpane !== b.dataset.doc; });
}));
const dlg = document.getElementById('zoom');
document.querySelectorAll('.grid img').forEach((im) => im.addEventListener('click', () => { dlg.querySelector('img').src = im.src; dlg.showModal(); }));
dlg.addEventListener('click', () => dlg.close());
</script>
</body>
</html>
`;
fs.writeFileSync(path.join(rel, 'index.html'), html);
console.log('wrote out/release/index.html', (html.length / 1024).toFixed(0) + ' KB');
