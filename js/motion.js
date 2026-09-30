// js/motion.js — GSAP motion layer for the index-motion.html preview.
// Every effect lives inside gsap.matchMedia() so visitors who prefer reduced
// motion get the plain, fully visible page. ScrollTriggers are created in
// page order (top to bottom) so pin spacing is measured correctly.

(function () {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, DrawSVGPlugin);

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const header = $('header.sticky');
  const hdr = () => (header ? header.offsetHeight : 0);
  const setHeaderVar = () => document.documentElement.style.setProperty('--hdr', hdr() + 'px');
  const finePointer = () => window.matchMedia('(pointer: fine)').matches;

  // Scatter the small italic taglines around the hero, clear of the headline.
  function scatterTaglines() {
    $$('.random-text').forEach(el => {
      let top, left;
      do {
        top = Math.random() * 90 + 5;
        left = Math.random() * 90 + 5;
      } while (top > 25 && top < 75 && left > 25 && left < 75);
      el.style.top = `${top}%`;
      el.style.left = `${left}%`;
      gsap.set(el, { xPercent: -50, yPercent: -50 });
    });
  }

  function init() {
    setHeaderVar();
    ScrollTrigger.addEventListener('refreshInit', setHeaderVar);
    scatterTaglines();
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set('.random-text', { opacity: 1 });
    });

    mm.add({
      motion: '(prefers-reduced-motion: no-preference)',
      desktop: '(min-width: 1024px)'
    }, ctx => {
      const { motion, desktop } = ctx.conditions;
      if (!motion) return;
      document.documentElement.classList.add('motion-ok');
      const restoreText = [];

      // ── Scroll progress hairline ────────────────────────────────────────
      gsap.to('.bg-progress', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.3 }
      });

      // ── Hero intro ──────────────────────────────────────────────────────
      SplitText.create('#hero-title', {
        type: 'words',
        mask: 'words',
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.words, {
            yPercent: 110, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.06, delay: 0.2
          });
        }
      });
      gsap.to('.random-text', { opacity: 1, duration: 1.4, stagger: 0.25, delay: 1.1, ease: 'power2.out' });
      $$('.random-text').forEach((el, i) => {
        gsap.to(el, {
          y: gsap.utils.random(-14, 14), x: gsap.utils.random(-10, 10),
          duration: gsap.utils.random(3, 5), ease: 'sine.inOut', repeat: -1, yoyo: true, delay: i * 0.3
        });
      });
      gsap.fromTo('.hero-cue-line', { scaleY: 0 }, { scaleY: 1, duration: 1.2, ease: 'power2.inOut', repeat: -1, yoyo: true, delay: 1.6 });
      gsap.from('.hero-cue', { opacity: 0, duration: 1, delay: 1.6 });

      // ── Hero scroll story ───────────────────────────────────────────────
      // The hero stays pinned (no pin spacing) while the spacer scrolls past
      // and the creator card rises over it — no empty sheet, the card's
      // content is visible the whole way up.
      const floaters = $$('.hero-floater');
      const heroTl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: '#hero-seq',
          start: () => `top ${hdr()}px`,
          endTrigger: '#creator',
          end: () => `top ${hdr()}px`,
          pin: true,
          pinSpacing: false,
          scrub: 0.6,
          invalidateOnRefresh: true
        }
      });
      heroTl
        .to('.hero-cue', { opacity: 0, duration: 0.15 }, 0)
        .fromTo(floaters,
          { y: () => window.innerHeight * 0.6, opacity: 0, rotate: i => [-6, 5, -3][i] || 0 },
          { y: 0, opacity: 1, rotate: i => [-2, 2, -1][i] || 0, stagger: 0.06, duration: 0.7 }, 0)
        .to('.hero-headline', { yPercent: -8, duration: 0.8 }, 0.3)
        // creator card now climbing over the hero
        .to('.hero-inner', { scale: 0.94, transformOrigin: '50% 30%', borderRadius: 24, duration: 1 }, 1)
        .to('.hero-dim', { opacity: 0.35, duration: 1 }, 1)
        .to(floaters, { y: i => -140 * (floaters[i].dataset.depth || 1), duration: 1 }, 1);

      if (finePointer()) {
        const movers = floaters.map(el => ({
          depth: parseFloat(el.dataset.depth || 1),
          x: gsap.quickTo(el.querySelector('img'), 'x', { duration: 0.8, ease: 'power3.out' }),
          y: gsap.quickTo(el.querySelector('img'), 'y', { duration: 0.8, ease: 'power3.out' })
        }));
        $('#hero-seq').addEventListener('mousemove', e => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          movers.forEach(m => { m.x(nx * 30 * m.depth); m.y(ny * 30 * m.depth); });
        });
      }

      // ── 01 · Meet the Creator (content arrives with the card) ──────────
      const creatorTl = gsap.timeline({
        scrollTrigger: { trigger: '#creator', start: 'top 85%', once: true }
      });
      creatorTl
        .from('.creator-portrait img', { y: 60, scale: 0.94, opacity: 0, duration: 1.1, ease: 'expo.out' })
        .add(ruleIn($('#creator [data-chapter-rule]')), 0.15)
        .from('.creator-title', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, 0.25);
      splitLines('.creator-copy p', 'top 90%');

      // ── 02 · Kala Ghoda: a pen line sweeps across and draws the precinct
      kalaGhoda();

      // ── 03 · The Bombay Ballad ─────────────────────────────────────────
      chapterIn($('#bombay-ballad [data-chapter]'));
      gsap.fromTo('.ballad-band img', { xPercent: -8 }, {
        xPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: '.ballad-band', start: 'top bottom', end: 'bottom top', scrub: true }
      });
      if (desktop) {
        const track = $('.ballad-track');
        const travel = () => Math.max(0, track.scrollWidth - window.innerWidth);
        const voyageTween = gsap.to(track, {
          x: () => -travel(),
          ease: 'none',
          scrollTrigger: {
            trigger: '.ballad-voyage',
            start: () => `top ${hdr()}px`,
            end: () => '+=' + travel(),
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true
          }
        });
        gsap.from('.ballad-intro-panel > *', {
          y: 30, opacity: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: '.ballad-voyage', start: 'top 70%', once: true }
        });
        gsap.to('.ballad-hint', { x: 10, duration: 0.8, ease: 'sine.inOut', repeat: -1, yoyo: true });
        $$('.ballad-track > a').forEach(card => {
          gsap.fromTo(card.querySelector('img'), { xPercent: -6, scale: 1.12 }, {
            xPercent: 6,
            ease: 'none',
            scrollTrigger: { trigger: card, containerAnimation: voyageTween, start: 'left right', end: 'right left', scrub: true }
          });
          gsap.from(card, {
            y: 80, rotate: 3, opacity: 0, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: card, containerAnimation: voyageTween, start: 'left 90%', toggleActions: 'play none none reverse' }
          });
        });
      } else {
        gsap.from('.ballad-intro-panel > *', {
          y: 30, opacity: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: '.ballad-intro-panel', start: 'top 85%', once: true }
        });
        riseBatch('.ballad-track > a');
      }

      // ── 04 · Curated collections ───────────────────────────────────────
      // Arch frames rise open from the base, then each card slowly cycles
      // through products from its collection while it is on screen.
      chapterIn($('#collections [data-chapter]'));
      const catCards = $$('#collections .cat-card');
      gsap.set(catCards, { opacity: 0, y: 50 });
      gsap.set(catCards.map(c => $('.cat-frame', c)), { clipPath: 'inset(100% 0% 0% 0%)' });
      ScrollTrigger.batch(catCards, {
        start: 'top 90%',
        once: true,
        onEnter: batch => {
          gsap.to(batch, { opacity: 1, y: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out' });
          gsap.to(batch.map(c => $('.cat-frame', c)), { clipPath: 'inset(0% 0% 0% 0%)', stagger: 0.12, duration: 1.2, ease: 'expo.out' });
          gsap.from(batch.map(c => $('.cat-meta', c)), { y: 16, opacity: 0, stagger: 0.12, duration: 0.8, delay: 0.3, ease: 'power2.out' });
        }
      });
      catCards.forEach((card, i) => {
        const imgs = $$('.cat-img', card);
        if (imgs.length < 2) return;
        const cycle = gsap.timeline({ repeat: -1, paused: true, delay: i * 0.4 });
        imgs.forEach((img, k) => {
          const next = imgs[(k + 1) % imgs.length];
          cycle.to(img, { opacity: 0, duration: 0.9, ease: 'power1.inOut' }, k * 2.8 + 2)
            .to(next, { opacity: 1, duration: 0.9, ease: 'power1.inOut' }, k * 2.8 + 2);
        });
        ScrollTrigger.create({
          trigger: card,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: self => (self.isActive ? cycle.play() : cycle.pause())
        });
      });

      // ── Scroll-speed marquee ───────────────────────────────────────────
      velocityBand();

      // ── 05 · 06 · Services open out from rounded cards ─────────────────
      serviceReveal('#consultancy', 1);
      serviceReveal('#heritage', -1);
      gsap.fromTo('#heritage img',
        { clipPath: 'inset(100% 0% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'none',
          scrollTrigger: { trigger: '#heritage', start: 'top 75%', end: 'center center', scrub: true }
        });

      // ── 07 · Journal ────────────────────────────────────────────────────
      chapterIn($('#journal [data-chapter]'));
      riseBatch('#journal .swiper-slide');

      // ── 08 · Instagram (the rail fills in from the dashboard feed) ─────
      const onIgReady = () => {
        ScrollTrigger.refresh();
        chapterIn($('#instagram [data-chapter]'));
        gsap.from('#instagram [data-ig-track] > li', {
          opacity: 0, x: 60, stagger: 0.08, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '#instagram [data-ig-track]', start: 'top 90%', once: true }
        });
      };
      if (!$('#instagram').hidden) onIgReady();
      else document.addEventListener('ig:ready', () => ctx.add(onIgReady), { once: true });

      // ── Magnetic call-to-action buttons ────────────────────────────────
      if (finePointer()) {
        $$('.btn-magnetic').forEach(btn => {
          const xTo = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'elastic.out(1, 0.4)' });
          const yTo = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'elastic.out(1, 0.4)' });
          btn.addEventListener('mousemove', e => {
            const r = btn.getBoundingClientRect();
            xTo((e.clientX - r.left - r.width / 2) * 0.35);
            yTo((e.clientY - r.top - r.height / 2) * 0.35);
          });
          btn.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
        });
      }

      return () => {
        restoreText.forEach(([el, text]) => { el.textContent = text; });
        document.documentElement.classList.remove('motion-ok');
      };

      // ── helpers that need restoreText ──────────────────────────────────

      // Chapter header: arch draws, rule extends from the number, kicker
      // decodes, title rises letter by letter, lede lifts line by line.
      function chapterIn(el, trigger) {
        if (!el) return;
        const tl = gsap.timeline({
          scrollTrigger: { trigger: trigger || el, start: 'top 85%', once: true }
        });
        const arch = $$('.chapter-arch path', el);
        if (arch.length) tl.from(arch, { drawSVG: '50% 50%', duration: 1.2, ease: 'power2.inOut', stagger: 0.15 }, 0);
        tl.add(ruleIn($('.chapter-rule', el)), 0.2);
        const kicker = $('.chapter-kicker', el);
        if (kicker) tl.add(scramble(kicker), 0.4);
        const title = $('.chapter-title', el);
        if (title) {
          const split = SplitText.create(title, { type: 'chars,words' });
          tl.from(split.chars, {
            y: 40, opacity: 0, rotateX: -80, transformOrigin: '50% 100%',
            stagger: { each: 0.025, ease: 'sine.inOut' }, duration: 0.9, ease: 'back.out(1.8)'
          }, 0.45);
        }
        const lede = $('.chapter-lede', el);
        if (lede) {
          const split = SplitText.create(lede, { type: 'lines', mask: 'lines', linesClass: 'split-line' });
          tl.from(split.lines, { yPercent: 100, opacity: 0, stagger: 0.08, duration: 0.9, ease: 'power3.out' }, 0.7);
        }
        return tl;
      }

      function ruleIn(rule) {
        const tl = gsap.timeline();
        if (!rule) return tl;
        const lines = $$('.chapter-line', rule);
        lines.forEach((line, i) => {
          const fromRight = lines.length > 1 && i === 0;
          tl.fromTo(line, { scaleX: 0, transformOrigin: fromRight ? '100% 50%' : '0% 50%' },
            { scaleX: 1, duration: 1, ease: 'expo.inOut' }, 0);
        });
        const num = $('.chapter-num', rule);
        if (num) tl.add(scramble(num, '0123456789'), 0);
        const kicker = $('.chapter-kicker', rule);
        if (kicker) tl.add(scramble(kicker), 0.3);
        return tl;
      }

      function scramble(el, chars = 'lowerCase') {
        const text = el.textContent;
        restoreText.push([el, text]);
        el.textContent = ' ';
        return gsap.to(el, { scrambleText: { text, chars, revealDelay: 0.2, speed: 0.5 }, duration: 1.2 });
      }

      function kalaGhoda() {
        const stage = $('.kg-stage');
        const pan = $('.kg-pan');
        const img = $('.kg-img');
        const spots = $$('.kg-spot');
        const panTravel = () => Math.max(0, pan.offsetWidth - window.innerWidth);

        chapterIn($('#kala-ghoda [data-chapter]'), '#kala-ghoda');

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: stage,
            start: () => `top ${hdr()}px`,
            end: () => '+=' + window.innerHeight * (desktop ? 2.2 : 2.6),
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true
          }
        });
        // 0 → 1: the pen sweeps left to right, revealing the drawing behind it;
        // on narrow screens the panorama pans so the pen stays in view.
        tl.set('.kg-pen', { opacity: 1 }, 0)
          .fromTo(img, { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1 }, 0)
          .fromTo('.kg-pen', { left: '0%' }, { left: '100%', duration: 1 }, 0)
          .fromTo(pan, { x: 0 }, { x: () => -panTravel(), duration: 1 }, 0)
          .to('.kg-pen', { opacity: 0, duration: 0.08 }, 1);
        // As the pen reaches a landmark: dot lands, stem grows up into the sky, label settles on top.
        spots.forEach(spot => {
          const at = parseFloat(spot.dataset.at);
          tl.set(spot, { opacity: 1 }, at)
            .fromTo($('.kg-dot', spot), { scale: 0 }, { scale: 1, duration: 0.03, ease: 'back.out(3)' }, at)
            .fromTo($('.kg-stem', spot), { scaleY: 0 }, { scaleY: 1, duration: 0.06, ease: 'power2.out' }, at + 0.02)
            .fromTo($('.kg-label', spot), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.05, ease: 'power2.out' }, at + 0.07);
        });
        if (desktop) {
          // Lean in to the statue that named the precinct, then settle back.
          tl.to(pan, { scale: 1.45, transformOrigin: '64.5% 62%', duration: 0.6, ease: 'power1.inOut' }, 1.05)
            .to(spots.slice(0, 2), { opacity: 0, duration: 0.2 }, 1.05)
            .to(pan, { scale: 1, duration: 0.5, ease: 'power1.inOut' }, 1.8)
            .to(spots.slice(0, 2), { opacity: 1, duration: 0.2 }, 2.1);
        } else {
          // Narrow screens: once drawn, glide back so the library and the
          // statue settle side by side with their labels in view.
          const statue = spots[spots.length - 1];
          const settleX = () => {
            // stop where the statue's label (which extends to the right) just fits on screen
            const labelRight = statue.offsetLeft + $('.kg-label', statue).offsetWidth - 14;
            return -gsap.utils.clamp(0, panTravel(), labelRight - window.innerWidth + 12);
          };
          tl.to(pan, { x: settleX, duration: 0.45, ease: 'power1.inOut' }, 1.05)
            .to({}, { duration: 0.25 });
        }
        // Dots keep a gentle pulse once visible.
        gsap.to('.kg-dot', { boxShadow: '0 0 0 12px rgba(170, 72, 55, 0)', duration: 1.4, repeat: -1, ease: 'power1.out' });
      }

      function velocityBand() {
        const track = $('.velocity-track');
        const loop = gsap.to(track, { xPercent: -50, duration: 28, ease: 'none', repeat: -1 });
        const skewTo = gsap.quickTo(track, 'skewX', { duration: 0.4, ease: 'power3.out' });
        ScrollTrigger.create({
          trigger: '.velocity-band',
          start: 'top bottom',
          end: 'bottom top',
          onUpdate(self) {
            const v = self.getVelocity();
            const speed = gsap.utils.clamp(-6, 6, v / 250);
            gsap.to(loop, { timeScale: speed === 0 ? 1 : speed, duration: 0.2, overwrite: true });
            gsap.to(loop, { timeScale: self.direction, duration: 1.2, delay: 0.25, overwrite: false });
            skewTo(gsap.utils.clamp(-12, 12, v / -150));
          },
          onToggle(self) { if (!self.isActive) skewTo(0); }
        });
        gsap.from('.velocity-band', {
          opacity: 0, y: 40, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '.velocity-band', start: 'top 90%', once: true }
        });
      }

      function serviceReveal(section, dir) {
        const text = $(`${section} .text-center`);
        const img = $(`${section} img`);
        gsap.fromTo(section,
          { clipPath: 'inset(0% 4% 0% 4% round 28px)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 0px)',
            ease: 'none',
            scrollTrigger: { trigger: section, start: 'top bottom', end: 'top 25%', scrub: true }
          });
        const tl = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top 70%', once: true } });
        tl.add(ruleIn($('[data-chapter-rule]', text)), 0)
          .from(Array.from(text.children).slice(1), { x: -60 * dir, opacity: 0, stagger: 0.12, duration: 1, ease: 'power3.out' }, 0.1)
          .from(img.parentElement, { x: 160 * dir, rotate: 4 * dir, opacity: 0, duration: 1.4, ease: 'expo.out' }, 0);
        gsap.fromTo(img.parentElement, { y: 60 }, {
          y: -60,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true }
        });
      }
    });
  }

  // Lines slide up out of their own masks when the paragraph scrolls in.
  function splitLines(selector, start = 'top 85%') {
    $$(selector).forEach(el => {
      SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'split-line',
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.lines, {
            yPercent: 100, opacity: 0, stagger: 0.08, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: el, start, once: true }
          });
        }
      });
    });
  }

  function riseBatch(selector) {
    gsap.set(selector, { opacity: 0, y: 60, rotate: 1.5 });
    ScrollTrigger.batch(selector, {
      start: 'top 92%',
      once: true,
      onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, rotate: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out' })
    });
  }

  // Wait for the display fonts so SplitText measures real glyphs.
  const ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  const start = () => ready.then(init);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();

  // Lazy images change page height after load.
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
    setTimeout(() => ScrollTrigger.refresh(), 2500);
  });
})();
