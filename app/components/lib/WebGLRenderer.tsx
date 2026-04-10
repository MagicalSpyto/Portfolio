'use client';

import { useEffect, useRef } from 'react';
import { initWebGL } from '@/app/utils/webgl';

export default function WebGLRenderer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const webgl = initWebGL(canvas);
    if (!webgl) return;

    const handleResize = () => {
      webgl.resizeCanvas();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      //webgl.cleanup();
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className="w-full h-96 bg-slate-100 rounded-lg shadow-md"
    />
  );
}
