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
      
      mouseRef.current.x = x;
      mouseRef.current.y = y;
      mouseRef.current.isHovering = true;

      // Spawn path if mouse has moved a threshold distance
      const distFromLast = Math.hypot(x - lastSpawnRef.current.x, y - lastSpawnRef.current.y);
      if (distFromLast > 18) {
        spawnPath(x, y);
        lastSpawnRef.current = { x, y };
      }
    };

    const handleMouseEnter = () => {
      mouseRef.current.isHovering = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.isHovering = false;
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Periodically pulse a background path at the cursor if the user stops moving the mouse but is hovering
    const idlePulseInterval = setInterval(() => {
      const mouse = mouseRef.current;
      if (mouse.isHovering && mouse.x !== -9999) {
        // Spawn 1-2 random current paths emanating from the cursor location
        spawnPath(mouse.x, mouse.y);
        if (Math.random() > 0.6) {
          spawnPath(mouse.x, mouse.y);
        }
      }
    }, 280);

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isDark = resolvedTheme === 'dark';

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

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(idlePulseInterval);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
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
