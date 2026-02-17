/* =====================================================
   PERSONAL PORTFOLIO — MAIN JAVASCRIPT
   ===================================================== */

'use strict';

/* ── Nav: scroll behaviour ─────────────────────────── */
(function initNav() {
  const nav        = document.getElementById('nav');
  const hamburger  = document.getElementById('hamburger');
  const navLinks   = document.getElementById('navLinks');
  const allLinks   = navLinks.querySelectorAll('a');

  let lastScroll   = 0;
  let ticking      = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const current = window.scrollY;
      nav.classList.toggle('scrolled', current > 50);
      // Hide nav on scroll down, reveal on scroll up
      if (current > lastScroll && current > 200) {
        nav.classList.add('hidden');
      } else {
        nav.classList.remove('hidden');
      }
      lastScroll = current;
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Hamburger toggle
  function toggleMenu(open) {
    hamburger.classList.toggle('open', open);
    navLinks.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    hamburger.setAttribute('aria-expanded', String(open));
  }

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('open');
    toggleMenu(!isOpen);
  });

  // Close on link click (mobile)
  allLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target)) {
      toggleMenu(false);
    }
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      toggleMenu(false);
      hamburger.focus();
    }
  });
})();

/* ── Reveal on scroll (Intersection Observer) ──────── */
(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      // Stagger cards in a grid
      const delay = entry.target.closest('.skills__grid, .other-projects')
        ? [...entry.target.parentElement.children].indexOf(entry.target) * 80
        : 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => io.observe(el));
})();

/* ── Active nav link highlight on scroll ───────────── */
(function initActiveLink() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav__link');
  if (!sections.length || !navLinks.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        link.classList.toggle(
          'nav__link--active',
          link.getAttribute('href') === `#${entry.target.id}`
        );
      });
    });
  }, { threshold: 0.4 });

  sections.forEach(s => io.observe(s));
})();

/* ── Experience tabs ───────────────────────────────── */
(function initTabs() {
  const tabs   = document.querySelectorAll('.exp-tab');
  const panels = document.querySelectorAll('.exp-panel');
  if (!tabs.length) return;

  function activate(tab) {
    const target = tab.dataset.target;

    tabs.forEach(t => {
      t.classList.remove('exp-tab--active');
      t.setAttribute('aria-selected', 'false');
    });
    panels.forEach(p => p.classList.remove('exp-panel--active'));

    tab.classList.add('exp-tab--active');
    tab.setAttribute('aria-selected', 'true');

    const panel = document.getElementById(target);
    if (panel) {
      panel.classList.add('exp-panel--active');
      // Animate panel in
      panel.style.animation = 'none';
      panel.offsetHeight; // reflow
      panel.style.animation = 'fadeUp 0.35s ease both';
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => activate(tab));

    // Keyboard navigation
    tab.addEventListener('keydown', e => {
      const tabList = [...tabs];
      const idx = tabList.indexOf(tab);
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        tabList[(idx + 1) % tabList.length].focus();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        tabList[(idx - 1 + tabList.length) % tabList.length].focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate(tab);
      }
    });
  });
})();

/* ── Smooth scroll for anchor links ────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ── Typed cursor effect in hero ───────────────────── */
(function initTyped() {
  const tagline = document.querySelector('.hero__tagline');
  if (!tagline) return;

  const phrases = [
    'I build things for the web.',
    'I craft user experiences.',
    'I solve hard problems.',
    'I ship production code.',
  ];

  let phraseIdx  = 0;
  let charIdx    = 0;
  let deleting   = false;
  let paused     = false;

  // Only run if user has no motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Add cursor element
  const cursor = document.createElement('span');
  cursor.className = 'typed-cursor';
  cursor.textContent = '|';
  cursor.style.cssText = `
    color: var(--clr-accent);
    animation: blink 1s step-end infinite;
    margin-left: 2px;
    font-weight: 300;
  `;
  const style = document.createElement('style');
  style.textContent = '@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }';
  document.head.appendChild(style);
  tagline.appendChild(cursor);

  let baseText = '';

  function tick() {
    const phrase = phrases[phraseIdx];

    if (!deleting) {
      charIdx++;
      tagline.firstChild.textContent = phrase.slice(0, charIdx);
      if (charIdx === phrase.length) {
        paused = true;
        setTimeout(() => { paused = false; deleting = true; schedule(); }, 1800);
        return;
      }
    } else {
      charIdx--;
      tagline.firstChild.textContent = phrase.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(schedule, 300);
        return;
      }
    }
    schedule();
  }

  function schedule() {
    const speed = deleting ? 40 : 65;
    setTimeout(tick, speed + Math.random() * 25);
  }

  // Insert a text node before the cursor
  tagline.innerHTML = '';
  tagline.appendChild(document.createTextNode(phrases[0]));
  tagline.appendChild(cursor);
  charIdx = phrases[0].length;

  setTimeout(() => { deleting = true; schedule(); }, 2200);
})();

