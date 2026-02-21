// ═══════════════════════════════════════════════════
//  Deck Navigation & Controls
//  Auto-generates nav bar and menu from slide attributes:
//    data-act="Act Name"       → starts a new act (nav + menu group)
//    data-menu-title="Title"   → slide title in menu
// ═══════════════════════════════════════════════════

// ═══ THEME TOGGLE ═══
function toggleTheme() {
  const html = document.documentElement;
  const isLight = html.getAttribute('data-theme') === 'light';
  const newTheme = isLight ? 'dark' : 'light';
  html.setAttribute('data-theme', newTheme);
  document.getElementById('theme-toggle').textContent = isLight ? '☀️' : '🌙';
  localStorage.setItem('deck-theme', newTheme);
}

// Restore saved theme (default: dark)
(function() {
  const saved = localStorage.getItem('deck-theme');
  if (saved === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    document.addEventListener('DOMContentLoaded', () => {
      document.getElementById('theme-toggle').textContent = '🌙';
    });
  }
})();

// ═══ REVEAL.JS INIT ═══
Reveal.initialize({
  width: 1280, height: 720, margin: 0.04,
  hash: true,
  history: true,
  overview: true,
  controls: false,
  progress: true,
  slideNumber: false,
  transition: 'fade',
  transitionSpeed: 'default',
  autoAnimateEasing: 'ease-out',
  autoAnimateDuration: 0.7,
  plugins: [RevealNotes]
});

// ═══ AUTO-GENERATE NAVIGATION ═══
const actRanges = [];

function buildNavigation() {
  const slides = document.querySelectorAll('.reveal .slides > section');

  // 1. Scan slides for data-act markers to build act ranges
  slides.forEach((slide, idx) => {
    if (slide.dataset.act) {
      actRanges.push({ start: idx, label: slide.dataset.act });
    }
  });

  // Calculate end indices
  actRanges.forEach((act, i) => {
    act.end = (i < actRanges.length - 1) ? actRanges[i + 1].start - 1 : slides.length - 1;
  });

  // 2. Build nav bar buttons
  const navHTML = actRanges.map((act, i) => {
    const sep = i > 0 ? '<span class="nav-sep"></span>' : '';
    return `${sep}<button class="nav-act${i === 0 ? ' active' : ''}" data-start="${act.start}" data-end="${act.end}" onclick="Reveal.slide(${act.start})">
      <span class="nav-dot"></span>
      <span class="nav-label">${act.label}</span>
    </button>`;
  }).join('');

  document.querySelector('.nav-acts').innerHTML = navHTML;

  // 3. Build slide menu entries
  let menuHTML = '';
  let actIdx = 0;

  slides.forEach((slide, idx) => {
    if (slide.dataset.act) {
      const actNum = actRanges.findIndex(a => a.start === idx) + 1;
      menuHTML += `<div class="menu-act-label">Act ${actNum} · ${slide.dataset.act}</div>`;
    }

    const title = slide.dataset.menuTitle || `Slide ${idx + 1}`;
    menuHTML += `<button class="menu-slide" data-idx="${idx}">` +
      `<span class="menu-slide-num">${idx + 1}</span>` +
      `<span class="menu-slide-title">${title}</span></button>`;
  });

  document.getElementById('menu-slides').innerHTML = menuHTML;

  // 4. Attach menu click handlers
  document.querySelectorAll('.menu-slide').forEach(btn => {
    btn.addEventListener('click', () => {
      Reveal.slide(parseInt(btn.dataset.idx));
      toggleMenu();
    });
  });
}

// ═══ NAV STATE ═══
function updateNav() {
  const idx = Reveal.getIndices().h;
  const total = Reveal.getTotalSlides();
  let currentAct = 0;

  actRanges.forEach((a, i) => {
    if (idx >= a.start && idx <= a.end) currentAct = i;
  });

  document.querySelectorAll('.nav-act').forEach((btn, i) => {
    btn.classList.remove('active', 'done');
    if (i === currentAct) btn.classList.add('active');
    else if (i < currentAct) btn.classList.add('done');
  });

  document.getElementById('slide-counter').textContent = (idx + 1) + ' / ' + total;

  document.querySelectorAll('.menu-slide').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.idx) === idx);
  });
}

// ═══ SLIDE-OUT MENU ═══
let menuOpen = false;

function toggleMenu() {
  menuOpen = !menuOpen;
  document.getElementById('menu-overlay').classList.toggle('open', menuOpen);
  document.getElementById('menu-panel').classList.toggle('open', menuOpen);
}

// Keyboard: M to toggle menu, ESC closes menu
document.addEventListener('keydown', (e) => {
  if (e.key === 'm' || e.key === 'M') {
    if (!e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      toggleMenu();
    }
  }
  if (e.key === 't' || e.key === 'T') {
    if (!e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      toggleTheme();
    }
  }
  if (e.key === 'Escape' && menuOpen) {
    e.preventDefault();
    e.stopPropagation();
    toggleMenu();
  }
});

// ═══ EVENTS ═══
Reveal.on('slidechanged', (e) => {
  updateNav();
  if (e.currentSlide.classList.contains('section-open')) {
    e.currentSlide.style.animation = 'actEntrance 1s ease-out';
  }
});

Reveal.on('ready', () => {
  buildNavigation();
  updateNav();
  document.querySelector('.reveal').classList.add('ready');
});

// Strike through old belief only when new belief is revealed
Reveal.on('fragmentshown', (e) => {
  if (e.fragment.classList.contains('new')) {
    const old = e.fragment.closest('section').querySelector('.old');
    if (old) old.classList.add('struck');
  }
});
Reveal.on('fragmenthidden', (e) => {
  if (e.fragment.classList.contains('new')) {
    const old = e.fragment.closest('section').querySelector('.old');
    if (old) old.classList.remove('struck');
  }
});
