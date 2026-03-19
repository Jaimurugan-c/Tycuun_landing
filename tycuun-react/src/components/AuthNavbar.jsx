import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Megaphone, Users, Briefcase, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthNavbar({ onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.style.overflow = 'auto';
  };

  const openMenu = () => {
    setMenuOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleLogout = () => {
    closeMenu();
    logout();
    navigate('/');
  };

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Megaphone, label: 'Advertise', path: '/advertise' },
    { icon: Users, label: 'Recruitment', path: '/recruitment' },
    { icon: Briefcase, label: 'Business', path: '/business' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const isActive = (path) => location.pathname === path;

  const avatarUrl = user?.profileImage || null;

  return (
    <nav className="nav-glass fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="flex items-center gap-3 group">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-accent/20 rounded-lg rotate-45 group-hover:rotate-[60deg] transition-transform duration-500"></div>
              <div className="absolute inset-1 rounded-md rotate-45 group-hover:rotate-[30deg] transition-transform duration-500" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-light))' }}></div>
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-main">TYCUUN</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ icon: Icon, label, path }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-lg transition-colors ${
                  isActive(path)
                    ? 'text-accent'
                    : 'text-muted hover:text-accent hover:bg-cardHover'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[11px] font-medium">{label}</span>
              </button>
            ))}
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3">
            <button onClick={onToggleTheme} className="p-2 rounded-lg hover:bg-cardHover transition-colors text-main" aria-label="Toggle theme">
              <svg className="w-5 h-5 hidden dark:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
              <svg className="w-5 h-5 block dark:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
              </svg>
            </button>

            <div className="flex items-center gap-3 pl-3 border-l border-border">
              <button
                onClick={() => navigate('/profile')}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm overflow-hidden"
                style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-light))' }}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0).toUpperCase() || 'U'
                )}
              </button>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-muted hover:text-red-500 hover:bg-cardHover transition-colors"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Buttons */}
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

          {/* Mobile User Info */}
          <div className="px-6 pb-4 mb-2 border-b border-border">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden"
                style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-light))' }}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
              <div>
                <div className="text-sm font-semibold text-main">{user?.name || 'User'}</div>
                <div className="text-xs text-muted">{user?.email || ''}</div>
              </div>
            </div>
          </div>

          <nav className="flex flex-col gap-1 p-6">
            {navItems.map(({ icon: Icon, label, path }) => (
              <button
                key={label}
                onClick={() => { navigate(path); closeMenu(); }}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-left ${
                  isActive(path) ? 'text-accent bg-accent/10' : 'text-main hover:bg-cardHover'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
            <div className="mt-4 pt-4 border-t border-border">
              <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-3 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors w-full text-left">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </nav>
        </div>
      </div>
    </nav>
  );
}
