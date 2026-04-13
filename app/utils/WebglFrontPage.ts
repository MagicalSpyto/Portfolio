import * as THREE from 'three';
import { exp } from 'three/tsl';

// Public controls used by the React wrapper component.
type WebGLFrontPageController = {
	resizeCanvas: () => void;
	getMouseLocation: () => { x: number; y: number; inside: boolean };
	cleanup: () => void;
};

export function initWebGL(canvas: HTMLCanvasElement): WebGLFrontPageController {
	// Renderer bound to the provided canvas.
	const renderer = new THREE.WebGLRenderer({
		canvas,
		antialias: true,
		alpha: true,
		powerPreference: 'high-performance',
	});
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

	const scene = new THREE.Scene();

	// Simple camera looking at the center of the point field.
	const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
	camera.position.set(0, 0, 3);

	// Simulation constants for point count, movement speed, and lifetime range.
	const GRID_POINTS_PER_SIDE = 300;
	const GRID_HALF_SIZE = 0.5;
    //the grid size is used to scale the mouse curser influence range, since teh grid is normalized to [-0.5, 0.5], the influence redius should be scaled bs a consistent factor to allow the rest of teh scaling operations like speed to have a reference unit.
    const GRID_SIZE = 100;
	const POINT_SPEED = 200 / GRID_SIZE;
	const INFLUENCE_RADIUS_PX = 75;
	const MIN_LIFETIME_SECONDS = 2;
	const MAX_LIFETIME_SECONDS = 6;
	const MAX_SPAWN_ATTEMPTS = 30;
	const pointPositions: number[] = [];

	// Mouse location in normalized grid space: [-0.5, 0.5] for both axes.
	const mouseLocation = { x: 0, y: 0, inside: false };

	// Generate a normalized 2D grid centered at the origin.
	for (let y = 0; y < GRID_POINTS_PER_SIDE; y += 1) {
		for (let x = 0; x < GRID_POINTS_PER_SIDE; x += 1) {
			const xPos = x / (GRID_POINTS_PER_SIDE - 1) - 0.5;
			const yPos = y / (GRID_POINTS_PER_SIDE - 1) - 0.5;
			pointPositions.push(xPos, yPos, 0);
		}
	}

	// Position buffer storing every point coordinate (x, y, z).
	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute('position', new THREE.Float32BufferAttribute(pointPositions, 3));
	const positionAttribute = geometry.getAttribute('position') as THREE.BufferAttribute;
    const expectedPositions = new Float32Array(positionAttribute.count * 3);
	// Per-point runtime data: velocity, age, and lifetime.
	const pointVelocities = new Float32Array(positionAttribute.count * 3);
	const pointAges = new Float32Array(positionAttribute.count);
	const pointLifetimes = new Float32Array(positionAttribute.count);

	// Returns a random lifetime in seconds inside the configured range.
	const randomLifetime = () =>
		MIN_LIFETIME_SECONDS + Math.random() * (MAX_LIFETIME_SECONDS - MIN_LIFETIME_SECONDS);

	// Reinitializes a point with random position, random direction, and new lifetime.
	const respawnPoint = (i: number) => {
		const i3 = i * 3;
		let dirX = 0.5;//Math.random() * 2 - 1;
		let dirY = -0.5;//Math.random() * 2 - 1;
		const length = Math.hypot(dirX, dirY) || 1;
		dirX /= length;
		dirY /= length;

		let spawnX = 0;
		let spawnY = 0;
		let hasValidSpawn = false;
		const width = Math.max(canvas.clientWidth, 1);
		const height = Math.max(canvas.clientHeight, 1);

		for (let attempt = 0; attempt < MAX_SPAWN_ATTEMPTS; attempt += 1) {
			const candidateX = (Math.random() * 2 - 1) * GRID_HALF_SIZE * 1.5;
			const candidateY = (Math.random() * 2 - 1) * GRID_HALF_SIZE * 1.5;

			if (!mouseLocation.inside) {
				spawnX = candidateX;
				spawnY = candidateY;
				hasValidSpawn = true;
				break;
			}

			const dxPx = (candidateX - mouseLocation.x) * width;
			const dyPx = (candidateY - mouseLocation.y) * height;
			if (Math.hypot(dxPx, dyPx) > INFLUENCE_RADIUS_PX) {
				spawnX = candidateX;
				spawnY = candidateY;
				hasValidSpawn = true;
				break;
			}
		}

		if (!hasValidSpawn) {
			spawnX = (Math.random() * 2 - 1) * GRID_HALF_SIZE;
			spawnY = (Math.random() * 2 - 1) * GRID_HALF_SIZE;
		}

		positionAttribute.array[i3] = spawnX;
		positionAttribute.array[i3 + 1] = spawnY;
		positionAttribute.array[i3 + 2] = 0;
        expectedPositions[i3] = positionAttribute.array[i3];
        expectedPositions[i3 + 1] = positionAttribute.array[i3 + 1];
        expectedPositions[i3 + 2] = 0;
		const speed = POINT_SPEED * (0.5 + Math.random());
		pointVelocities[i3] = dirX * speed;
		pointVelocities[i3 + 1] = dirY * speed;
		pointVelocities[i3 + 2] = 0;

		pointAges[i] = 0;
		pointLifetimes[i] = randomLifetime();
	};

	// Initialize all points once at startup.
	for (let i = 0; i < positionAttribute.count; i += 1) {
		respawnPoint(i);
	}

	// Visual style for each particle.
	const material = new THREE.PointsMaterial({
		color: 0x60a5fa,
		size: 0.02,
		sizeAttenuation: true,
	});

	// Render the whole point cloud as one drawable object.
	const pointGrid = new THREE.Points(geometry, material);
	scene.add(pointGrid);

	// Keeps renderer/camera in sync with canvas size and scales grid to visible area.
    let windowSizeX = canvas.clientWidth;
    let windowSizeY = canvas.clientHeight;
	const resizeCanvas = () => {
		windowSizeX = canvas.clientWidth;
		windowSizeY = canvas.clientHeight;
		if (!windowSizeX || !windowSizeY) return;

		renderer.setSize(windowSizeX, windowSizeY, false);
		camera.aspect = windowSizeX / windowSizeY;
		camera.updateProjectionMatrix();

		// Fit the normalized grid to the visible camera area so size tracks canvas dimensions.
		const distanceToGrid = Math.abs(camera.position.z - pointGrid.position.z);
		const visibleHeight =
			2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * distanceToGrid;
		const visibleWidth = visibleHeight * camera.aspect;
		pointGrid.scale.set(visibleWidth, visibleHeight, 1);
	};

	// Run once so first frame has correct size.
	resizeCanvas();

	const handlePointerMove = (event: PointerEvent) => {
		let windowRect = canvas.getBoundingClientRect();
		if (!windowRect.width || !windowRect.height) return;

		const normalizedX = (event.clientX - windowRect.left) / windowRect.width;
		const normalizedY = (event.clientY - windowRect.top) / windowRect.height;
		const insideCanvas =
			normalizedX >= 0 && normalizedX <= 1 && normalizedY >= 0 && normalizedY <= 1;

		mouseLocation.inside = insideCanvas;
		if (!insideCanvas) return;

		mouseLocation.x = normalizedX - 0.5;
		mouseLocation.y = -(normalizedY - 0.5);
	};

	const handleWindowPointerLeave = () => {
		mouseLocation.inside = false;
	};

	window.addEventListener('pointermove', handlePointerMove);
	window.addEventListener('pointerleave', handleWindowPointerLeave);

	// requestAnimationFrame state and simple delta-time tracking.
	let frameId = 0;
	let lastTime = performance.now();

	const animate = () => {
		frameId = window.requestAnimationFrame(animate);
		const now = performance.now();
		const delta = (now - lastTime) / 1000;
		lastTime = now;
        
		for (let i = 0; i < positionAttribute.count; i += 1) {
			const pointIndex = i * 3;
			// Age each point and respawn it when its lifetime is over.
			pointAges[i] += delta;

			if (pointAges[i] >= pointLifetimes[i]) {
				respawnPoint(i);
				continue;
			}
            // influence the mouse will have on a particle. influence x ** 2 + influence y ** 2 should be etween 0 and 1
            let influenceX = 0;
            let influenceY = 0;
            if (mouseLocation.inside) {
                // Vector from mouse to particle in normalized grid space [-0.5, 0.5].
                const dx = expectedPositions[pointIndex] - mouseLocation.x;
                const dy = expectedPositions[pointIndex + 1] - mouseLocation.y;

				// Velocity direction in pixel space.
				const vxPx = pointVelocities[pointIndex];
				const vyPx = pointVelocities[pointIndex + 1];
				const speedPx = Math.hypot(vxPx, vyPx);
				const vDirXPx = speedPx > 0 ? vxPx / speedPx : 1;
				const vDirYPx = speedPx > 0 ? vyPx / speedPx : 0;

				// Perpendicular axis in pixel space (velocity rotated by 90 degrees).
				let perpXPx = -vDirYPx;
				let perpYPx = vDirXPx;
                // Check if the point is left or right of the velocity path in pixel space.
				const pointXPx = positionAttribute.array[pointIndex] * windowSizeX;
				const pointYPx = positionAttribute.array[pointIndex + 1] * windowSizeY;
				const mouseXPx = mouseLocation.x * windowSizeX;
				const mouseYPx = mouseLocation.y * windowSizeY;
				const relXPx = pointXPx - mouseXPx;
				const relYPx = pointYPx - mouseYPx;
				const side = vDirXPx * relYPx - vDirYPx * relXPx;
				const isLeft = side < 0;
                if(isLeft){
					perpXPx = -perpXPx;
					perpYPx = -perpYPx;
                }


				// Compute distance in pixel space so radius stays visually consistent on all screen sizes.
				const dxPx = dx * windowSizeX;
				const dyPx = dy * windowSizeY;
				const distancePx = Math.hypot(dxPx, dyPx);
                
				if (distancePx < INFLUENCE_RADIUS_PX) {
					const falloff = Math.cos((distancePx / INFLUENCE_RADIUS_PX) * (Math.PI / 2)); // Ease influence for smoother movement.
					const influenceMagnitudePx = falloff * INFLUENCE_RADIUS_PX;
					const influenceXPx = perpXPx * influenceMagnitudePx;
					const influenceYPx = perpYPx * influenceMagnitudePx;
					influenceX = influenceXPx / windowSizeX;
					influenceY = influenceYPx / windowSizeY;
				}
            }
			// Integrate movement using velocity and frame delta.
			let x = expectedPositions[pointIndex];
			let y = expectedPositions[pointIndex + 1];

			x += pointVelocities[pointIndex] * delta / windowSizeX * GRID_SIZE;
			y += pointVelocities[pointIndex + 1] * delta / windowSizeY * GRID_SIZE;
            
            expectedPositions[pointIndex] = x;
            expectedPositions[pointIndex + 1] = y;

			const forceX = ((x + influenceX) - positionAttribute.array[pointIndex]) / 50;
			const forceY = ((y + influenceY) - positionAttribute.array[pointIndex + 1]) / 50;


			positionAttribute.array[pointIndex] = positionAttribute.array[pointIndex] + forceX;
			positionAttribute.array[pointIndex + 1] = positionAttribute.array[pointIndex + 1] + forceY;
		}

		// Tell Three.js to upload the modified position buffer to the GPU.
		positionAttribute.needsUpdate = true;

		renderer.render(scene, camera);
	};

	animate();

	// Dispose GPU resources and stop animation loop on unmount.
	const cleanup = () => {
		window.cancelAnimationFrame(frameId);
		window.removeEventListener('pointermove', handlePointerMove);
		window.removeEventListener('pointerleave', handleWindowPointerLeave);
		geometry.dispose();
		material.dispose();
		renderer.dispose();
	};

	return {
		resizeCanvas,
		getMouseLocation: () => ({ ...mouseLocation }),
		cleanup,
	};
}
