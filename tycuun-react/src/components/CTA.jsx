import { useState, useEffect, useRef } from 'react';

export default function CTA() {
  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    const reveals = sectionRef.current?.querySelectorAll('.reveal');
    reveals?.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="join" ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-bg to-transparent"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(0, 188, 242, 0.1), transparent 70%)' }}></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="reveal text-center">
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-6 text-main">
            Ready to <span className="gradient-text">Take Off?</span>
          </h2>
          <p className="text-muted text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Join TYCUUN today and become part of a thriving business network.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input type="email" placeholder="Enter your email address" required className="flex-1 px-6 py-4 bg-card border border-border rounded-xl text-main placeholder-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all text-base" />
                <button type="submit" className="btn-primary whitespace-nowrap text-white font-semibold px-8 py-4 rounded-xl text-base transition-all">Sign In</button>
              </div>
              <p className="text-muted text-sm mt-4">Join the business network — it's free to get started.</p>
            </form>
          ) : (
            <div className="mt-8 p-6 bg-accent/10 border border-accent/30 rounded-2xl">
              <svg className="w-12 h-12 text-accent mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <h3 className="font-display font-semibold text-xl text-main mb-2">Welcome to TYCUUN</h3>
              <p className="text-muted">Your business journey starts now. Check your email for next steps.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
