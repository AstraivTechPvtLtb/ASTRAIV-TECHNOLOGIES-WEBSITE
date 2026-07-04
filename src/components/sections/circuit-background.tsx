'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  glowColor: string;
  lineLength: number;
  angle: number; // 0 for straight horizontal, 1 for 45 deg, -1 for -45 deg
  speed: number;
  driftOffset: number;
}

export function CircuitBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const mouseRef = useRef({ x: -9999, y: -9999, radius: 160 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    // Set canvas sizing
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
      initParticles();
    };

    // Color definitions based on current active theme
    const isDark = resolvedTheme === 'dark';
    const primaryColor = '#5B5FEF'; // Astraiv Purple
    const accentColor = '#00C2FF';  // Astraiv Cyan
    const darkNodeColor = 'rgba(0, 194, 255, 0.85)';
    const lightNodeColor = 'rgba(11, 61, 145, 0.4)';

    // Initialize particles
    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 18000));
      
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 2 + 2; // 2px to 4px
        const isAccent = Math.random() > 0.4;
        const color = isAccent ? accentColor : primaryColor;
        const glowColor = isAccent ? 'rgba(0, 194, 255, 0.3)' : 'rgba(91, 95, 239, 0.3)';
        
        // Random angle for trace bend
        const angleRand = Math.random();
        const angle = angleRand < 0.4 ? 0 : angleRand < 0.7 ? 1 : -1;

        particles.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: 0,
          vy: 0,
          radius,
          color,
          glowColor,
          lineLength: Math.random() * 60 + 40, // 40px to 100px trace tail
          angle,
          speed: Math.random() * 0.15 + 0.05,
          driftOffset: Math.random() * Math.PI * 2,
        });
      }
    };

    // Handle mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Animation Loop
    let time = 0;
    const animate = () => {
      time += 0.005;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mouse = mouseRef.current;
      const isDark = resolvedTheme === 'dark';

      // Draw connections first
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

          // Faint straight grid connection (circuit wire vibe)
          if (dist < 80) {
            const opacity = (1 - dist / 80) * (isDark ? 0.06 : 0.03);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            // Draw a squared horizontal/vertical line instead of direct diagonal for circuit logic
            if (Math.random() > 0.5) {
              ctx.lineTo(p2.x, p1.y);
            } else {
              ctx.lineTo(p1.x, p2.y);
            }
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = isDark ? `rgba(0, 194, 255, ${opacity})` : `rgba(11, 61, 145, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw and update particles
      particles.forEach((p) => {
        // 1. Sine wave drift
        p.baseY += Math.sin(time + p.driftOffset) * p.speed * 0.2;
        p.baseX += Math.cos(time + p.driftOffset) * p.speed * 0.1;

        // 2. Mouse Repulsion (Antigravity physics)
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const pushForce = force * 6; // repulsion strength
          
          p.vx += (dx / dist) * pushForce;
          p.vy += (dy / dist) * pushForce;
        }

        // 3. Return to base anchor spring force
        const returnForceX = (p.baseX - p.x) * 0.02;
        const returnForceY = (p.baseY - p.y) * 0.02;

        p.vx += returnForceX;
        p.vy += returnForceY;

        // Friction dampening
        p.vx *= 0.92;
        p.vy *= 0.92;

        p.x += p.vx;
        p.y += p.vy;

        // Keep within bounds
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // 4. Draw Circuit Path/Trace behind node
        ctx.beginPath();
        const traceX = p.x - p.lineLength;
        let traceY = p.y;
        
        if (p.angle === 1) {
          // Bends 45 deg down
          const bendX = p.x - 25;
          ctx.moveTo(traceX, p.y + 25);
          ctx.lineTo(bendX, p.y + 25);
          ctx.lineTo(p.x, p.y);
        } else if (p.angle === -1) {
          // Bends 45 deg up
          const bendX = p.x - 25;
          ctx.moveTo(traceX, p.y - 25);
          ctx.lineTo(bendX, p.y - 25);
          ctx.lineTo(p.x, p.y);
        } else {
          // Straight horizontal path
          ctx.moveTo(traceX, p.y);
          ctx.lineTo(p.x, p.y);
        }

        // Create stroke gradient ending at the node
        const grad = ctx.createLinearGradient(p.x - p.lineLength, p.y, p.x, p.y);
        const traceOpacity = isDark ? 0.08 : 0.04;
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(0.5, p.color === accentColor ? `rgba(0, 194, 255, ${traceOpacity * 0.5})` : `rgba(91, 95, 239, ${traceOpacity * 0.5})`);
        grad.addColorStop(1, p.color === accentColor ? `rgba(0, 194, 255, ${traceOpacity})` : `rgba(91, 95, 239, ${traceOpacity})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.stroke();

        // 5. Draw Glowing Node Circle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? darkNodeColor : lightNodeColor;

        if (isDark) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
        }

        ctx.fill();
        ctx.shadowBlur = 0; // reset shadow for performance

        // Concentric outer ring for circuit detail (glowing halo)
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius + 3, 0, Math.PI * 2);
        ctx.strokeStyle = isDark 
          ? (p.color === accentColor ? 'rgba(0, 194, 255, 0.15)' : 'rgba(91, 95, 239, 0.15)')
          : 'rgba(11, 61, 145, 0.06)';
        ctx.lineWidth = 0.75;
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (canvas) canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mounted, resolvedTheme]);

  if (!mounted) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
    />
  );
}
