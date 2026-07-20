"use client";

import { useEffect } from "react";

export default function Site({ establishments }) {
  useEffect(() => {
    var loaderT = setTimeout(function () {
      var l = document.getElementById("loader");
      if (l) l.classList.add("gone");
    }, 1600);

    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    var nav = document.getElementById("nav");
    var burger = document.getElementById("burger");
    var menu = document.getElementById("menu");
    var progress = document.getElementById("progress");

    function onScroll() {
      var y = window.scrollY;
      if (nav) nav.classList.toggle("small", y > 40);
      var h = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    function closeMenu() {
      if (burger) burger.classList.remove("open");
      if (menu) menu.classList.remove("open");
    }
    function toggleMenu() {
      if (burger) burger.classList.toggle("open");
      if (menu) menu.classList.toggle("open");
    }
    if (burger) burger.addEventListener("click", toggleMenu);
    var menuLinks = menu ? menu.querySelectorAll("a") : [];
    menuLinks.forEach(function (a) { a.addEventListener("click", closeMenu); });

    var reveals = document.querySelectorAll(".reveal");
    var io;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
      reveals.forEach(function (el) { io.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add("in"); });
    }

    var imgs = document.querySelectorAll(".hero__img");
    var idx = 0;
    var slideInt = null;
    if (imgs.length > 1) {
      slideInt = setInterval(function () {
        imgs[idx].classList.remove("is-active");
        idx = (idx + 1) % imgs.length;
        imgs[idx].classList.add("is-active");
      }, 5400);
    }

    var counters = document.querySelectorAll("[data-count]");
    var cio;
    if ("IntersectionObserver" in window) {
      cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var el = e.target, target = parseInt(el.dataset.count, 10), start = null, dur = 1300;
          function step(ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / dur, 1);
            el.textContent = Math.floor(p * target);
            if (p < 1) requestAnimationFrame(step); else el.textContent = target;
          }
          requestAnimationFrame(step);
          cio.unobserve(el);
        });
      }, { threshold: 0.6 });
      counters.forEach(function (c) { cio.observe(c); });
    }

    var mapLink = document.getElementById("mapLink");
    if (mapLink) {
      mapLink.href = "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent("Carré VIP Ngor Route de l'Aéroport Dakar");
      mapLink.target = "_blank"; mapLink.rel = "noopener";
    }

    var items = Array.prototype.slice.call(document.querySelectorAll("[data-src]"));
    var lb = document.getElementById("lb"), lbImg = document.getElementById("lbImg"), lbi = 0;
    function openLb(i) { lbi = i; lbImg.src = items[i].dataset.src; lb.classList.add("open"); document.body.style.overflow = "hidden"; }
    function closeLb() { lb.classList.remove("open"); document.body.style.overflow = ""; }
    function lbStep(d) { lbi = (lbi + d + items.length) % items.length; lbImg.src = items[lbi].dataset.src; }
    items.forEach(function (el, i) {
      el.addEventListener("click", function (e) { e.preventDefault(); openLb(i); });
    });
    var lbClose = document.getElementById("lbClose");
    var lbNext = document.getElementById("lbNext");
    var lbPrev = document.getElementById("lbPrev");
    if (lbClose) lbClose.addEventListener("click", closeLb);
    if (lbNext) lbNext.addEventListener("click", function () { lbStep(1); });
    if (lbPrev) lbPrev.addEventListener("click", function () { lbStep(-1); });
    if (lb) lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
    function onKey(e) {
      if (!lb || !lb.classList.contains("open")) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowRight") lbStep(1);
      if (e.key === "ArrowLeft") lbStep(-1);
    }
    document.addEventListener("keydown", onKey);

    function railStepOf(rail) {
      var f = rail.querySelector("figure");
      return f ? f.getBoundingClientRect().width + 16 : rail.clientWidth * 0.8;
    }
    function railScrollTo(rail, delta) {
      var max = rail.scrollWidth - rail.clientWidth;
      var target = Math.max(0, Math.min(max, rail.scrollLeft + delta));
      try { rail.scrollTo({ left: target, behavior: "smooth" }); } catch (e) {}
      requestAnimationFrame(function () { if (Math.abs(rail.scrollLeft - target) > 2) rail.scrollLeft = target; });
      setTimeout(function () { if (Math.abs(rail.scrollLeft - target) > 2) rail.scrollLeft = target; }, 60);
    }
    var rails = Array.prototype.slice.call(document.querySelectorAll("[data-rail]"));
    rails.forEach(function (rail) {
      var scope = rail.closest(".sp") || document;
      var next = scope.querySelector(".rl-next"), prev = scope.querySelector(".rl-prev");
      if (next) next.addEventListener("click", function () { railScrollTo(rail, railStepOf(rail)); });
      if (prev) prev.addEventListener("click", function () { railScrollTo(rail, -railStepOf(rail)); });
      var down = false, moved = false, startX, sl;
      rail.addEventListener("pointerdown", function (e) { down = true; moved = false; startX = e.pageX; sl = rail.scrollLeft; try { rail.setPointerCapture(e.pointerId); } catch (_) {} });
      rail.addEventListener("pointermove", function (e) { if (!down) return; if (Math.abs(e.pageX - startX) > 4) moved = true; rail.scrollLeft = sl - (e.pageX - startX); });
      rail.addEventListener("pointerup", function () { down = false; });
      rail.addEventListener("click", function (e) { if (moved) { e.stopPropagation(); e.preventDefault(); } }, true);
      rail.addEventListener("wheel", function (e) { if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { rail.scrollLeft += e.deltaY; e.preventDefault(); } }, { passive: false });
    });

    var navLinks = Array.prototype.slice.call(menu ? menu.querySelectorAll("a") : []).filter(function (a) {
      var hh = a.getAttribute("href");
      return hh && hh.charAt(0) === "#" && !a.classList.contains("menu__cta") && document.querySelector(hh);
    });
    var sections = navLinks.map(function (a) { return document.querySelector(a.getAttribute("href")); });
    function setActive() {
      var probe = window.scrollY + window.innerHeight * 0.35;
      var current = -1;
      sections.forEach(function (s, i) {
        var top = s.getBoundingClientRect().top + window.scrollY;
        if (probe >= top) current = i;
      });
      navLinks.forEach(function (a, i) { a.classList.toggle("active", i === current); });
    }
    window.addEventListener("scroll", setActive, { passive: true });
    setActive();

    var toast = document.getElementById("toast"), tt;
    function showToast(m) { toast.textContent = m; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove("show"); }, 4200); }

    var form = document.getElementById("reserveForm");
    function onSubmit(e) {
      e.preventDefault();
      var d = {
        name: form.name.value.trim(), phone: form.phone.value.trim(),
        date: form.date.value, guests: form.guests.value,
        space: form.space.value, msg: form.msg.value.trim(),
      };
      if (!d.name || !d.phone || !d.date || !d.guests || !d.space) { showToast("Merci de compléter les champs requis."); return; }
      var txt = "Bonjour Carré Vip Ngor, je souhaite réserver :\n" +
        "• Nom : " + d.name + "\n• Téléphone : " + d.phone + "\n• Date : " + d.date +
        "\n• Couverts : " + d.guests + "\n• Espace : " + d.space + (d.msg ? "\n• Message : " + d.msg : "");
      window.open("https://wa.me/221789008888?text=" + encodeURIComponent(txt), "_blank");
      showToast("Merci " + d.name + " ! Votre demande est prête sur WhatsApp.");
      form.reset();
    }
    if (form) form.addEventListener("submit", onSubmit);

    var di = document.getElementById("date");
    if (di) di.min = new Date().toISOString().split("T")[0];

    var fine = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
    var reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;

    var glow = document.getElementById("cursorGlow");
    var glowRaf = null;
    if (glow && fine && !reduce) {
      var gx = window.innerWidth / 2, gy = window.innerHeight / 2, cxx = gx, cyy = gy;
      var glowMove = function (e) { gx = e.clientX; gy = e.clientY; glow.classList.add("on"); };
      var glowLeave = function () { glow.classList.remove("on"); };
      function glowLoop() {
        cxx += (gx - cxx) * 0.18; cyy += (gy - cyy) * 0.18;
        glow.style.transform = "translate(" + cxx + "px," + cyy + "px) translate(-50%,-50%)";
        glowRaf = requestAnimationFrame(glowLoop);
      }
      window.addEventListener("mousemove", glowMove);
      window.addEventListener("mouseleave", glowLeave);
      glowLoop();
    }

    if (fine && !reduce) {
      document.querySelectorAll(".cta, .sp__arrows button").forEach(function (el) {
        var strength = 0.35;
        el.addEventListener("mousemove", function (e) {
          var r = el.getBoundingClientRect();
          var mx = e.clientX - (r.left + r.width / 2);
          var my = e.clientY - (r.top + r.height / 2);
          el.style.transform = "translate(" + mx * strength + "px," + my * strength + "px)";
        });
        el.addEventListener("mouseleave", function () { el.style.transform = ""; });
      });
      document.querySelectorAll(".sp__rail figure").forEach(function (fig) {
        var img = fig.querySelector("img");
        fig.addEventListener("mousemove", function (e) {
          var r = fig.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width - 0.5;
          var py = (e.clientY - r.top) / r.height - 0.5;
          fig.style.transform = "perspective(900px) rotateY(" + px * 5 + "deg) rotateX(" + -py * 5 + "deg)";
          if (img) img.style.transform = "scale(1.07)";
        });
        fig.addEventListener("mouseleave", function () {
          fig.style.transform = ""; if (img) img.style.transform = "";
        });
      });
    }

    if (!reduce) {
      var heroBg = document.querySelector(".hero__bg");
      var heroInner = document.querySelector(".hero__inner");
      var heroParallax = function () {
        var y = window.scrollY;
        if (y < window.innerHeight) {
          if (heroBg) heroBg.style.transform = "translateY(" + y * 0.28 + "px)";
          if (heroInner) heroInner.style.transform = "translateY(" + y * 0.12 + "px)";
        }
      };
      window.addEventListener("scroll", heroParallax, { passive: true });
    }

    return function () {
      clearTimeout(loaderT);
      if (slideInt) clearInterval(slideInt);
      if (glowRaf) cancelAnimationFrame(glowRaf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", setActive);
      document.removeEventListener("keydown", onKey);
      if (io) io.disconnect();
      if (cio) cio.disconnect();
    };
  }, []);

  const bg = (name) => ({ backgroundImage: `url('/assets/img/${name}')` });

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <div className="frame" aria-hidden="true" />
      <div className="progress" id="progress" aria-hidden="true" />
      <div className="cursor-glow" id="cursorGlow" aria-hidden="true" />

      <div className="loader" id="loader">
        <div className="loader__word">
          <span>C</span><span>a</span><span>r</span><span>r</span><span>é</span>
          <em>&nbsp;</em>
          <span>V</span><span>i</span><span>p</span>
        </div>
        <div className="loader__bar"><i /></div>
      </div>

      <header className="nav" id="nav">
        <a href="#top" className="brand">
          <span className="brand__name">Carré Vip</span>
          <span className="brand__loc">Ngor · Dakar</span>
        </a>
        <nav className="menu" id="menu">
          <a href="#story"><b>01</b>Le lieu</a>
          <a href="#spaces"><b>02</b>Les espaces</a>
          <a href="#visit"><b>03</b>Nous trouver</a>
          <a href="#reserve" className="menu__cta">Réserver</a>
          <div className="menu__extra">
            <a className="menu__phone" href="tel:+22133823326">+221 33 823 33 26</a>
            <div className="menu__social">
              <a href="https://www.facebook.com/p/CARRE-VIP-NGOR-route-de-l-a%C3%A9roport-100063702677994/" target="_blank" rel="noopener">Facebook</a>
            </div>
            <span className="menu__addr">Route de l&apos;Aéroport, Ngor · Dakar</span>
          </div>
        </nav>
        <button className="burger" id="burger" aria-label="Menu"><span /><span /></button>
      </header>

      <section className="hero" id="top">
        <div className="hero__bg">
          <div className="hero__img is-active" style={bg("club-sofas-logo.jpeg")} />
          <div className="hero__img" style={bg("pool-01.jpeg")} />
          <div className="hero__img" style={bg("lounge-floral.jpeg")} />
          <div className="hero__img" style={bg("entrance-mural.jpeg")} />
        </div>
        <div className="hero__veil" />

        <span className="hero__side hero__side--l">EST. NGOR — 24/7</span>
        <span className="hero__side hero__side--r">14.6928° N · 17.5140° W</span>

        <div className="hero__inner">
          <h1 className="hero__h1">
            <span className="line"><span>Un jardin</span></span>
            <span className="line"><span>tropical qui ne</span></span>
            <span className="line"><span><em>ferme jamais</em></span></span>
          </h1>
          <div className="hero__foot">
            <p>Restaurant &amp; piscine, grand club, after et lounge — quatre univers, une seule adresse. L&apos;endroit le plus vivant de Dakar.</p>
            <a href="#reserve" className="cta">
              <span>Réserver une table</span>
              <svg viewBox="0 0 24 24" width="16" height="16"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
            </a>
          </div>
        </div>

        <div className="hero__ticker">
          <span>Piscine</span><i>/</i><span>Restaurant</span><i>/</i><span>Club</span><i>/</i><span>After</span><i>/</i><span>Lounge</span><i>/</i><span>Chicha</span><i>/</i>
        </div>
      </section>

      <section className="story" id="story">
        <div className="story__label reveal"><i />01 — Le lieu</div>
        <div className="story__grid">
          <div className="story__text">
            <h2 className="reveal">
              <span className="drop">À</span> Ngor, sous les palmiers et les bougainvilliers,
              le <em>Carré Vip</em> réinvente l&apos;art dakarois de recevoir —
              du premier café du matin aux dernières lueurs de la nuit.
            </h2>
            <div className="story__cols">
              <p className="reveal">Un complexe, quatre univers : le restaurant et sa piscine ouverts 24h/24, le grand club, l&apos;after jusqu&apos;au matin et le lounge feutré. À toute heure, il se passe quelque chose au Carré.</p>
              <p className="reveal">Une cuisine généreuse, des cocktails signatures, une chicha parfumée et un service qui ne s&apos;arrête jamais. Ici, chaque instant se vit comme une célébration.</p>
            </div>
            <div className="story__meta reveal">
              <div><b data-count="24">0</b><span>ouvert 24h/24</span></div>
              <div><b data-count="4">0</b><span>univers</span></div>
              <div><b>∞</b><span>soirées</span></div>
            </div>
          </div>
          <div className="story__media">
            <figure className="story__fig story__fig--a reveal"><img src="/assets/img/entrance-mural.jpeg" alt="Escalier d'entrée du Carré Vip" loading="lazy" /></figure>
            <figure className="story__fig story__fig--b reveal"><img src="/assets/img/club-sofas-logo.jpeg" alt="Le club Carré Vip" loading="lazy" /><figcaption>Le club Carré Vip</figcaption></figure>
          </div>
        </div>
      </section>

      <section className="spaces" id="spaces">
        <div className="spaces__head">
          <div className="story__label reveal"><i />02 — Les espaces</div>
          <h2 className="spaces__title reveal">Quatre univers,<br />une même adresse</h2>
        </div>

        {establishments.map((e, i) => (
          <article className="sp reveal" key={e.id} style={{ "--acc": e.accent }}>
            <div className="sp__top">
              <div className="sp__title">
                <span className="sp__idx">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{e.name}</h3>
                  <span className="sp__hours"><i />{e.hours}</span>
                </div>
              </div>
              <div className="sp__arrows"><button className="rl-prev" aria-label="Précédent">‹</button><button className="rl-next" aria-label="Suivant">›</button></div>
            </div>
            <p className="sp__desc">{e.desc}</p>
            <ul className="sp__tags">{e.tags.map((t) => <li key={t}>{t}</li>)}</ul>
            <div className="sp__rail" data-rail="">
              {e.photos.length === 0 ? (
                <div className="sp__empty">Photos bientôt disponibles</div>
              ) : (
                e.photos.map((src, j) => (
                  <figure key={src} data-src={src}><img src={src} alt={`${e.name} — ${j + 1}`} loading="lazy" /></figure>
                ))
              )}
            </div>
          </article>
        ))}

        <p className="spaces__hint reveal"><span>Glissez</span> chaque série ou utilisez les flèches · <span>cliquez</span> une photo pour l&apos;agrandir</p>
      </section>

      <section className="quote" style={bg("club-throne.jpeg")}>
        <div className="quote__veil" />
        <blockquote className="reveal">« Le luxe, ici, c&apos;est le <em>temps</em> — celui qui ne s&apos;arrête jamais. »</blockquote>
      </section>

      <section className="visit" id="visit">
        <div className="visit__grid">
          <div className="visit__info" id="reserve">
            <div className="story__label reveal"><i />03 — Réserver &amp; nous trouver</div>
            <h2 className="visit__title reveal">Vivez l&apos;expérience<br /><em>Carré Vip</em></h2>
            <p className="reveal">Réservez votre table, un salon lounge ou un espace au club. Notre équipe vous répond en quelques minutes sur WhatsApp.</p>

            <div className="visit__lines reveal">
              <a className="visit__line" href="https://wa.me/221789008888" target="_blank" rel="noopener">
                <span className="visit__k">WhatsApp · Commandes</span>
                <span className="visit__v">+221 78 900 88 88</span>
              </a>
              <a className="visit__line" href="tel:+22133823326">
                <span className="visit__k">Téléphone</span>
                <span className="visit__v">+221 33 823 33 26</span>
              </a>
              <a className="visit__line" id="mapLink" href="#">
                <span className="visit__k">Adresse</span>
                <span className="visit__v">Route de l&apos;Aéroport, Ngor — Dakar</span>
              </a>
              <div className="visit__line">
                <span className="visit__k">Suivez-nous</span>
                <span className="visit__v visit__social">
                  <a href="https://www.facebook.com/p/CARRE-VIP-NGOR-route-de-l-a%C3%A9roport-100063702677994/" target="_blank" rel="noopener">Facebook</a>
                </span>
              </div>
            </div>
          </div>

          <form className="rform reveal" id="reserveForm" noValidate>
            <div className="fld"><input id="name" name="name" type="text" required placeholder=" " /><label htmlFor="name">Nom complet</label></div>
            <div className="fld"><input id="phone" name="phone" type="tel" required placeholder=" " /><label htmlFor="phone">Téléphone</label></div>
            <div className="fld-row">
              <div className="fld"><input id="date" name="date" type="date" required placeholder=" " /><label htmlFor="date" className="fixed">Date</label></div>
              <div className="fld"><input id="guests" name="guests" type="number" min="1" max="60" required placeholder=" " /><label htmlFor="guests">Couverts</label></div>
            </div>
            <div className="fld">
              <select id="space" name="space" required defaultValue="">
                <option value="" disabled>Espace souhaité</option>
                <option>Restaurant / Piscine</option>
                <option>Club Carré Vip</option>
                <option>After</option>
                <option>Lounge · Chicha</option>
                <option>Privatisation</option>
              </select>
            </div>
            <div className="fld"><textarea id="msg" name="msg" rows="2" placeholder=" " /><label htmlFor="msg">Message (optionnel)</label></div>
            <button type="submit" className="cta cta--full">
              <span>Envoyer sur WhatsApp</span>
              <svg viewBox="0 0 24 24" width="16" height="16"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
            </button>
            <p className="rform__note">Réponse rapide · sans engagement</p>
          </form>
        </div>
      </section>

      <footer className="foot">
        <div className="foot__big">Carré Vip</div>
        <div className="foot__row">
          <span>Ngor · Dakar · Sénégal</span>
          <nav>
            <a href="#story">Le lieu</a>
            <a href="#spaces">Espaces</a>
            <a href="#visit">Nous trouver</a>
            <a href="#reserve">Réserver</a>
          </nav>
          <span>+221 33 823 33 26</span>
        </div>
        <div className="foot__base">
          <span>© <span id="year" /> Carré Vip — Route de l&apos;Aéroport, Ngor.</span>
          <span className="foot__credit">Conçu par <a href="https://wa.me/221774992742" target="_blank" rel="noopener">MMBTECH</a></span>
          <a href="#top">Retour en haut ↑</a>
        </div>
      </footer>

      <div className="lb" id="lb">
        <button className="lb__x" id="lbClose" aria-label="Fermer">✕</button>
        <button className="lb__nav lb__prev" id="lbPrev" aria-label="Précédent">‹</button>
        <img id="lbImg" src="" alt="" />
        <button className="lb__nav lb__next" id="lbNext" aria-label="Suivant">›</button>
      </div>

      <div className="toast" id="toast" />
    </>
  );
}
