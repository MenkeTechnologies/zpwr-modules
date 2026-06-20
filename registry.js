/* ZPWR Modules registry — storefront grid + module detail, app-store-styled.
 * Fed by registry.json; search uses the vendored fzf (fzf.js). */
(function () {
  'use strict';

  var esc = window.FZF.escapeHtml;
  var hl = function (q, text) { return window.FZF.highlightWithIndices(text, q ? window.FZF.getMatchIndices(q, text) : []); };
  var MODULES = [];
  var REGISTRY_URL = 'registry.json';

  function initials(name) {
    return (name || '?').replace(/[^A-Za-z0-9 ]/g, '').split(/\s+/).map(function (w) { return w[0] || ''; }).join('').slice(0, 3).toUpperCase();
  }
  function categories() {
    var seen = {}, out = ['All'];
    MODULES.forEach(function (m) { if (m.category && !seen[m.category]) { seen[m.category] = true; out.push(m.category); } });
    return out;
  }
  function hostShort(h) { return (h || '').replace('zpwr-', ''); }

  // ---- storefront grid (index.html) ----------------------------------
  function cardHtml(m, q) {
    var pills = []
      .concat(m.host ? ['<span class="p-pill">' + esc(m.host) + '</span>'] : [])
      .concat((m.tags || []).map(function (t) { return '<span class="p-pill">' + esc(t) + '</span>'; }))
      .join('');
    return '' +
      '<a class="product-card" href="module.html?id=' + encodeURIComponent(m.slug || '') + '" data-cat="' + esc(m.category || '') + '">' +
        '<div class="product-thumb"><span class="badge">' + esc(hostShort(m.host)) + '</span><span class="glyph">' + esc(initials(m.name)) + '</span></div>' +
        '<div class="product-body">' +
          '<span class="p-cat">' + esc(m.category || '') + '</span>' +
          '<span class="p-name">' + hl(q, m.name || '') + '</span>' +
          '<span class="p-tag">' + hl(q, m.desc || '') + '</span>' +
          '<div class="p-meta">' + pills + '</div>' +
        '</div>' +
        '<div class="product-foot">' +
          '<span class="price"><span class="amt free">Free</span><span class="per">' + esc(m.license || 'CC0') + '</span></span>' +
          '<span class="p-host">' + esc(hostShort(m.host)) + ' ↗</span>' +
        '</div>' +
      '</a>';
  }

  function renderGrid(cat, query) {
    var grid = document.getElementById('productGrid');
    if (!grid) return;
    var q = (query || '').trim();
    var scored = [];
    MODULES.forEach(function (m) {
      if (cat && cat !== 'All' && m.category !== cat) return;
      var fields = [m.name || '', m.desc || '', m.category || '', m.author || '', (m.tags || []).join(' '), m.host || ''];
      var score = window.FZF.searchScore(q, fields);
      if (q && score <= 0) return;
      scored.push({ m: m, score: score });
    });
    if (q) scored.sort(function (a, b) { return b.score - a.score; });
    else scored.sort(function (a, b) { return a.m.name.localeCompare(b.m.name); });
    if (!scored.length) { grid.innerHTML = '<div class="empty-state">no modules match that search</div>'; return; }
    grid.innerHTML = scored.map(function (x) { return cardHtml(x.m, q); }).join('');
    var cards = grid.querySelectorAll('.product-card');
    for (var i = 0; i < cards.length; i++) cards[i].style.animationDelay = (0.05 + i * 0.04) + 's';
  }

  function renderFilters() {
    var row = document.getElementById('filterRow');
    if (!row) return;
    row.innerHTML = categories().map(function (c, i) {
      return '<button type="button" class="filter-chip' + (i === 0 ? ' active' : '') + '" data-cat="' + esc(c) + '">' + esc(c) + '</button>';
    }).join('');
  }

  function renderStats() {
    var set = function (id, v) { var el = document.getElementById(id); if (el) el.textContent = v; };
    set('statProducts', String(MODULES.length));
    set('statCats', String(categories().length - 1));
    var hosts = {}; MODULES.forEach(function (m) { if (m.host) hosts[m.host] = 1; });
    set('statFree', String(Object.keys(hosts).length));
  }

  function initGrid() {
    renderStats();
    renderFilters();
    renderGrid('All', '');
    var activeCat = 'All';
    var search = document.getElementById('storeSearch');
    if (search) search.addEventListener('input', function () { renderGrid(activeCat, search.value); });
    var row = document.getElementById('filterRow');
    if (row) row.addEventListener('click', function (e) {
      var chip = e.target.closest('.filter-chip'); if (!chip) return;
      activeCat = chip.getAttribute('data-cat');
      row.querySelectorAll('.filter-chip').forEach(function (c) { c.classList.toggle('active', c === chip); });
      renderGrid(activeCat, search ? search.value : '');
    });
  }

  // ---- module detail (module.html) -----------------------------------
  function getParam(name) {
    var m = new RegExp('[?&]' + name + '=([^&]*)').exec(location.search);
    return m ? decodeURIComponent(m[1]) : null;
  }

  function renderDetail() {
    var root = document.getElementById('detailRoot');
    if (!root) return;
    var m = MODULES.filter(function (x) { return (x.slug || '') === getParam('id'); })[0];
    if (!m) { root.innerHTML = '<div class="empty-state">module not found</div>'; return; }
    document.title = m.name + ' — ZPWR Modules';
    var pills = []
      .concat(m.category ? ['<span class="p-pill">' + esc(m.category) + '</span>'] : [])
      .concat(m.host ? ['<span class="p-pill">' + esc(m.host) + '</span>'] : [])
      .concat((m.tags || []).map(function (t) { return '<span class="p-pill">' + esc(t) + '</span>'; }))
      .join('');
    root.innerHTML = '' +
      '<div class="detail-top">' +
        '<div class="detail-hero"><span class="glyph">' + esc(initials(m.name)) + '</span></div>' +
        '<div class="detail-buy">' +
          '<span class="p-cat">' + esc(m.category || '') + '</span>' +
          '<h2>' + esc(m.name) + '</h2>' +
          '<p class="p-tag">' + esc(m.desc || '') + '</p>' +
          '<div class="p-meta">' + pills + '</div>' +
          '<div class="price detail-price"><span class="amt free">Free</span><span class="per">' + esc(m.license || 'CC0') + ' · ' + esc(m.author || 'unknown') + '</span></div>' +
          '<div class="buy-actions">' +
            (m.url ? '<a class="btn btn-buy" href="' + esc(m.url) + '" download>Download .zfxmod ↗</a>' : '') +
            '<a class="btn btn-secondary" href="https://github.com/MenkeTechnologies/zpwr-modules">Registry</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<section class="tutorial-section"><h2>Signal chain</h2><div class="chain" id="chain"><span class="node">loading…</span></div>' +
        '<p class="meta">Drop this module into a patch (in-plugin: <code>◈ MODULES</code>) and it expands into these blocks — In feeds the first, the last feeds Out.</p></section>' +
      '<section class="tutorial-section"><h2>Details</h2>' +
        '<dl class="det-table">' +
          '<dt>Host</dt><dd>' + esc(m.host || '-') + '</dd>' +
          '<dt>Category</dt><dd>' + esc(m.category || '-') + '</dd>' +
          '<dt>License</dt><dd>' + esc(m.license || '-') + '</dd>' +
          '<dt>Author</dt><dd>' + esc(m.author || '-') + '</dd>' +
          '<dt>Slug</dt><dd>' + esc(m.slug || '-') + '</dd>' +
        '</dl></section>';
    if (m.url) fetch(m.url, { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (z) {
      var nodes = [];
      try { nodes = (JSON.parse(z.patch || '{}').nodes || []).map(function (n) { return n.type; }); } catch (e) {}
      var parts = ['<span class="node io">In</span>']
        .concat(nodes.map(function (t) { return '<span class="node">' + esc(t) + '</span>'; }))
        .concat(['<span class="node io">Out</span>']);
      document.getElementById('chain').innerHTML = parts.join('<span class="arrow">→</span>');
    }).catch(function () { document.getElementById('chain').innerHTML = '<span class="node">chain unavailable</span>'; });
  }

  // ---- boot ----------------------------------------------------------
  function boot() {
    fetch(REGISTRY_URL, { cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        MODULES = Array.isArray(d.modules) ? d.modules : [];
        if (document.getElementById('productGrid')) initGrid();
        if (document.getElementById('detailRoot')) renderDetail();
      })
      .catch(function () {
        var g = document.getElementById('productGrid') || document.getElementById('detailRoot');
        if (g) g.innerHTML = '<div class="empty-state">could not load registry.json</div>';
      });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
