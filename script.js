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

/* Robo 3D que segue o mouse (apenas desktop) */
(function () {
  var robot = document.getElementById("robot");
  if (!robot) return;

  // Sem cursor (toque) ou com movimento reduzido: robo fica parado/escondido
  if (
    prefersReducedMotion ||
    window.matchMedia("(hover: none)").matches ||
    window.matchMedia("(max-width: 900px)").matches
  ) {
    return;
  }

  var head = robot.querySelector(".robot-head");
  var center = { x: 0, y: 0 };
  var mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  var ticking = false;

  function measure() {
    var rect = head.getBoundingClientRect();
    center.x = rect.left + rect.width / 2;
    center.y = rect.top + rect.height / 2;
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function render() {
    var dx = mouse.x - center.x;
    var dy = mouse.y - center.y;

    var ry = clamp(dx / 14, -32, 32); // gira a cabeca na horizontal
    var rx = clamp(-dy / 16, -22, 22); // inclina na vertical
    var px = clamp(dx / 45, -4, 4); // pupila X
    var py = clamp(dy / 45, -4, 4); // pupila Y

    robot.style.setProperty("--ry", ry + "deg");
    robot.style.setProperty("--rx", rx + "deg");
    robot.style.setProperty("--px", px + "px");
    robot.style.setProperty("--py", py + "px");

    ticking = false;
  }

  window.addEventListener(
    "mousemove",
    function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!ticking) {
        window.requestAnimationFrame(render);
        ticking = true;
      }
    },
    { passive: true }
  );

  window.addEventListener("resize", measure);
  window.addEventListener("scroll", measure, { passive: true });

  measure();
})();

/* Contador animado nas estatisticas */
(function () {
  var nums = document.querySelectorAll("[data-count]");
  if (!nums.length) return;

  function animate(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (isNaN(target)) return;

    if (prefersReducedMotion) {
      el.textContent = String(target);
      return;
    }

    var duration = 1200;
    var start = null;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      el.textContent = String(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if (!("IntersectionObserver" in window)) {
    nums.forEach(animate);
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  nums.forEach(function (el) {
    observer.observe(el);
  });
})();

/* Efeito de digitacao no hero */
(function () {
  var el = document.getElementById("typed-text");
  if (!el) return;

  var words = (el.getAttribute("data-words") || "").split("|").filter(Boolean);
  if (words.length < 2 || prefersReducedMotion) return;

  var wordIndex = 0;
  var charIndex = words[0].length; // comeca com a primeira palavra completa
  var deleting = false;

  function tick() {
    var current = words[wordIndex];

    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex >= current.length) {
        deleting = true;
        return setTimeout(tick, 1600); // pausa com a palavra completa
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex <= 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }
    setTimeout(tick, deleting ? 45 : 85);
  }

  setTimeout(tick, 1600);
})();

/* Tilt 3D + spotlight nos cards (desktop) */
(function () {
  if (prefersReducedMotion || window.matchMedia("(hover: none)").matches) return;

  var cards = document.querySelectorAll(".skill-card, .proj-card");
  var MAX = 7; // graus

  cards.forEach(function (card) {
    var spot = document.createElement("span");
    spot.className = "card-spot";
    spot.setAttribute("aria-hidden", "true");
    card.insertBefore(spot, card.firstChild);

    card.addEventListener("mousemove", function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var ry = ((x - rect.width / 2) / (rect.width / 2)) * MAX;
      var rx = -((y - rect.height / 2) / (rect.height / 2)) * MAX;

      card.classList.add("is-tilting");
      card.style.transform =
        "perspective(700px) rotateX(" + rx + "deg) rotateY(" + ry +
        "deg) translateY(-6px)";
      spot.style.setProperty("--mx", x + "px");
      spot.style.setProperty("--my", y + "px");
    });

    card.addEventListener("mouseleave", function () {
      card.classList.remove("is-tilting");
      card.style.transform = "";
    });
  });
})();

/* Botoes magneticos (desktop) */
(function () {
  if (prefersReducedMotion || window.matchMedia("(hover: none)").matches) return;

  var STRENGTH = 0.35;
  document.querySelectorAll(".btn-glow, .btn-ghost").forEach(function (btn) {
    btn.addEventListener("mousemove", function (e) {
      var rect = btn.getBoundingClientRect();
      var mx = e.clientX - rect.left - rect.width / 2;
      var my = e.clientY - rect.top - rect.height / 2;
      btn.style.transform =
        "translate(" + mx * STRENGTH + "px," + (my * STRENGTH - 3) + "px)";
    });

    btn.addEventListener("mouseleave", function () {
      btn.style.transform = "";
    });
  });
})();

/* Botao voltar ao topo */
(function () {
  var btn = document.getElementById("to-top");
  if (!btn) return;

  var ticking = false;
  function update() {
    var y = window.scrollY || document.documentElement.scrollTop;
    btn.classList.toggle("show", y > 600);
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

  btn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  });

  update();
})();

/* Loading screen */
(function () {
  var loader = document.getElementById("loader");
  if (!loader) return;

  function hide() {
    loader.classList.add("done");
  }

  if (prefersReducedMotion) {
    hide();
    return;
  }

  var hidden = false;
  function hideOnce() {
    if (hidden) return;
    hidden = true;
    hide();
  }

  window.addEventListener("load", function () {
    setTimeout(hideOnce, 600);
  });
  // Seguranca: nunca deixa o loader preso
  setTimeout(hideOnce, 3000);
})();

