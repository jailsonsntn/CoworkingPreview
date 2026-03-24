/* =============================================
   COWORKING SAÚDE THERAPI — script.js
   ============================================= */

(function () {
  'use strict';

  /* ---- Navbar scroll state ---- */
  const navbar = document.getElementById('navbar');

  function updateNavbar() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  /* ---- Mobile menu toggle ---- */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  navToggle.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Fechar menu ao clicar em um link ou fora
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', function (e) {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  /* ---- Scroll Reveal (IntersectionObserver) ---- */
  const revealEls = document.querySelectorAll('[data-scroll-reveal]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const delay = parseInt(entry.target.dataset.delay || '0', 10);
            setTimeout(function () {
              entry.target.classList.add('revealed');
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: mostrar tudo imediatamente
    revealEls.forEach(function (el) {
      el.classList.add('revealed');
    });
  }

  /* ---- Parallax sutil no hero ---- */
  const heroContent = document.querySelector('.hero-content');
  const heroOverlay = document.querySelector('.hero-overlay');

  function heroParallax() {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      if (heroContent) {
        heroContent.style.transform = 'translateY(' + scrollY * 0.28 + 'px)';
        heroContent.style.opacity   = String(1 - scrollY / (window.innerHeight * 0.85));
      }
      if (heroOverlay) {
        heroOverlay.style.opacity = String(0.72 + scrollY * 0.0002);
      }
    }
  }
  window.addEventListener('scroll', heroParallax, { passive: true });

  /* ---- Back to Top ---- */
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }, { passive: true });

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---- Galeria / Lightbox ---- */
  const galleryItems  = document.querySelectorAll('.gallery-item');
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev  = document.getElementById('lightboxPrev');
  const lightboxNext  = document.getElementById('lightboxNext');

  let currentIndex = 0;
  const galleryImages = [];

  galleryItems.forEach(function (item, idx) {
    const img = item.querySelector('img');
    if (img) {
      galleryImages.push({ src: img.src, alt: img.alt });
    }
    item.addEventListener('click', function () {
      openLightbox(idx);
    });
  });

  function openLightbox(idx) {
    currentIndex = idx;
    setLightboxImage(idx);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function setLightboxImage(idx) {
    if (!galleryImages[idx]) return;
    lightboxImg.style.opacity = '0';
    setTimeout(function () {
      lightboxImg.src = galleryImages[idx].src;
      lightboxImg.alt = galleryImages[idx].alt;
      lightboxImg.style.opacity = '1';
    }, 120);
  }

  lightboxImg.style.transition = 'opacity .2s';

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  lightboxPrev.addEventListener('click', function (e) {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    setLightboxImage(currentIndex);
  });

  lightboxNext.addEventListener('click', function (e) {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % galleryImages.length;
    setLightboxImage(currentIndex);
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')    closeLightbox();
    if (e.key === 'ArrowLeft') {
      currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
      setLightboxImage(currentIndex);
    }
    if (e.key === 'ArrowRight') {
      currentIndex = (currentIndex + 1) % galleryImages.length;
      setLightboxImage(currentIndex);
    }
  });

  // Swipe touch no lightbox
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  lightbox.addEventListener('touchend', function (e) {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) > 50) {
      if (dx < 0) {
        currentIndex = (currentIndex + 1) % galleryImages.length;
      } else {
        currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
      }
      setLightboxImage(currentIndex);
    }
  }, { passive: true });

  /* ---- Active nav link by scroll ---- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  window.addEventListener('scroll', function () {
    let current = '';
    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navAnchors.forEach(function (a) {
      a.classList.remove('active-link');
      if (a.getAttribute('href') === '#' + current) {
        a.classList.add('active-link');
      }
    });
  }, { passive: true });

  /* ---- Smooth ancor scroll (fallback) ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 16;
        window.scrollTo({
          top: target.offsetTop - offset,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ---- Modal Vídeo de Apresentação ---- */
  const videoModal      = document.getElementById('videoModal');
  const videoModalClose = document.getElementById('videoModalClose');
  const videoModalBack  = document.getElementById('videoModalBackdrop');
  const presentVideo    = document.getElementById('presentationVideo');
  const openVideoBtn    = document.getElementById('openVideoModal');

  function openVideoModal() {
    videoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (presentVideo) {
      presentVideo.currentTime = 0;
      presentVideo.play().catch(function () {});
    }
  }

  function closeVideoModal() {
    videoModal.classList.remove('active');
    document.body.style.overflow = '';
    if (presentVideo) {
      presentVideo.pause();
      presentVideo.currentTime = 0;
    }
  }

  if (openVideoBtn)    openVideoBtn.addEventListener('click', openVideoModal);
  if (videoModalClose) videoModalClose.addEventListener('click', closeVideoModal);
  if (videoModalBack)  videoModalBack.addEventListener('click', closeVideoModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && videoModal.classList.contains('active')) {
      closeVideoModal();
    }
  });

  /* ---- Counter animation (stats) ---- */
  function animateCounter(el, target, suffix) {
    let start     = 0;
    const duration = 1600;
    const step      = 16;
    const increment = target / (duration / step);

    const timer = setInterval(function () {
      start += increment;
      if (start >= target) {
        el.textContent = target + suffix;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(start) + suffix;
      }
    }, step);
  }

  const statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const stats = entry.target.querySelectorAll('.stat strong');
        stats.forEach(function (stat) {
          const text = stat.textContent.trim();
          const num  = parseInt(text.replace(/\D/g, ''), 10);
          const suf  = text.replace(/[0-9]/g, '');
          if (!isNaN(num)) animateCounter(stat, num, suf);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);

})();
