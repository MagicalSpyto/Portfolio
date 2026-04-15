import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';

type WebGLController = {
  resizeCanvas: () => void;
  cleanup: () => void;
};

export function initWebGL(canvas: HTMLCanvasElement): WebGLController {
  console.log("Initializing WebGL...");
  const renderer = new THREE.WebGLRenderer({ 
    canvas, 
    antialias: true,
    powerPreference: "high-performance"
});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const camera = new THREE.PerspectiveCamera(
        75, 
        canvas.clientWidth / canvas.clientHeight, 
        0.1, 
        1000);
    camera.position.z = 3;
  const scene = new THREE.Scene();
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  let animationFrameId = 0;
  let isDisposed = false;
  let points: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial> | null = null;
  let pointsMaterial: THREE.PointsMaterial | null = null;
  let pointsGeometry: THREE.BufferGeometry | null = null;
  let resumeTimer: ReturnType<typeof setTimeout> | null = null;

  const resizeCanvas = () => {
    if (isDisposed) return;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    canvas.width = width;
    canvas.height = height;
    renderer.setClearColor(0x111111, 1);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Auto-rotate when the user is not touching the controls.
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;
    const AUTO_ROTATE_RESUME_DELAY_MS = 2000;
    let returnLerpFactor = 0.01;
    const RETURN_DONE_THRESHOLD = 0.0001;
    let isReturningToDefault = false;

    // Store the baseline camera state we want to return to.
    const defaultCameraPosition = camera.position.clone();
    const defaultTarget = controls.target.clone();

    // Pause auto-rotation while the user is manually interacting.
    controls.addEventListener('start', () => {
      controls.autoRotate = false;
      isReturningToDefault = false;
      if (resumeTimer) {
        clearTimeout(resumeTimer);
        resumeTimer = null;
      }
    });
    // Resume auto-rotation shortly after the user releases the control.
    controls.addEventListener('end', () => {
      if (resumeTimer) {
        clearTimeout(resumeTimer);
      }
      resumeTimer = setTimeout(() => {
        // First ease back to baseline camera state, then resume auto-rotation.
        isReturningToDefault = true;
        controls.autoRotate = false;
        resumeTimer = null;
      }, AUTO_ROTATE_RESUME_DELAY_MS);
    });

    console.log("Loading point cloud...");
    const loader = new PLYLoader();
    loader.load('../imports/pointcloud.ply', (geometry) => {
        if (isDisposed) {
          geometry.dispose();
          return;
        }
        geometry.scale(1, -1, 1); // Invert Y axis if needed
        geometry.translate(-0.2, -0.5, 0); // Center the point cloud
        const material = new THREE.PointsMaterial({ 
            vertexColors: true, 
            size: 0.025 });
        pointsGeometry = geometry;
        pointsMaterial = material;
        points = new THREE.Points(geometry, material);
        scene.add(points);

        function animate() {
          if (isDisposed) return;
            animationFrameId = requestAnimationFrame(animate);
          if (isReturningToDefault) {
            camera.position.lerp(defaultCameraPosition, returnLerpFactor);
            controls.target.lerp(defaultTarget, returnLerpFactor);
            returnLerpFactor += 0.001; // Gradually increase the lerp factor for a smooth return

            const positionDelta = camera.position.distanceTo(defaultCameraPosition);
            const targetDelta = controls.target.distanceTo(defaultTarget);

            if (positionDelta < RETURN_DONE_THRESHOLD && targetDelta < RETURN_DONE_THRESHOLD) {
              camera.position.copy(defaultCameraPosition);
              controls.target.copy(defaultTarget);
              isReturningToDefault = false;
              controls.autoRotate = true;    
              returnLerpFactor = 0.01; // Reset for the next time
            }
          }
            controls.update();
            renderer.render(scene, camera);
        }
        animate();
    });

    return {
      resizeCanvas,
      cleanup: () => {
        if (isDisposed) return;
        isDisposed = true;
        if (resumeTimer) {
          clearTimeout(resumeTimer);
          resumeTimer = null;
        }
        window.cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', resizeCanvas);
        controls.dispose();
        if (points) {
          scene.remove(points);
          points = null;
        }
        pointsGeometry?.dispose();
        pointsMaterial?.dispose();
        renderer.dispose();
      },
    };
}
