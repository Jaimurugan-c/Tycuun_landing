import { useState, useEffect, useRef } from 'react';
import { useParticles } from '../hooks/useParticles';

export default function WelcomePopup() {
  const [isActive, setIsActive] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const canvasRef = useRef(null);

  useParticles(canvasRef, { popup: true });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsActive(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isActive) {
        setIsActive(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isActive]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setIsActive(false), 1000);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) setIsActive(false);
  };

  return (
    <div
      className={`popup-overlay fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isActive ? 'active' : ''}`}
      onClick={handleOverlayClick}
    >
      <div className="popup-box relative bg-card rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transform transition-all duration-500 border border-border">
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none"></canvas>
        <div className="relative z-10 p-8">
          {!submitted ? (
            <div>
              <h2 className="font-display font-bold text-2xl text-main mb-2 text-center">HELLO CHAMP WELCOME</h2>
              <p className="text-muted text-center mb-6">EXPLORE THE BUSINESS GENERATION</p>
              <p className="text-muted text-center mb-6">It's your go-to space for buying, selling, promotingand leveling up through learning & training.
Showcase your requirement, amazing products,
exciting offers, and impressive business
information to the world.</p>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-main mb-1">Full Name</label>
                  <input type="text" id="name" required placeholder="John Doe" className="w-full px-5 py-3 bg-bg border border-border rounded-xl text-main placeholder-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-main mb-1">Phone Number</label>
                  <input type="tel" id="phone" required placeholder="+91 98765 43210" className="w-full px-5 py-3 bg-bg border border-border rounded-xl text-main placeholder-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all" />
                </div>
                <button type="submit" className="w-full btn-primary py-4 rounded-xl text-white font-semibold text-base transition-all">Submit & Continue</button>
              </form>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                <svg className="w-12 h-12 text-accent animate-check" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <h2 className="font-display font-bold text-2xl text-main mb-3">Thank You!</h2>
              <p className="text-muted">We've received your details. Redirecting you...</p>
            </div>
          )}
          <button onClick={() => setIsActive(false)} className="absolute top-4 right-4 text-muted hover:text-accent transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