/* ── Matrix rain background ────────────────────────── */
(function initMatrixBg() {
  const canvas = document.getElementById('matrix-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const CELL        = 18;           // px per character cell
  const DROP_SPEED  = 0.35;         // cells per frame
  const FADE        = 0.93;         // opacity multiplier per frame for trail
  const FLIP_CHANCE = 0.018;        // chance a resting char randomly flips
  const CURSOR_R    = 180;          // cursor highlight radius in px
  const ACCENT      = [100, 255, 218]; // --clr-accent rgb

  let cols, rows, grid, drops;
  // Smoothed mouse position (lerped for a soft glow follow)
  let mouse    = { x: -9999, y: -9999 };
  let mouseLerp = { x: -9999, y: -9999 };

  function makeGrid() {
    cols = Math.ceil(canvas.width  / CELL) + 1;
    rows = Math.ceil(canvas.height / CELL) + 2;
    grid = Array.from({ length: cols }, () =>
      Array.from({ length: rows }, () => ({
        ch: Math.random() > 0.5 ? '1' : '0',
        op: 0,
      }))
    );
    drops = Array.from({ length: cols }, () =>
      -(Math.random() * rows * 1.5)   // stagger starts
    );
  }

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    makeGrid();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font      = `${CELL - 3}px "JetBrains Mono", monospace`;
    ctx.textAlign = 'left';

    // Lerp mouse toward actual position
    mouseLerp.x += (mouse.x - mouseLerp.x) * 0.1;
    mouseLerp.y += (mouse.y - mouseLerp.y) * 0.1;

    // Advance each column's drop and update grid opacities
    for (let c = 0; c < cols; c++) {
      const head = Math.floor(drops[c]);

      // Stamp new char at the drop head
      if (head >= 0 && head < rows) {
        grid[c][head].ch = Math.random() > 0.5 ? '1' : '0';
        grid[c][head].op = 1;
      }

      // Fade the whole column trail and randomly flip chars
      for (let r = 0; r < rows; r++) {
        const cell = grid[c][r];
        if (cell.op > 0) cell.op *= FADE;
        if (Math.random() < FLIP_CHANCE) cell.ch = Math.random() > 0.5 ? '1' : '0';
      }

      drops[c] += DROP_SPEED;
      if (drops[c] - rows > 8) {
        drops[c] = -(Math.random() * rows * 0.6 + 4);
      }
    }

    // Draw every visible cell
    for (let c = 0; c < cols; c++) {
      const headRow = Math.floor(drops[c]);

      for (let r = 0; r < rows; r++) {
        const cell = grid[c][r];
        if (cell.op < 0.015) continue;

        const x = c * CELL;
        const y = r * CELL + CELL;

        // Cursor proximity boost
        const dx   = x + CELL / 2 - mouseLerp.x;
        const dy   = y - CELL / 2 - mouseLerp.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const boost = dist < CURSOR_R
          ? Math.pow(1 - dist / CURSOR_R, 1.8) * 0.85
          : 0;

        const isHead = r === headRow || r === headRow - 1;
        let [rv, gv, bv] = ACCENT;
        let op;

        if (isHead) {
          // Bright near-white tip
          rv = 200; gv = 255; bv = 245;
          op = 1;
        } else {
          op = Math.min(0.95, cell.op * 0.65 + boost);
        }

        if (op < 0.015) continue;
        ctx.fillStyle = `rgba(${rv},${gv},${bv},${op})`;
        ctx.fillText(cell.ch, x, y);
      }
    }
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  document.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  // Static fallback for reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Draw one quiet static frame at very low opacity
    for (let c = 0; c < cols; c++)
      for (let r = 0; r < rows; r++)
        if (Math.random() < 0.15) grid[c][r].op = Math.random() * 0.15;
    draw();
    return;
  }

  (function loop() { draw(); requestAnimationFrame(loop); })();
})();

/* ── Copy email on click ───────────────────────────── */
(function initCopyEmail() {
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
  emailLinks.forEach(link => {
    link.addEventListener('click', e => {
      const email = link.href.replace('mailto:', '');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(email).catch(() => {});
      }
    });
  });
})();

/* ── Scroll progress bar ───────────────────────────── */
(function initScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.prepend(bar);

  function update() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = max > 0 ? `${(window.scrollY / max * 100).toFixed(2)}%` : '0%';
  }

  window.addEventListener('scroll', update, { passive: true });
})();

/* ── Hero parallax + fade on scroll ───────────────── */
(function initHeroParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const content = document.querySelector('.hero__content');
  const hint    = document.querySelector('.hero__scroll-hint');
  if (!content) return;

  content.style.willChange = 'transform, opacity';

  function update() {
    const y = window.scrollY;
    const vh = window.innerHeight;
    const t  = Math.min(1, y / vh);  // 0 at top, 1 when scrolled one full viewport

    content.style.transform = `translateY(${(y * 0.18).toFixed(1)}px)`;
    content.style.opacity   = Math.max(0, 1 - t * 1.6).toFixed(3);
    if (hint) hint.style.opacity = Math.max(0, 1 - t * 4).toFixed(3);
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  }, { passive: true });
})();

/* ── Page load fade-in ─────────────────────────────── */
document.documentElement.style.opacity = '0';
window.addEventListener('load', () => {
  document.documentElement.style.transition = 'opacity 0.4s ease';
  document.documentElement.style.opacity = '1';
});
