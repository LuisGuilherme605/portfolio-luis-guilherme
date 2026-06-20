/* ========================================
   EXTRAS — idioma PT/EN, tema, CV, voltar ao topo e estudos de caso
   Tudo additivo: injeta os controles por JS e nao altera o resto do site.
   ======================================== */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- injeta botao de CV no hero ---------- */
  var ctas = document.querySelector(".hero-ctas");
  if (ctas && !document.querySelector(".btn-cv")) {
    var cv = document.createElement("a");
    cv.href = "curriculo-luis-guilherme.pdf";
    cv.setAttribute("download", "");
    cv.className = "btn-ghost btn-cv";
    cv.setAttribute("data-en", "Download CV ↓");
    cv.innerHTML = "Baixar CV ↓";
    ctas.appendChild(cv);
  }

  /* ---------- injeta botao de tema (desktop + mobile) ---------- */
  var nav = document.querySelector("nav");
  var langBtn = document.getElementById("langToggle");
  var themeBtn = null;
  if (nav && langBtn) {
    themeBtn = document.createElement("button");
    themeBtn.className = "theme-toggle";
    themeBtn.id = "themeToggle";
    themeBtn.setAttribute("aria-label", "Alternar tema / Toggle theme");
    themeBtn.textContent = "☾";
    langBtn.insertAdjacentElement("afterend", themeBtn);
  }
  var mobileMenu = document.getElementById("mobileMenu");
  var themeBtnMobile = null;
  if (mobileMenu) {
    themeBtnMobile = document.createElement("button");
    themeBtnMobile.className = "mobile-lang";
    themeBtnMobile.id = "themeToggleMobile";
    themeBtnMobile.setAttribute("aria-label", "Alternar tema / Toggle theme");
    themeBtnMobile.textContent = "Modo claro";
    mobileMenu.appendChild(themeBtnMobile);
  }

  /* ---------- injeta botao voltar ao topo ---------- */
  var toTop = document.createElement("button");
  toTop.className = "to-top";
  toTop.setAttribute("aria-label", "Voltar ao topo / Back to top");
  toTop.innerHTML = "↑";
  document.body.appendChild(toTop);

  /* ---------- injeta botoes \"Ver case\" + modal ---------- */
  var CASES = {
    vortex: {
      tags: ["HTML", "CSS", "JavaScript"],
      link: { url: "https://zingy-daffodil-2d280f.netlify.app/", type: "visit" },
      pt: {
        type: "Web Design · Landing Page Institucional",
        name: "VORTEX — Arquitetura de Vanguarda",
        challenge: "Estudios de arquitetura premium precisam transmitir sofisticacao no primeiro segundo. O desafio era criar uma landing institucional com cara de alto padrao e identidade visual forte, usando so HTML, CSS e JavaScript.",
        solution: "Construi um site escuro e elegante com loading screen animado, hierarquia tipografica marcante e secoes bem definidas: portfolio em destaque, servicos, equipe e contato.",
        decisions: ["HTML semantico e CSS organizado por secoes, sem dependencias externas.", "Animacoes em CSS para transicoes suaves e loading screen.", "Layout responsivo pensado para mobile e desktop."],
        outcome: ["Site publicado e no ar (Netlify).", "Identidade visual consistente do topo ao rodape.", "Aprendi a estruturar um projeto maior em secoes reutilizaveis."],
      },
      en: {
        type: "Web Design · Corporate Landing Page",
        name: "VORTEX — Vanguard Architecture",
        challenge: "Premium architecture studios must convey sophistication in the first second. The challenge was a high-end corporate landing page with a strong visual identity, using only HTML, CSS and JavaScript.",
        solution: "I built a dark, elegant site with an animated loading screen, strong typographic hierarchy and well-defined sections: featured portfolio, services, team and contact.",
        decisions: ["Semantic HTML and section-organized CSS, no external dependencies.", "CSS animations for smooth transitions and the loading screen.", "Responsive layout for mobile and desktop."],
        outcome: ["Site published and live (Netlify).", "Consistent visual identity throughout.", "Learned to structure a larger project into reusable sections."],
      },
    },
    forma: {
      tags: ["HTML", "CSS", "JavaScript"],
      link: { url: "https://willowy-lollipop-4ade34.netlify.app/", type: "visit" },
      pt: {
        type: "Web Design · Agencia Criativa",
        name: "Forma Studio — Design que Transforma",
        challenge: "Uma agencia criativa precisa que o proprio site seja a prova do seu trabalho. O desafio era um layout editorial com personalidade, mostrando cases e depoimentos de forma envolvente.",
        solution: "Criei um site com marquee animado, showcase de cases, depoimentos e secao de servicos, com tipografia refinada e animacoes suaves.",
        decisions: ["Layout editorial com bastante respiro e hierarquia clara.", "Marquee e microanimacoes em CSS/JS puro.", "Padroes visuais reaproveitados entre secoes."],
        outcome: ["Site publicado (Netlify) com identidade clean e profissional.", "Pratiquei ritmo visual e composicao editorial."],
      },
      en: {
        type: "Web Design · Creative Agency",
        name: "Forma Studio — Design that Transforms",
        challenge: "A creative agency needs its own site to be proof of its work. The challenge was an editorial layout with personality, showing cases and testimonials in an engaging way.",
        solution: "I built a site with an animated marquee, case showcase, testimonials and a services section, with refined typography and smooth animations.",
        decisions: ["Editorial layout with generous whitespace and clear hierarchy.", "Marquee and micro-animations in vanilla CSS/JS.", "Visual patterns reused across sections."],
        outcome: ["Site published (Netlify) with a clean, professional identity.", "Practiced visual rhythm and editorial composition."],
      },
    },
    brasilia: {
      tags: ["HTML", "CSS", "JavaScript", "3D"],
      link: { url: "https://github.com/LuisGuilherme605/Brasilia3D", type: "code" },
      pt: {
        type: "Web Interativo · Turismo 3D",
        name: "Brasilia 3D — Guia Turistico Interativo",
        challenge: "Mostrar pontos turisticos de Brasilia de um jeito diferente do mapa tradicional. O desafio tecnico era criar navegacao imersiva em 3D usando so tecnologias web nativas.",
        solution: "Desenvolvi um guia interativo com visualizacao tridimensional dos principais pontos da capital, navegacao imersiva e foco na exploracao.",
        decisions: ["HTML, CSS e JavaScript puro, sem bibliotecas 3D pesadas.", "Foco em performance e interacao fluida.", "Conteudo turistico organizado por pontos de interesse."],
        outcome: ["Projeto no GitHub, mostrando capacidade de encarar um desafio tecnico mais complexo.", "Aprendi a lidar com interacao espacial e organizacao de dados."],
      },
      en: {
        type: "Interactive Web · 3D Tourism",
        name: "Brasilia 3D — Interactive Tourist Guide",
        challenge: "Show Brasilia's landmarks in a different way from the traditional map. The technical challenge was immersive 3D navigation using only native web technologies.",
        solution: "I built an interactive guide with three-dimensional visualization of the capital's main landmarks, immersive navigation and a focus on exploration.",
        decisions: ["Vanilla HTML, CSS and JavaScript, no heavy 3D libraries.", "Focus on performance and fluid interaction.", "Tourist content organized by points of interest."],
        outcome: ["Project on GitHub, showing the ability to tackle a more complex technical challenge.", "Learned to handle spatial interaction and data organization."],
      },
    },
  };
  var CASE_LABELS = {
    pt: { challenge: "Desafio", solution: "Solucao", decisions: "Decisoes tecnicas", outcome: "Resultado & aprendizados", visit: "Ver ao vivo →", code: "Ver codigo →", btn: "Ver case →" },
    en: { challenge: "Challenge", solution: "Solution", decisions: "Technical decisions", outcome: "Outcome & learnings", visit: "View live →", code: "View code →", btn: "Read case study →" },
  };
  var caseOrder = ["vortex", "forma", "brasilia"];
  var projCards = document.querySelectorAll(".proj-card");
  projCards.forEach(function (card, i) {
    var id = caseOrder[i];
    if (!id || !CASES[id]) return;
    var body = card.querySelector(".proj-body") || card;
    var btn = document.createElement("button");
    btn.className = "proj-case";
    btn.setAttribute("data-case", id);
    btn.setAttribute("data-en", CASE_LABELS.en.btn);
    btn.textContent = CASE_LABELS.pt.btn;
    body.appendChild(btn);
  });

  var modal = document.createElement("div");
  modal.className = "case-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.innerHTML =
    '<div class="case-backdrop" data-case-close></div>' +
    '<div class="case-panel">' +
    '<button class="case-close" data-case-close aria-label="Fechar / Close">×</button>' +
    '<div class="case-content"></div>' +
    "</div>";
  document.body.appendChild(modal);
  var caseContent = modal.querySelector(".case-content");
  var casePanel = modal.querySelector(".case-panel");
  var currentCase = null;
  var caseLastFocus = null;

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function renderCase(id) {
    var c = CASES[id];
    if (!c) return;
    var lang = document.documentElement.lang === "en" ? "en" : "pt";
    var d = c[lang];
    var t = CASE_LABELS[lang];
    var dec = d.decisions.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
    var out = d.outcome.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
    var linkLabel = c.link.type === "code" ? t.code : t.visit;
    caseContent.innerHTML =
      '<div class="case-type">' + esc(d.type) + "</div>" +
      '<h3 class="case-name">' + esc(d.name) + "</h3>" +
      '<div class="case-block"><h4>' + t.challenge + "</h4><p>" + esc(d.challenge) + "</p></div>" +
      '<div class="case-block"><h4>' + t.solution + "</h4><p>" + esc(d.solution) + "</p></div>" +
      '<div class="case-block"><h4>' + t.decisions + "</h4><ul>" + dec + "</ul></div>" +
      '<div class="case-block"><h4>' + t.outcome + "</h4><ul>" + out + "</ul></div>" +
      '<a class="case-cta" href="' + c.link.url + '" target="_blank" rel="noopener noreferrer">' + linkLabel + "</a>";
  }
  function openCase(id) {
    caseLastFocus = document.activeElement;
    currentCase = id;
    renderCase(id);
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    var cl = modal.querySelector(".case-close");
    if (cl) setTimeout(function () { cl.focus(); }, 30);
  }
  function closeCase() {
    currentCase = null;
    modal.classList.remove("open");
    document.body.style.overflow = "";
    if (caseLastFocus && caseLastFocus.focus) caseLastFocus.focus();
  }
  document.querySelectorAll(".proj-case").forEach(function (b) {
    b.addEventListener("click", function () { openCase(b.getAttribute("data-case")); });
  });
  modal.querySelectorAll("[data-case-close]").forEach(function (el) {
    el.addEventListener("click", closeCase);
  });
  document.addEventListener("keydown", function (e) {
    if (!modal.classList.contains("open")) return;
    if (e.key === "Escape") { closeCase(); }
    else if (e.key === "Tab" && casePanel) {
      var f = casePanel.querySelectorAll('a[href], button:not([disabled])');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- TEMA claro/escuro ---------- */
  function applyTheme(theme) {
    var light = theme === "light";
    document.body.classList.toggle("light", light);
    if (themeBtn) themeBtn.textContent = light ? "☀" : "☾";
    var en = document.documentElement.lang === "en";
    if (themeBtnMobile) {
      themeBtnMobile.textContent = light
        ? (en ? "Dark mode" : "Modo escuro")
        : (en ? "Light mode" : "Modo claro");
    }
  }
  var savedTheme = null;
  try { savedTheme = localStorage.getItem("theme"); } catch (e) {}
  if (savedTheme) applyTheme(savedTheme);
  else if (window.matchMedia("(prefers-color-scheme: light)").matches) applyTheme("light");
  else applyTheme("dark");

  function toggleTheme() {
    var light = !document.body.classList.contains("light");
    applyTheme(light ? "light" : "dark");
    try { localStorage.setItem("theme", light ? "light" : "dark"); } catch (e) {}
  }
  if (themeBtn) themeBtn.addEventListener("click", toggleTheme);
  if (themeBtnMobile) themeBtnMobile.addEventListener("click", toggleTheme);

  /* ---------- VOLTAR AO TOPO ---------- */
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      var y = window.scrollY || document.documentElement.scrollTop;
      toTop.classList.toggle("show", y > 600);
      ticking = false;
    });
  }, { passive: true });
  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  });

  /* ---------- IDIOMA PT / EN ---------- */
  var STORE = "lang";
  var langToggles = [
    document.getElementById("langToggle"),
    document.getElementById("langToggleMobile"),
  ];
  function translate(lang) {
    var els = document.querySelectorAll("[data-en]");
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var en = el.getAttribute("data-en");
      if (en === null) continue;
      if (lang === "en") {
        if (el.getAttribute("data-pt") === null) el.setAttribute("data-pt", el.innerHTML);
        el.innerHTML = en;
      } else {
        var pt = el.getAttribute("data-pt");
        if (pt !== null) el.innerHTML = pt;
      }
    }
  }
  function applyLang(lang) {
    var en = lang === "en";
    document.documentElement.lang = en ? "en" : "pt-BR";
    document.body.classList.toggle("en", en);
    translate(en ? "en" : "pt");
    document.title = en
      ? "Luis Guilherme — Front-End Developer & Tech Student"
      : "Luis Guilherme — Dev Frontend & ADS";
    applyTheme(document.body.classList.contains("light") ? "light" : "dark");
    if (currentCase) renderCase(currentCase);
  }
  var savedLang = null;
  try { savedLang = localStorage.getItem(STORE); } catch (e) {}
  var initial = savedLang ||
    (navigator.language && navigator.language.toLowerCase().indexOf("pt") === 0 ? "pt" : "en");
  applyLang(initial === "en" ? "en" : "pt");

  function toggleLang() {
    var next = document.documentElement.lang === "en" ? "pt" : "en";
    applyLang(next);
    try { localStorage.setItem(STORE, next); } catch (e) {}
  }
  langToggles.forEach(function (btn) {
    if (btn) btn.addEventListener("click", toggleLang);
  });
})();
