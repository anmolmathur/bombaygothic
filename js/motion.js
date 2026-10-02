// js/motion.js — GSAP motion layer for the homepage (index.html).
// Every effect lives inside gsap.matchMedia() so visitors who prefer reduced
// motion get the plain, fully visible page. ScrollTriggers are created in
// page order (top to bottom) so pin spacing is measured correctly.

(function () {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, DrawSVGPlugin, Observer);

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
          // The masks clip each word; give them room for descenders (g, y) and
          // the italic overhang of the display font, then stop clipping once risen.
          gsap.set(self.masks, { padding: '0.12em 0.22em 0.28em', margin: '-0.12em -0.22em -0.28em' });
          return gsap.from(self.words, {
            yPercent: 110, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.06, delay: 0.2,
            onComplete: () => gsap.set(self.masks, { overflow: 'visible' })
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
      chapterIn($('#collections [data-chapter]'));
      const catsMode = document.documentElement.classList;
      if (catsMode.contains('cats-cards')) catCardsIn();
      else if (!catsMode.contains('cats-list')) catDiscsIn();
      else catListIn();

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

      // Variant A (?cats=cards): arch frames rise open, then each card slowly
      // cycles through products from its collection while it is on screen.
      function catCardsIn() {
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
      }

      // Variant C (desktop default): disc gallery, after a24.raviklaassens.com.
      // Scroll steps through the six categories (pinned, snapping); the discs
      // flow in a cover-flow arc, lean with scroll speed and tilt under the
      // pointer. Drag, arrow keys or clicking a neighbour move it too.
      function catDiscsIn() {
        const root = $('.cat-variant-discs');
        const stage = $('.disc-stage', root);
        const track = $('.disc-track', root);
        const discs = $$('.disc', root);
        const data = JSON.parse($('#disc-data').textContent);
        const n = discs.length;
        const field = f => $(`[data-field="${f}"]`, root);
        const ticks = $$('.disc-ticks i', root);
        const state = { p: 0 };
        const bank = { lean: 0 }; // separate target so its overwrite never kills the scroll tween
        let active = 0;
        let dragged = false;
        let infoTl; // declared before the scroll tween, which can render (and call setActive) immediately

        discs.forEach(d => { d.setAttribute('draggable', 'false'); $('img', d).setAttribute('draggable', 'false'); });
        gsap.to($$('.disc-sheen', root), { rotation: 360, duration: 16, ease: 'none', repeat: -1 });
        gsap.to($('.disc-grain', root), {
          x: () => gsap.utils.random(-60, 60), y: () => gsap.utils.random(-60, 60),
          duration: 0.12, ease: 'steps(1)', repeat: -1, repeatRefresh: true
        });

        const size = () => discs[0].offsetWidth;
        // neighbour spacing adapts to the centre column so side discs never slide under the text panels
        const gapFor = () => Math.max(size() * 0.35, Math.min(size() * 0.58, track.offsetWidth / 2 - size() * 0.3 - 12));
        const render = () => {
          const D = size();
          const gap = gapFor();
          const depth = D * 0.6;
          discs.forEach((el, i) => {
            const d = i - state.p;
            const ad = Math.abs(d);
            const s = Math.sign(d);
            gsap.set(el, {
              x: s * (gap * Math.min(ad, 1) + gap * 0.42 * Math.max(0, ad - 1)),
              y: Math.abs(bank.lean) * D * 0.04 * (1 - Math.min(ad, 1) * 0.5),
              z: -depth * Math.min(ad, 2),
              rotationY: -s * Math.min(ad, 1) * 38,
              rotationZ: bank.lean * 7 * (1 - Math.min(ad, 1) * 0.4),
              scale: 1 - 0.24 * Math.min(ad, 1) - 0.12 * Math.max(0, Math.min(ad - 1, 1)),
              opacity: ad <= 1 ? 1 - 0.3 * ad : Math.max(0, 0.7 - (ad - 1) * 0.7),
              zIndex: 100 - Math.round(ad * 10),
              pointerEvents: ad > 1.6 ? 'none' : 'auto'
            });
          });
          const idx = gsap.utils.clamp(0, n - 1, Math.round(state.p));
          if (idx !== active) setActive(idx, Math.sign(idx - active));
        };

        const tween = gsap.to(state, {
          p: n - 1,
          ease: 'none',
          onUpdate: render,
          scrollTrigger: {
            trigger: stage,
            start: () => `top ${hdr()}px`,
            end: () => '+=' + window.innerHeight * 0.7 * (n - 1),
            pin: true,
            scrub: 0.6,
            snap: { snapTo: 1 / (n - 1), duration: { min: 0.25, max: 0.6 }, delay: 0.05, ease: 'power2.inOut' },
            invalidateOnRefresh: true,
            onUpdate: self => {
              // lean into the direction of travel, then settle
              const v = gsap.utils.clamp(-1, 1, self.getVelocity() / 2500);
              gsap.to(bank, { lean: v, duration: 0.35, overwrite: true, onUpdate: render });
              gsap.to(bank, { lean: 0, duration: 0.9, delay: 0.2, ease: 'power2.out', onUpdate: render });
            },
            onRefresh: render
          }
        });
        const st = tween.scrollTrigger;
        const scrollFor = i => st.start + (st.end - st.start) * (i / (n - 1));
        const go = i => {
          i = gsap.utils.clamp(0, n - 1, i);
          window.scrollTo({ top: scrollFor(i), behavior: 'smooth' });
        };

        // Info panel: title rises through its mask, rules redraw, values swap, number decodes.
        function setActive(i, dir) {
          const prev = active;
          active = i;
          ticks.forEach((t, k) => t.classList.toggle('is-active', k === i));
          gsap.to($('.disc-tilt', discs[prev]), { rotationX: 0, rotationY: 0, duration: 0.5, ease: 'power2.out' });
          const c = data[i];
          const num = String(i + 1).padStart(2, '0');
          const values = [field('sub'), field('signature'), $('.disc-cta', root)];
          const picks = $$('.disc-pick', root);
          if (infoTl) infoTl.kill();
          infoTl = gsap.timeline();
          infoTl
            .to(field('name'), { yPercent: -110 * dir, duration: 0.22, ease: 'power2.in' }, 0)
            .to(values, { opacity: 0, y: -10 * dir, duration: 0.18, ease: 'power1.in' }, 0)
            .to(picks, { opacity: 0, x: 16 * dir, duration: 0.18, ease: 'power1.in', stagger: 0.04 }, 0)
            .call(() => {
              field('name').textContent = c.name;
              field('sub').textContent = c.sub;
              field('signature').textContent = c.signature;
              field('cta-name').textContent = c.name;
              $('.disc-cta', root).href = c.url;
              picks.forEach((pk, k) => {
                const item = c.picks[k];
                pk.style.visibility = item ? '' : 'hidden';
                if (!item) return;
                pk.href = item.url;
                $('img', pk).src = item.img;
                field('pick' + k).textContent = item.name;
              });
            }, null, 0.23)
            .fromTo(field('name'), { yPercent: 110 * dir }, { yPercent: 0, duration: 0.6, ease: 'expo.out' }, 0.24)
            .fromTo($$('.disc-rule', root), { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'expo.out', stagger: 0.06 }, 0.24)
            .fromTo(values, { opacity: 0, y: 10 * dir }, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out', stagger: 0.05 }, 0.3)
            .fromTo(picks, { opacity: 0, x: -16 * dir }, { opacity: 1, x: 0, duration: 0.45, ease: 'power3.out', stagger: 0.06 }, 0.32)
            .to(field('index'), { scrambleText: { text: `${num} / 06`, chars: '0123456789', speed: 0.6 }, duration: 0.5 }, 0.24)
            .to(field('count'), { scrambleText: { text: num, chars: '0123456789', speed: 0.6 }, duration: 0.5 }, 0.24);
        }

        // Pointer tilt on the active disc.
        const tiltX = discs.map(d => gsap.quickTo($('.disc-tilt', d), 'rotationX', { duration: 0.6, ease: 'power3.out' }));
        const tiltY = discs.map(d => gsap.quickTo($('.disc-tilt', d), 'rotationY', { duration: 0.6, ease: 'power3.out' }));
        if (finePointer()) {
          track.addEventListener('pointermove', e => {
            const r = discs[active].getBoundingClientRect();
            const nx = gsap.utils.clamp(-1, 1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2));
            const ny = gsap.utils.clamp(-1, 1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2));
            tiltY[active](nx * 14);
            tiltX[active](-ny * 14);
          });
          track.addEventListener('pointerleave', () => { tiltX[active](0); tiltY[active](0); });
        }

        // Touch: a horizontal swipe steps one category (vertical scroll still works too).
        if (!finePointer()) {
          let swiped = false;
          const step = d => { if (swiped) return; swiped = dragged = true; go(active + d); };
          Observer.create({
            target: track,
            type: 'touch',
            tolerance: 30,
            lockAxis: true,
            onLeft: () => step(1),
            onRight: () => step(-1),
            onRelease: () => { swiped = false; setTimeout(() => { dragged = false; }, 80); }
          });
        }

        // Mouse drag to move through (converted into page scroll so pin + snap stay in charge).
        if (finePointer()) Observer.create({
          target: track,
          type: 'pointer,touch',
          dragMinimum: 6,
          onDragStart: () => { dragged = true; },
          onDrag: self => {
            const perPx = (st.end - st.start) / (n - 1) / gapFor();
            window.scrollBy({ top: -self.deltaX * perPx, behavior: 'instant' });
          },
          onDragEnd: () => setTimeout(() => { dragged = false; }, 60)
        });

        // Click: a neighbour comes to the front; the front disc opens its collection.
        discs.forEach((d, i) => d.addEventListener('click', e => {
          if (dragged || i !== active) {
            e.preventDefault();
            if (!dragged) go(i);
          }
        }));

        // Arrow keys while the gallery is on screen.
        const onKey = e => {
          if (!st.isActive) return;
          if (e.key === 'ArrowRight') { e.preventDefault(); go(active + 1); }
          if (e.key === 'ArrowLeft') { e.preventDefault(); go(active - 1); }
        };
        document.addEventListener('keydown', onKey);

        // Entrance: rules draw, discs fan out from the centre.
        gsap.from($$('.disc-rule', root), {
          scaleX: 0, duration: 1, ease: 'expo.inOut', stagger: 0.08,
          scrollTrigger: { trigger: stage, start: 'top 75%', once: true }
        });
        gsap.from(discs.map(d => $('.disc-tilt', d)), {
          opacity: 0, yPercent: 20, duration: 1.1, ease: 'expo.out', stagger: 0.06,
          scrollTrigger: { trigger: stage, start: 'top 75%', once: true }
        });
        ticks[0].classList.add('is-active');
        render();
      }

      // Variant B (phones, and ?cats=list): rules draw across, names rise out of their masks,
      // numbers decode; on desktop a preview of the hovered category floats
      // beside the cursor and tilts with its speed.
      function catListIn() {
        const list = $('.cat-variant-list');
        const rows = $$('.cat-row', list);
        const tl = gsap.timeline({ scrollTrigger: { trigger: list, start: 'top 80%', once: true } });
        tl.fromTo($$('.cat-row-line', list), { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: 'expo.inOut', stagger: 0.08 }, 0)
          .from($$('.cat-row-name-inner', list), {
            yPercent: 130, duration: 0.9, ease: 'power3.out', stagger: 0.08,
            onComplete: () => gsap.set($$('.cat-row-name', list), { overflow: 'visible' })
          }, 0.25)
          .from($$('.cat-row-sub, .cat-row-arrow', list), { opacity: 0, x: -12, duration: 0.7, ease: 'power2.out', stagger: 0.04 }, 0.45)
          .from($$('.cat-row-thumb', list), { clipPath: 'inset(100% 0% 0% 0%)', duration: 0.9, ease: 'expo.out', stagger: 0.08 }, 0.2);
        $$('.cat-row-num', list).forEach((num, i) => tl.add(scramble(num, '0123456789'), 0.2 + i * 0.08));

        if (!desktop || !finePointer()) return;
        const float = $('.cat-float', list);
        const imgs = $$('img', float);
        const xTo = gsap.quickTo(float, 'x', { duration: 0.6, ease: 'power3.out' });
        const yTo = gsap.quickTo(float, 'y', { duration: 0.6, ease: 'power3.out' });
        const rotTo = gsap.quickTo(float, 'rotation', { duration: 0.5, ease: 'power3.out' });
        let lastX = 0;
        let current = -1;
        list.addEventListener('mousemove', e => {
          const r = list.getBoundingClientRect();
          const x = e.clientX - r.left;
          xTo(x);
          yTo(e.clientY - r.top);
          rotTo(gsap.utils.clamp(-12, 12, (x - lastX) * 0.6));
          lastX = x;
        });
        const show = i => {
          if (i === current) return;
          current = i;
          imgs.forEach((img, k) => gsap.to(img, { opacity: k === i ? 1 : 0, duration: 0.35, overwrite: true }));
          gsap.fromTo(imgs[i], { scale: 1.2 }, { scale: 1, duration: 0.6, ease: 'power3.out' });
        };
        rows.forEach(row => row.addEventListener('mouseenter', () => {
          show(+row.dataset.index);
          gsap.to(float, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'power3.out', overwrite: 'auto' });
          gsap.to(rows.filter(r => r !== row), { opacity: 0.35, duration: 0.3, overwrite: 'auto' });
          gsap.to(row, { opacity: 1, duration: 0.3, overwrite: 'auto' });
        }));
        $('.cat-list', list).addEventListener('mouseleave', () => {
          current = -1;
          gsap.to(float, { autoAlpha: 0, scale: 0.85, duration: 0.3, ease: 'power2.in', overwrite: 'auto' });
          gsap.to(rows, { opacity: 1, duration: 0.3, overwrite: 'auto' });
        });
        gsap.set(float, { scale: 0.85 });
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
          tl.to(pan, { scale: 1.45, transformOrigin: '63% 68%', duration: 0.6, ease: 'power1.inOut' }, 1.05)
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
