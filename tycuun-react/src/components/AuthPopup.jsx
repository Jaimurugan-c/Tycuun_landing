import { useState, useRef, useEffect } from 'react';
import { useParticles } from '../hooks/useParticles';
import { calculatePasswordStrength } from '../utils/passwordStrength';

export default function AuthPopup({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('signin');
  const [signInPasswordVisible, setSignInPasswordVisible] = useState(false);
  const [signUpPasswordVisible, setSignUpPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const canvasRef = useRef(null);

  useParticles(canvasRef, { popup: true });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log('Sign In:', { email: formData.get('email'), password: formData.get('password') });
    alert('Sign In successful! (Demo)');
    onClose();
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log('Sign Up:', { name: formData.get('name'), email: formData.get('email'), password: formData.get('password') });
    alert('Account created successfully! (Demo)');
    onClose();
  };

  const handlePasswordChange = (e) => {
    setPasswordStrength(calculatePasswordStrength(e.target.value));
  };

  const strengthColors = ['#ef4444', '#f97316', '#eab308', '#22c55e'];

  const SocialButtons = ({ label }) => (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-card text-muted">{label}</span>
        </div>
      </div>
      <div className="mt-4 flex gap-3">
        <button type="button" className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-bg border border-border rounded-xl hover:bg-cardHover transition-all">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="text-sm font-medium text-main">Google</span>
        </button>
        <button type="button" className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-bg border border-border rounded-xl hover:bg-cardHover transition-all">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <span className="text-sm font-medium text-main">GitHub</span>
        </button>
      </div>
    </div>
  );

  const EyeIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
    </svg>
  );

  return (
    <div
      className={`popup-overlay fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'active' : ''}`}
      onClick={handleOverlayClick}
    >
      <div className="popup-box auth-popup-box relative bg-card rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transform transition-all duration-500 border border-border">
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none"></canvas>
        <div className="relative z-10 p-6 sm:p-8">

          {/* Tab Switcher */}
          <div className="flex bg-bg rounded-xl p-1 mb-6">
            <button
              className={`auth-tab flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all ${activeTab === 'signin' ? 'active' : ''}`}
              onClick={() => setActiveTab('signin')}
            >Sign In</button>
            <button
              className={`auth-tab flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all ${activeTab === 'signup' ? 'active' : ''}`}
              onClick={() => setActiveTab('signup')}
            >Sign Up</button>
          </div>

          {/* Sign In Form */}
          {activeTab === 'signin' && (
            <div className="auth-form">
              <div className="text-center mb-6">
                <h2 className="font-display font-bold text-2xl text-main mb-2">Welcome Back</h2>
                <p className="text-muted text-sm">Sign in to continue to your account</p>
              </div>
              <form className="space-y-4" onSubmit={handleSignIn}>
                <div>
                  <label htmlFor="signInEmail" className="block text-sm font-medium text-main mb-1">Email Address</label>
                  <input type="email" id="signInEmail" name="email" required placeholder="you@example.com" className="w-full px-4 py-3 bg-bg border border-border rounded-xl text-main placeholder-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all text-sm" />
                </div>
                <div>
                  <label htmlFor="signInPassword" className="block text-sm font-medium text-main mb-1">Password</label>
                  <div className="relative">
                    <input type={signInPasswordVisible ? 'text' : 'password'} id="signInPassword" name="password" required placeholder="Enter your password" className="w-full px-4 py-3 pr-12 bg-bg border border-border rounded-xl text-main placeholder-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all text-sm" />
                    <button type="button" onClick={() => setSignInPasswordVisible(!signInPasswordVisible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-accent transition-colors">
                      <EyeIcon />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-border bg-bg accent-accent" />
                    <span className="text-sm text-muted">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-accent hover:underline">Forgot password?</a>
                </div>
                <button type="submit" className="w-full btn-primary py-3.5 rounded-xl text-white font-semibold text-sm transition-all">Sign In</button>
              </form>
              <SocialButtons label="Or continue with" />
            </div>
          )}

          {/* Sign Up Form */}
          {activeTab === 'signup' && (
            <div className="auth-form">
              <div className="text-center mb-6">
                <h2 className="font-display font-bold text-2xl text-main mb-2">Create Account</h2>
                <p className="text-muted text-sm">Join the business network today</p>
              </div>
              <form className="space-y-4" onSubmit={handleSignUp}>
                <div>
                  <label htmlFor="signUpName" className="block text-sm font-medium text-main mb-1">Full Name</label>
                  <input type="text" id="signUpName" name="name" required placeholder="John Doe" className="w-full px-4 py-3 bg-bg border border-border rounded-xl text-main placeholder-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all text-sm" />
                </div>
                <div>
                  <label htmlFor="signUpEmail" className="block text-sm font-medium text-main mb-1">Email Address</label>
                  <input type="email" id="signUpEmail" name="email" required placeholder="you@example.com" className="w-full px-4 py-3 bg-bg border border-border rounded-xl text-main placeholder-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all text-sm" />
                </div>
                <div>
                  <label htmlFor="signUpPassword" className="block text-sm font-medium text-main mb-1">Password</label>
                  <div className="relative">
                    <input type={signUpPasswordVisible ? 'text' : 'password'} id="signUpPassword" name="password" required placeholder="Create a strong password" onChange={handlePasswordChange} className="w-full px-4 py-3 pr-12 bg-bg border border-border rounded-xl text-main placeholder-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all text-sm" />
                    <button type="button" onClick={() => setSignUpPasswordVisible(!signUpPasswordVisible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-accent transition-colors">
                      <EyeIcon />
                    </button>
                  </div>
                  <div className="mt-2 flex gap-1">
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full"
                        style={{ background: i <= passwordStrength ? strengthColors[passwordStrength - 1] : 'var(--border)' }}
                      ></div>
                    ))}
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <input type="checkbox" id="terms" required className="w-4 h-4 mt-0.5 rounded border-border bg-bg accent-accent" />
                  <label htmlFor="terms" className="text-sm text-muted">I agree to the <a href="#" className="text-accent hover:underline">Terms of Service</a> and <a href="#" className="text-accent hover:underline">Privacy Policy</a></label>
                </div>
                <button type="submit" className="w-full btn-primary py-3.5 rounded-xl text-white font-semibold text-sm transition-all">Create Account</button>
              </form>
              <SocialButtons label="Or sign up with" />
            </div>
          )}

          {/* Close button */}
          <button onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-accent transition-colors z-20">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
