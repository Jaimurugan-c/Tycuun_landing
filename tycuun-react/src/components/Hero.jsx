import { useEffect, useRef } from 'react';

export default function Hero({ onOpenAuth }) {
  const sectionRef = useRef(null);
  const countersRef = useRef([]);

  useEffect(() => {
    // Scroll reveal
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    const reveals = sectionRef.current?.querySelectorAll('.reveal');
    reveals?.forEach(el => revealObserver.observe(el));

    // Counter animation
    const counterObserver = new IntersectionObserver((entries) => {
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
          counterObserver.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });

    countersRef.current.forEach(c => {
      if (c) counterObserver.observe(c);
    });

    return () => {
      revealObserver.disconnect();
      counterObserver.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="floating-shape shape-1"></div>
      <div className="floating-shape shape-2"></div>
      <div className="floating-shape shape-3"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="reveal reveal-delay-1 inline-flex items-center gap-2 bg-accent/10 border border-accent/30 text-accent text-xs font-semibold px-4 py-2 rounded-full mb-8">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
              Business Social Network
            </div>

            <h1 className="reveal reveal-delay-2 font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] mb-8 text-main">
              You are in the
              <span className="block gradient-text">Business Social Network</span>
            </h1>

            <p className="reveal reveal-delay-3 text-muted text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
              Designed to support entrepreneurs for business connect with real people, promote products, watch business updates and elevate your business skills.
            </p>

            <div className="reveal reveal-delay-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button onClick={onOpenAuth} className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 text-white font-semibold px-8 py-4 rounded-xl text-base">
                Get Started Free
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </button>
              <a href="#about" className="btn-outline w-full sm:w-auto inline-flex items-center justify-center gap-2 font-semibold px-8 py-4 rounded-xl text-base bg-transparent">
                Learn More
              </a>
            </div>

            <div className="reveal reveal-delay-5 flex items-center justify-center lg:justify-start gap-8 mt-12 pt-8 border-t border-border/50">
              <div>
                <div className="font-display font-bold text-2xl text-main"><span className="counter" data-target="500" ref={el => countersRef.current[0] = el}>0</span>+</div>
                <div className="text-muted text-sm">Early Members</div>
              </div>
              <div className="w-px h-10 bg-border"></div>
              <div>
                <div className="font-display font-bold text-2xl text-main"><span className="counter" data-target="50" ref={el => countersRef.current[1] = el}>0</span>+</div>
                <div className="text-muted text-sm">Industries</div>
              </div>
              <div className="w-px h-10 bg-border"></div>
              <div>
                <div className="font-display font-bold text-2xl text-main"><span className="counter" data-target="100" ref={el => countersRef.current[2] = el}>0</span>%</div>
                <div className="text-muted text-sm">Free Access</div>
              </div>
            </div>
          </div>

          {/* Right - Visual */}
          <div className="reveal reveal-delay-3 hidden lg:flex justify-center items-center">
            <div className="relative">
              <div className="hero-card w-80 h-[500px] bg-card rounded-3xl border border-border p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 progress-bar"></div>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-light))' }}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-display font-semibold text-main">TYCUUN</div>
                      <div className="text-muted text-xs">Business Network</div>
                    </div>
                  </div>
                </div>

                <div className="relative h-40 mb-6 bg-bg/50 rounded-xl border border-border/50 overflow-hidden" id="connectionVisual"></div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-bg/50 rounded-xl border border-border/30">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-main truncate">New connection request</div>
                      <div className="text-xs text-muted">2 min ago</div>
                    </div>
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--accent-light)' }}></div>
                  </div>
                </div>
              </div>
              <div className="absolute -inset-8 rounded-[50px] blur-3xl -z-10" style={{ background: 'linear-gradient(to right, rgba(0, 188, 242, 0.1), transparent, rgba(80, 230, 160, 0.1))' }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
