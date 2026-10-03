/* Shared by every page. To change the menu, booking band or footer, edit them here once. */
const NAME = "Israel Akinyemi";
const WA = "https://wa.me/2348073171179?text=Hello%20Israel%2C%20I%27d%20like%20to%20book%20a%20maths%20lesson.";
const PAGES = [
  ["index.html", "Home"], ["experience.html", "Experience"], ["education.html", "Education"],
  ["expertise.html", "Expertise"], ["lessons.html", "Lessons"], ["practice.html", "Practice"], ["contact.html", "Contact"]
];

const current = location.pathname.split("/").pop() || "index.html";
const links = PAGES.map(([href, label]) =>
  `<a href="${href}"${href === current ? ' class="active" aria-current="page"' : ""}>${label}</a>`).join("");
document.body.insertAdjacentHTML("afterbegin", `
  <header class="site-header"><div class="wrap bar">
    <a class="brand" href="index.html">${NAME}</a>
    <button class="menu-btn" aria-expanded="false" aria-controls="nav" aria-label="Toggle menu">Menu</button>
    <nav class="nav" id="nav">${links}<a class="nav-cta" href="${WA}" target="_blank" rel="noopener">Book a lesson</a></nav>
  </div></header>`);
const cta = current === "contact.html" ? "" : `
  <div class="cta"><h2>Ready to make maths click?</h2>
  <p>Message me and we'll find the right starting point.</p>
  <div class="actions"><a class="btn wa" href="${WA}" target="_blank" rel="noopener">Book on WhatsApp</a>
  <a class="btn ghost" href="contact.html">Other ways to reach me</a></div></div>`;
document.querySelector("main").insertAdjacentHTML("beforeend", cta);
document.body.insertAdjacentHTML("beforeend",
  `<footer><div class="wrap">© ${new Date().getFullYear()} ${NAME} · Abuja, Nigeria</div></footer>`);

// Mobile menu
const header = document.querySelector(".site-header");
const btn = header.querySelector(".menu-btn"), nav = header.querySelector(".nav");
btn.addEventListener("click", () => { btn.setAttribute("aria-expanded", nav.classList.toggle("open")); });
nav.addEventListener("click", e => { if (e.target.tagName === "A") nav.classList.remove("open"); });
document.addEventListener("keydown", e => { if (e.key === "Escape") nav.classList.remove("open"); });

// Header shadow on scroll
const onScroll = () => header.classList.toggle("scrolled", scrollY > 8);
addEventListener("scroll", onScroll, { passive: true }); onScroll();

// Fade-in on scroll (the chalkboard also starts "writing" when it appears)
const items = document.querySelectorAll("section, .job, .card, .cta, .board");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.08 });
  items.forEach(el => { if (!el.classList.contains("board")) el.classList.add("reveal"); io.observe(el); });
} else items.forEach(el => el.classList.add("in"));

// Contact form: opens the visitor's email app with the message filled in
const form = document.getElementById("contact-form");
if (form) form.addEventListener("submit", e => {
  e.preventDefault();
  const f = new FormData(form);
  const body = `${f.get("message")}\n\n— ${f.get("name")} (${f.get("email")})`;
  location.href = `mailto:israelakinyemi704@gmail.com?subject=${encodeURIComponent(f.get("subject") || "Tutoring enquiry")}&body=${encodeURIComponent(body)}`;
});

// ---- Practice page: random problems with step-by-step solutions ----
const box = document.getElementById("practice");
if (box) {
  const $ = id => document.getElementById(id);
  const R = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const pick = (a, b) => { let n = 0; while (!n) n = R(a, b); return n; };
  const f = n => (n < 0 ? "−" + -n : "" + n);          // number with a proper minus sign
  const sg = n => (n < 0 ? "− " + -n : "+ " + n);      // "+ 4" or "− 4"
  let cur, solved = 0, done = false;

  const make = (topic, level) => {
    if (topic === "linear" && level === "easy") {
      const a = R(2, 9), b = pick(-12, 12), x = pick(-9, 9), c = a * x + b;
      return { q: `${a}x ${sg(b)} = ${f(c)}`, ans: [x], steps: [
        `Get the x-term alone: ${a}x = ${f(c)} ${b > 0 ? "− " + b : "+ " + -b} = ${f(c - b)}`,
        `Divide both sides by ${a}: x = ${f(c - b)} ÷ ${a} = ${f(x)}`,
        `Check: ${a}(${f(x)}) ${sg(b)} = ${f(c)} ✓`] };
    }
    if (topic === "linear") {
      const a = R(4, 9), c = R(1, a - 1), b = pick(-10, 10), x = pick(-8, 8), d = (a - c) * x + b || 1;
      const xx = (d - b) / (a - c);
      if (!Number.isInteger(xx)) return make(topic, level);
      return { q: `${a}x ${sg(b)} = ${c}x ${sg(d)}`, ans: [xx], steps: [
        `Subtract ${c}x from both sides: ${a - c}x ${sg(b)} = ${f(d)}`,
        `Move the constant: ${a - c}x = ${f(d)} ${b > 0 ? "− " + b : "+ " + -b} = ${f(d - b)}`,
        `Divide both sides by ${a - c}: x = ${f(xx)}`] };
    }
    let r1, r2;
    if (level === "easy") { r1 = R(1, 8); r2 = R(1, 8); } else { r1 = pick(-9, 9); r2 = pick(-9, 9); }
    if (r1 === r2) return make(topic, level);
    const B = -(r1 + r2), C = r1 * r2;
    return { q: `x² ${B ? sg(B) + "x " : ""}${sg(C)} = 0`, ans: [r1, r2], steps: [
      `Find two numbers that multiply to ${f(C)} and add to ${f(B)}: ${f(-r1)} and ${f(-r2)}`,
      `Factorise: (x ${sg(-r1)})(x ${sg(-r2)}) = 0`,
      `Each bracket can equal zero, so x = ${f(r1)} or x = ${f(r2)}`] };
  };

  const fresh = () => {
    cur = make($("topic").value, $("level").value); done = false;
    $("prompt-text").textContent = $("topic").value === "quad" ? "Solve for x (give both answers, e.g. 2, −5)" : "Solve for x";
    $("problem").textContent = cur.q;
    $("answer").value = ""; $("feedback").textContent = ""; $("feedback").className = "feedback";
    $("solution").hidden = true; $("answer").focus();
  };
  const showSteps = () => {
    $("solution").innerHTML = cur.steps.map(s => `<li>${s}</li>`).join(""); $("solution").hidden = false;
  };
  const check = () => {
    const nums = $("answer").value.replace(/[−–]/g, "-").split(/[\s,;]+|and|or/).filter(Boolean).map(Number);
    const want = [...new Set(cur.ans)].sort((a, b) => a - b), got = [...new Set(nums)].sort((a, b) => a - b);
    const fb = $("feedback");
    if (!nums.length || nums.some(isNaN)) { fb.textContent = "Please enter a number."; fb.className = "feedback no"; return; }
    if (want.length === got.length && want.every((v, i) => Math.abs(v - got[i]) < 1e-9)) {
      fb.textContent = "Correct. Well done!"; fb.className = "feedback ok";
      if (!done) { done = true; $("score").textContent = "Solved: " + ++solved; }
      showSteps();
    } else { fb.textContent = "Not quite. Try again, or tap Show steps."; fb.className = "feedback no"; }
  };
  $("check").onclick = check; $("show").onclick = showSteps; $("next").onclick = fresh;
  $("topic").onchange = $("level").onchange = fresh;
  $("answer").addEventListener("keydown", e => { if (e.key === "Enter") check(); });
  fresh();
}
