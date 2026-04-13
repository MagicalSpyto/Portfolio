'use client';

import { useEffect, useRef } from 'react';
import { initWebGL } from '@/app/utils/WebglFrontPageAlt';

export default function FrontPageWebglRenderer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateScrollbarWidth = () => {
      const scrollbarWidth = Math.max(
        0,
        window.innerWidth - document.documentElement.clientWidth,
      );
      document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    };

    // Apply layout-affecting CSS variable before creating WebGL so first frame uses final size.
    updateScrollbarWidth();

    const webgl = initWebGL(canvas);
    if (!webgl) return;

    const handleResize = () => {
      updateScrollbarWidth();
      webgl.resizeCanvas();
    };

    // Sync once immediately and once on next frame after layout settles.
    webgl.resizeCanvas();
    const rafId = window.requestAnimationFrame(() => {
      webgl.resizeCanvas();
    });

    window.addEventListener('resize', handleResize);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      webgl.cleanup();
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="h-full w-full"
    />
  );
}
