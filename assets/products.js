(async function(){
  const grid = document.getElementById('grid');
  const qIn = document.getElementById('q');
  const catIn = document.getElementById('cat');
  const sortIn = document.getElementById('sort');
  const params = new URLSearchParams(location.search);
  if(params.get('q')) qIn.value = params.get('q');
  if(params.get('cat') && params.get('cat')!=='deals') catIn.value = params.get('cat');

  let all = [];
  try{
    const res = await fetch('assets/products.json');
    all = await res.json();
  }catch(e){
    grid.innerHTML = '<p style="color:var(--muted)">Could not load products.</p>';
    return;
  }

  function render(){
    const q = qIn.value.trim().toLowerCase();
    const cat = catIn.value;
    const sort = sortIn.value;
    let list = all.filter(p =>
      (!cat || p.category===cat) &&
      (!q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
    );
    if(sort==='asc') list.sort((a,b)=>a.price-b.price);
    if(sort==='desc') list.sort((a,b)=>b.price-a.price);
    if(!list.length){ grid.innerHTML='<p style="color:var(--muted);padding:40px">No products match your filters.</p>'; return; }
    grid.innerHTML = list.map(p=>`
      <article class="product-card">
        <a class="thumb" href="product.html?id=${p.id}"><img src="${p.image}" alt="${p.title}" loading="lazy"/></a>
        <div class="body">
          <h3>${p.title}</h3>
          <div class="rating">★ ${p.rating?.rate ?? '—'} <span style="color:var(--muted)">(${p.rating?.count ?? 0})</span></div>
          <div class="price">$${p.price.toFixed(2)}</div>
          <div class="actions">
            <button onclick="TN_addToCart()">Add to cart</button>
            <a href="product.html?id=${p.id}">View</a>
          </div>
        </div>
      </article>
    `).join('');
  }
  qIn.addEventListener('input',render);
  catIn.addEventListener('change',render);
  sortIn.addEventListener('change',render);
  render();
})();
