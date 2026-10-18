import { App } from './app.js';

const app = new App();
window.__app = app;
app.boot().catch((e) => {
  console.error(e);
  const b = document.getElementById('boot');
  if (b) b.classList.add('hide');
});
