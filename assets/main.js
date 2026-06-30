// Shared site behavior: header inject, burger, scroll fx, cookies, cart, auth guard
(function(){
  const BASE = location.pathname.replace(/[^/]*$/, ''); // current dir
  const link = (href, label) => `<a href="${BASE}${href}">${label}</a>`;

  function buildHeader(){
    const header = document.querySelector('[data-header]');
    if(!header) return;
    const current = location.pathname.split('/').pop() || 'index.html';
    const navItem = (href,label)=>`<a href="${BASE}${href}" class="${current===href?'active':''}">${label}</a>`;
    header.innerHTML = `
      <header class="site-header" id="siteHeader">
        <div class="container header-inner">
          <a href="${BASE}index.html" class="logo"><span class="logo-mark">T</span><span>TechNest</span></a>
          <form class="search" role="search" onsubmit="event.preventDefault();location.href='${BASE}products.html?q='+encodeURIComponent(this.q.value)">
            <input name="q" type="search" placeholder="Search products..." aria-label="Search products"/>
            <button type="submit" aria-label="Search">Search</button>
          </form>
          <div class="header-actions">
            <a href="${BASE}login.html"><span class="label" data-auth-label>Sign In</span></a>
            <a href="${BASE}checkout.html">Cart<span class="cart-badge" id="cartBadge">0</span></a>
            <button class="burger" id="burger" aria-label="Menu" aria-expanded="false">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
        <nav class="nav-bar" id="navBar" aria-label="Primary">
          <div class="container nav-inner">
            ${navItem('index.html','Home')}
            ${navItem('products.html','Products')}
            ${navItem('deals.html','Deals')}
            ${navItem('checkout.html','Checkout')}
            ${navItem('contact.html','Contact')}
          </div>
        </nav>
      </header>
    `;
    initHeader();
  }

  function buildFooter(){
    const f = document.querySelector('[data-footer]');
    if(!f) return;
    f.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div>
              <h4>TechNest</h4>
              <p style="font-size:.9rem">Your trusted destination for the latest tech and electronics.</p>
            </div>
            <div>
              <h4>Shop</h4>
              <a href="${BASE}products.html">All Products</a>
              <a href="${BASE}deals.html">Deals</a>
              <a href="${BASE}checkout.html">Cart</a>
            </div>
            <div>
              <h4>Support</h4>
              <a href="${BASE}contact.html">Contact</a>
              <a href="#">Returns</a>
              <a href="#">Shipping</a>
            </div>
            <div>
              <h4>Account</h4>
              <a href="${BASE}login.html">Sign In</a>
              <a href="#">Orders</a>
            </div>
          </div>
          <div class="footer-bot">&copy; ${new Date().getFullYear()} TechNest. Built for the web fundamentals project.</div>
        </div>
      </footer>
    `;
  }

  function initHeader(){
    const header = document.getElementById('siteHeader');
    const burger = document.getElementById('burger');
    const nav = document.getElementById('navBar');
    burger.addEventListener('click',()=>{
      const open = nav.classList.toggle('open');
      burger.classList.toggle('open',open);
      burger.setAttribute('aria-expanded',open);
    });
    // header bg change on scroll
    const onScroll=()=>{
      header.classList.toggle('scrolled', window.scrollY > 30);
      const top = document.getElementById('scrollTop');
      if(top) top.classList.toggle('show', window.scrollY > 400);
    };
    window.addEventListener('scroll',onScroll,{passive:true});onScroll();

    // Update cart + auth label
    updateCartBadge();
    const user = JSON.parse(localStorage.getItem('tn_user')||'null');
    const label = document.querySelector('[data-auth-label]');
    if(user && label) label.textContent = 'Hi, '+user.name;
  }

  function updateCartBadge(){
    const badge = document.getElementById('cartBadge');
    if(!badge) return;
    const count = parseInt(localStorage.getItem('tn_cart')||'0',10);
    badge.textContent = count;
  }
  window.TN_addToCart = function(){
    const c = parseInt(localStorage.getItem('tn_cart')||'0',10)+1;
    localStorage.setItem('tn_cart',c);
    updateCartBadge();
  };

  // Cookie banner
  function cookies(){
    if(localStorage.getItem('tn_cookies_ok')) return;
    const div = document.createElement('div');
    div.className='cookie-banner';
    div.innerHTML = `<p>We use cookies and localStorage to remember your cart and sign-in. By using this site you agree to our policy.</p><button id="cookieAccept">Accept</button>`;
    document.body.appendChild(div);
    div.querySelector('#cookieAccept').addEventListener('click',()=>{
      localStorage.setItem('tn_cookies_ok','1');
      div.style.animation='slideUp .3s reverse';
      setTimeout(()=>div.remove(),300);
    });
  }

  // Scroll-to-top button
  function scrollTopBtn(){
    const btn = document.createElement('button');
    btn.id='scrollTop';btn.className='scroll-top';btn.setAttribute('aria-label','Scroll to top');
    btn.innerHTML='↑';
    btn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
    document.body.appendChild(btn);
  }

  // Reveal-on-scroll animations
  function reveals(){
    const io = new IntersectionObserver(entries=>{
      entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target);}});
    },{threshold:.12});
    document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
  }

  // Auth guard for protected pages
  window.TN_requireAuth = function(){
    if(!localStorage.getItem('tn_user')){
      const back = encodeURIComponent(location.pathname+location.search);
      location.replace(BASE+'login.html?redirect='+back);
      return false;
    }
    return true;
  };

  document.addEventListener('DOMContentLoaded',()=>{
    buildHeader();
    buildFooter();
    scrollTopBtn();
    cookies();
    reveals();
  });
})();
