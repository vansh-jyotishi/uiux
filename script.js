/* ═══════════════════════════════════════════════════════════════
   SOLACE — Mental Health & Wellness Dashboard
   Interactive behaviors, animations, and data rendering
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // ── SIDEBAR TOGGLE ──
  initSidebar();

  // ── NOTIFICATION PANEL ──
  initNotifications();

  // ── COUNT-UP ANIMATIONS ──
  initCountUp();

  // ── SPARKLINE MINI CHARTS ──
  initSparklines();

  // ── MAIN BAR CHART ──
  initBarChart();

  // ── DONUT / RING CHART ──
  initRingChart();

  // ── TAB PILLS ──
  initTabs();

  // ── GREETING TIME ──
  updateGreeting();

  // ── KEYBOARD SHORTCUT ──
  initKeyboardShortcuts();
});

/* ═══════════════════════════════════════════
   SIDEBAR COLLAPSE / EXPAND
   ═══════════════════════════════════════════ */
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const mainWrapper = document.getElementById('mainWrapper');
  const toggleBtn = document.getElementById('sidebarToggle');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      mainWrapper.classList.toggle('sidebar-collapsed');
    });
  }

  // Mobile menu
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768 &&
          sidebar.classList.contains('mobile-open') &&
          !sidebar.contains(e.target) &&
          !mobileMenuBtn.contains(e.target)) {
        sidebar.classList.remove('mobile-open');
      }
    });
  }

  // Active link handling
  const sidebarLinks = document.querySelectorAll('.sidebar__link');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      sidebarLinks.forEach(l => l.classList.remove('sidebar__link--active'));
      link.classList.add('sidebar__link--active');

      // Close mobile sidebar after navigation
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('mobile-open');
      }
    });
  });
}

/* ═══════════════════════════════════════════
   NOTIFICATION PANEL
   ═══════════════════════════════════════════ */
function initNotifications() {
  const notifBtn = document.getElementById('notifBtn');
  const notifPanel = document.getElementById('notifPanel');
  const notifClose = document.getElementById('notifClose');
  const notifOverlay = document.getElementById('notifOverlay');

  function openPanel() {
    notifPanel.classList.add('open');
    notifOverlay.classList.add('open');
  }

  function closePanel() {
    notifPanel.classList.remove('open');
    notifOverlay.classList.remove('open');
  }

  if (notifBtn) notifBtn.addEventListener('click', openPanel);
  if (notifClose) notifClose.addEventListener('click', closePanel);
  if (notifOverlay) notifOverlay.addEventListener('click', closePanel);

  // Close with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && notifPanel.classList.contains('open')) {
      closePanel();
    }
  });
}

/* ═══════════════════════════════════════════
   COUNT-UP ANIMATION
   Animates metric card numbers from 0 to value
   ═══════════════════════════════════════════ */
