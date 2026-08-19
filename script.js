/* =========================================================
   Honey Acres Ranch — interactions
   ========================================================= */
(function () {
  'use strict';

  /* ---------- footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- sticky header state ---------- */
  var header = document.getElementById('siteHeader');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile navigation ---------- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');

  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });

    document.addEventListener('click', function (e) {
      if (!nav.classList.contains('open')) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      closeNav();
    });
  }

  /* ---------- reveal on scroll ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var siblings = Array.prototype.slice.call(el.parentNode.children).filter(function (n) {
          return n.classList && n.classList.contains('reveal');
        });
        var idx = Math.min(siblings.indexOf(el), 5);
        el.style.transitionDelay = (idx > 0 ? idx * 0.08 : 0) + 's';
        el.classList.add('visible');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- active nav link on scroll ---------- */
  var sections = Array.prototype.slice.call(
    document.querySelectorAll('section[id], .hero[id]')
  );
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav > a[href^="#"]:not(.btn)')
  );

  function setActive() {
    var pos = window.scrollY + window.innerHeight * 0.32;
    var currentId = null;

    sections.forEach(function (sec) {
      if (sec.offsetTop <= pos) currentId = sec.id;
    });

    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
    });
  }

  window.addEventListener('scroll', setActive, { passive: true });
  window.addEventListener('resize', setActive);
  setActive();

  /* ---------- gallery lightbox ---------- */
  var tiles = Array.prototype.slice.call(document.querySelectorAll('.tile'));
  var lightbox = document.getElementById('lightbox');
  var lbImage = document.getElementById('lbImage');
  var lbCaption = document.getElementById('lbCaption');
  var lbClose = document.getElementById('lbClose');
  var lbPrev = document.getElementById('lbPrev');
  var lbNext = document.getElementById('lbNext');
  var current = 0;
  var lastFocused = null;

  function render(index) {
    if (!tiles.length) return;
    current = (index + tiles.length) % tiles.length;
    var tile = tiles[current];
    var img = tile.querySelector('img');
    lbImage.src = tile.getAttribute('data-full') || (img ? img.src : '');
    lbImage.alt = img ? img.alt : '';
    lbCaption.textContent = tile.getAttribute('data-caption') || (img ? img.alt : '');
  }

  function openLightbox(index) {
    if (!lightbox) return;
    lastFocused = document.activeElement;
    render(index);
    lightbox.hidden = false;
    document.body.classList.add('lb-open');
    requestAnimationFrame(function () { lightbox.classList.add('open'); });
    lbClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.classList.remove('lb-open');
    window.setTimeout(function () {
      lightbox.hidden = true;
    }, 260);
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  tiles.forEach(function (tile, i) {
    tile.addEventListener('click', function () { openLightbox(i); });
  });

  if (lightbox) {
    lbClose.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click', function () { render(current - 1); });
    lbNext.addEventListener('click', function () { render(current + 1); });

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') render(current - 1);
      if (e.key === 'ArrowRight') render(current + 1);
      if (e.key === 'Tab') {
        var focusables = [lbClose, lbPrev, lbNext];
        var idx = focusables.indexOf(document.activeElement);
        e.preventDefault();
        var nextIdx = e.shiftKey ? idx - 1 : idx + 1;
        focusables[(nextIdx + focusables.length) % focusables.length].focus();
      }
    });

    /* touch swipe */
    var startX = null;
    lightbox.addEventListener('touchstart', function (e) {
      startX = e.changedTouches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var delta = e.changedTouches[0].clientX - startX;
      if (Math.abs(delta) > 45) render(delta > 0 ? current - 1 : current + 1);
      startX = null;
    }, { passive: true });
  }

  /* ---------- smooth anchor offset for sticky header ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (!id || id === '#' || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var headerH = header ? header.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - headerH + 1;
      window.scrollTo({
        top: top,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      });
    });
  });
})();
