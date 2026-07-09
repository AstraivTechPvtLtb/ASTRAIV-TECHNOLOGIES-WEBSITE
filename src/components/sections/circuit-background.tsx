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

  // Physics simulation refs
  const interpX = useRef(-9999);
  const interpY = useRef(-9999);
  const springX = useRef(-9999);
  const springY = useRef(-9999);
  const vx = useRef(0);
  const vy = useRef(0);

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

    // Fit canvas to parent container
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    const isDark = resolvedTheme === 'dark';
    const primaryColor = '#5B5FEF'; // Astraiv Purple
    const accentColor = '#00C2FF';  // Astraiv Cyan

    // Function to spawn a circuit trace path at coordinates
    const spawnPath = (x: number, y: number) => {
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
      });
    };

    // Handle mouse events
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const isInside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
      
      if (isInside) {
        if (!mouseRef.current.isHovering) {
          // Initialize spring position to avoid abrupt jump from -9999
          if (mouseRef.current.x === -9999) {
            interpX.current = x;
            interpY.current = y;
            springX.current = x;
            springY.current = y;
            vx.current = 0;
            vy.current = 0;
            lastSpawnRef.current = { x, y };
          }
          setIsHovered(true);
        }
        mouseRef.current.x = x;
        mouseRef.current.y = y;
        mouseRef.current.isHovering = true;
      } else {
        if (mouseRef.current.isHovering) {
          mouseRef.current.isHovering = false;
          setIsHovered(false);
        }
      }
    };

    const handleMouseEnter = () => {
      mouseRef.current.isHovering = true;
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      mouseRef.current.isHovering = false;
      setIsHovered(false);
    };

    const parent = canvas.parentElement;

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    if (parent) {
      parent.addEventListener('mouseenter', handleMouseEnter);
      parent.addEventListener('mouseleave', handleMouseLeave);
    }

    // Periodically pulse a background path at the cursor if the user stops moving the mouse but is hovering
    const idlePulseInterval = setInterval(() => {
      if (mouseRef.current.isHovering && springX.current !== -9999) {
        // Spawn 1-2 random current paths emanating from the spring-interpolated cursor location
        spawnPath(springX.current, springY.current);
        if (Math.random() > 0.6) {
          spawnPath(springX.current, springY.current);
        }
      }
    }, 280);

    let lastTime: number | null = null;
    // Animation Loop
    const animate = (timestamp: number) => {
      if (lastTime === null) {
        lastTime = timestamp;
      }
      let dt = (timestamp - lastTime) / 1000;
      lastTime = timestamp;

      // Clamp dt to avoid frame jumps on tab freeze/unfreeze
      if (dt > 0.1) dt = 0.1;
      if (dt <= 0) dt = 0.016;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isDark = resolvedTheme === 'dark';

      // Update physics for mouse positioning
      const targetX = mouseRef.current.x;
      const targetY = mouseRef.current.y;

      if (targetX !== -9999 && targetY !== -9999) {
        // 1. Interpolation step (approx 180ms => follow speed ~0.10)
        const followSpeed = 0.10; // Follow speed: 0.08–0.12
        interpX.current += (targetX - interpX.current) * followSpeed;
        interpY.current += (targetY - interpY.current) * followSpeed;

        // 2. Spring physics (stiffness: 120-180, damping: 18-24)
        const stiffness = 150;
        const damping = 20;

        const ax = stiffness * (interpX.current - springX.current) - damping * vx.current;
        const ay = stiffness * (interpY.current - springY.current) - damping * vy.current;

        vx.current += ax * dt;
        vy.current += ay * dt;

        springX.current += vx.current * dt;
        springY.current += vy.current * dt;

        // 3. Maximum follow offset (20–40 px)
        const maxOffset = 30; // Clamp offset to 30px
        const dx = springX.current - targetX;
        const dy = springY.current - targetY;
        const dist = Math.hypot(dx, dy);

        if (dist > maxOffset) {
          springX.current = targetX + (dx / dist) * maxOffset;
          springY.current = targetY + (dy / dist) * maxOffset;
        }

        // 4. Rest delta check: stop microscopic updates if settled
        const restDelta = 0.001;
        if (
          Math.hypot(interpX.current - springX.current, interpY.current - springY.current) < restDelta &&
          Math.hypot(vx.current, vy.current) < restDelta
        ) {
          springX.current = interpX.current;
          springY.current = interpY.current;
          vx.current = 0;
          vy.current = 0;
        }

        // 5. Spawning paths based on spring coordinates
        if (mouseRef.current.isHovering) {
          const distFromLast = Math.hypot(springX.current - lastSpawnRef.current.x, springY.current - lastSpawnRef.current.y);
          if (distFromLast > 18) {
            spawnPath(springX.current, springY.current);
            lastSpawnRef.current = { x: springX.current, y: springY.current };
          }
        }
      }

      // Update and draw active traces
      activePaths.forEach((path) => {
        // Calculate coordinates along the two-segment path
        const d1 = path.segment1Length;
        const d2 = path.segment2Length;
        const totalD = d1 + d2;
        const currentD = path.progress * totalD;

        if (path.progress < 1) {
          // Current is flowing
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
          // Flow is completed, trace fades out
          path.life -= 0.02; // fade rate
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
        const traceMaxOpacity = isDark ? 0.4 : 0.2;
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(1, path.color === accentColor 
          ? `rgba(0, 194, 255, ${traceMaxOpacity * path.life})` 
          : `rgba(91, 95, 239, ${traceMaxOpacity * path.life})`
        );

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.75;
        ctx.stroke();

        // Draw current pulse head (glowing signal dot)
        if (path.life > 0) {
          ctx.beginPath();
          ctx.arc(path.currentX, path.currentY, path.nodeRadius, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? '#FFFFFF' : path.color;

          if (isDark) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = path.color;
          }
          ctx.fill();
          ctx.shadowBlur = 0; // reset shadow for performance

          // If current flow reaches terminal point (Point 2), draw glowing Astraiv concentric ring logo detail
          if (path.progress >= 1) {
            ctx.beginPath();
            ctx.arc(path.p2X, path.p2Y, path.nodeRadius + 4, 0, Math.PI * 2);
            ctx.strokeStyle = path.color === accentColor 
              ? `rgba(0, 194, 255, ${0.35 * path.life})` 
              : `rgba(91, 95, 239, ${0.35 * path.life})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });

      // Filter out dead paths
      activePaths = activePaths.filter((path) => path.life > 0);

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(idlePulseInterval);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (parent) {
        parent.removeEventListener('mouseenter', handleMouseEnter);
        parent.removeEventListener('mouseleave', handleMouseLeave);
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
          ? 'opacity 320ms cubic-bezier(0.22, 1, 0.36, 1)'
          : 'opacity 380ms cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'opacity, transform',
        transform: 'translate3d(0, 0, 0)',
      }}
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
    />
  );
}
