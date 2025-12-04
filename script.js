// Theme persistence
(function applySavedTheme() {
  try {
    var saved = localStorage.getItem("theme");
    if (saved === "light") document.documentElement.classList.add("theme-light");
  } catch (_) {}
})();

// Toggle theme
document.getElementById("theme-toggle").addEventListener("click", function () {
  var root = document.documentElement;
  var isLight = root.classList.toggle("theme-light");
  try { localStorage.setItem("theme", isLight ? "light" : "dark"); } catch (_) {}
});

// Typing effect
(function typingEffect() {
  var el = document.querySelector(".typing");
  if (!el) return;
  var phrases = [
    "A Passionate Software Developer",
    "Web Developer • Cloud Enthusiast",
    "I build scalable web applications"
  ];
  var idx = 0, pos = 0, dir = 1, pause = 0;

  function tick() {
    var target = phrases[idx];
    if (pause > 0) { pause -= 1; return setTimeout(tick, 80); }
    pos += dir;
    el.textContent = target.slice(0, pos);
    if (dir > 0 && pos === target.length) { dir = -1; pause = 10; }
    else if (dir < 0 && pos === 0) { dir = 1; idx = (idx + 1) % phrases.length; pause = 5; }
    setTimeout(tick, 60);
  }
  tick();
})();

// Smooth scroll for internal links
document.addEventListener("click", function (e) {
  var a = e.target.closest('a[href^="#"]');
  if (!a) return;
  var id = a.getAttribute("href").slice(1);
  if (!id) return;
  var el = document.getElementById(id);
  if (el) {
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Floating + View Resume wiring
(function wireResume() {
  var resumeUrl = "resume.pdf";
  var anchors = [document.getElementById("floating-resume"), document.querySelector('#resume a'), document.getElementById("view-resume")];
  anchors.forEach(function (a) {
    if (!a) return;
    a.setAttribute("href", resumeUrl);
    a.setAttribute("download", "Prasad_Pinninti_Resume.pdf");
  });
})();

// Reveal on scroll (normal subtle effects)
(function revealOnScroll(){
  var items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (!items.length) return;
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function inView(el){
    var rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight - 80 && rect.bottom > 80;
  }
  function update(){
    items.forEach(function(el){
      if (prefersReduced || inView(el)) el.classList.add('is-visible');
    });
  }
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
})();


