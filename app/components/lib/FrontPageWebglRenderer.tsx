'use client';

import { useEffect, useRef } from 'react';
import { initWebGL } from '@/app/utils/webgl';

export default function FrontPageWebglRenderer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const webgl = initWebGL(canvas);
    if (!webgl) return;

    const handleResize = () => {
      //webgl.resizeCanvas();
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
      aria-hidden="true"
      className="h-full w-full"
    />
  );
}
