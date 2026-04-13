import * as THREE from 'three';

// Initializes and controls the animated front-page particle field.

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

	// Simulation constants controlling normalized field size and density in screen space.
	const GRID_HALF_SIZE = 0.5;
	// GRID_SIZE provides a stable reference scale for motion while the field itself lives in [-0.5, 0.5].
	const GRID_SIZE = 100;
	// The target spacing is converted into a point count from the current canvas area.
	const TARGET_POINT_SPACING_PX = 50;
	const MIN_POINT_COUNT = 250;
	const MAX_POINT_COUNT = 15000;
	// Particle motion is still simulated in normalized space and later scaled to the viewport.
	const POINT_SPEED = 20 / GRID_SIZE;
	// Link distance is measured in pixels so it stays visually consistent across aspect ratios.
	const LINK_DISTANCE_PX = 100;
	const MAX_LINE_OPACITY = 0.5;
	const MIN_LIFETIME_SECONDS = 2;
	const MAX_LIFETIME_SECONDS = 10;
	const LIFETIME_FADE_PORTION = 0.2;
	const MAX_SPAWN_ATTEMPTS = 24;
	const SPAWN_OUTSIDE_PADDING_PX = 6;
	// Cap the line buffer to keep GPU uploads bounded on large screens.
	const MAX_LINE_SEGMENTS = 150000;

	// Mouse location in normalized grid space: [-0.5, 0.5] for both axes.
	const mouseLocation = { x: 0, y: 0, inside: false };
	// Mouse influence radius in pixels
	const mouseInfluenceRadiusPX = 120;
	const repellingFactor = 0.7;

	// Position buffer storing every point coordinate (x, y, z).
	const geometry = new THREE.BufferGeometry();
	let positionAttribute = new THREE.BufferAttribute(new Float32Array(0), 3);
	geometry.setAttribute('position', positionAttribute);
	// Per-point runtime data stored in parallel arrays to avoid per-frame object allocation.
	let pointVelocities = new Float32Array(0);
	let pointAges = new Float32Array(0);
	let pointLifetimes = new Float32Array(0);
	let pointAlphas = new Float32Array(0);
	let pointAlphaAttribute = new THREE.BufferAttribute(pointAlphas, 1);
	geometry.setAttribute('alpha', pointAlphaAttribute);

	// Fade points in at birth and out right before respawn.
	const getLifetimeFadeAlpha = (age: number, lifetime: number) => {
		const safeLifetime = Math.max(lifetime, 0.0001);
		const t = THREE.MathUtils.clamp(age / safeLifetime, 0, 1);
		const fadeWindow = Math.min(LIFETIME_FADE_PORTION, 0.5);
		if (fadeWindow <= 0) return 1;
		const fadeIn = THREE.MathUtils.clamp(t / fadeWindow, 0, 1);
		const fadeOut = THREE.MathUtils.clamp((1 - t) / fadeWindow, 0, 1);
		return Math.min(fadeIn, fadeOut);
	};

	// Returns a random lifetime in seconds inside the configured range.
	const randomLifetime = () =>
		MIN_LIFETIME_SECONDS + Math.random() * (MAX_LIFETIME_SECONDS - MIN_LIFETIME_SECONDS);

	// Converts canvas area into a bounded particle count so density scales with screen size.
	const getTargetPointCount = (width: number, height: number) => {
		const canvasArea = Math.max(width, 1) * Math.max(height, 1);
		const targetCount = Math.round(canvasArea / (TARGET_POINT_SPACING_PX * TARGET_POINT_SPACING_PX));
		return THREE.MathUtils.clamp(targetCount, MIN_POINT_COUNT, MAX_POINT_COUNT);
	};

	// Reinitializes a point with a random position, drift direction, speed, and lifetime.
	const respawnPoint = (i: number) => {
		const i3 = i * 3;
		let dirX = (Math.random() * 2 - 1) * 1.5;
		let dirY = (Math.random() * 2 - 1) * 1.5;
		const length = Math.hypot(dirX, dirY) || 1;
		dirX /= length;
		dirY /= length;

		let spawnX = 0;
		let spawnY = 0;
		const influenceRadiusSquaredPx = mouseInfluenceRadiusPX * mouseInfluenceRadiusPX;
		let foundSpawnOutsideInfluence = !mouseLocation.inside;

		for (let attempt = 0; attempt < MAX_SPAWN_ATTEMPTS; attempt += 1) {
			spawnX = Math.random() * GRID_HALF_SIZE * 2 - GRID_HALF_SIZE;
			spawnY = Math.random() * GRID_HALF_SIZE * 2 - GRID_HALF_SIZE;

			if (!mouseLocation.inside) {
				foundSpawnOutsideInfluence = true;
				break;
			}

			const distanceX = (spawnX - mouseLocation.x) * windowSizeX;
			const distanceY = (spawnY - mouseLocation.y) * windowSizeY;
			if (distanceX * distanceX + distanceY * distanceY >= influenceRadiusSquaredPx) {
				foundSpawnOutsideInfluence = true;
				break;
			}
		}

		if (mouseLocation.inside && !foundSpawnOutsideInfluence) {
			const angle = Math.random() * Math.PI * 2;
			spawnX = mouseLocation.x +
				(Math.cos(angle) * (mouseInfluenceRadiusPX + SPAWN_OUTSIDE_PADDING_PX)) / Math.max(windowSizeX, 1);
			spawnY = mouseLocation.y +
				(Math.sin(angle) * (mouseInfluenceRadiusPX + SPAWN_OUTSIDE_PADDING_PX)) / Math.max(windowSizeY, 1);
			spawnX = THREE.MathUtils.clamp(spawnX, -GRID_HALF_SIZE, GRID_HALF_SIZE);
			spawnY = THREE.MathUtils.clamp(spawnY, -GRID_HALF_SIZE, GRID_HALF_SIZE);
		}

		positionAttribute.array[i3] = spawnX;
		positionAttribute.array[i3 + 1] = spawnY;
		positionAttribute.array[i3 + 2] = 0;
		const speed = POINT_SPEED * (0.5 + Math.random());
		pointVelocities[i3] = dirX * speed;
		pointVelocities[i3 + 1] = dirY * speed;
		pointVelocities[i3 + 2] = 0;

		pointAges[i] = 0;
		pointLifetimes[i] = randomLifetime();
		pointAlphas[i] = 0;
	};

	// Resizes the particle buffers while preserving existing state so viewport changes do not reshuffle the field.
	const rebuildPointField = (pointCount: number) => {
		const previousPositions = positionAttribute.array as Float32Array;
		const previousVelocities = pointVelocities;
		const previousAges = pointAges;
		const previousLifetimes = pointLifetimes;
		const previousAlphas = pointAlphas;
		const preservedPointCount = Math.min(positionAttribute.count, pointCount);

		positionAttribute = new THREE.BufferAttribute(new Float32Array(pointCount * 3), 3);
		positionAttribute.setUsage(THREE.DynamicDrawUsage);
		geometry.setAttribute('position', positionAttribute);
		pointVelocities = new Float32Array(pointCount * 3);
		pointAges = new Float32Array(pointCount);
		pointLifetimes = new Float32Array(pointCount);
		pointAlphas = new Float32Array(pointCount);
		pointAlphaAttribute = new THREE.BufferAttribute(pointAlphas, 1);
		pointAlphaAttribute.setUsage(THREE.DynamicDrawUsage);
		geometry.setAttribute('alpha', pointAlphaAttribute);

		// Copy the overlapping prefix so existing points keep their motion and lifetime state.
		if (preservedPointCount > 0) {
			positionAttribute.array.set(previousPositions.subarray(0, preservedPointCount * 3));
			pointVelocities.set(previousVelocities.subarray(0, preservedPointCount * 3));
			pointAges.set(previousAges.subarray(0, preservedPointCount));
			pointLifetimes.set(previousLifetimes.subarray(0, preservedPointCount));
			pointAlphas.set(previousAlphas.subarray(0, preservedPointCount));
		}

		// Only new trailing slots are randomized when the screen grows.
		for (let i = preservedPointCount; i < pointCount; i += 1) {
			respawnPoint(i);
		}

		positionAttribute.needsUpdate = true;
		pointAlphaAttribute.needsUpdate = true;
	};

	// Visual style for each particle.
	const material = new THREE.ShaderMaterial({
		transparent: true,
		depthWrite: false,
		uniforms: {
			uColor: { value: new THREE.Color(0xffffff) },
			uSize: { value: 2.5 },
		},
		vertexShader: `
			attribute float alpha;
			uniform float uSize;
			varying float vAlpha;

			void main() {
				vAlpha = alpha;
				vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
				gl_Position = projectionMatrix * mvPosition;
				gl_PointSize = uSize;
			}
		`,
		fragmentShader: `
			uniform vec3 uColor;
			varying float vAlpha;

			void main() {
				vec2 centered = gl_PointCoord - vec2(0.5);
				float dist = length(centered);
				if (dist > 0.5) discard;
				gl_FragColor = vec4(uColor, vAlpha);
			}
		`,
	});

	// Render the whole point cloud as one drawable object.
	const pointGrid = new THREE.Points(geometry, material);
	scene.add(pointGrid);

	// Dynamic line geometry rebuilt each frame from point proximity.
	const lineGeometry = new THREE.BufferGeometry();
	const linePositions = new Float32Array(MAX_LINE_SEGMENTS * 2 * 3);
	const lineAlphas = new Float32Array(MAX_LINE_SEGMENTS * 2);
	const linePositionAttribute = new THREE.BufferAttribute(linePositions, 3);
	const lineAlphaAttribute = new THREE.BufferAttribute(lineAlphas, 1);
	linePositionAttribute.setUsage(THREE.DynamicDrawUsage);
	lineAlphaAttribute.setUsage(THREE.DynamicDrawUsage);
	lineGeometry.setAttribute('position', linePositionAttribute);
	lineGeometry.setAttribute('alpha', lineAlphaAttribute);
	lineGeometry.setDrawRange(0, 0);

	const lineMaterial = new THREE.ShaderMaterial({
		transparent: true,
		depthWrite: false,
		uniforms: {
			uColor: { value: new THREE.Color(0xffffff) },
		},
		// Alpha is carried per vertex so each segment can fade based on its current distance.
		vertexShader: `
			attribute float alpha;
			varying float vAlpha;

			void main() {
				vAlpha = alpha;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
		`,
		fragmentShader: `
			uniform vec3 uColor;
			varying float vAlpha;

			void main() {
				gl_FragColor = vec4(uColor, vAlpha);
			}
		`,
	});
	const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
	scene.add(lineSegments);

	// Cached canvas size is reused in simulation and proximity checks to avoid repeated DOM reads.
	let windowSizeX = canvas.offsetWidth;
	canvas.offsetWidth
	let windowSizeY = canvas.clientHeight;
	let currentPointCount = 0;
	// Keeps renderer, camera, geometry density, and scene scale aligned with the canvas size.
	const resizeCanvas = () => {
		windowSizeX = canvas.offsetWidth;
		windowSizeY = canvas.clientHeight;
		if (!windowSizeX || !windowSizeY) return;

		// Resize the particle field only when the target density actually changes.
		const nextPointCount = getTargetPointCount(windowSizeX, windowSizeY);
		if (nextPointCount !== currentPointCount) {
			rebuildPointField(nextPointCount);
			currentPointCount = nextPointCount;
		}

		renderer.setSize(windowSizeX, windowSizeY, false);
		camera.aspect = windowSizeX / windowSizeY;
		camera.updateProjectionMatrix();

		// Fit the normalized grid to the visible camera area so size tracks canvas dimensions.
		const distanceToGrid = Math.abs(camera.position.z - pointGrid.position.z);
		const visibleHeight =
			2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * distanceToGrid;
		const visibleWidth = visibleHeight * camera.aspect;
		pointGrid.scale.set(visibleWidth, visibleHeight, 1);
		lineSegments.scale.set(visibleWidth, visibleHeight, 1);
	};

	// Run once so first frame has correct size.
	resizeCanvas();

	const handlePointerMove = (event: PointerEvent) => {
		// Convert the pointer position into canvas-local normalized coordinates.
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

	// Stop mouse repulsion when the pointer leaves the browser window.
	const handleWindowPointerLeave = () => {
		mouseLocation.inside = false;
	};

	// Rebuilds visible links every frame using a pixel-scaled spatial hash to avoid all-pairs checks.
	const rebuildProximityLines = () => {
		const cellSizeX = LINK_DISTANCE_PX / Math.max(windowSizeX, 1);
		const cellSizeY = LINK_DISTANCE_PX / Math.max(windowSizeY, 1);
		const linkDistanceSquaredPx = LINK_DISTANCE_PX * LINK_DISTANCE_PX;
		const mouseLinkDistanceSquaredPx = mouseInfluenceRadiusPX * mouseInfluenceRadiusPX;
		const cells = new Map<string, number[]>();

		// Bucket points into nearby cells so each particle only checks local neighbors.
		for (let i = 0; i < positionAttribute.count; i += 1) {
			const positionIndex = i * 3;
			const x = positionAttribute.array[positionIndex];
			const y = positionAttribute.array[positionIndex + 1];
			const cellX = Math.floor((x + GRID_HALF_SIZE) / cellSizeX);
			const cellY = Math.floor((y + GRID_HALF_SIZE) / cellSizeY);
			const key = `${cellX},${cellY}`;
			const bucket = cells.get(key);
			if (bucket) {
				bucket.push(i);
			} else {
				cells.set(key, [i]);
			}
		}

		let segmentCount = 0;
		// Visit each cell neighborhood and emit line segments for pairs inside the pixel-space threshold.
		for (let i = 0; i < positionAttribute.count; i += 1) {
			if (segmentCount >= MAX_LINE_SEGMENTS) break;

			const positionIndex = i * 3;
			const x1 = positionAttribute.array[positionIndex];
			const y1 = positionAttribute.array[positionIndex + 1];
			const pointAlpha1 = pointAlphas[i];
			if (pointAlpha1 <= 0) continue;
			const baseCellX = Math.floor((x1 + GRID_HALF_SIZE) / cellSizeX);
			const baseCellY = Math.floor((y1 + GRID_HALF_SIZE) / cellSizeY);

			for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
				if (segmentCount >= MAX_LINE_SEGMENTS) break;
				for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
					if (segmentCount >= MAX_LINE_SEGMENTS) break;

					const key = `${baseCellX + offsetX},${baseCellY + offsetY}`;
					const bucket = cells.get(key);
					if (!bucket) continue;

					for (let k = 0; k < bucket.length; k += 1) {
						if (segmentCount >= MAX_LINE_SEGMENTS) break;
						const j = bucket[k];
						if (j <= i) continue;

						const j3 = j * 3;
						const x2 = positionAttribute.array[j3];
						const y2 = positionAttribute.array[j3 + 1];
						const pointAlpha2 = pointAlphas[j];
						if (pointAlpha2 <= 0) continue;
						const dxPx = (x2 - x1) * windowSizeX;
						const dyPx = (y2 - y1) * windowSizeY;
						const distanceSquaredPx = dxPx * dxPx + dyPx * dyPx;
						if (distanceSquaredPx > linkDistanceSquaredPx) continue;

						// Fade links as they approach the maximum allowed distance.
						const distancePx = Math.sqrt(distanceSquaredPx);
						const normalizedDistance = distancePx / LINK_DISTANCE_PX;
						const lifetimeAlpha = Math.min(pointAlpha1, pointAlpha2);
						const alpha = (1 - normalizedDistance) * MAX_LINE_OPACITY * lifetimeAlpha;
						if (alpha <= 0) continue;

						const target = segmentCount * 6;
						const alphaTarget = segmentCount * 2;
						linePositions[target] = x1;
						linePositions[target + 1] = y1;
						linePositions[target + 2] = 0;
						linePositions[target + 3] = x2;
						linePositions[target + 4] = y2;
						linePositions[target + 5] = 0;
						lineAlphas[alphaTarget] = alpha;
						lineAlphas[alphaTarget + 1] = alpha;
						segmentCount += 1;
					}
				}
			}
		}

		// Treat the cursor as an extra anchor point and connect nearby particles to it.
		if (mouseLocation.inside && segmentCount < MAX_LINE_SEGMENTS) {
			for (let i = 0; i < positionAttribute.count; i += 1) {
				if (segmentCount >= MAX_LINE_SEGMENTS) break;

				const pointIndex = i * 3;
				const x = positionAttribute.array[pointIndex];
				const y = positionAttribute.array[pointIndex + 1];
				const pointAlpha = pointAlphas[i];
				if (pointAlpha <= 0) continue;

				const dxPx = (x - mouseLocation.x) * windowSizeX;
				const dyPx = (y - mouseLocation.y) * windowSizeY;
				const distanceSquaredPx = dxPx * dxPx + dyPx * dyPx;
				if (distanceSquaredPx > mouseLinkDistanceSquaredPx) continue;

				const distancePx = Math.sqrt(distanceSquaredPx);
				const normalizedDistance = distancePx / mouseInfluenceRadiusPX;
				const alpha = (1 - normalizedDistance) * MAX_LINE_OPACITY * pointAlpha;
				if (alpha <= 0) continue;

				const target = segmentCount * 6;
				const alphaTarget = segmentCount * 2;
				linePositions[target] = mouseLocation.x;
				linePositions[target + 1] = mouseLocation.y;
				linePositions[target + 2] = 0;
				linePositions[target + 3] = x;
				linePositions[target + 4] = y;
				linePositions[target + 5] = 0;
				lineAlphas[alphaTarget] = alpha;
				lineAlphas[alphaTarget + 1] = alpha;
				segmentCount += 1;
			}
		}

		lineGeometry.setDrawRange(0, segmentCount * 2);
		linePositionAttribute.needsUpdate = true;
		lineAlphaAttribute.needsUpdate = true;
	};

	window.addEventListener('pointermove', handlePointerMove);
	window.addEventListener('pointerleave', handleWindowPointerLeave);

	// requestAnimationFrame state and simple delta-time tracking.
	let frameId = 0;
	let lastTime = performance.now();

	const animate = () => {
		// Schedule next frame first to keep the loop alive even if this frame exits early.
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
				pointAlphas[i] = 0;
				continue;
			}

			let influenceX = 0;
			let influenceY = 0;
			if (mouseLocation.inside) {
				// Apply a simple repulsion force when the particle is inside the mouse influence radius.
				const distanceX = (positionAttribute.array[pointIndex] - mouseLocation.x) * windowSizeX;
				const distanceY = (positionAttribute.array[pointIndex + 1] - mouseLocation.y) * windowSizeY;
				if(mouseInfluenceRadiusPX > Math.sqrt(distanceX * distanceX + distanceY * distanceY)){
					influenceX = (mouseLocation.x - positionAttribute.array[pointIndex]);
					influenceY = (mouseLocation.y - positionAttribute.array[pointIndex + 1]);
				}
			}
			// Integrate drift velocity first, then add local mouse-driven offset.
			let x = positionAttribute.array[pointIndex];
			let y = positionAttribute.array[pointIndex + 1];

			x += pointVelocities[pointIndex] * delta / windowSizeX * GRID_SIZE;
			y += pointVelocities[pointIndex + 1] * delta / windowSizeY * GRID_SIZE;

			positionAttribute.array[pointIndex] = x + influenceX * delta * repellingFactor;
			positionAttribute.array[pointIndex + 1] = y + influenceY * delta * repellingFactor;

			pointAlphas[i] = getLifetimeFadeAlpha(pointAges[i], pointLifetimes[i]);
		}

		// Tell Three.js to upload the modified position buffer to the GPU.
		positionAttribute.needsUpdate = true;
		pointAlphaAttribute.needsUpdate = true;
		rebuildProximityLines();

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
		lineGeometry.dispose();
		lineMaterial.dispose();
		renderer.dispose();
	};

	return {
		resizeCanvas,
		getMouseLocation: () => ({ ...mouseLocation }),
		cleanup,
	};
}
