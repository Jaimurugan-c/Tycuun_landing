import { useEffect, useRef, useCallback } from 'react';

const features = [
  {
    icon: (
      <svg className="w-7 h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
      </svg>
    ),
    iconBg: 'bg-accent/10',
    title: 'Business Connects',
    desc: 'Connect with real people in your industry. Build meaningful relationships.',
    delay: 'reveal-delay-1'
  },
  {
    icon: (
      <svg className="w-7 h-7" style={{ color: 'var(--accent-light)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
      </svg>
    ),
    iconBg: '',
    iconStyle: { background: 'rgba(80, 230, 160, 0.1)' },
    title: 'Promote Products',
    desc: 'Showcase your products and offers to a targeted audience.',
    delay: 'reveal-delay-2'
  },
  {
    icon: (
      <svg className="w-7 h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
      </svg>
    ),
    iconBg: 'bg-accent/10',
    title: 'Market Updates',
    desc: 'Stay informed with real-time updates on market trends.',
    delay: 'reveal-delay-3'
  },
  {
    icon: (
      <svg className="w-7 h-7" style={{ color: 'var(--accent-light)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
      </svg>
    ),
    iconBg: '',
    iconStyle: { background: 'rgba(80, 230, 160, 0.1)' },
    title: 'Elevate Skills',
    desc: 'Access training resources and mentorship programs.',
    delay: 'reveal-delay-4'
  },
  {
    icon: (
      <svg className="w-7 h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
      </svg>
    ),
    iconBg: 'bg-accent/10',
    title: 'Marketplace',
    desc: 'A dedicated marketplace connecting buyers and sellers.',
    delay: 'reveal-delay-5'
  },
  {
    icon: (
      <svg className="w-7 h-7" style={{ color: 'var(--accent-light)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
      </svg>
    ),
    iconBg: '',
    iconStyle: { background: 'rgba(80, 230, 160, 0.1)' },
    title: 'Financial Insights',
    desc: 'Share and gain valuable insights on sales strategies.',
    delay: 'reveal-delay-5'
  }
];

export default function Features() {
  const sectionRef = useRef(null);

  const handleMouseMove = useCallback((e, card) => {
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
  }, []);

  const handleMouseLeave = useCallback((card) => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    const reveals = sectionRef.current?.querySelectorAll('.reveal');
    reveals?.forEach(el => observer.observe(el));

    // 3D tilt
    const cards = sectionRef.current?.querySelectorAll('.feature-card-3d');
    const handlers = [];
    cards?.forEach(card => {
      const moveHandler = (e) => handleMouseMove(e, card);
      const leaveHandler = () => handleMouseLeave(card);
      card.addEventListener('mousemove', moveHandler);
      card.addEventListener('mouseleave', leaveHandler);
      handlers.push({ card, moveHandler, leaveHandler });
    });

    return () => {
      observer.disconnect();
      handlers.forEach(({ card, moveHandler, leaveHandler }) => {
        card.removeEventListener('mousemove', moveHandler);
        card.removeEventListener('mouseleave', leaveHandler);
      });
    };
  }, [handleMouseMove, handleMouseLeave]);

  return (
    <section id="features" ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-card/20 to-bg z-0"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="reveal text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 text-accent text-sm font-medium mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
            </svg>
            WHAT WE OFFER
          </div>
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-6 text-main">
            Everything You Need to <span className="gradient-text">Succeed</span>
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Tycuun brings you face-to-face with potential customers, partners, and opportunities.
          </p>
        </div>

        <div className="feature-container grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className={`feature-card-3d reveal ${feature.delay} rounded-2xl p-8 overflow-hidden group`}>
              <div className="content-3d relative z-10">
                <div
                  className={`icon-3d w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${feature.iconBg}`}
                  style={feature.iconStyle || {}}
                >
                  {feature.icon}
                </div>
                <h3 className="font-display font-semibold text-xl text-main mb-3">{feature.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
