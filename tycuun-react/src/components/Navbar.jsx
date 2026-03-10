import { useState } from 'react';

export default function Navbar({ onToggleTheme, onOpenAuth }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const openMenu = () => {
    setMenuOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.style.overflow = 'auto';
  };

  const handleMobileSignIn = () => {
    closeMenu();
    onOpenAuth();
  };

  const handleMobileLinkClick = () => {
    closeMenu();
  };

  return (
    <nav className="nav-glass fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-accent/20 rounded-lg rotate-45 group-hover:rotate-[60deg] transition-transform duration-500"></div>
              <div className="absolute inset-1 rounded-md rotate-45 group-hover:rotate-[30deg] transition-transform duration-500" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-light))' }}></div>
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-main">TYCUUN</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            <a href="#features" className="nav-link">Features</a>
            <a href="#network" className="nav-link">Network</a>
            <a href="#about" className="nav-link">About</a>
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-4">
            <button onClick={onToggleTheme} className="p-2 rounded-lg hover:bg-cardHover transition-colors text-main" aria-label="Toggle theme">
              <svg className="w-5 h-5 hidden dark:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
              <svg className="w-5 h-5 block dark:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
              </svg>
            </button>

            <button onClick={onOpenAuth} className="btn-primary inline-flex items-center gap-2 text-white font-semibold px-6 py-2.5 rounded-lg text-sm">
              Sign In
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </button>
          </div>

          {/* Mobile Menu Buttons */}
          <div className="flex items-center gap-2 md:hidden">
            <button onClick={onToggleTheme} className="p-2 text-muted hover:text-accent focus:outline-none transition-colors" aria-label="Toggle theme">
              <svg className="w-6 h-6 hidden dark:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
              <svg className="w-6 h-6 block dark:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
              </svg>
            </button>

            <button onClick={openMenu} className="p-2 text-muted hover:text-accent focus:outline-none transition-colors" aria-label="Open menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`menu-overlay ${menuOpen ? 'active' : ''}`} onClick={closeMenu}></div>

      {/* Mobile Menu Panel */}
      <div className={`mobile-menu fixed inset-y-0 right-0 w-80 max-w-full z-50 md:hidden ${menuOpen ? 'open' : ''}`}>
        <div className="menu-content h-full flex flex-col bg-card dark:bg-zinc-900 shadow-2xl">
          <div className="flex justify-end p-4">
            <button onClick={closeMenu} className="p-2 text-muted hover:text-accent transition-colors" aria-label="Close menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <nav className="flex flex-col gap-2 p-6">
            <a href="#features" className="mobile-link" onClick={handleMobileLinkClick}>Features</a>
            <a href="#network" className="mobile-link" onClick={handleMobileLinkClick}>Network</a>
            <a href="#about" className="mobile-link" onClick={handleMobileLinkClick}>About</a>
            <div className="mt-4 pt-4 border-t border-border">
              <button onClick={handleMobileSignIn} className="btn-primary text-center block w-full py-3 rounded-lg">Sign In</button>
            </div>
          </nav>
        </div>
      </div>
    </nav>
  );
}
