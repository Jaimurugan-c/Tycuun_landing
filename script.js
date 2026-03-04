// --- Theme Toggle Logic ---
const themeToggleBtns = document.querySelectorAll('#themeToggle, #themeToggleMobile');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to 'dark'
const currentTheme = localStorage.getItem('theme') || 'dark';
htmlElement.classList.toggle('dark', currentTheme === 'dark');

function toggleTheme() {
    const isDark = htmlElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    // Re-initialize particles to update their colors for the new theme
    if (typeof createParticles === 'function') {
        createParticles();
    }
}

themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', toggleTheme);
});
// Popup logic
document.addEventListener('DOMContentLoaded', () => {
  const popup = document.getElementById('welcomePopup');
  const closeBtn = document.getElementById('closePopup');
  const form = document.getElementById('leadForm');
  const formState = document.getElementById('formState');
  const thankState = document.getElementById('thankYouState');

  // Show popup after 800ms delay (on page load)
  setTimeout(() => {
    popup.classList.add('active');
  }, 5000);

  // Close popup
  function closePopup() {
    popup.classList.remove('active');
  }

  closeBtn.addEventListener('click', closePopup);

  // Optional: close when clicking outside the box
  popup.addEventListener('click', (e) => {
    if (e.target === popup) closePopup();
  });

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Here you can send data to backend (fetch/axios) if needed
    // For demo we just show thank you

    formState.classList.add('hidden');
    thankState.classList.remove('hidden');

    // Auto close after 3 seconds
    setTimeout(closePopup, 1000);
  });

  // Simple particles inside popup (similar style to your main canvas)
  const canvas = document.getElementById('popupParticles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizePopupCanvas() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    }

    function createPopupParticles() {
      particles = [];
      const count = 30; // fewer particles for small box
      const isDark = document.documentElement.classList.contains('dark');

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2.5 + 0.8,
          speedY: Math.random() * 0.4 + 0.15,
          speedX: (Math.random() - 0.5) * 0.3,
          color: isDark 
            ? (Math.random() > 0.5 ? 'rgba(0, 188, 242,' : 'rgba(80, 230, 160,') 
            : (Math.random() > 0.5 ? 'rgba(0, 120, 200,' : 'rgba(60, 180, 140,'),
          opacity: Math.random() * 0.4 + 0.15
        });
      }
    }

    function animatePopupParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.y -= p.speedY;
        p.x += p.speedX;

        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -10 || p.x > canvas.width + 10) p.x = Math.random() * canvas.width;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.opacity + ')';
        ctx.fill();
      });

      requestAnimationFrame(animatePopupParticles);
    }

    // Init
    resizePopupCanvas();
    createPopupParticles();
    animatePopupParticles();

    // Resize handler
    window.addEventListener('resize', () => {
      resizePopupCanvas();
      createPopupParticles();
    });

    // Update colors when theme changes
    const observer = new MutationObserver(() => {
      createPopupParticles();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  }
});
// --- Particle Background Logic ---
const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationId = null;

function initCanvas() {
    resizeCanvas();
    createParticles();
    animateParticles();
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function createParticles() {
    particles = [];
    const count = Math.floor(window.innerWidth / 20); // Density
    // Adjust colors based on theme
    const isDark = htmlElement.classList.contains('dark');
    
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            speedY: Math.random() * 0.3 + 0.1, // Rising speed
            speedX: (Math.random() - 0.5) * 0.2,
            // Use darker particles for light mode, brighter for dark mode
            color: isDark 
                ? (Math.random() > 0.5 ? 'rgba(0, 188, 242, ' : 'rgba(80, 230, 160, ')
                : (Math.random() > 0.5 ? 'rgba(0, 100, 180, ' : 'rgba(50, 160, 120, '),
            opacity: Math.random() * (isDark ? 0.5 : 0.3) + 0.1
        });
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
        // Move up
        p.y -= p.speedY;
        p.x += p.speedX;

        // Reset if out of bounds
        if (p.y < -10) {
            p.y = canvas.height + 10;
            p.x = Math.random() * canvas.width;
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.opacity + ')';
        ctx.fill();
    });

    animationId = requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
});

// --- 3D Tilt Effect for Feature Cards ---
const cards = document.querySelectorAll('.feature-card-3d');

cards.forEach(card => {
    // Mouse move listener for tilt
    card.addEventListener('mousemove', (e) => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
        const rotateY = ((x - centerX) / centerX) * 10;
        
        // Update CSS variables for the spotlight effect
        card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    // Reset on mouse leave
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
});

// --- Mobile Menu ---
const menuBtn = document.getElementById('menuBtn');
const closeMenuBtn = document.getElementById('closeMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const menuOverlay = document.getElementById('menuOverlay');

if (menuBtn && mobileMenu && closeMenuBtn && menuOverlay) {

    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.add('open');
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // prevent scroll
    });

    function closeMenu() {
        mobileMenu.classList.remove('open');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    closeMenuBtn.addEventListener('click', closeMenu);
    menuOverlay.addEventListener('click', closeMenu);

    // Close when clicking links
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

// --- Scroll Reveal ---
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// --- Counter Animation ---
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.target);
                let current = 0;
                const increment = target / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        counter.textContent = target;
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(current);
                    }
                }, 30);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
}

// --- Form ---
const form = document.getElementById('signupForm');
const successMsg = document.getElementById('successMsg');
if(form && successMsg) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        form.classList.add('hidden');
        successMsg.classList.remove('hidden');
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    initScrollReveal();
    initCounters();
});