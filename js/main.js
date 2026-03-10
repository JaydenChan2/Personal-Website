/* =====================================================
   JAYFLIX — MAIN JAVASCRIPT
   ===================================================== */

'use strict';

/* ── Intro Animation ───────────────────────────────── */
(function initIntro() {
  const intro    = document.getElementById('nfIntro');
  const profiles = document.getElementById('profiles');
  if (!intro || !profiles) return;

  // After 2.1s hold, fade the intro out then reveal profiles
  setTimeout(() => {
    intro.classList.add('hiding');
    setTimeout(() => {
      intro.style.display = 'none';
      profiles.classList.add('active');
    }, 560); // matches CSS transition duration
  }, 2100);
})();

/* ── Section Switching ─────────────────────────────── */
(function initSections() {
  const profileCards  = document.querySelectorAll('.profile-card');
  const allSections   = document.querySelectorAll('.nf-section');
  const profilesEl    = document.getElementById('profiles');
  const switchBtn     = document.getElementById('switchProfileBtn');
  const navLogo       = document.getElementById('navLogo');

  function showProfiles() {
    allSections.forEach(s => s.classList.remove('active'));
    profilesEl.classList.add('active');
    switchBtn.classList.remove('visible');
    window.scrollTo(0, 0);
  }

  function showSection(id) {
    // Brief fade-out of profiles grid before switching
    const grid  = document.querySelector('.profiles-grid');
    const title = document.querySelector('.profiles-screen__title');
    const foot  = document.querySelector('.profiles-screen__footer');

    [grid, title, foot].forEach(el => {
      if (el) { el.style.transition = 'opacity 0.28s ease'; el.style.opacity = '0'; }
    });

    setTimeout(() => {
      profilesEl.classList.remove('active');
      allSections.forEach(s => s.classList.remove('active'));

      const target = document.getElementById(id);
      if (target) target.classList.add('active');

      switchBtn.classList.add('visible');
      window.scrollTo(0, 0);

      // Reset grid opacity for next visit
      [grid, title, foot].forEach(el => {
        if (el) { el.style.opacity = '1'; el.style.transition = ''; }
      });
    }, 300);
  }

  // Profile card clicks
  profileCards.forEach(card => {
    card.addEventListener('click', () => {
      const targetId = card.dataset.target;
      if (!targetId) return;

      // Scale the clicked card
      card.style.transition = 'transform 0.25s ease';
      card.style.transform  = 'scale(1.14)';
      setTimeout(() => { card.style.transform = ''; }, 500);

      showSection(targetId);
    });

    // Keyboard support
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  // Switch Profile button → back to profiles
  if (switchBtn) {
    switchBtn.addEventListener('click', () => {
      showProfiles();
    });
  }

  // Logo click → also goes back to profiles
  if (navLogo) {
    navLogo.addEventListener('click', () => {
      showProfiles();
    });
  }
})();

/* ── Nav: scroll & hide on scroll down ────────────── */
(function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  let lastScroll = 0;
  let ticking    = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const cur = window.scrollY;
      nav.classList.toggle('scrolled', cur > 60);
      if (cur > lastScroll && cur > 200) {
        nav.classList.add('hidden');
      } else {
        nav.classList.remove('hidden');
      }
      lastScroll = cur;
      ticking    = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ── Project Modal ─────────────────────────────────── */
(function initProjectModal() {
  const PROJECTS = {
    chudai: {
      title: 'CHUD.AI — Facial Geometry Analysis',
      category: 'AI · Computer Vision · Full Stack',
      mediaType: 'youtube',
      mediaId: 'Jv91GEhY3nk',
      desc: 'An AI-powered facial geometry analysis engine with a real-time browser dashboard. Uses Google MediaPipe Face Mesh to track 468 facial landmarks and computes aesthetic metrics including Canthal Tilt, Facial Width-to-Height Ratio, Midface Ratio, bilateral Symmetry, and Golden Ratio adherence. Runs a 10-second averaged scan to produce a locked final score.',
      tags: ['Python', 'Flask', 'MediaPipe', 'NumPy', 'OpenCV', 'JavaScript'],
      github: 'https://github.com/JaydenChan2/chud-ai',
    },
    musicsheet: {
      title: 'Music to Sheet Converter',
      category: 'Audio Processing · Full Stack',
      mediaType: 'placeholder',
      mediaIcon: '🎵 → 🎼',
      mediaBg: 'linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)',
      desc: 'A full-stack application that converts MP3 / WAV audio files into guitar tablature and sheet music notation using audio signal processing. Users upload an audio file through a React UI; a Flask backend uses Librosa and NumPy to analyse the signal and generate playable guitar tabs in the browser. MIDI and PDF export coming soon.',
      tags: ['React 19', 'Vite', 'Flask', 'Librosa', 'NumPy', 'TailwindCSS'],
      github: 'https://github.com/JaydenChan2/Music-to-Sheet-Converter',
    },
    stock: {
      title: 'Stock Analysis & Portfolio Optimizer',
      category: 'Finance · Data Analytics',
      mediaType: 'placeholder',
      mediaIcon: '📈',
      mediaBg: 'linear-gradient(135deg,#134e5e,#71b280)',
      desc: 'Flask-based platform that pulls real-time stock data via yfinance, applies RSI and Bollinger Bands to generate Buy/Sell/Hold signals with a confidence score, scans the market for active buys, and distributes a given budget across the strongest opportunities using portfolio optimisation.',
      tags: ['Python', 'Flask', 'Pandas', 'NumPy', 'yfinance'],
      github: 'https://github.com/JaydenChan2/Stock-Prediction',
    },
    roomies: {
      title: 'Roomies',
      category: 'Social · In Development',
      mediaType: 'placeholder',
      mediaIcon: '🏠',
      mediaBg: 'linear-gradient(135deg,#4a1942,#c05b5b)',
      desc: 'An app that personalises your roommate search journey — matching you with compatible people so you\'re sure to get along with whoever you live with. The platform focuses on personality, lifestyle habits, and scheduling compatibility to make university housing less of a gamble. Currently in active development.',
      tags: ['In Development'],
      github: 'https://github.com/JaydenChan2/Roomies',
    },
    lynx: {
      title: 'Lynx — Fundraising Co-Pilot',
      category: 'AI · Multi-Agent Systems · FinTech',
      mediaType: 'youtube',
      mediaId: 'FsvDk2D9g6U',
      desc: 'An end-to-end autonomous fundraising co-pilot and adversarial VC simulator. A multi-agent AI system that translates dense technical IP into an institutional investment thesis, matches founders with local Canadian capital, and ruthlessly simulates the boardroom pitch — stress-testing decks before they ever reach a real partner.',
      tags: ['Python', 'Multi-Agent AI', 'LLMs', 'Flask', 'React', 'FinTech'],
      github: 'https://github.com/arjunalwe/Lynx.git',
    },
  };

  const modal    = document.getElementById('projModal');
  const backdrop = document.getElementById('projModalBackdrop');
  const closeBtn = document.getElementById('projModalClose');
  const mediaEl  = document.getElementById('projModalMedia');
  const titleEl  = document.getElementById('projModalTitle');
  const catEl    = document.getElementById('projModalCategory');
  const descEl   = document.getElementById('projModalDesc');
  const tagsEl   = document.getElementById('projModalTags');
  const ghEl     = document.getElementById('projModalGH');

  if (!modal) return;

  function openModal(key) {
    const proj = PROJECTS[key];
    if (!proj) return;

    if (proj.mediaType === 'youtube') {
      mediaEl.className = 'proj-modal__media';
      mediaEl.style.background = '';
      mediaEl.innerHTML = `<iframe
        src="https://www.youtube.com/embed/${proj.mediaId}?autoplay=1&mute=1&loop=1&playlist=${proj.mediaId}&controls=1&rel=0&modestbranding=1"
        title="${proj.title}"
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen
      ></iframe>`;
    } else {
      mediaEl.innerHTML = '';
      mediaEl.className = 'proj-modal__media proj-modal__media--placeholder';
      mediaEl.style.background = proj.mediaBg || '#1a1a1a';
      const icon = document.createElement('span');
      icon.textContent = proj.mediaIcon || '📁';
      mediaEl.appendChild(icon);
    }

    titleEl.textContent = proj.title;
    catEl.textContent   = proj.category;
    descEl.textContent  = proj.desc;
    tagsEl.innerHTML    = proj.tags.map(t => `<span class="proj-modal__tag">${t}</span>`).join('');
    ghEl.href           = proj.github;

    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => {
      mediaEl.innerHTML = '';
      mediaEl.className = 'proj-modal__media';
      mediaEl.style.background = '';
    }, 300);
  }

  document.querySelectorAll('.proj-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => openModal(thumb.dataset.project));
    thumb.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(thumb.dataset.project); }
    });
  });

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
})();

