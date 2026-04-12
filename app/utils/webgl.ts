import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';

export async function initWebGL(canvas: HTMLCanvasElement) {
  console.log("Initializing WebGL...");
  const renderer = new THREE.WebGLRenderer({ 
    canvas, 
    antialias: true,
    powerPreference: "high-performance"
});
  const camera = new THREE.PerspectiveCamera(
        75, 
        canvas.clientWidth / canvas.clientHeight, 
        0.1, 
        1000);
    camera.position.z = 3;

  const resizeCanvas = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width;
    canvas.height = height;
    renderer.setClearColor(0x111111, 1);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const scene = new THREE.Scene();
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    console.log("Loading point cloud...");
    const loader = new PLYLoader();
    loader.load('../imports/pointcloud.ply', (geometry) => {
        geometry.scale(1, -1, 1); // Invert Y axis if needed
        geometry.translate(-0.2, -0.5, 0); // Center the point cloud
        const material = new THREE.PointsMaterial({ 
            vertexColors: true, 
            size: 0.025 });
        const points = new THREE.Points(geometry, material);
        scene.add(points);

        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
        animate();
    });
}
