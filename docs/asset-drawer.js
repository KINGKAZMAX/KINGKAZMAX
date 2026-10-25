'use strict';
(async()=>{
  const $=id=>document.getElementById(id);
  try{const theme=localStorage.getItem('kinglab:theme');if(theme==='dark')document.body.dataset.theme='dark';}catch{}
  try {
    const response=await fetch('public-assets.json');if(!response.ok)throw Error('Unable to load assets');
    const data=await response.json(); const assets=Array.isArray(data)?data:data.assets;
    if(!Array.isArray(assets))throw Error('Invalid asset list');
    [...new Set(assets.map(a=>a.category))].filter(Boolean).sort().forEach(category=>{const o=document.createElement('option');o.value=category;o.textContent=category;$('asset-category').append(o);});
    const safeLink=(url,label)=>{const a=document.createElement('a');const u=new URL(url);if(u.protocol!=='https:')throw Error('Unexpected URL');a.href=u.href;a.textContent=label;return a;};
    function render(){const query=$('asset-search').value.trim().toLowerCase(),category=$('asset-category').value,origin=$('asset-origin').value;const selected=assets.filter(a=>(!category||a.category===category)&&(!origin||(origin==='fork'?a.fork:!a.fork))&&[a.name,a.description,a.category,...(a.topics||[])].filter(Boolean).join(' ').toLowerCase().includes(query));
      $('asset-rows').replaceChildren(...selected.map(a=>{const row=document.createElement('tr');const cells=Array.from({length:4},()=>document.createElement('td'));cells[0].append(safeLink(a.url,a.name));cells[1].textContent=(a.category||'档案')+' · '+(a.description||'当前仓库未填写简介');if(a.fork&&a.upstream_url)cells[2].append(safeLink(a.upstream_url,'Fork · '+a.upstream_repository));else cells[2].textContent=a.fork?'Fork · 上游见仓库':'非 Fork · 贡献与依赖见仓库';const license=a.github_license_spdx;cells[3].textContent=license&&license!=='NOASSERTION'?license:((a.root_license_files||[]).length?'有许可文件，需按原文判断':'未发现根目录许可文件');row.append(...cells);return row;}));
      $('asset-count').textContent='显示 '+selected.length+' / '+assets.length+' 个公开资产 · 快照 2026-10-26';
    }
    ['asset-search','asset-category','asset-origin'].forEach(id=>$(id).addEventListener(id==='asset-search'?'input':'change',render));render();
  }catch{$('asset-count').textContent='暂时无法加载互动目录。请打开下方 Markdown 目录，全部公开资产仍可查看。';}
})();
