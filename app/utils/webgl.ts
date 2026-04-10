import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export async function initWebGL(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ 
    canvas, 
    antialias: true,
    powerPreference: "high-performance"
});
  const resizeCanvas = () => {
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight;
    renderer.setClearColor(0x111111, 1);
    renderer.setSize(canvas.width, canvas.height, false);
  }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75, 
        canvas.width / canvas.height, 
        0.1, 
        1000);
    camera.position.z = 3;
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const PLYBuffer = await loadPLY("/imports/pointcloud.ply");
    const geometry = createBuffers(PLYBuffer);
    const material = new THREE.PointsMaterial({ 
        vertexColors: true, 
        size: 0.01 });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
}
async function loadPLY(url:string) {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const headerEnd = findHeaderEnd(buffer);
    findVertexCount(buffer);
    const headerLessBuffer = buffer.slice(headerEnd);
    const bytes = new Uint8Array(headerLessBuffer);
    console.log(bytes[0].toString(16));
    const view = new DataView(headerLessBuffer);
    console.log(view.getFloat32(0, true));

    return headerLessBuffer;
}
function findHeaderEnd(buffer: ArrayBuffer): number {
  const bytes = new Uint8Array(buffer);
  const marker = new TextEncoder().encode("end_header");
  for (let i = 0; i < bytes.length - marker.length; i++) {
    const match = marker.every((b, j) => bytes[i + j] === b);
    if (!match) continue;

    const nextIndex = i + marker.length;
    const nextByte = bytes[nextIndex];
    const nextNextByte = bytes[nextIndex + 1];
    if (nextByte === 10) {
      return nextIndex + 1; // LF
    }
    if (nextByte === 13 && nextNextByte === 10) {
      return nextIndex + 2; // CRLF
    }
  }
  throw new Error("end_header not found");
}
function findVertexCount(buffer: ArrayBuffer): number {
  const bytes = new Uint8Array(buffer);
  const marker = new TextEncoder().encode("vertex ");
  for (let i = 0; i < bytes.length - marker.length; i++) {
    const match = marker.every((b, j) => bytes[i + j] === b);
    if (!match) continue;

    const nextIndex = i + marker.length;
    return nextIndex;
  }
  throw new Error("end_header not found");
}
function createBuffers(buffer: ArrayBuffer){
    const view = new DataView(buffer);
    const stride = 27; // 3 floats for position + 3 floats for color
    const count = buffer.byteLength / stride;

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for(let i = 0; i < count; i++){
        const base = i * stride;

        positions[i * 3] = view.getFloat32(base, true);
        positions[i * 3 + 1] = view.getFloat32(base + 4, true) * -1; // Invert Y axis
        positions[i * 3 + 2] = view.getFloat32(base + 8, true);

        colors[i * 3] = view.getUint8(base + 24) /255;
        colors[i * 3 + 1] = view.getUint8(base + 25) / 255;
        colors[i * 3 + 2] = view.getUint8(base + 26) / 255;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geometry;
}