/* ========================================
   PORTFOLIO — Luis Guilherme
   ======================================== */

var prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* Stars Background */
(function () {
  var canvas = document.getElementById("star-canvas");
  if (!canvas || prefersReducedMotion) return;

  var ctx = canvas.getContext("2d");
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var width = 0;
  var height = 0;
  var stars = [];
  var running = true;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildStars();
  }

  function buildStars() {
    // Menos estrelas em telas pequenas (performance)
    var count = width < 600 ? 70 : 140;
    stars = [];
    for (var i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.2 + 0.2,
        alpha: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.01 + 0.004,
      });
    }
  }

  function draw() {
    if (!running) return;
    ctx.clearRect(0, 0, width, height);
    for (var i = 0; i < stars.length; i++) {
      var star = stars[i];
      star.alpha += star.speed;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fillStyle =
        "rgba(180,160,255," + ((Math.sin(star.alpha) * 0.5 + 0.5) * 0.6) + ")";
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize);

  // Pausa a animacao quando a aba nao esta visivel (economia de bateria)
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      running = false;
    } else if (!running) {
      running = true;
      draw();
    }
  });

  draw();
})();

/* Custom Cursor */
(function () {
  var cursor = document.getElementById("cursor");
  var trail = document.getElementById("cursor-trail");
  if (!cursor || !trail) return;

  // Em dispositivos de toque o cursor custom nao faz sentido
  if (window.matchMedia("(hover: none)").matches) {
    cursor.style.display = "none";
    trail.style.display = "none";
    return;
  }

  // Esconde o cursor nativo apenas quando o customizado esta ativo
  document.body.classList.add("has-custom-cursor");

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
  var faders = document.querySelectorAll(".fi");

  if (!("IntersectionObserver" in window)) {
    faders.forEach(function (el) {
      el.classList.add("vis");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("vis");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05 }
  );

  faders.forEach(function (el) {
    observer.observe(el);
  });
})();

/* Hamburger Menu */
(function () {
  var hamburger = document.getElementById("hamburger");
  var mobileMenu = document.getElementById("mobileMenu");
  if (!hamburger || !mobileMenu) return;

  function closeMenu() {
    hamburger.classList.remove("open");
    mobileMenu.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  hamburger.addEventListener("click", function () {
    var willOpen = !mobileMenu.classList.contains("open");
    hamburger.classList.toggle("open", willOpen);
    mobileMenu.classList.toggle("open", willOpen);
    hamburger.setAttribute("aria-expanded", String(willOpen));
    document.body.style.overflow = willOpen ? "hidden" : "";
  });

  // Fecha o menu com a tecla ESC
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && mobileMenu.classList.contains("open")) {
      closeMenu();
    }
  });

  document.querySelectorAll(".mobile-link").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var target = document.querySelector(link.getAttribute("href"));
      closeMenu();
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
    if (link.classList.contains("mobile-link")) return;
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

/* Nav: estado ao rolar + barra de progresso */
(function () {
  var nav = document.querySelector("nav");
  var progress = document.getElementById("scroll-progress");
  var ticking = false;

  function update() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;

    if (nav) {
      nav.classList.toggle("scrolled", scrollTop > 40);
    }

    if (progress) {
      var docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progress.style.width = pct + "%";
    }

    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );

  update();
})();

/* Destaque da secao ativa no menu */
(function () {
  var links = document.querySelectorAll(".nav-links a[data-nav]");
  if (!links.length || !("IntersectionObserver" in window)) return;

  var map = {};
  links.forEach(function (link) {
    var id = link.getAttribute("href").slice(1);
    if (id) map[id] = link;
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (l) {
            l.classList.remove("active");
          });
          var active = map[entry.target.id];
          if (active) active.classList.add("active");
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  Object.keys(map).forEach(function (id) {
    var section = document.getElementById(id);
    if (section) observer.observe(section);
  });
})();
