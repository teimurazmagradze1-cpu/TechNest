(function () {
  const form = document.getElementById("contactForm");
  const alertBox = document.getElementById("formAlert");
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const phoneRe = /^[+]?[\d\s\-().]{7,20}$/;

  function setErr(input, msg) {
    const f = input.closest(".field");
    f.classList.toggle("invalid", !!msg);
    f.querySelector(".error-msg").textContent = msg || "";
  }
  form.querySelectorAll("input,textarea").forEach((i) => {
    i.addEventListener("input", () => setErr(i, ""));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alertBox.innerHTML = "";
    let ok = true;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const message = form.message.value.trim();
    if (!name) {
      setErr(form.name, "Please enter your name.");
      ok = false;
    }
    if (!email) {
      setErr(form.email, "Email is required.");
      ok = false;
    } else if (!emailRe.test(email)) {
      setErr(form.email, "Enter a valid email.");
      ok = false;
    }
    if (phone && !phoneRe.test(phone)) {
      setErr(form.phone, "Enter a valid phone number.");
      ok = false;
    }
    if (!message) {
      setErr(form.message, "Please write a message.");
      ok = false;
    } else if (message.length < 10) {
      setErr(form.message, "Message is too short (min 10 chars).");
      ok = false;
    }
    if (!ok) return;
    alertBox.innerHTML =
      '<div class="alert success">Thanks! Your message has been sent.</div>';
    form.reset();
  });
})();
