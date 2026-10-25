'use strict';
(async () => {
  const $ = id => document.getElementById(id);
  try { if (localStorage.getItem('kinglab:theme') === 'dark') document.body.dataset.theme = 'dark'; } catch {}
  try {
    const response = await fetch('public-assets.json');
    if (!response.ok) throw Error('Unable to load assets');
    const data = await response.json();
    const assets = Array.isArray(data) ? data : data.assets;
    if (!Array.isArray(assets)) throw Error('Invalid asset list');

    [...new Set(assets.map(asset => asset.category))].filter(Boolean).sort().forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      $('asset-category').append(option);
    });
    const safeLink = (url, label) => {
      const link = document.createElement('a');
      const target = new URL(url);
      if (target.protocol !== 'https:') throw Error('Unexpected URL');
      link.href = target.href;
      link.textContent = label;
      return link;
    };

    function render() {
      const query = $('asset-search').value.trim().toLowerCase();
      const category = $('asset-category').value;
      const origin = $('asset-origin').value;
      const selected = assets.filter(asset =>
        (!category || asset.category === category) &&
        (!origin || (origin === 'fork' ? asset.fork : !asset.fork)) &&
        [asset.name, asset.description, asset.category, ...(asset.topics || []), ...(asset.aliases || [])]
          .filter(Boolean).join(' ').toLowerCase().includes(query)
      );
      $('asset-rows').replaceChildren(...selected.map(asset => {
        const row = document.createElement('tr');
        const cells = Array.from({ length: 4 }, () => document.createElement('td'));
        cells[0].append(safeLink(asset.url, asset.name));
        cells[1].textContent = (asset.category || 'Archive') + ' · ' + (asset.description || 'Needs documentation.');
        if (asset.fork && asset.upstream_url) {
          cells[2].append(safeLink(asset.upstream_url, 'Fork of ' + asset.upstream_repository));
        } else {
          cells[2].textContent = asset.fork ? 'Fork; see repository for upstream source' : 'Not marked as a fork; see repository for authorship';
        }
        const license = asset.github_license_spdx;
        cells[3].textContent = license && license !== 'NOASSERTION' ? license :
          (asset.root_license_files || []).length ? 'Root license file present; read its terms' :
          'No root license file detected; check repository notices';
        row.append(...cells);
        return row;
      }));
      $('asset-count').textContent = `Showing ${selected.length} of ${assets.length} public repositories · Snapshot: 26 October 2026`;
    }
    ['asset-search', 'asset-category', 'asset-origin'].forEach(id =>
      $(id).addEventListener(id === 'asset-search' ? 'input' : 'change', render)
    );
    render();
  } catch {
    $('asset-count').textContent = 'The interactive directory is temporarily unavailable. The complete public index is available below.';
  }
})();
