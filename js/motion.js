// js/motion.js — GSAP motion layer for the index-motion.html preview.
// Every effect lives inside gsap.matchMedia() so visitors who prefer reduced
// motion get the plain, fully visible page.

(function () {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const isMobile = () => window.innerWidth < 768;

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
    scatterTaglines();
    const mm = gsap.matchMedia();

    // Reduced motion: show everything at rest.
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

      // ── Scroll progress hairline ────────────────────────────────────────
      gsap.to('.bg-progress', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.3 }
      });

      // ── Hero intro: headline rises word by word out of masks ────────────
      SplitText.create('#hero-title', {
        type: 'words',
        mask: 'words',
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.words, {
            yPercent: 110,
            opacity: 0,
            duration: 1.1,
            ease: 'expo.out',
            stagger: 0.06,
            delay: 0.2
          });
        }
      });

      // Taglines drift in, then keep breathing gently.
      gsap.to('.random-text', {
        opacity: 1,
        duration: 1.4,
        stagger: 0.25,
        delay: 1.1,
        ease: 'power2.out'
      });
      $$('.random-text').forEach((el, i) => {
        gsap.to(el, {
          y: gsap.utils.random(-14, 14),
          x: gsap.utils.random(-10, 10),
          duration: gsap.utils.random(3, 5),
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: i * 0.3
        });
      });

      // ── Hero scroll story: photos float up, headline recedes, creator slides in
      const floaters = $$('.hero-floater');
      const heroTl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: '#hero-seq',
          start: 'top top',
          end: () => '+=' + (isMobile() ? 2.4 : 2) * window.innerHeight,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });
      heroTl
        .fromTo(floaters,
          { y: () => window.innerHeight * 0.8, opacity: 0, rotate: i => [-6, 5, -3][i] || 0 },
          { y: 0, opacity: 1, rotate: i => [-2, 2, -1][i] || 0, stagger: 0.08, duration: 1 })
        .to('.hero-headline', { scale: 0.92, opacity: 0.35, filter: 'blur(2px)', duration: 0.6 }, 0.6)
        .to(floaters, { y: i => -120 * (floaters[i].dataset.depth || 1), duration: 0.8 }, 1.1)
        .fromTo('.creator-layer', { yPercent: 100 }, { yPercent: 0, duration: 1 }, 1.1)
        .fromTo('.creator-portrait img',
          { clipPath: 'inset(100% 0% 0% 0% round 0.5rem)', scale: 1.15 },
          { clipPath: 'inset(0% 0% 0% 0% round 0.5rem)', scale: 1, duration: 0.8 }, 1.5)
        .from('.creator-title', { y: 40, opacity: 0, duration: 0.5 }, 1.7)
        .from('.creator-copy p', { y: 30, opacity: 0, stagger: 0.15, duration: 0.5 }, 1.8)
        .to({}, { duration: 0.3 }); // short hold before the pin releases

      // Mouse parallax on the hero photos (desktop pointers only).
      if (window.matchMedia('(pointer: fine)').matches) {
        const movers = floaters.map(el => {
          const img = el.querySelector('img');
          const depth = parseFloat(el.dataset.depth || 1);
          return {
            depth,
            x: gsap.quickTo(img, 'x', { duration: 0.8, ease: 'power3.out' }),
            y: gsap.quickTo(img, 'y', { duration: 0.8, ease: 'power3.out' })
          };
        });
        const hero = $('#hero-seq');
        hero.addEventListener('mousemove', e => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          movers.forEach(m => { m.x(nx * 30 * m.depth); m.y(ny * 30 * m.depth); });
        });
      }

      // ── Kala Ghoda: curtain opens, then the illustration drifts ─────────
      gsap.fromTo('.kg-reveal',
        { clipPath: 'inset(0% 12% 0% 12%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'none',
          scrollTrigger: { trigger: '.kg-reveal', start: 'top bottom', end: 'top 30%', scrub: true }
        });
      gsap.fromTo('.kg-layer', { yPercent: -10 }, {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: { trigger: '.kg-reveal', start: 'top bottom', end: 'bottom top', scrub: true }
      });

      // ── Bombay Ballad ───────────────────────────────────────────────────
      // Band sails sideways as you scroll past, like a ship crossing the harbour.
      gsap.fromTo('.ballad-band img', { xPercent: -8 }, {
        xPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: '.ballad-band', start: 'top bottom', end: 'bottom top', scrub: true }
      });

      // Kicker decodes, title rolls in on a wave, intro copy lifts line by line.
      const kicker = $('.ballad-kicker');
      const kickerText = kicker.textContent;
      kicker.textContent = '\u00a0';
      gsap.to(kicker, {
        scrambleText: { text: kickerText, chars: 'lowerCase', revealDelay: 0.3, speed: 0.4 },
        duration: 1.6,
        scrollTrigger: { trigger: kicker, start: 'top 85%', once: true }
      });
      SplitText.create('.ballad-title', {
        type: 'chars',
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.chars, {
            y: 40,
            opacity: 0,
            rotateX: -80,
            transformOrigin: '50% 100%',
            stagger: { each: 0.035, ease: 'sine.inOut' },
            duration: 0.9,
            ease: 'back.out(1.8)',
            scrollTrigger: { trigger: '.ballad-title', start: 'top 85%', once: true }
          });
        }
      });
      splitLines('.ballad-intro p');

      // Product row: horizontal voyage on desktop, rising cards on smaller screens.
      if (desktop) {
        const track = $('.ballad-track');
        const cards = $$('.ballad-track > a');
        const travel = () => Math.max(0, track.scrollWidth - window.innerWidth);
        const voyageTween = gsap.to(track, {
          x: () => -travel(),
          ease: 'none',
          scrollTrigger: {
            trigger: '.ballad-voyage',
            start: 'top top',
            end: () => '+=' + travel(),
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true
          }
        });
        // Each product image gently counter-drifts inside its frame as it crosses.
        cards.forEach(card => {
          gsap.fromTo(card.querySelector('img'), { xPercent: -6, scale: 1.12 }, {
            xPercent: 6,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              containerAnimation: voyageTween,
              start: 'left right',
              end: 'right left',
              scrub: true
            }
          });
        });
      } else {
        riseBatch('.ballad-track > a');
      }

      // ── Curated collections: icons pop in, wobble on hover ─────────────
      splitLines('#collections p');
      gsap.set('#collections .grid > a', { opacity: 0, y: 30, scale: 0.8 });
      ScrollTrigger.batch('#collections .grid > a', {
        start: 'top 90%',
        once: true,
        onEnter: batch => gsap.to(batch, {
          opacity: 1, y: 0, scale: 1, stagger: 0.08, duration: 0.7, ease: 'back.out(2)'
        })
      });
      $$('#collections .grid > a').forEach(link => {
        const icon = link.querySelector('i');
        link.addEventListener('mouseenter', () => {
          gsap.fromTo(icon, { rotate: 0 }, { keyframes: { rotate: [0, -12, 10, -6, 0] }, duration: 0.6, ease: 'power1.inOut' });
          gsap.to(icon, { y: -6, duration: 0.3, ease: 'power2.out' });
        });
        link.addEventListener('mouseleave', () => gsap.to(icon, { y: 0, duration: 0.4, ease: 'power2.out' }));
      });

      // ── Design consultancy & heritage walks ────────────────────────────
      serviceReveal('#consultancy', 1);
      serviceReveal('#heritage', -1);

      // Heritage arches rise like a doorway opening.
      gsap.fromTo('#heritage img',
        { clipPath: 'inset(100% 0% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'none',
          scrollTrigger: { trigger: '#heritage', start: 'top 75%', end: 'center center', scrub: true }
        });

      // ── Journal & Instagram ─────────────────────────────────────────────
      headingReveal('#journal h2');
      riseBatch('#journal .swiper-slide:not(.swiper-slide-duplicate)');
      headingReveal('#instagram h2');
      // The rail fills in from the dashboard feed after load, so wait for it.
      const onIgReady = () => {
        ScrollTrigger.refresh();
        gsap.from('#instagram [data-ig-track] > li', {
          opacity: 0, x: 60, stagger: 0.08, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '#instagram [data-ig-track]', start: 'top 85%', once: true }
        });
      };
      if (!$('#instagram').hidden) onIgReady();
      else document.addEventListener('ig:ready', () => ctx.add(onIgReady), { once: true });
      headingReveal('#collections h2');

      // ── Magnetic call-to-action buttons ────────────────────────────────
      if (window.matchMedia('(pointer: fine)').matches) {
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
        kicker.textContent = kickerText;
        document.documentElement.classList.remove('motion-ok');
      };
    });
  }

  // Lines slide up out of their own masks when the paragraph scrolls in.
  function splitLines(selector) {
    $$(selector).forEach(el => {
      SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'split-line',
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.lines, {
            yPercent: 100,
            opacity: 0,
            stagger: 0.08,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true }
          });
        }
      });
    });
  }

  function headingReveal(selector) {
    $$(selector).forEach(el => {
      gsap.from(el, {
        y: 40, opacity: 0, letterSpacing: '0.12em', duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });
  }

  function riseBatch(selector) {
    gsap.set(selector, { opacity: 0, y: 60, rotate: 1.5 });
    ScrollTrigger.batch(selector, {
      start: 'top 90%',
      once: true,
      onEnter: batch => gsap.to(batch, {
        opacity: 1, y: 0, rotate: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out'
      })
    });
  }

  function serviceReveal(section, dir) {
    const text = $(`${section} .text-center`);
    const img = $(`${section} img`);
    gsap.from(text.children, {
      x: -60 * dir, opacity: 0, stagger: 0.12, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: section, start: 'top 70%', once: true }
    });
    // Image slides in from its edge, then keeps a slow parallax drift.
    gsap.from(img.parentElement, {
      x: 160 * dir, rotate: 4 * dir, opacity: 0, duration: 1.4, ease: 'expo.out',
      scrollTrigger: { trigger: section, start: 'top 70%', once: true }
    });
    gsap.fromTo(img.parentElement, { y: 60 }, {
      y: -60,
      ease: 'none',
      scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true }
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
