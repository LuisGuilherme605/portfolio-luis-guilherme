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
  if (!ctx) return;
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

  function getWords() {
    var attr =
      document.documentElement.lang === "en" && el.getAttribute("data-words-en")
        ? "data-words-en"
        : "data-words";
    return (el.getAttribute(attr) || "").split("|").filter(Boolean);
  }

  var words = getWords();
  if (words.length < 2 || prefersReducedMotion) return;

  var wordIndex = 0;
  var charIndex = words[0].length; // comeca com a primeira palavra completa
  var deleting = false;

  function tick() {
    words = getWords(); // re-le para refletir troca de idioma
    if (wordIndex >= words.length) wordIndex = 0;
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
    { icon: "文", label: "English / Português", hint: "Idioma", type: "action", value: "lang" },
    { icon: "☀", label: "Alternar tema claro/escuro", hint: "Ação", type: "action", value: "theme" },
    { icon: "▲", label: "Ir para o topo", hint: "Ação", type: "action", value: "top" },
    { icon: "✆", label: "Conversar no WhatsApp", hint: "Link", type: "link", value: "https://wa.me/5561998730501" },
    { icon: "@", label: "Enviar e-mail", hint: "Link", type: "link", value: "mailto:Lg5104891@gmail.com" },
    { icon: "⌥", label: "GitHub", hint: "Link", type: "link", value: "https://github.com/LuisGuilherme605" },
    { icon: "in", label: "LinkedIn", hint: "Link", type: "link", value: "https://www.linkedin.com/in/luis-guilherme-dev" },
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
      if (cmd.value === "lang" && window.__toggleLang) window.__toggleLang();
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

/* Idioma PT / EN */
(function () {
  var toggle = document.getElementById("langToggle");
  var STORE = "lang";

  function translateEl(el, lang) {
    var en = el.getAttribute("data-en");
    if (en === null) return;
    if (lang === "en") {
      if (el.getAttribute("data-pt") === null)
        el.setAttribute("data-pt", el.innerHTML);
      el.innerHTML = en;
    } else {
      var pt = el.getAttribute("data-pt");
      if (pt !== null) el.innerHTML = pt;
    }
  }

  function translatePlaceholder(el, lang) {
    var en = el.getAttribute("data-en-placeholder");
    if (en === null) return;
    if (lang === "en") {
      if (!el.getAttribute("data-pt-placeholder"))
        el.setAttribute("data-pt-placeholder", el.getAttribute("placeholder") || "");
      el.setAttribute("placeholder", en);
    } else {
      var pt = el.getAttribute("data-pt-placeholder");
      if (pt !== null) el.setAttribute("placeholder", pt);
    }
  }

  function apply(lang) {
    document.documentElement.lang = lang === "en" ? "en" : "pt-BR";
    var i, els;
    els = document.querySelectorAll("[data-en]");
    for (i = 0; i < els.length; i++) translateEl(els[i], lang);
    els = document.querySelectorAll("[data-en-placeholder]");
    for (i = 0; i < els.length; i++) translatePlaceholder(els[i], lang);
    document.title =
      lang === "en"
        ? "Luis Guilherme — Front-End Developer & Tech Student"
        : "Luis Guilherme — Dev Frontend & ADS";
    if (toggle) toggle.classList.toggle("en", lang === "en");
    try {
      window.dispatchEvent(new CustomEvent("langchange", { detail: lang }));
    } catch (e) {}
  }

  var saved = null;
  try {
    saved = localStorage.getItem(STORE);
  } catch (e) {}

  var initial =
    saved ||
    (navigator.language && navigator.language.toLowerCase().indexOf("pt") === 0
      ? "pt"
      : "en");
  apply(initial === "en" ? "en" : "pt");

  function toggleLang() {
    var next = document.documentElement.lang === "en" ? "pt" : "en";
    apply(next);
    try {
      localStorage.setItem(STORE, next);
    } catch (e) {}
  }

  if (toggle) toggle.addEventListener("click", toggleLang);
  window.__toggleLang = toggleLang;
})();

/* Estudos de caso (modal, bilingue) */
(function () {
  var modal = document.getElementById("caseModal");
  if (!modal) return;
  var content = modal.querySelector(".case-content");

  var L = {
    pt: { challenge: "Desafio", solution: "Solução", decisions: "Decisões técnicas", outcome: "Resultado & aprendizados", role: "Papel", tech: "Tecnologias", visit: "Ver ao vivo →", code: "Ver código →" },
    en: { challenge: "Challenge", solution: "Solution", decisions: "Technical decisions", outcome: "Outcome & learnings", role: "Role", tech: "Tech", visit: "View live →", code: "View code →" },
  };

  var CASES = {
    vortex: {
      tags: ["HTML", "CSS", "JavaScript"],
      link: { url: "https://zingy-daffodil-2d280f.netlify.app/", type: "visit" },
      pt: {
        name: "VORTEX — Arquitetura de Vanguarda",
        type: "Web Design · Landing Page Institucional",
        role: "Projeto autoral (solo) — design e desenvolvimento",
        challenge: "Estúdios de arquitetura premium precisam transmitir sofisticação no primeiro segundo. O desafio era criar uma landing institucional com cara de alto padrão e identidade visual forte, sem usar nenhum framework — apenas HTML, CSS e JavaScript.",
        solution: "Construí um site escuro e elegante com loading screen animado, hierarquia tipográfica marcante e seções bem definidas: portfólio em destaque, serviços, equipe e formulário de contato. Cada detalhe reforça a sensação de marca premium.",
        decisions: ["HTML semântico e CSS organizado por seções, sem dependências externas.", "Animações em CSS para transições suaves e loading screen.", "Layout responsivo pensado para mobile e desktop."],
        outcome: ["Site publicado e no ar (Netlify).", "Identidade visual consistente do topo ao rodapé.", "Aprendi a estruturar um projeto maior em seções reutilizáveis."],
      },
      en: {
        name: "VORTEX — Vanguard Architecture",
        type: "Web Design · Corporate Landing Page",
        role: "Solo project — design and development",
        challenge: "Premium architecture studios must convey sophistication in the first second. The challenge was to build a high-end corporate landing page with a strong visual identity, using no framework — just HTML, CSS and JavaScript.",
        solution: "I built a dark, elegant site with an animated loading screen, strong typographic hierarchy and well-defined sections: featured portfolio, services, team and contact form. Every detail reinforces a premium brand feel.",
        decisions: ["Semantic HTML and section-organized CSS, with no external dependencies.", "CSS animations for smooth transitions and the loading screen.", "Responsive layout designed for mobile and desktop."],
        outcome: ["Site published and live (Netlify).", "Consistent visual identity from top to bottom.", "Learned to structure a larger project into reusable sections."],
      },
    },
    forma: {
      tags: ["HTML", "CSS", "JavaScript"],
      link: { url: "https://willowy-lollipop-4ade34.netlify.app/", type: "visit" },
      pt: {
        name: "Forma Studio — Design que Transforma",
        type: "Web Design · Agência Criativa",
        role: "Projeto autoral (solo) — design e desenvolvimento",
        challenge: "Uma agência criativa precisa que o próprio site seja a prova do seu trabalho. O desafio era um layout editorial com personalidade, que apresentasse cases e depoimentos de forma envolvente.",
        solution: "Criei um site com marquee animado, showcase de cases, depoimentos e seção de serviços estruturada, com tipografia refinada e animações suaves que guiam a leitura.",
        decisions: ["Layout editorial com bastante respiro e hierarquia clara.", "Marquee e microanimações em CSS/JS puro.", "Padrões visuais reaproveitados entre as seções."],
        outcome: ["Site publicado (Netlify) com identidade clean e profissional.", "Pratiquei ritmo visual e composição editorial.", "Reforcei consistência de componentes em um projeto real."],
      },
      en: {
        name: "Forma Studio — Design that Transforms",
        type: "Web Design · Creative Agency",
        role: "Solo project — design and development",
        challenge: "A creative agency needs its own site to be proof of its work. The challenge was an editorial layout with personality that showcases cases and testimonials in an engaging way.",
        solution: "I created a site with an animated marquee, case showcase, testimonials and a structured services section, with refined typography and smooth animations that guide the reading.",
        decisions: ["Editorial layout with generous whitespace and clear hierarchy.", "Marquee and micro-animations in vanilla CSS/JS.", "Visual patterns reused across sections."],
        outcome: ["Site published (Netlify) with a clean, professional identity.", "Practiced visual rhythm and editorial composition.", "Reinforced component consistency in a real project."],
      },
    },
    brasilia: {
      tags: ["HTML", "CSS", "JavaScript", "3D"],
      link: { url: "https://github.com/LuisGuilherme605/Brasilia3D", type: "code" },
      pt: {
        name: "Brasília 3D — Guia Turístico Interativo",
        type: "Web Interativo · Turismo 3D",
        role: "Projeto autoral (solo) — desenvolvimento",
        challenge: "Mostrar pontos turísticos de Brasília de um jeito diferente do mapa tradicional. O desafio técnico era criar navegação imersiva em 3D usando apenas tecnologias web nativas.",
        solution: "Desenvolvi um guia interativo com visualização tridimensional dos principais pontos da capital, navegação imersiva e foco na experiência de exploração.",
        decisions: ["HTML, CSS e JavaScript puro, sem bibliotecas 3D pesadas.", "Foco em performance e interação fluida.", "Conteúdo turístico organizado por pontos de interesse."],
        outcome: ["Projeto no GitHub, demonstrando capacidade de encarar um desafio técnico mais complexo.", "Aprendi a lidar com interação espacial e organização de dados.", "Saí da zona de conforto além das landing pages."],
      },
      en: {
        name: "Brasília 3D — Interactive Tourist Guide",
        type: "Interactive Web · 3D Tourism",
        role: "Solo project — development",
        challenge: "Show Brasília's landmarks in a different way from the traditional map. The technical challenge was building immersive 3D navigation using only native web technologies.",
        solution: "I built an interactive guide with three-dimensional visualization of the capital's main landmarks, immersive navigation and a focus on the exploration experience.",
        decisions: ["Vanilla HTML, CSS and JavaScript, with no heavy 3D libraries.", "Focus on performance and fluid interaction.", "Tourist content organized by points of interest."],
        outcome: ["Project on GitHub, showing the ability to tackle a more complex technical challenge.", "Learned to handle spatial interaction and data organization.", "Stepped outside the comfort zone beyond landing pages."],
      },
    },
  };

  var currentId = null;

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function render(id) {
    var c = CASES[id];
    if (!c) return;
    var lang = document.documentElement.lang === "en" ? "en" : "pt";
    var d = c[lang];
    var t = L[lang];

    var tags = c.tags.map(function (x) { return '<span class="sk-tag">' + esc(x) + "</span>"; }).join("");
    var dec = d.decisions.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
    var out = d.outcome.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
    var linkLabel = c.link.type === "code" ? t.code : t.visit;

    content.innerHTML =
      '<div class="case-type">' + esc(d.type) + "</div>" +
      "<h3 class=\"case-name\">" + esc(d.name) + "</h3>" +
      '<div class="case-tags">' + tags + "</div>" +
      '<div class="case-role"><strong>' + t.role + ":</strong> " + esc(d.role) + "</div>" +
      '<div class="case-block"><h4>' + t.challenge + "</h4><p>" + esc(d.challenge) + "</p></div>" +
      '<div class="case-block"><h4>' + t.solution + "</h4><p>" + esc(d.solution) + "</p></div>" +
      '<div class="case-block"><h4>' + t.decisions + "</h4><ul>" + dec + "</ul></div>" +
      '<div class="case-block"><h4>' + t.outcome + "</h4><ul>" + out + "</ul></div>" +
      '<a class="case-cta" href="' + c.link.url + '" target="_blank" rel="noopener noreferrer">' + linkLabel + "</a>";
  }

  function open(id) {
    currentId = id;
    render(id);
    modal.classList.add("open");
    modal.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
    var closeBtn = modal.querySelector(".case-close");
    if (closeBtn) setTimeout(function () { closeBtn.focus(); }, 30);
  }

  function close() {
    currentId = null;
    modal.classList.remove("open");
    modal.setAttribute("hidden", "");
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".proj-case").forEach(function (btn) {
    btn.addEventListener("click", function () { open(btn.getAttribute("data-case")); });
  });

  modal.querySelectorAll("[data-case-close]").forEach(function (el) {
    el.addEventListener("click", close);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("open")) close();
  });

  // Atualiza o idioma do modal se estiver aberto
  window.addEventListener("langchange", function () {
    if (currentId) render(currentId);
  });
})();
