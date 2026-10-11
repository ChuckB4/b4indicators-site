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
  root.B4Gate = { unlocked: unlocked, remember: remember, pending: pending, clear: clear, justReturned: justReturned, cleanUrl: cleanUrl, banner: banner };

  // pages with plain download links (<a data-gate href=...>); the Studio handles its own actions (body[data-gate-custom])
  document.addEventListener('DOMContentLoaded', function () {
    var d = document.getElementById('gate');
    if (!d || document.body.hasAttribute('data-gate-custom')) return;
    document.addEventListener('click', function (e) {
      var a = e.target.closest('[data-gate]');
      if (a) { if (unlocked()) return; e.preventDefault(); remember({ dl: a.href }); if (d.showModal) d.showModal(); return; }
      if (e.target.closest('[data-gate-close]') || e.target === d) d.close();
    });
    var p = pending();
    if (justReturned() && p && p.dl) {
      cleanUrl(); clear();
      banner('Thanks for signing up! Your download is starting. The links are in your email too.', 'Download again', function () { location.href = p.dl; });
      setTimeout(function () { location.href = p.dl; }, 700);
    } else cleanUrl();
  });
})(this);
