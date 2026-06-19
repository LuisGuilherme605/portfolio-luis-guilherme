/* ========================================
   PORTFOLIO — Luis Guilherme
   ======================================== */

/* Stars Background — drifting + twinkling */
(function () {
  const canvas = document.getElementById("star-canvas");
  const ctx = canvas.getContext("2d");
  let width, height;
  const stars = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener("resize", resize);

  for (let i = 0; i < 160; i++) {
    stars.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.3 + 0.2,
      alpha: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.004 + 0.0015,
      dx: (Math.random() - 0.5) * 0.12,
      dy: Math.random() * 0.12 + 0.02,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    stars.forEach(function (star) {
      star.alpha += star.speed;
      star.x += star.dx;
      star.y += star.dy;
      if (star.x < 0) star.x = width;
      else if (star.x > width) star.x = 0;
      if (star.y > height) {
        star.y = 0;
        star.x = Math.random() * width;
      }
      const tw = (Math.sin(star.alpha) * 0.5 + 0.5) * 0.7 + 0.1;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(186,168,255," + tw + ")";
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  draw();
})();

/* Hero parallax — fundo reage ao mouse (desktop) */
(function () {
  if (window.matchMedia("(max-width: 900px)").matches) return;
  var hero = document.querySelector(".hero");
  var grid = document.querySelector(".hero-grid-bg");
  if (!hero || !grid) return;
  var ticking = false;
  hero.addEventListener("mousemove", function (e) {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var r = hero.getBoundingClientRect();
      var mx = (e.clientX - r.left) / r.width - 0.5;
      var my = (e.clientY - r.top) / r.height - 0.5;
      grid.style.transform = "translate(" + mx * 20 + "px," + my * 20 + "px)";
    });
  });
})();

/* Custom Cursor */
(function () {
  var cursor = document.getElementById("cursor");
  var trail = document.getElementById("cursor-trail");

  document.addEventListener("mousemove", function (e) {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
    trail.style.left = e.clientX + "px";
    trail.style.top = e.clientY + "px";
  });

  document.querySelectorAll("a, button").forEach(function (el) {
    el.addEventListener("mouseenter", function () {
      cursor.style.width = "20px";
      cursor.style.height = "20px";
      trail.style.width = "60px";
      trail.style.height = "60px";
    });
    el.addEventListener("mouseleave", function () {
      cursor.style.width = "12px";
      cursor.style.height = "12px";
      trail.style.width = "36px";
      trail.style.height = "36px";
    });
  });
})();

/* Fade-In Observer */
(function () {
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("vis");
        }
      });
    },
    { threshold: 0.05 }
  );

  document.querySelectorAll(".fi").forEach(function (el) {
    observer.observe(el);
  });
})();

/* Hamburger Menu */
(function () {
  var hamburger = document.getElementById("hamburger");
  var mobileMenu = document.getElementById("mobileMenu");

  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("open");
    mobileMenu.classList.toggle("open");
    document.body.style.overflow = mobileMenu.classList.contains("open")
      ? "hidden"
      : "";
  });

  document.querySelectorAll(".mobile-link").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var target = document.querySelector(link.getAttribute("href"));
      hamburger.classList.remove("open");
      mobileMenu.classList.remove("open");
      document.body.style.overflow = "";
      if (target) {
        target.classList.add("vis");
        setTimeout(function () {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
      }
    });
  });
})();

/* Smooth Scroll for Anchor Links */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var href = link.getAttribute("href");
      if (href === "#") return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.classList.add("vis");
        setTimeout(function () {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
      }
    });
  });
})();

var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Robo mascote — olhos seguem o cursor, cabeca inclina em 3D */
(function () {
  var robo = document.getElementById("robo");
  if (!robo || reduceMotion) return;
  var inner = robo.querySelector(".robo-inner");
  var pupils = robo.querySelectorAll(".robo-pupil");

  // alvo (target) e valor atual (suavizado) de cada eixo
  var tPupilX = 0, tPupilY = 0, pupilX = 0, pupilY = 0;
  var tRotX = 0, tRotY = 0, rotX = 0, rotY = 0;

  function onMove(clientX, clientY) {
    var rect = robo.getBoundingClientRect();
    if (!rect.width) return; // robo escondido (mobile)
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;
    var ang = Math.atan2(clientY - cy, clientX - cx);
    var reach = Math.min(Math.hypot(clientX - cx, clientY - cy) / 55, 1);
    tPupilX = Math.cos(ang) * 5 * reach; // unidades do viewBox do SVG
    tPupilY = Math.sin(ang) * 4 * reach;
    // cabeca "olha" na direcao do cursor (parallax 3D)
    tRotY = (clientX / window.innerWidth - 0.5) * 26;
    tRotX = -(clientY / window.innerHeight - 0.5) * 18;
  }

  window.addEventListener("mousemove", function (e) {
    onMove(e.clientX, e.clientY);
  });
  window.addEventListener(
    "touchmove",
    function (e) {
      if (e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY);
    },
    { passive: true }
  );

  function tick() {
    pupilX += (tPupilX - pupilX) * 0.18;
    pupilY += (tPupilY - pupilY) * 0.18;
    rotX += (tRotX - rotX) * 0.08;
    rotY += (tRotY - rotY) * 0.08;
    var t = "translate(" + pupilX.toFixed(2) + " " + pupilY.toFixed(2) + ")";
    pupils.forEach(function (p) {
      p.setAttribute("transform", t);
    });
    inner.style.transform =
      "perspective(620px) rotateX(" +
      rotX.toFixed(2) +
      "deg) rotateY(" +
      rotY.toFixed(2) +
      "deg)";
    requestAnimationFrame(tick);
  }
  tick();
})();

/* Tilt 3D nos cards — mesmo motivo do robo: reagem ao cursor */
(function () {
  if (reduceMotion || window.matchMedia("(max-width: 820px)").matches) return;
  var cards = document.querySelectorAll(".proj-card, .skill-card");
  cards.forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      card.classList.add("tilt-on");
      card.style.transform =
        "perspective(720px) rotateX(" +
        (-py * 5).toFixed(2) +
        "deg) rotateY(" +
        (px * 5).toFixed(2) +
        "deg) translateY(-6px)";
    });
    card.addEventListener("mouseleave", function () {
      card.classList.remove("tilt-on");
      card.style.transform = "";
    });
  });
})();

/* Contador animado nos numeros das stats (ao entrar na tela) */
(function () {
  if (reduceMotion) return;
  var targets = [];
  document.querySelectorAll(".stat-n").forEach(function (el) {
    var raw = el.textContent.trim();
    if (/^\d+$/.test(raw)) {
      el.dataset.end = raw; // guarda o alvo ANTES de zerar
      el.textContent = "0";
      targets.push(el);
    }
  });
  if (!targets.length) return;

  function run(el) {
    var end = parseInt(el.dataset.end, 10);
    var dur = 1100,
      start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3); // ease-out cubico
      el.textContent = Math.round(end * eased).toString();
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var obs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          run(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  targets.forEach(function (el) {
    obs.observe(el);
  });
})();
