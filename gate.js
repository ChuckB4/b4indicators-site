/* B4 download gate.
   The email form submits away from the page (a normal form post). After the signup the form provider sends the visitor to /thanks/,
   which unlocks downloads in this browser and returns them here with ?unlocked=1; this script then finishes the download they asked for.
   Once unlocked (30 days), download links work directly. */
(function (root) {
  'use strict';
  var UNLOCK = 'b4studio-unlocked', RET = 'b4return', DAY = 864e5;
  function unlocked() { try { var v = Number(localStorage.getItem(UNLOCK)); return v > 1 && Date.now() - v < 30 * DAY; } catch (e) { return false; } }
  function here() { return location.href.replace(/([?&])unlocked=1(&|$)/, '$1').replace(/[?&](#|$)/, '$1'); }
  function remember(data) {
    var o = { url: here(), t: Date.now() }; for (var k in data || {}) o[k] = data[k];
    try { localStorage.setItem(RET, JSON.stringify(o)); } catch (e) {}
  }
  function pending() {
    try {
      var j = JSON.parse(localStorage.getItem(RET) || 'null'), a = document.createElement('a');
      if (!j || Date.now() - j.t > 2 * 3600e3) return null;
      a.href = j.url; return a.pathname === location.pathname ? j : null;
    } catch (e) { return null; }
  }
  function clear() { try { localStorage.removeItem(RET); } catch (e) {} }
  function justReturned() { return /[?&]unlocked=1(&|$)/.test(location.search); }
  function cleanUrl() { if (justReturned()) history.replaceState(null, '', here()); }
  function banner(text, label, fn) {
    var b = document.createElement('div');
    b.setAttribute('role', 'status');
    b.style.cssText = 'position:fixed;left:50%;top:72px;transform:translateX(-50%);z-index:60;width:min(640px,calc(100vw - 32px));background:#0b1b27;color:#e3eef2;border:1px solid #13bba4;' +
      'border-radius:14px;padding:14px 16px;box-shadow:0 20px 50px #0007;display:flex;gap:12px;align-items:center;flex-wrap:wrap;font:15px/1.5 Raleway,-apple-system,Segoe UI,sans-serif';
    b.innerHTML = '<span style="flex:1 1 260px"></span><button type="button" style="border:0;border-radius:999px;background:#13bba4;color:#06231f;font:600 14px Raleway,sans-serif;padding:9px 18px;cursor:pointer"></button>' +
      '<button type="button" aria-label="Close" style="border:0;background:none;color:#a6bbc5;font-size:22px;cursor:pointer;line-height:1">&times;</button>';
    b.children[0].textContent = text; b.children[1].textContent = label;
    b.children[1].onclick = function () { fn(); };
    b.children[2].onclick = function () { b.remove(); };
    document.body.appendChild(b);
    return b;
  }
  // The sign-up form uses Google's invisible reCAPTCHA. When Google shows a challenge, it is placed in <body>, OUTSIDE this dialog.
  // A MODAL dialog (showModal) makes everything outside it inert and draws it underneath, so the challenge could not be seen or
  // clicked and "Subscribe did nothing". The dialog is therefore opened NON-modal, with our own dimmed backdrop below the
  // reCAPTCHA challenge (Google's challenge layer uses z-index 2000000000).
  function style() {
    if (document.getElementById('b4-gate-style')) return;
    var s = document.createElement('style'); s.id = 'b4-gate-style';
    s.textContent = 'html.b4-gate-open::before{content:"";position:fixed;inset:0;background:#04101acc;z-index:1000}' +
      'dialog.gate[open]{position:fixed;inset:0;margin:auto;z-index:1001;max-height:calc(100vh - 32px);overflow:auto}';
    document.head.appendChild(s);
  }
  function onKey(e) { if (e.key === 'Escape') { var d = document.querySelector('dialog.gate[open]'); if (d) closeGate(d); } }
  // a click on the dimmed backdrop (it is html::before, so the target is <html>) closes the dialog; clicks on the reCAPTCHA
  // challenge (its own elements / iframe) never reach this as <html>, so they do not close it
  function onBackdrop(e) { if (e.target === document.documentElement) { var d = document.querySelector('dialog.gate[open]'); if (d) closeGate(d); } }
  function openGate(d) {
    if (!d) return;
    style();
    if (d.open) return;
    if (d.show) d.show(); else d.setAttribute('open', '');
    document.documentElement.classList.add('b4-gate-open');
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onBackdrop);
    var f = d.querySelector('input:not([type=hidden])'); if (f) try { f.focus(); } catch (e) {}
  }
  function closeGate(d) {
    if (!d) return;
    if (d.close) d.close(); else d.removeAttribute('open');
    document.documentElement.classList.remove('b4-gate-open');
    document.removeEventListener('keydown', onKey);
    document.removeEventListener('click', onBackdrop);
  }
  root.B4Gate = { unlocked: unlocked, remember: remember, pending: pending, clear: clear, justReturned: justReturned, cleanUrl: cleanUrl, banner: banner, open: openGate, close: closeGate };

  // pages with plain download links (<a data-gate href=...>); the Studio handles its own actions (body[data-gate-custom])
  document.addEventListener('DOMContentLoaded', function () {
    var d = document.getElementById('gate');
    if (!d || document.body.hasAttribute('data-gate-custom')) return;
    document.addEventListener('click', function (e) {
      var a = e.target.closest('[data-gate]');
      if (a) { if (unlocked()) return; e.preventDefault(); remember({ dl: a.href }); openGate(d); return; }
      if (e.target.closest('[data-gate-close]') || e.target === d) closeGate(d);
    });
    var p = pending();
    if (justReturned() && p && p.dl) {
      cleanUrl(); clear();
      banner('Thanks for signing up! Your download is starting. The links are in your email too.', 'Download again', function () { location.href = p.dl; });
      setTimeout(function () { location.href = p.dl; }, 700);
    } else cleanUrl();
  });
})(this);
