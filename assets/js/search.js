(function () {
  var input   = document.getElementById('search-input');
  var results = document.getElementById('search-results');
  if (!input || !results) return;

  var fuse;

  fetch(typeof searchIndexUrl !== 'undefined' ? searchIndexUrl : '/index.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      fuse = new Fuse(data, {
        keys: [
          { name: 'title',   weight: 0.6 },
          { name: 'summary', weight: 0.3 },
          { name: 'tags',    weight: 0.1 }
        ],
        threshold: 0.35,
        includeMatches: false
      });
    });

  input.addEventListener('input', function () {
    var q = this.value.trim();
    results.innerHTML = '';
    if (!q || !fuse) return;

    var hits = fuse.search(q).slice(0, 10);

    if (!hits.length) {
      results.innerHTML = '<p class="search-no-results">No posts found for "' + escapeHtml(q) + '".</p>';
      return;
    }

    var html = '';
    hits.forEach(function (hit) {
      var p = hit.item;
      html += '<div class="search-result-item">';
      html += '<h2 class="search-result-title"><a href="' + p.url + '">' + escapeHtml(p.title) + '</a></h2>';
      if (p.summary) {
        html += '<p class="search-result-summary">' + escapeHtml(p.summary) + '</p>';
      }
      html += '</div>';
    });
    results.innerHTML = html;
  });

  function escapeHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
})();
