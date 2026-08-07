/* ============================================================
   NÓ DIGITAL — Romantic Interactive Landing Page
   Soft interactions: tilt cards, scroll reveals, gentle
   particles, counters, smooth scroll, parallax
   ============================================================ */

(function () {
  'use strict';

  // ============================================================
  // MAGNETIC BUTTONS (gentle pull)
  // ============================================================
  const magneticEls = document.querySelectorAll('[data-magnetic]');

  magneticEls.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const strength = 0.2;
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
      el.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => { el.style.transition = ''; }, 600);
    });
  });

  // ============================================================
  // SCROLL REVEAL
  // ============================================================
  const revealElements = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // ============================================================
  // GENTLE TILT EFFECT ON CARDS
  // ============================================================
  const tiltCards = document.querySelectorAll('[data-tilt]');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateX = (0.5 - y) * 8;
      const rotateY = (x - 0.5) * 8;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => { card.style.transition = ''; }, 700);
    });
  });

  // ============================================================
  // COUNTER ANIMATION
  // ============================================================
  const statNumbers = document.querySelectorAll('[data-count]');

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const numEl = el.querySelector('.stat-number');
          animateCount(numEl, 0, target, 2200);
          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((el) => counterObserver.observe(el));

  function animateCount(el, start, end, duration) {
    const startTime = performance.now();
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * eased);
      el.textContent = current.toLocaleString('pt-PT');
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // ============================================================
  // NAVBAR SCROLL EFFECT
  // ============================================================
  const nav = document.getElementById('nav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });

  // ============================================================
  // MOBILE MENU
  // ============================================================
  const navToggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-link').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ============================================================
  // HERO FLOATING PARTICLES (soft, romantic)
  // ============================================================
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function resizeCanvas() {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.offsetWidth;
        this.y = Math.random() * canvas.offsetHeight;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3 - 0.1; // gentle upward drift
        this.opacity = Math.random() * 0.3 + 0.1;
        this.fadeSpeed = Math.random() * 0.003 + 0.001;
        this.growing = Math.random() > 0.5;
        // Warm gold and blush tones
        const colors = [
          'rgba(201, 150, 58,',   // gold
          'rgba(224, 184, 96,',   // light gold
          'rgba(180, 130, 60,',   // dark gold
          'rgba(200, 180, 160,',  // warm grey
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Gentle breathing effect
        if (this.growing) {
          this.opacity += this.fadeSpeed;
          if (this.opacity >= 0.4) this.growing = false;
        } else {
          this.opacity -= this.fadeSpeed;
          if (this.opacity <= 0.05) this.growing = true;
        }

        // Soft mouse attraction
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          this.x += dx * 0.0008;
          this.y += dy * 0.0008;
        }

        // Wrap around gently
        if (this.x < -10) this.x = canvas.offsetWidth + 10;
        if (this.x > canvas.offsetWidth + 10) this.x = -10;
        if (this.y < -10) this.y = canvas.offsetHeight + 10;
        if (this.y > canvas.offsetHeight + 10) this.y = -10;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.opacity + ')';
        ctx.fill();
      }
    }

    const particleCount = Math.min(50, Math.floor(canvas.offsetWidth * canvas.offsetHeight / 18000));
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const opacity = (1 - dist / 100) * 0.06;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(201, 150, 58, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      drawConnections();
      animationId = requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // Pause when hero not visible
    const heroSection = document.getElementById('hero');
    const canvasObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          cancelAnimationFrame(animationId);
        } else {
          animateParticles();
        }
      });
    });
    canvasObserver.observe(heroSection);
  }

  // ============================================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ============================================================
  // CONTACT FORM
  // ============================================================
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const name = formData.get('name');
      const email = formData.get('email');
      const message = formData.get('message');

      feedback.className = 'form-feedback';
      feedback.style.display = 'none';

      if (!name || !email || !message) {
        feedback.textContent = 'Por favor, preencham todos os campos obrigatórios.';
        feedback.className = 'form-feedback error';
        feedback.style.display = 'block';
        return;
      }

      try {
        feedback.innerHTML = '<strong>Mensagem enviada com sucesso!</strong> Respondemos em menos de 24 horas.';
        feedback.className = 'form-feedback success';
        feedback.style.display = 'block';
        form.reset();
      } catch (err) {
        feedback.textContent = 'Erro ao enviar. Tentem novamente ou contactem diretamente.';
        feedback.className = 'form-feedback error';
        feedback.style.display = 'block';
      }
    });
  }

  // ============================================================
  // GENTLE PARALLAX ON HERO
  // ============================================================
  const heroContent = document.querySelector('.hero-content');
  window.addEventListener('scroll', () => {
    if (!heroContent) return;
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroContent.style.transform = `translateY(${scrolled * 0.1}px)`;
      heroContent.style.opacity = 1 - scrolled / (window.innerHeight * 1.1);
    }
  }, { passive: true });

  // ============================================================
  // PAGE LOAD ANIMATION
  // ============================================================
  window.addEventListener('load', () => {
    // Stagger hero reveals
    const heroReveals = document.querySelectorAll('.hero [data-reveal]');
    heroReveals.forEach((el, i) => {
      setTimeout(() => el.classList.add('revealed'), 300 + i * 180);
    });
  });

})();
