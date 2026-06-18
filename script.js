/* ═══════════════════════════════════════════════
   PORTFOLIO JAVASCRIPT
   ═══════════════════════════════════════════════ */

/* ── NEURAL CANVAS ── */
(function initCanvas() {
  const canvas = document.getElementById('neural-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, nodes = [], mouse = { x: 0, y: 0 };
  const NODE_COUNT = 70;
  const CONNECT_DIST = 150;
  const NODE_SPEED = 0.35;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createNode() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * NODE_SPEED,
      vy: (Math.random() - 0.5) * NODE_SPEED,
      r: Math.random() * 1.8 + 0.5,
    };
  }

  function init() {
    resize();
    nodes = Array.from({ length: NODE_COUNT }, createNode);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.35;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(108, 99, 255, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Mouse attraction connections
    nodes.forEach(n => {
      const dx = n.x - mouse.x;
      const dy = n.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        const alpha = (1 - dist / 200) * 0.5;
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    });

    // Draw nodes
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(108, 99, 255, 0.7)';
      ctx.fill();
    });
  }

  function update() {
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  init();
  loop();
})();

/* ── CUSTOM CURSOR ── */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  let fx = 0, fy = 0, mx = 0, my = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  function animFollower() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top = fy + 'px';
    requestAnimationFrame(animFollower);
  }
  animFollower();

  document.querySelectorAll('a, button, .tag, .project-card, .skill-category').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '16px';
      cursor.style.height = '16px';
      follower.style.width = '50px';
      follower.style.height = '50px';
      follower.style.opacity = '0.3';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '8px';
      cursor.style.height = '8px';
      follower.style.width = '32px';
      follower.style.height = '32px';
      follower.style.opacity = '0.5';
    });
  });
})();

/* ── NAVBAR ── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const links = document.querySelectorAll('.nav-link');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
  });

  navLinks.addEventListener('click', e => {
    if (e.target.classList.contains('nav-link')) {
      navLinks.classList.remove('open');
    }
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();

/* ── TYPED EFFECT ── */
(function initTyped() {
  const el = document.getElementById('typed-text');
  const phrases = [
    'AI Engineer',
    'Full-Stack Developer',
    'LLM Systems Builder',
    'RAG Pipeline Engineer',
    'Agentic AI Developer',
    'Researcher & Innovator',
  ];
  let pi = 0, ci = 0, deleting = false;
  const SPEED_TYPE = 80, SPEED_DELETE = 45, PAUSE = 2000;

  function type() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) {
        deleting = true;
        setTimeout(type, PAUSE);
        return;
      }
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
      }
    }
    setTimeout(type, deleting ? SPEED_DELETE : SPEED_TYPE);
  }
  type();
})();

/* ── SCROLL REVEAL ── */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll(
    '.skill-category, .project-card, .research-card, .achievement-card, .stat-card, .detail-card'
  );

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, parseInt(delay));
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => obs.observe(el));
})();

/* ── CONTACT FORM ── */
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('form-submit-btn');
  const btnText = document.getElementById('btn-text');
  const successMsg = document.getElementById('form-success');

  btn.disabled = true;
  btnText.textContent = 'Sending...';

  // Simulate async send
  setTimeout(() => {
    btn.disabled = false;
    btnText.textContent = 'Send Message';
    successMsg.style.display = 'block';
    e.target.reset();
    setTimeout(() => {
      successMsg.style.display = 'none';
    }, 5000);
  }, 1500);
}

/* ── SMOOTH SCROLL (older browser fallback) ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── TILT EFFECT ON PROJECT CARDS ── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
