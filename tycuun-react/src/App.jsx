import { useState, useRef } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import { useParticles } from './hooks/useParticles';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthNavbar from './components/AuthNavbar';
import Hero from './components/Hero';
import Features from './components/Features';
import CTA from './components/CTA';
import Footer from './components/Footer';
import WelcomePopup from './components/WelcomePopup';
import AuthPopup from './components/AuthPopup';
import Profile from './pages/Profile';
import ProfileView from './pages/ProfileView';
import EditProfile from './pages/EditProfile';

function LandingPage({ onOpenAuth }) {
  return (
    <>
      <Hero onOpenAuth={onOpenAuth} />
      <Features />
      <CTA />
      <Footer />
    </>
  );
}

export default function App() {
  const { toggleTheme } = useTheme();
  const { user, loading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const canvasRef = useRef(null);

  useParticles(canvasRef);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      {!user && <WelcomePopup />}
      <AuthPopup isOpen={authOpen} onClose={() => setAuthOpen(false)} />

      {/* Particle Canvas Background */}
      <canvas ref={canvasRef} id="networkCanvas"></canvas>

      {user ? (
        <AuthNavbar onToggleTheme={toggleTheme} />
      ) : (
        <Navbar onToggleTheme={toggleTheme} onOpenAuth={() => setAuthOpen(true)} />
      )}

      <Routes>
        <Route path="/" element={<LandingPage onOpenAuth={() => setAuthOpen(true)} />} />
        <Route path="/profile" element={user ? <ProfileView /> : <Navigate to="/" replace />} />
        <Route path="/profile/edit" element={user ? <EditProfile /> : <Navigate to="/" replace />} />
        <Route path="/profile/:id" element={user ? <ProfileView /> : <Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
