import { useState, useRef } from 'react';
import { useTheme } from './hooks/useTheme';
import { useParticles } from './hooks/useParticles';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import CTA from './components/CTA';
import Footer from './components/Footer';
import WelcomePopup from './components/WelcomePopup';
import AuthPopup from './components/AuthPopup';

export default function App() {
  const { toggleTheme } = useTheme();
  const [authOpen, setAuthOpen] = useState(false);
  const canvasRef = useRef(null);

  useParticles(canvasRef);

  return (
    <>
      <WelcomePopup />
      <AuthPopup isOpen={authOpen} onClose={() => setAuthOpen(false)} />

      {/* Particle Canvas Background */}
      <canvas ref={canvasRef} id="networkCanvas"></canvas>

      <Navbar onToggleTheme={toggleTheme} onOpenAuth={() => setAuthOpen(true)} />
      <Hero onOpenAuth={() => setAuthOpen(true)} />
      <Features />
      <CTA />
      <Footer />
    </>
  );
}
