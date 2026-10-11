/* B4 share buttons: the visitor shares a link themselves (no contact import, no automatic posting).
   Every link carries a referral tag (?ref=, utm_*) so shares that bring visitors can be counted. */
(function (root) {
  'use strict';
  var NETS = [
    ['x', 'X', function (u, t) { return 'https://twitter.com/intent/tweet?text=' + enc(t) + '&url=' + enc(u); }],
    ['facebook', 'Facebook', function (u) { return 'https://www.facebook.com/sharer/sharer.php?u=' + enc(u); }],
    ['linkedin', 'LinkedIn', function (u) { return 'https://www.linkedin.com/sharing/share-offsite/?url=' + enc(u); }],
    ['reddit', 'Reddit', function (u, t) { return 'https://www.reddit.com/submit?url=' + enc(u) + '&title=' + enc(t); }],
    ['whatsapp', 'WhatsApp', function (u, t) { return 'https://wa.me/?text=' + enc(t + ' ' + u); }],
    ['telegram', 'Telegram', function (u, t) { return 'https://t.me/share/url?url=' + enc(u) + '&text=' + enc(t); }],
    ['email', 'Email', function (u, t) { return 'mailto:?subject=' + enc(t) + '&body=' + enc(t + '\n\n' + u); }]
  ];
  function enc(s) { return encodeURIComponent(s); }
  function refCode() {
    try {
      var r = localStorage.getItem('b4ref');
      if (!r) { r = Math.random().toString(36).slice(2, 8); localStorage.setItem('b4ref', r); }
      return r;
    } catch (e) { return 'web'; }
  }
  // adds the referral tag before any #fragment (the fragment can carry a shared Studio build)
  function tag(url, medium) {
    var hash = '', i = url.indexOf('#');
    if (i >= 0) { hash = url.slice(i); url = url.slice(0, i); }
    var clean = url.replace(/([?&])(ref|utm_source|utm_medium|utm_campaign)=[^&]*/g, '$1').replace(/[?&]+$/, '').replace(/\?&+/, '?');
    return clean + (clean.indexOf('?') >= 0 ? '&' : '?') + 'ref=' + refCode() + '&utm_source=share&utm_medium=' + medium + '&utm_campaign=b4indicators' + hash;
  }
  var CSS = '.b4sh{display:flex;flex-wrap:wrap;gap:8px;align-items:center}.b4sh a,.b4sh button{display:inline-flex;align-items:center;gap:6px;border-radius:999px;border:1px solid #dce5e9;background:#fff;color:#20394a;' +
    'padding:6px 12px;font:600 13px/1.2 Raleway,-apple-system,Segoe UI,sans-serif;text-decoration:none;cursor:pointer}.b4sh a:hover,.b4sh button:hover{border-color:#13bba4;color:#087d73}' +
    '.b4sh.dark a,.b4sh.dark button{background:#0e2433;border-color:#28475a;color:#d3e6ea}.b4sh.dark a:hover,.b4sh.dark button:hover{border-color:#5ee4cf;color:#5ee4cf}.b4sh .lbl{font:700 11px/1 Raleway,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#7a8c97;margin-right:2px}';
  function style() { if (document.getElementById('b4sh-css')) return; var s = document.createElement('style'); s.id = 'b4sh-css'; s.textContent = CSS; document.head.appendChild(s); }
  // opts: {url, title, text, label, dark}; url/title may be functions so a container can share the current state
  function render(el, opts) {
    style();
    var v = function (x) { return typeof x === 'function' ? x() : x; };
    el.classList.add('b4sh'); if (opts.dark) el.classList.add('dark');
    var h = (opts.label ? '<span class="lbl">' + opts.label + '</span>' : '') + (navigator.share ? '<button type="button" data-n="native">Share…</button>' : '') +
      NETS.map(function (n) { return '<a href="#" data-n="' + n[0] + '" rel="noopener">' + n[1] + '</a>'; }).join('') + '<button type="button" data-n="copy">Copy link</button>';
    el.innerHTML = h;
    el.addEventListener('click', function (e) {
      var a = e.target.closest('[data-n]'); if (!a) return; e.preventDefault();
      var n = a.dataset.n, url = v(opts.url) || location.href, title = v(opts.title) || document.title, text = v(opts.text) || title;
      if (n === 'native') { navigator.share({ title: title, text: text, url: tag(url, 'native') }).catch(function () {}); return; }
      if (n === 'copy') {
        var u = tag(url, 'copy');
        (navigator.clipboard ? navigator.clipboard.writeText(u) : Promise.reject()).then(function () { a.textContent = 'Link copied ✓'; setTimeout(function () { a.textContent = 'Copy link'; }, 1800); },
          function () {   // clipboard blocked: show the link, selected, so it can be copied by hand
            var box = el.querySelector('input.b4sh-link') || document.createElement('input');
            box.className = 'b4sh-link'; box.readOnly = true; box.value = u; box.setAttribute('aria-label', 'Share link');
            box.style.cssText = 'flex:1 1 100%;min-width:0;font:13px/1.4 monospace;padding:6px 10px;border-radius:8px;border:1px solid #13bba4';
            if (!box.parentNode) el.appendChild(box); box.focus(); box.select();
          });
        return;
      }
      var net = NETS.filter(function (x) { return x[0] === n; })[0];
      var target = net[2](tag(url, n), text);
      if (n === 'email') location.href = target; else window.open(target, '_blank', 'noopener,width=640,height=560');
    });
  }
  root.B4Share = { render: render, tag: tag };
  // auto-render any <div data-b4-share> on the page
  document.addEventListener('DOMContentLoaded', function () {
    [].forEach.call(document.querySelectorAll('[data-b4-share]'), function (el) {
      render(el, { url: el.dataset.url || location.origin + location.pathname, title: el.dataset.title, text: el.dataset.text, label: el.dataset.label, dark: el.hasAttribute('data-dark') });
    });
  });
})(this);
