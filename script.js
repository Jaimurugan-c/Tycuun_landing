// script.js

// ===== THEME TOGGLE LOGIC =====
const themeToggleBtns = document.querySelectorAll('#themeToggle, #themeToggleMobile');
const htmlElement = document.documentElement;

const currentTheme = localStorage.getItem('theme') || 'dark';
htmlElement.classList.toggle('dark', currentTheme === 'dark');

function toggleTheme() {
    const isDark = htmlElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (typeof createParticles === 'function') {
        createParticles();
    }
}

themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', toggleTheme);
});

// ===== WELCOME POPUP LOGIC =====
document.addEventListener('DOMContentLoaded', () => {
    const welcomePopup = document.getElementById('welcomePopup');
    const closePopupBtn = document.getElementById('closePopup');
    const leadForm = document.getElementById('leadForm');
    const formState = document.getElementById('formState');
    const thankYouState = document.getElementById('thankYouState');

    // Show welcome popup after 3 seconds
    setTimeout(() => {
        welcomePopup.classList.add('active');
    }, 3000);

    function closeWelcomePopup() {
        welcomePopup.classList.remove('active');
    }

    closePopupBtn.addEventListener('click', closeWelcomePopup);

    welcomePopup.addEventListener('click', (e) => {
        if (e.target === welcomePopup) closeWelcomePopup();
    });

    leadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        formState.classList.add('hidden');
        thankYouState.classList.remove('hidden');
        setTimeout(closeWelcomePopup, 1000);
    });

    // Welcome popup particles
    const popupCanvas = document.getElementById('popupParticles');
    if (popupCanvas) {
        initPopupParticles(popupCanvas);
    }
});

// ===== AUTH POPUP LOGIC =====
const authPopup = document.getElementById('authPopup');
const closeAuthPopupBtn = document.getElementById('closeAuthPopup');
const signInTab = document.getElementById('signInTab');
const signUpTab = document.getElementById('signUpTab');
const signInForm = document.getElementById('signInForm');
const signUpForm = document.getElementById('signUpForm');
const openAuthPopupBtn = document.getElementById('openAuthPopup');
const mobileSignInBtn = document.getElementById('mobileSignInBtn');
const heroSignInBtn = document.getElementById('heroSignInBtn');

// Open auth popup
function openAuthModal() {
    authPopup.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Close mobile menu if open
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    if (mobileMenu) mobileMenu.classList.remove('open');
    if (menuOverlay) menuOverlay.classList.remove('active');
}

function closeAuthModal() {
    authPopup.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Event listeners for opening auth popup
if (openAuthPopupBtn) openAuthPopupBtn.addEventListener('click', openAuthModal);
if (mobileSignInBtn) mobileSignInBtn.addEventListener('click', openAuthModal);
if (heroSignInBtn) heroSignInBtn.addEventListener('click', openAuthModal);

// Close auth popup
if (closeAuthPopupBtn) {
    closeAuthPopupBtn.addEventListener('click', closeAuthModal);
}

// Close on overlay click
if (authPopup) {
    authPopup.addEventListener('click', (e) => {
        if (e.target === authPopup) closeAuthModal();
    });
}

// Tab switching
function switchTab(tab) {
    if (tab === 'signin') {
        signInTab.classList.add('active');
        signUpTab.classList.remove('active');
        signInForm.classList.remove('hidden');
        signUpForm.classList.add('hidden');
    } else {
        signUpTab.classList.add('active');
        signInTab.classList.remove('active');
        signUpForm.classList.remove('hidden');
        signInForm.classList.add('hidden');
    }
}

if (signInTab) signInTab.addEventListener('click', () => switchTab('signin'));
if (signUpTab) signUpTab.addEventListener('click', () => switchTab('signup'));

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
    }
}

// Password strength indicator
const signUpPasswordInput = document.getElementById('signUpPassword');
if (signUpPasswordInput) {
    signUpPasswordInput.addEventListener('input', (e) => {
        const password = e.target.value;
        const strength = calculatePasswordStrength(password);
        updateStrengthIndicator(strength);
    });
}

function calculatePasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
}

function updateStrengthIndicator(strength) {
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e'];
    for (let i = 1; i <= 4; i++) {
        const bar = document.getElementById(`strength${i}`);
        if (bar) {
            bar.style.background = i <= strength ? colors[strength - 1] : 'var(--border)';
        }
    }
}

// Form handlers
function handleSignIn(e) {
    e.preventDefault();
    const email = document.getElementById('signInEmail').value;
    const password = document.getElementById('signInPassword').value;
    
    // Add your sign in logic here
    console.log('Sign In:', { email, password });
    alert('Sign In successful! (Demo)');
    closeAuthModal();
}

function handleSignUp(e) {
    e.preventDefault();
    const name = document.getElementById('signUpName').value;
    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;
    
    // Add your sign up logic here
    console.log('Sign Up:', { name, email, password });
    alert('Account created successfully! (Demo)');
    closeAuthModal();
}

// Auth popup particles
const authCanvas = document.getElementById('authParticles');
if (authCanvas) {
    initPopupParticles(authCanvas);
}

function initPopupParticles(canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }

    function createParticles() {
        particles = [];
        const count = 30;
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

    function animate() {
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

        requestAnimationFrame(animate);
    }

    resizeCanvas();
    createParticles();
    animate();

    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
    });

    const observer = new MutationObserver(() => {
        createParticles();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
}

// ===== PARTICLE BACKGROUND =====
const canvas = document.getElementById('networkCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let particles = [];
let animationId = null;

function initCanvas() {
    resizeCanvas();
    createParticles();
    animateParticles();
}

function resizeCanvas() {
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
}

function createParticles() {
    particles = [];
    if (!canvas) return;
    
    const count = Math.floor(window.innerWidth / 20);
    const isDark = htmlElement.classList.contains('dark');
    
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            speedY: Math.random() * 0.3 + 0.1,
            speedX: (Math.random() - 0.5) * 0.2,
            color: isDark 
                ? (Math.random() > 0.5 ? 'rgba(0, 188, 242, ' : 'rgba(80, 230, 160, ')
                : (Math.random() > 0.5 ? 'rgba(0, 100, 180, ' : 'rgba(50, 160, 120, '),
            opacity: Math.random() * (isDark ? 0.5 : 0.3) + 0.1
        });
    }
}

function animateParticles() {
    if (!ctx || !canvas) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
        p.y -= p.speedY;
        p.x += p.speedX;

        if (p.y < -10) {
            p.y = canvas.height + 10;
            p.x = Math.random() * canvas.width;
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

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

// ===== 3D TILT EFFECT =====
const cards = document.querySelectorAll('.feature-card-3d');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        
        card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
});

// ===== MOBILE MENU =====
const menuBtn = document.getElementById('menuBtn');
const closeMenuBtn = document.getElementById('closeMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const menuOverlay = document.getElementById('menuOverlay');

if (menuBtn && mobileMenu && closeMenuBtn && menuOverlay) {
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.add('open');
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    function closeMenu() {
        mobileMenu.classList.remove('open');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    closeMenuBtn.addEventListener('click', closeMenu);
    menuOverlay.addEventListener('click', closeMenu);

    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

// ===== SCROLL REVEAL =====
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

// ===== COUNTER ANIMATION =====
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

// ===== CTA FORM =====
const ctaForm = document.getElementById('signupForm');
const successMsg = document.getElementById('successMsg');
if (ctaForm && successMsg) {
    ctaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        ctaForm.classList.add('hidden');
        successMsg.classList.remove('hidden');
    });
}

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (authPopup && authPopup.classList.contains('active')) {
            closeAuthModal();
        }
        const welcomePopup = document.getElementById('welcomePopup');
        if (welcomePopup && welcomePopup.classList.contains('active')) {
            welcomePopup.classList.remove('active');
        }
    }
});

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    initScrollReveal();
    initCounters();
});