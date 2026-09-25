'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

interface CircuitPath {
  id: number;
  startX: number;
  startY: number;
  p1X: number;
  p1Y: number;
  p2X: number;
  p2Y: number;
  currentX: number;
  currentY: number;
  progress: number; // 0 to 1 (flow progress)
  speed: number;
  life: number; // 1 to 0 (fade progress after flow completes)
  color: string;
  nodeRadius: number;
  angleType: number; // 1 (up-bend), -1 (down-bend), 0 (straight)
  segment1Length: number;
  segment2Length: number;
  isAccent: boolean;
}

export function CircuitBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Mouse position tracking
  const mouseRef = useRef({ x: -9999, y: -9999, isHovering: false });
  const lastSpawnRef = useRef({ x: -9999, y: -9999 });
  const pathIdCounter = useRef(0);


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
    let activePaths: CircuitPath[] = [];

    const isDark = resolvedTheme === 'dark';

    // Theme-optimized color palette
    const primaryColor = isDark ? '#3B82F6' : '#4F46E5'; // Supporting Tech Blue (Dark) / Tech Indigo (Light)
    const accentColor = isDark ? '#2563EB' : '#0284C7';  // Royal Blue (Dark) / Tech Sapphire Blue (Light)

    // Fit canvas to parent hero section with High-DPI support
    const resizeCanvas = () => {
      const heroEl = canvas.closest('section') || canvas.parentElement;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = heroEl?.clientWidth || window.innerWidth;
      const height = heroEl?.clientHeight || window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.resetTransform();
      ctx.scale(dpr, dpr);
    };

    // Function to spawn a circuit trace path at coordinates (capped at 10 max for smooth 60fps)
    const spawnPath = (x: number, y: number) => {
      if (activePaths.length >= 10) return;
      pathIdCounter.current += 1;
      
      const isAccent = Math.random() > 0.45;
      const color = isAccent ? accentColor : primaryColor;
      
      // Determine segment directions
      const directions = [
        { dx: 1, dy: 0 },   // Right
        { dx: -1, dy: 0 },  // Left
        { dx: 0, dy: 1 },   // Down
        { dx: 0, dy: -1 },  // Up
      ];
      const dir = directions[Math.floor(Math.random() * directions.length)];
      
      const segment1Length = Math.random() * 45 + 30; // 30px to 75px
      const segment2Length = Math.random() * 35 + 20; // 20px to 55px

      // Calculate Point 1 (end of first segment)
      const p1X = x + dir.dx * segment1Length;
      const p1Y = y + dir.dy * segment1Length;

      // Calculate Point 2 (end of second segment with 45-degree bend)
      let p2X = p1X;
      let p2Y = p1Y;
      const angleType = Math.random() > 0.5 ? 1 : -1;

      if (dir.dx !== 0) {
        // Horizontal trace: bends vertically at 45 deg
        p2X = p1X + dir.dx * segment2Length;
        p2Y = p1Y + angleType * segment2Length;
      } else {
        // Vertical trace: bends horizontally at 45 deg
        p2X = p1X + angleType * segment2Length;
        p2Y = p1Y + dir.dy * segment2Length;
      }

      activePaths.push({
        id: pathIdCounter.current,
        startX: x,
        startY: y,
        p1X,
        p1Y,
        p2X,
        p2Y,
        currentX: x,
        currentY: y,
        progress: 0,
        speed: Math.random() * 0.025 + 0.02, // flow speed
        life: 1.0,
        color,
        nodeRadius: Math.random() * 1.5 + 2.5, // 2.5px to 4px
        angleType,
        segment1Length,
        segment2Length,
        isAccent,
      });
    };

    let isVisible = true;
    let isLoopRunning = false;
    let lastTime: number | null = null;

    const startAnimationLoop = () => {
      if (!isLoopRunning && isVisible) {
        isLoopRunning = true;
        lastTime = null;
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    const stopAnimationLoop = () => {
      if (isLoopRunning) {
        cancelAnimationFrame(animationFrameId);
        isLoopRunning = false;
      }
    };

    // Use IntersectionObserver to pause entirely when scrolled out of viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          startAnimationLoop();
        } else {
          stopAnimationLoop();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(canvas);

    // Check media queries
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

    // Direct listener on canvas to capture exact 3D-unprojected offsetX and offsetY
    const handleCanvasMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.offsetX;
      mouseRef.current.y = e.offsetY;
    };
    canvas.addEventListener('mousemove', handleCanvasMouseMove);

    // Handle mouse events strictly within the hero bounds
    const heroSection = canvas.closest('section') || canvas.parentElement;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) return;
      const heroEl = canvas.closest('section') || canvas.parentElement || canvas;
      const rect = heroEl.getBoundingClientRect();
      const isInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (isInside) {
        // Query exact 3D unprojected canvas coordinates from browser layout engine
        canvas.dispatchEvent(
          new MouseEvent('mousemove', {
            clientX: e.clientX,
            clientY: e.clientY,
            bubbles: false,
          })
        );

        const currentX = mouseRef.current.x;
        const currentY = mouseRef.current.y;

        if (!mouseRef.current.isHovering || lastSpawnRef.current.x === -9999) {
          mouseRef.current.isHovering = true;
          setIsHovered(true);
          lastSpawnRef.current = { x: currentX, y: currentY };
          spawnPath(currentX, currentY);
        } else {
          const distFromLast = Math.hypot(
            currentX - lastSpawnRef.current.x,
            currentY - lastSpawnRef.current.y
          );
          if (distFromLast > 18) {
            spawnPath(currentX, currentY);
            lastSpawnRef.current = { x: currentX, y: currentY };
          }
        }
        startAnimationLoop();
      } else {
        if (mouseRef.current.isHovering) {
          mouseRef.current.isHovering = false;
          mouseRef.current.x = -9999;
          mouseRef.current.y = -9999;
          lastSpawnRef.current = { x: -9999, y: -9999 };
          setIsHovered(false);
        }
      }
    };

    const handleMouseEnter = () => {
      mouseRef.current.isHovering = true;
      setIsHovered(true);
      startAnimationLoop();
    };

    const handleMouseLeave = () => {
      mouseRef.current.isHovering = false;
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
      lastSpawnRef.current = { x: -9999, y: -9999 };
      setIsHovered(false);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });
    if (!isTouchDevice && !prefersReducedMotion) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      if (heroSection) {
        heroSection.addEventListener('mouseenter', handleMouseEnter);
        heroSection.addEventListener('mouseleave', handleMouseLeave);
      }
    }

    // Periodically pulse a background path at the cursor if the user is hovering
    const idlePulseInterval = setInterval(() => {
      if (
        isVisible &&
        mouseRef.current.isHovering &&
        mouseRef.current.x !== -9999 &&
        !prefersReducedMotion
      ) {
        spawnPath(mouseRef.current.x, mouseRef.current.y);
        if (Math.random() > 0.6) {
          spawnPath(mouseRef.current.x, mouseRef.current.y);
        }
        startAnimationLoop();
      }
    }, 280);

    // Animation Loop
    function animate(timestamp: number) {
      if (!canvas || !ctx || !isVisible) {
        isLoopRunning = false;
        return;
      }

      if (lastTime === null) {
        lastTime = timestamp;
      }
      let dt = (timestamp - lastTime) / 1000;
      lastTime = timestamp;

      // Clamp dt to avoid frame jumps on tab freeze/unfreeze
      if (dt > 0.1) dt = 0.1;
      if (dt <= 0) dt = 0.016;

      const heroEl = canvas.closest('section') || canvas.parentElement;
      const parentWidth = heroEl?.clientWidth || window.innerWidth;
      const parentHeight = heroEl?.clientHeight || window.innerHeight;
      ctx.clearRect(0, 0, parentWidth, parentHeight);

      // Update and draw active traces with organic momentum
      activePaths.forEach((path) => {
        const d1 = path.segment1Length;
        const d2 = path.segment2Length;
        const totalD = d1 + d2;
        const currentD = path.progress * totalD;

        if (path.progress < 1) {
          // Flowing along path
          path.progress += path.speed;
          if (path.progress > 1) path.progress = 1;

          if (currentD <= d1) {
            const t = currentD / d1;
            path.currentX = path.startX + t * (path.p1X - path.startX);
            path.currentY = path.startY + t * (path.p1Y - path.startY);
          } else {
            const t = (currentD - d1) / d2;
            path.currentX = path.p1X + t * (path.p2X - path.p1X);
            path.currentY = path.p1Y + t * (path.p2Y - path.p1Y);
          }
        } else {
          // Fade out smoothly
          path.life -= 0.02;
        }

        // Draw flowing path traces
        ctx.beginPath();
        ctx.moveTo(path.startX, path.startY);

        const currentDrawn = path.progress * totalD;
        if (currentDrawn <= d1) {
          ctx.lineTo(path.currentX, path.currentY);
        } else {
          ctx.lineTo(path.p1X, path.p1Y);
          ctx.lineTo(path.currentX, path.currentY);
        }

        // Gradient for current traces trailing behind the pulse head
        const grad = ctx.createLinearGradient(path.startX, path.startY, path.currentX, path.currentY);
        const traceMaxOpacity = isDark ? 0.55 : 0.45;
        grad.addColorStop(0, 'rgba(0,0,0,0)');

        if (isDark) {
          grad.addColorStop(1, path.isAccent
            ? `rgba(0, 240, 255, ${traceMaxOpacity * path.life})`
            : `rgba(99, 102, 241, ${traceMaxOpacity * path.life})`
          );
        } else {
          grad.addColorStop(1, path.isAccent
            ? `rgba(2, 132, 199, ${traceMaxOpacity * path.life})`
            : `rgba(79, 70, 229, ${traceMaxOpacity * path.life})`
          );
        }

        ctx.strokeStyle = grad;
        ctx.lineWidth = isDark ? 1.75 : 2;
        ctx.stroke();

        // Draw current pulse head (glowing signal dot)
        if (path.life > 0) {
          ctx.beginPath();
          ctx.arc(path.currentX, path.currentY, path.nodeRadius, 0, Math.PI * 2);
          
          if (isDark) {
            ctx.fillStyle = '#FFFFFF';
            ctx.shadowBlur = 12;
            ctx.shadowColor = path.isAccent ? '#2563EB' : '#3B82F6';
          } else {
            ctx.fillStyle = path.isAccent ? '#0284C7' : '#4F46E5';
            ctx.shadowBlur = 6;
            ctx.shadowColor = path.isAccent ? '#0284C7' : '#4F46E5';
          }
          
          ctx.fill();
          ctx.shadowBlur = 0; // reset shadow for performance

          // If current flow reaches terminal point (Point 2), draw glowing concentric ring
          if (path.progress >= 1) {
            ctx.beginPath();
            ctx.arc(path.p2X, path.p2Y, path.nodeRadius + 4, 0, Math.PI * 2);
            if (isDark) {
              ctx.strokeStyle = path.isAccent 
                ? `rgba(0, 240, 255, ${0.45 * path.life})` 
                : `rgba(99, 102, 241, ${0.45 * path.life})`;
            } else {
              ctx.strokeStyle = path.isAccent 
                ? `rgba(2, 132, 199, ${0.45 * path.life})` 
                : `rgba(79, 70, 229, ${0.45 * path.life})`;
            }
            ctx.lineWidth = isDark ? 1 : 1.25;
            ctx.stroke();
          }
        }
      });

      // Filter out dead paths
      activePaths = activePaths.filter((path) => path.life > 0);

      // If idle and no paths left to render, pause the loop until mouse interaction
      if (activePaths.length === 0 && !mouseRef.current.isHovering) {
        ctx.clearRect(0, 0, parentWidth, parentHeight);
        isLoopRunning = false;
        return;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    startAnimationLoop();

    return () => {
      stopAnimationLoop();
      observer.disconnect();
      clearInterval(idlePulseInterval);
      canvas.removeEventListener('mousemove', handleCanvasMouseMove);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (heroSection) {
        heroSection.removeEventListener('mouseenter', handleMouseEnter);
        heroSection.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [mounted, resolvedTheme]);

  if (!mounted) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        opacity: isHovered ? 1 : 0,
        transition: isHovered
          ? 'opacity 450ms cubic-bezier(0.22, 1, 0.36, 1)'
          : 'opacity 550ms ease-in-out',
        willChange: 'opacity, transform',
        transform: 'translate3d(0, 0, 0)',
      }}
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
    />
  );
}
