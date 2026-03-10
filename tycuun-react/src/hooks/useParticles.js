import { useEffect, useRef } from 'react';

export function useParticles(canvasRef, options = {}) {
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
      if (options.popup) {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    }

    function createParticles() {
      particlesRef.current = [];
      const isDark = document.documentElement.classList.contains('dark');

      if (options.popup) {
        const count = 30;
        for (let i = 0; i < count; i++) {
          particlesRef.current.push({
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
      } else {
        const count = Math.floor(window.innerWidth / 20);
        for (let i = 0; i < count; i++) {
          particlesRef.current.push({
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
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach(p => {
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

      animationRef.current = requestAnimationFrame(animate);
    }

    resizeCanvas();
    createParticles();
    animate();

    const handleResize = () => {
      resizeCanvas();
      createParticles();
    };

    window.addEventListener('resize', handleResize);

    // Watch for theme changes
    const observer = new MutationObserver(() => {
      createParticles();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [canvasRef, options.popup]);
}
