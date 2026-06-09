/* ========================================
   PORTFOLIO — Luis Guilherme
   ======================================== */

/* Stars Background */
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

  for (let i = 0; i < 140; i++) {
    stars.push({
      x: Math.random() * 2000,
      y: Math.random() * 1200,
      r: Math.random() * 1.2 + 0.2,
      alpha: Math.random(),
      speed: Math.random() * 0.003 + 0.001,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    stars.forEach(function (star) {
      star.alpha += star.speed;
      ctx.beginPath();
      ctx.arc(star.x % width, star.y % height, star.r, 0, Math.PI * 2);
      ctx.fillStyle =
        "rgba(180,160,255," + (Math.sin(star.alpha) * 0.5 + 0.5) * 0.6 + ")";
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  draw();
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
