/* ==========================================================================
   Tomas Guzman · Portafolio · main.js
   Sin dependencias. Este archivo es público: no guardes claves ni secretos acá.
   El ID de medición de GA4 y el endpoint de Formspree son públicos por diseño.
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- Configuración ---------- */
  var CONFIG = {
    GA_ID: "",            // Pegá tu ID de GA4, por ejemplo "G-ABC123XYZ". Vacío = analytics desactivado.
    FORM_ENDPOINT: "",    // Pegá tu endpoint de Formspree, por ejemplo "https://formspree.io/f/abcdwxyz". Vacío = abre el mail.
    EMAIL: ["tomasgz.dev", "gmail.com"], // se arma en tiempo real para que los bots no lo lean del HTML
    CONSENT_KEY: "tg_consent_v1"
  };

  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  function store(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; }
  }

  /* ---------- Año del footer ---------- */
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Email ofuscado ---------- */
  var email = CONFIG.EMAIL.join("@");
  $$("[data-email]").forEach(function (el) {
    el.textContent = email;
    if (el.tagName === "A") el.href = "mailto:" + email;
  });

  /* ---------- Nav: sombra, menú móvil y sección activa ---------- */
  var nav = $(".nav");
  var progress = $(".progress");
  function onScroll() {
    var y = window.scrollY;
    if (nav) nav.classList.toggle("scrolled", y > 10);
    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = "scaleX(" + (h > 0 ? y / h : 0) + ")";
    }
    updateTimeline();
  }

  var menuBtn = $(".menu-btn");
  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      var open = root.classList.toggle("menu-open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$(".nav-links a").forEach(function (a) {
      a.addEventListener("click", function () {
        root.classList.remove("menu-open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  var links = $$(".nav-links a[href^='#']");
  if ("IntersectionObserver" in window && links.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.setAttribute("aria-current", a.getAttribute("href") === "#" + e.target.id ? "true" : "false"); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    links.forEach(function (a) { var s = $(a.getAttribute("href")); if (s) spy.observe(s); });
  }

  /* ---------- Revelado al hacer scroll ---------- */
  function countUp(el) {
    var to = parseFloat(el.getAttribute("data-count"));
    var dec = (el.getAttribute("data-count").split(".")[1] || "").length;
    var sep = el.getAttribute("data-sep") || ",";
    if (reduce) { el.textContent = to.toFixed(dec).replace(".", sep); return; }
    var t0 = null, dur = 1600;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var v = to * (1 - Math.pow(1 - p, 4));
      el.textContent = v.toFixed(dec).replace(".", sep);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        $$("[data-count]", e.target).forEach(countUp);
        if (e.target.hasAttribute("data-count")) countUp(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
    $$(".rv, .rv-l, .tl, .pc").forEach(function (el) { io.observe(el); });
  } else {
    $$(".rv, .rv-l, .tl, .pc").forEach(function (el) { el.classList.add("in"); });
  }

  /* Retraso escalonado: data-stagger en el contenedor */
  $$("[data-stagger]").forEach(function (box) {
    var step = parseInt(box.getAttribute("data-stagger"), 10) || 90;
    $$(".rv, .rv-l", box).forEach(function (el, i) { el.style.setProperty("--d", (i * step) + "ms"); });
  });

  $$("[data-v]").forEach(function (el) { el.style.setProperty("--v", el.getAttribute("data-v") + "%"); });

  /* ---------- Línea de tiempo que se llena con el scroll ---------- */
  var tl = $(".timeline");
  function updateTimeline() {
    if (!tl) return;
    var r = tl.getBoundingClientRect();
    var vh = window.innerHeight;
    var p = (vh * 0.6 - r.top) / r.height;
    tl.style.setProperty("--p", Math.max(0, Math.min(1, p)).toFixed(3));
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  requestAnimationFrame(onScroll);

  /* ---------- Brillo que sigue al cursor en las tarjetas ---------- */
  if (window.matchMedia("(hover: hover)").matches) {
    $$(".card").forEach(function (c) {
      c.addEventListener("pointermove", function (e) {
        var r = c.getBoundingClientRect();
        c.style.setProperty("--x", (e.clientX - r.left) + "px");
        c.style.setProperty("--y", (e.clientY - r.top) + "px");
      });
    });

    /* Tarjetas de "modo jugador" con inclinación 3D */
    if (!reduce) {
      $$(".pc").forEach(function (c) {
        c.addEventListener("pointermove", function (e) {
          var r = c.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
          c.classList.add("tilt");
          c.style.setProperty("--ry", (px * 10).toFixed(2) + "deg");
          c.style.setProperty("--rx", (-py * 10).toFixed(2) + "deg");
        });
        c.addEventListener("pointerleave", function () { c.classList.remove("tilt"); });
      });
    }

    /* CTA magnético */
    if (!reduce) {
      $$(".cta.magnet").forEach(function (b) {
        b.addEventListener("pointermove", function (e) {
          var r = b.getBoundingClientRect();
          b.style.setProperty("--mx", ((e.clientX - r.left - r.width / 2) * 0.18) + "px");
          b.style.setProperty("--my", ((e.clientY - r.top - r.height / 2) * 0.25) + "px");
        });
        b.addEventListener("pointerleave", function () { b.style.setProperty("--mx", "0px"); b.style.setProperty("--my", "0px"); });
      });
    }
  }

  /* ---------- Corte de katana en el nombre ---------- */
  $$(".slash").forEach(function (s) {
    var t;
    function cut() { clearTimeout(t); s.classList.add("cut"); }
    function heal() { t = setTimeout(function () { s.classList.remove("cut"); }, 250); }
    s.addEventListener("mouseenter", cut);
    s.addEventListener("mouseleave", heal);
    s.addEventListener("touchstart", function () { cut(); setTimeout(heal, 700); }, { passive: true });
    if (!reduce) setTimeout(function () { cut(); setTimeout(heal, 700); }, 1400);
  });

  /* ---------- Campo de estrellas con parallax ---------- */
  var cv = $("#stars");
  if (cv && cv.getContext) {
    var ctx = cv.getContext("2d"), stars = [], W, H, dpr, running = true;
    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.width = Math.floor(window.innerWidth * dpr);
      H = cv.height = Math.floor(window.innerHeight * dpr);
      var n = Math.min(160, Math.floor((window.innerWidth * window.innerHeight) / (window.innerWidth < 700 ? 14000 : 9000)));
      stars = [];
      for (var i = 0; i < n; i++) {
        stars.push({ x: Math.random() * W, y: Math.random() * H, z: Math.random() * 0.8 + 0.2, tw: Math.random() * Math.PI * 2 });
      }
    }
    function draw(t) {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      var sy = window.scrollY * dpr;
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var y = (s.y - sy * s.z * 0.35) % H; if (y < 0) y += H;
        var a = 0.35 + 0.45 * s.z + (reduce ? 0 : Math.sin(t / 900 + s.tw) * 0.15);
        ctx.fillStyle = "rgba(220,215,255," + a.toFixed(2) + ")";
        ctx.fillRect(s.x, y, s.z * 1.6 * dpr, s.z * 1.6 * dpr);
      }
      if (!reduce) requestAnimationFrame(draw);
    }
    size();
    window.addEventListener("resize", size);
    document.addEventListener("visibilitychange", function () {
      running = !document.hidden;
      if (running && !reduce) requestAnimationFrame(draw);
    });
    setTimeout(function () { requestAnimationFrame(draw); }, 700);
    if (reduce) window.addEventListener("scroll", function () { requestAnimationFrame(draw); }, { passive: true });
  }

  /* ---------- Entrada del hero ---------- */
  requestAnimationFrame(function () { setTimeout(function () { root.classList.add("ready"); }, 60); });

  /* ---------- Consentimiento de cookies + GA4 (Consent Mode v2) ---------- */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag("consent", "default", {
    ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
    analytics_storage: "denied", wait_for_update: 500
  });

  var gaLoaded = false;
  function loadGA() {
    if (gaLoaded || !/^G-[A-Z0-9]+$/.test(CONFIG.GA_ID)) return;
    gaLoaded = true;
    gtag("consent", "update", { analytics_storage: "granted" });
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + CONFIG.GA_ID;
    document.head.appendChild(s);
    gtag("js", new Date());
    gtag("config", CONFIG.GA_ID, { anonymize_ip: true });
  }
  function track(name, params) { if (gaLoaded) gtag("event", name, params || {}); }

  var banner = $(".cookie");
  function showBanner() { if (banner) { banner.hidden = false; requestAnimationFrame(function () { banner.classList.add("show"); }); } }
  function hideBanner() { if (banner) { banner.classList.remove("show"); setTimeout(function () { banner.hidden = true; }, 500); } }
  function decide(v) {
    store(CONFIG.CONSENT_KEY, v);
    hideBanner();
    if (v === "granted") loadGA();
    else if (gaLoaded) { gtag("consent", "update", { analytics_storage: "denied" }); }
  }
  if (banner && CONFIG.GA_ID) {
    var prev = store(CONFIG.CONSENT_KEY);
    if (prev === "granted") loadGA();
    else if (prev !== "denied") setTimeout(showBanner, 900);
    $("[data-consent='accept']", banner).addEventListener("click", function () { decide("granted"); });
    $("[data-consent='reject']", banner).addEventListener("click", function () { decide("denied"); });
  }
  $$("[data-cookie-settings]").forEach(function (b) {
    if (!CONFIG.GA_ID) { b.hidden = true; return; }
    b.addEventListener("click", showBanner);
  });

  /* Evento de clic en el CTA */
  $$("a.cta").forEach(function (a) {
    a.addEventListener("click", function () { track("cta_click", { location: a.getAttribute("data-loc") || "" }); });
  });

  /* ---------- Formulario con protección anti-spam ---------- */
  var form = $("#contact-form");
  if (form) {
    var started = Date.now();
    var msg = $(".form-msg", form);
    var btn = $("button[type=submit]", form);
    function say(t, cls) { msg.textContent = t; msg.className = "form-msg " + (cls || ""); }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);

      // 1) Honeypot: los humanos no ven este campo
      if (data.get("_gotcha")) return;
      // 2) Trampa de tiempo: nadie completa el formulario en menos de 3 segundos
      if (Date.now() - started < 3000) { say("Tomate un segundo más y volvé a enviarlo.", "err"); return; }
      // 3) Límite: un envío por minuto desde este navegador
      var last = parseInt(store("tg_last_send") || "0", 10);
      if (Date.now() - last < 60000) { say("Ya recibí tu mensaje. Esperá un minuto para enviar otro.", "err"); return; }
      // 4) Validación básica y filtro de enlaces masivos
      var text = String(data.get("mensaje") || "");
      if ((text.match(/https?:\/\//g) || []).length > 2) { say("El mensaje tiene demasiados enlaces.", "err"); return; }
      if (!form.checkValidity()) { form.reportValidity(); return; }

      if (!CONFIG.FORM_ENDPOINT) {
        var body = "Nombre: " + data.get("nombre") + "\nEmail: " + data.get("email") +
          (data.get("empresa") ? "\nEmpresa: " + data.get("empresa") : "") + "\n\n" + text;
        window.location.href = "mailto:" + email + "?subject=" + encodeURIComponent("Contacto desde tu web") + "&body=" + encodeURIComponent(body);
        store("tg_last_send", String(Date.now()));
        track("generate_lead", { method: "mailto" });
        say("Se abrió tu app de correo con el mensaje listo para enviar.", "ok");
        return;
      }

      btn.disabled = true;
      say("Enviando…");
      fetch(CONFIG.FORM_ENDPOINT, { method: "POST", body: data, headers: { Accept: "application/json" } })
        .then(function (r) {
          if (!r.ok) throw new Error("http");
          form.reset();
          store("tg_last_send", String(Date.now()));
          track("generate_lead", { method: "form" });
          say("¡Gracias! Recibí tu mensaje y te respondo pronto.", "ok");
        })
        .catch(function () { say("No se pudo enviar. Escribime directo a " + email + ".", "err"); })
        .then(function () { btn.disabled = false; });
    });
  }
})();