function initCountUp() {
  const counters = document.querySelectorAll('[data-count]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1500;
        const startTime = performance.now();

        function tick(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(eased * target);
          el.textContent = current.toLocaleString() + suffix;

          if (progress < 1) {
            requestAnimationFrame(tick);
          }
        }

        requestAnimationFrame(tick);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(c => observer.observe(c));
}

/* ═══════════════════════════════════════════
   SPARKLINE MINI CHARTS
   Renders small bar charts inside metric cards
   ═══════════════════════════════════════════ */
function initSparklines() {
  const sparklines = document.querySelectorAll('.metric-card__sparkline');

  sparklines.forEach(container => {
    const values = container.dataset.values.split(',').map(Number);
    const max = Math.max(...values);

    values.forEach((val, i) => {
      const bar = document.createElement('div');
      bar.className = 'spark-bar';
      bar.style.height = '0%';
      container.appendChild(bar);

      // Stagger animation
      setTimeout(() => {
        bar.style.height = ((val / max) * 100) + '%';
      }, 100 + i * 60);
    });
  });
}

/* ═══════════════════════════════════════════
   BAR CHART
   Renders wellness trends as grouped bar chart
   ═══════════════════════════════════════════ */
function initBarChart() {
  const chartContainer = document.getElementById('chartBars');
  if (!chartContainer) return;

  // Placeholder data — 12 months of wellness metrics
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const data = {
    anxiety:  [65, 58, 52, 50, 45, 42, 40, 38, 35, 33, 30, 28],
    depression: [55, 52, 48, 45, 43, 40, 38, 36, 34, 32, 30, 27],
    wellness: [45, 50, 55, 58, 62, 65, 68, 72, 75, 78, 80, 82]
  };

  const maxValue = 100;

  months.forEach((month, i) => {
    const group = document.createElement('div');
    group.className = 'chart-bar-group';

    // Three bars per month
    const bars = [
      { value: data.anxiety[i], cls: 'chart-bar--primary' },
      { value: data.depression[i], cls: 'chart-bar--secondary' },
      { value: data.wellness[i], cls: 'chart-bar--tertiary' }
    ];

    bars.forEach(bar => {
      const el = document.createElement('div');
      el.className = `chart-bar ${bar.cls}`;
      el.style.height = '0%';
      el.title = `${bar.value}%`;
      group.appendChild(el);

      // Animate in with stagger
      setTimeout(() => {
        el.style.height = ((bar.value / maxValue) * 100) + '%';
      }, 300 + i * 80);
    });

    // Month label
    const label = document.createElement('span');
    label.className = 'chart-bar-label';
    label.textContent = month;
    group.appendChild(label);

    chartContainer.appendChild(group);
  });
}

/* ═══════════════════════════════════════════
   DONUT / RING CHART
   Animates SVG circle stroke-dasharray segments
   ═══════════════════════════════════════════ */
function initRingChart() {
  const segments = document.querySelectorAll('.ring-chart__segment');
  if (!segments.length) return;

  // Circumference = 2 * PI * r (r=80)
  const circumference = 2 * Math.PI * 80; // ~502.65

  // Percentages: Calm 38%, Happy 27%, Anxious 22%, Stressed 13%
  const percentages = [38, 27, 22, 13];
  let cumulativeOffset = 0;

  setTimeout(() => {
    segments.forEach((seg, i) => {
      const segmentLength = (percentages[i] / 100) * circumference;
      const gapLength = circumference - segmentLength;

      seg.style.strokeDasharray = `${segmentLength} ${gapLength}`;
      seg.style.strokeDashoffset = -cumulativeOffset;

      cumulativeOffset += segmentLength;
    });
  }, 600);
}

/* ═══════════════════════════════════════════
   TAB PILLS
   Toggle active state on tab buttons
   ═══════════════════════════════════════════ */
function initTabs() {
  const tabGroups = document.querySelectorAll('.tab-pills');

  tabGroups.forEach(group => {
    const pills = group.querySelectorAll('.tab-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('tab-pill--active'));
        pill.classList.add('tab-pill--active');
      });
    });
  });
}

/* ═══════════════════════════════════════════
   DYNAMIC GREETING
   Updates based on current time of day
   ═══════════════════════════════════════════ */
function updateGreeting() {
  const greetingEl = document.querySelector('.topbar__title');
  if (!greetingEl) return;

  const hour = new Date().getHours();
  let greeting;

  if (hour < 12) greeting = 'Good Morning';
  else if (hour < 17) greeting = 'Good Afternoon';
  else greeting = 'Good Evening';

  greetingEl.textContent = `${greeting}, Dr. Kapoor`;
}

/* ═══════════════════════════════════════════
   KEYBOARD SHORTCUTS
   ═══════════════════════════════════════════ */
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Cmd/Ctrl + K to focus search
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      const searchInput = document.querySelector('.topbar__search-input');
      if (searchInput) searchInput.focus();
    }

    // B to toggle sidebar (when not typing in input)
    if (e.key === 'b' && !isTyping(e)) {
      const sidebar = document.getElementById('sidebar');
      const mainWrapper = document.getElementById('mainWrapper');
      if (sidebar && mainWrapper) {
        sidebar.classList.toggle('collapsed');
        mainWrapper.classList.toggle('sidebar-collapsed');
      }
    }
  });
}

/* Utility: check if user is typing in an input field */
function isTyping(e) {
  const tag = e.target.tagName.toLowerCase();
  return tag === 'input' || tag === 'textarea' || e.target.isContentEditable;
}
