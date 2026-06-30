(function(){
  const form = document.getElementById('loginForm');
  const alertBox = document.getElementById('formAlert');
  const toggle = document.getElementById('togglePw');
  const pw = document.getElementById('password');

  toggle.addEventListener('click',()=>{
    const isPw = pw.type === 'password';
    pw.type = isPw ? 'text' : 'password';
    toggle.textContent = isPw ? 'Hide' : 'Show';
    toggle.setAttribute('aria-label', isPw ? 'Hide password' : 'Show password');
  });

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const pwRe = /^(?=.*[A-Z])(?=.*\d).{8,}$/; // 8+, 1 uppercase, 1 number

  function showErr(name,msg){
    const field = document.getElementById(name).closest('.field');
    field.classList.add('invalid');
    field.querySelector('.error-msg').textContent = msg;
  }
  function clearErr(name){
    const field = document.getElementById(name).closest('.field');
    field.classList.remove('invalid');
    field.querySelector('.error-msg').textContent = '';
  }
  ['name','email','password'].forEach(n=>{
    document.getElementById(n).addEventListener('input',()=>clearErr(n));
  });

  form.addEventListener('submit',e=>{
    e.preventDefault();
    alertBox.innerHTML='';
    let ok = true;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    if(!name){ showErr('name','Please enter your name.'); ok=false; }
    else if(name.length<2){ showErr('name','Name is too short.'); ok=false; }
    if(!email){ showErr('email','Email is required.'); ok=false; }
    else if(!emailRe.test(email)){ showErr('email','Enter a valid email address.'); ok=false; }
    if(!password){ showErr('password','Password is required.'); ok=false; }
    else if(!pwRe.test(password)){ showErr('password','At least 8 chars, 1 uppercase and 1 number.'); ok=false; }
    if(!ok) return;

    localStorage.setItem('tn_user', JSON.stringify({name,email}));
    alertBox.innerHTML = '<div class="alert success">Signed in successfully. Redirecting…</div>';
    const redirect = new URLSearchParams(location.search).get('redirect') || 'index.html';
    setTimeout(()=>{ location.href = decodeURIComponent(redirect); }, 800);
  });
})();