/* Tema claro/escuro */
(function () {
  var toggle = document.getElementById("themeToggle");
  var meta = document.querySelector('meta[name="theme-color"]');
  var COLORS = { dark: "#07070f", light: "#f4f3fb" };

  function apply(theme) {
    var light = theme === "light";
    document.body.classList.toggle("light", light);
    if (meta) meta.setAttribute("content", light ? COLORS.light : COLORS.dark);
    if (toggle) toggle.setAttribute("aria-pressed", String(light));
  }

  var saved = null;
  try {
    saved = localStorage.getItem("theme");
  } catch (e) {}

  if (saved) {
    apply(saved);
  } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    apply("light");
  }

  function toggleTheme() {
    var light = !document.body.classList.contains("light");
    apply(light ? "light" : "dark");
    try {
      localStorage.setItem("theme", light ? "light" : "dark");
    } catch (e) {}
  }

  if (toggle) toggle.addEventListener("click", toggleTheme);

  // Exposto para o command palette
  window.__toggleTheme = toggleTheme;
})();

/* Registro do Service Worker (PWA) */
(function () {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("service-worker.js").catch(function () {});
  });
})();

/* Command Palette (⌘K / Ctrl+K) */
(function () {
  var cmdk = document.getElementById("cmdk");
  if (!cmdk) return;

  var input = cmdk.querySelector(".cmdk-input");
  var list = cmdk.querySelector(".cmdk-list");
  var empty = cmdk.querySelector(".cmdk-empty");
  var trigger = document.getElementById("cmdkTrigger");

  var commands = [
    { icon: "◆", label: "Sobre mim", hint: "Seção", type: "nav", value: "#sobre" },
    { icon: "✦", label: "Habilidades", hint: "Seção", type: "nav", value: "#habilidades" },
    { icon: "⬡", label: "Stack tecnológico", hint: "Seção", type: "nav", value: "#stack" },
    { icon: "▣", label: "Projetos", hint: "Seção", type: "nav", value: "#projetos" },
    { icon: "✎", label: "Formação", hint: "Seção", type: "nav", value: "#formacao" },
    { icon: "✉", label: "Contato", hint: "Seção", type: "nav", value: "#contato" },
    { icon: "⇩", label: "Baixar currículo (PDF)", hint: "Arquivo", type: "link", value: "curriculo-luis-guilherme.pdf" },
    { icon: "☀", label: "Alternar tema claro/escuro", hint: "Ação", type: "action", value: "theme" },
    { icon: "▲", label: "Ir para o topo", hint: "Ação", type: "action", value: "top" },
    { icon: "✆", label: "Conversar no WhatsApp", hint: "Link", type: "link", value: "https://wa.me/5561998730501" },
    { icon: "@", label: "Enviar e-mail", hint: "Link", type: "link", value: "mailto:Lg5104891@gmail.com" },
    { icon: "⌥", label: "GitHub", hint: "Link", type: "link", value: "https://github.com/LuisGuilherme605" },
    { icon: "in", label: "LinkedIn", hint: "Link", type: "link", value: "https://www.linkedin.com/in/luis-guilherme-126072360" },
  ];

  var filtered = commands.slice();
  var activeIndex = 0;

  function norm(s) {
    return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  }

  function render() {
    list.innerHTML = "";
    if (!filtered.length) {
      empty.hidden = false;
      return;
    }
    empty.hidden = true;
    filtered.forEach(function (cmd, i) {
      var li = document.createElement("li");
      li.className = "cmdk-item" + (i === activeIndex ? " active" : "");
      li.setAttribute("role", "option");
      li.innerHTML =
        '<span class="cmdk-ico">' + cmd.icon + "</span>" +
        "<span>" + cmd.label + "</span>" +
        '<span class="cmdk-hint">' + cmd.hint + "</span>";
      li.addEventListener("click", function () {
        run(cmd);
      });
      li.addEventListener("mousemove", function () {
        activeIndex = i;
        updateActive();
      });
      list.appendChild(li);
    });
  }

  function updateActive() {
    var items = list.querySelectorAll(".cmdk-item");
    items.forEach(function (el, i) {
      el.classList.toggle("active", i === activeIndex);
    });
  }

  function filter() {
    var q = norm(input.value.trim());
    filtered = q
      ? commands.filter(function (c) {
          return norm(c.label).indexOf(q) !== -1 || norm(c.hint).indexOf(q) !== -1;
        })
      : commands.slice();
    activeIndex = 0;
    render();
  }

  function open() {
    filtered = commands.slice();
    activeIndex = 0;
    input.value = "";
    render();
    cmdk.classList.add("open");
    cmdk.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
    setTimeout(function () {
      input.focus();
    }, 30);
  }

  function close() {
    cmdk.classList.remove("open");
    cmdk.setAttribute("hidden", "");
    document.body.style.overflow = "";
  }

  function run(cmd) {
    close();
    if (cmd.type === "nav") {
      var target = document.querySelector(cmd.value);
      if (target) {
        target.classList.add("vis");
        setTimeout(function () {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 60);
      }
    } else if (cmd.type === "link") {
      window.open(cmd.value, "_blank", "noopener");
    } else if (cmd.type === "action") {
      if (cmd.value === "theme" && window.__toggleTheme) window.__toggleTheme();
      if (cmd.value === "top")
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    }
  }

  input.addEventListener("input", filter);

  cmdk.querySelectorAll("[data-cmdk-close]").forEach(function (el) {
    el.addEventListener("click", close);
  });

  if (trigger) trigger.addEventListener("click", open);

  document.addEventListener("keydown", function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      cmdk.classList.contains("open") ? close() : open();
      return;
    }
    if (!cmdk.classList.contains("open")) return;

    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, filtered.length - 1);
      updateActive();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      updateActive();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[activeIndex]) run(filtered[activeIndex]);
    }
  });
})();
