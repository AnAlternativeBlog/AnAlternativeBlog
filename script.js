// An Alternative Blog — script.js

(function () {
  'use strict';

  // ---- Section navigation ----

  var pageTitles = {
    'home':    'An Alternative Blog',
    'about':   'About | An Alternative Blog',
    'blog':    'Blog | An Alternative Blog',
    'support': 'Support | An Alternative Blog',
    'contact': 'Contact | An Alternative Blog',
    'terms':   'Terms of Service | An Alternative Blog',
    'post-1':  'Glass-Steagall\u2019s Repeal: Necessary Modernisation or Catalyst for Crisis? | An Alternative Blog'
  };

  function getAllSections() {
    return document.querySelectorAll('main > section');
  }

  function showSection(id, pushHistory) {
    const target = document.getElementById(id);
    if (!target) return;

    getAllSections().forEach(function (s) {
      s.hidden = true;
    });

    target.hidden = false;
    window.scrollTo(0, 0);
    document.title = pageTitles[id] || 'An Alternative Blog';
    updateNavState(id);
    if (pushHistory !== false) updateHash(id);
  }

  function updateHash(id) {
    if (history.pushState) {
      history.pushState(null, '', '#' + id);
    } else {
      window.location.hash = id;
    }
  }

  function updateNavState(activeId) {
    document.querySelectorAll('nav a[data-section]').forEach(function (link) {
      if (link.dataset.section === activeId || (activeId.startsWith('post-') && link.dataset.section === 'blog')) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  // ---- Click delegation ----

  document.addEventListener('click', function (e) {
    // Nav links and site name with data-section
    const navTarget = e.target.closest('[data-section]');
    if (navTarget) {
      e.preventDefault();
      const id = navTarget.dataset.section;
      showSection(id);
      // Close mobile nav if open
      const ul = document.querySelector('nav ul');
      const toggle = document.querySelector('.nav-toggle');
      if (ul && ul.classList.contains('open')) {
        ul.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
      return;
    }

    // Post "read more" links and post title links
    const postLink = e.target.closest('a.post-link[href^="#"]');
    if (postLink) {
      e.preventDefault();
      const id = postLink.getAttribute('href').slice(1);
      showSection(id);
      return;
    }

    // Share on LinkedIn
    const shareBtn = e.target.closest('.share-link');
    if (shareBtn) {
      window.open(
        'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(window.location.href),
        'linkedin-share',
        'width=580,height=520'
      );
      return;
    }

    // Footer terms link (handled by data-section above)
  });

  // ---- Mobile nav toggle ----

  const toggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('nav ul');

  if (toggle && navList) {
    toggle.addEventListener('click', function () {
      const isOpen = navList.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // ---- Back to top ----

  const backToTop = document.querySelector('.back-to-top');

  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.hidden = window.scrollY < 300;
    }, { passive: true });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- Current year ----

  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ---- Handle URL hash on load ----

  function handleInitialHash() {
    const hash = window.location.hash.slice(1);
    const sections = getAllSections();
    const ids = Array.from(sections).map(function (s) { return s.id; });

    if (hash && ids.includes(hash)) {
      showSection(hash, false);
    } else {
      // Default: show home, hide everything else
      sections.forEach(function (s) {
        s.hidden = s.id !== 'home';
      });
      updateNavState('home');
    }
  }

  // Handle browser back/forward
  window.addEventListener('popstate', handleInitialHash);

  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleInitialHash);
  } else {
    handleInitialHash();
  }

})();
