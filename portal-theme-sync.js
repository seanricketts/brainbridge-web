/*!
 * BrainBridge portal -> iframe theme sync.
 * Paste into the Nexudus portal's custom JavaScript.
 *
 * The portal sets data-bs-theme="light"|"dark" on <html>/<body>. Embedded tools
 * (e.g. parking-map) are in an iframe on another domain and cannot see that, so
 * we send them the theme with postMessage, on load and whenever it changes.
 */
(function () {
  var ORIGIN = 'https://seanricketts.github.io';

  function theme() {
    var t = document.documentElement.getAttribute('data-bs-theme') || document.body.getAttribute('data-bs-theme');
    if (t === 'light' || t === 'dark') return t;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  function send(win) { try { win.postMessage({ type: 'bb-theme', theme: theme() }, ORIGIN); } catch (e) {} }
  function broadcast() {
    [].forEach.call(document.querySelectorAll('iframe'), function (f) {
      if ((f.src || '').indexOf(ORIGIN) === 0 && f.contentWindow) send(f.contentWindow);
    });
  }

  // An embed announces itself when it loads; answer with the current theme.
  window.addEventListener('message', function (e) {
    if (e.origin === ORIGIN && e.data && e.data.type === 'bb-ready' && e.source) send(e.source);
  });

  // Re-send whenever the user flips the toggle.
  var opts = { attributes: true, attributeFilter: ['data-bs-theme'] };
  var mo = new MutationObserver(broadcast);
  mo.observe(document.documentElement, opts);
  if (document.body) mo.observe(document.body, opts);
})();