/* ── Watch Card Initials ────────────────────────────── */
(function initWatchCardInitials() {
  document.querySelectorAll('.watch-card').forEach(card => {
    const poster = card.querySelector('.watch-card__poster');
    const title  = card.querySelector('.watch-card__info h4');
    if (!poster || !title) return;

    // Remove emoji/text spans, keep .watch-card__rating
    Array.from(poster.children).forEach(child => {
      if (!child.classList.contains('watch-card__rating')) child.remove();
    });

    const initial = document.createElement('span');
    initial.className = 'watch-card__initial';
    initial.textContent = title.textContent.trim()[0].toUpperCase();
    poster.insertBefore(initial, poster.firstChild);
  });
})();

/* ── Song Card Play Button ─────────────────────────── */
(function initSongPlay() {
  document.querySelectorAll('.song-card__play-icon').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.song-card');

      // If Spotify IFrame API controller exists, use it
      if (card && card._spotifyController) {
        card._spotifyController.togglePlay();
        return;
      }

      // Fallback: reload iframe with autoplay
      const iframe = card.querySelector('.song-card__player iframe');
      if (!iframe) return;
      const baseSrc = iframe.src.replace('&autoplay=1', '');
      iframe.src = baseSrc + '&autoplay=1';
    });
  });
})();

/* ── Netflix Row Arrow Scrolling ───────────────────── */
(function initRowArrows() {
  const tracks = document.querySelectorAll('.nf-row__track');
  tracks.forEach(track => {
    const leftBtn  = track.querySelector('.nf-arrow--left');
    const rightBtn = track.querySelector('.nf-arrow--right');
    const row      = track.querySelector('.nf-row__items--scroll');
    if (!row) return;

    const SCROLL = 320;
    if (leftBtn)  leftBtn.addEventListener('click',  () => row.scrollBy({ left: -SCROLL, behavior: 'smooth' }));
    if (rightBtn) rightBtn.addEventListener('click', () => row.scrollBy({ left:  SCROLL, behavior: 'smooth' }));
  });
})();

/* ── Song Hover Preview (Spotify IFrame API) ────────── */
window.onSpotifyIframeApiReady = (IFrameAPI) => {
  const songCards = document.querySelectorAll('.song-card[data-spotify-id]');
  let activeController = null;

  songCards.forEach(card => {
    const spotifyId = card.dataset.spotifyId;
    const playerDiv = card.querySelector('.song-card__player');
    if (!playerDiv || !spotifyId) return;

    // Clear the existing iframe; the API will create its own managed embed
    playerDiv.innerHTML = '';

    const options = {
      uri: `spotify:track:${spotifyId}`,
      width: '100%',
      height: 80,
    };

    IFrameAPI.createController(playerDiv, options, (controller) => {
      let isPlaying = false;
      let hoverTimer = null;

      // Store controller on the card for the click handler fallback
      card._spotifyController = controller;

      controller.addListener('playback_update', e => {
        isPlaying = !e.data.isPaused;
        card.classList.toggle('song-card--playing', isPlaying);
      });

      // Hover to preview
      card.addEventListener('mouseenter', () => {
        hoverTimer = setTimeout(() => {
          // Pause any other playing song first
          if (activeController && activeController !== controller) {
            activeController.togglePlay();
          }
          if (!isPlaying) {
            controller.play();
            activeController = controller;
          }
        }, 400);
      });

      card.addEventListener('mouseleave', () => {
        clearTimeout(hoverTimer);
        if (isPlaying) {
          controller.togglePlay();
          if (activeController === controller) activeController = null;
        }
      });
    });
  });
};
