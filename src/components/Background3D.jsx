'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Background3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Deep Dark Background
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0c0c);

    // 2. Camera — High vantage point looking towards horizon
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 7.5, 22);
    camera.lookAt(0, -1.5, -20);

    // 3. Ultra High-Performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: false, // Antialiasing analytically computed in GLSL via fwidth
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 4. Massive Ground Plane (600x600 so geometry edges never exist within view)
    const planeGeo = new THREE.PlaneGeometry(600, 600, 1, 1);
    planeGeo.rotateX(-Math.PI / 2);

    // 5. GPU Antialiased Grid Shader (Buttery smooth 60/144 FPS with zero borders or limits)
    const gridMaterial = new THREE.ShaderMaterial({
      extensions: {
        derivatives: true,
      },
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: 0.35 },
        uCellSize: { value: 5.0 },
        uLineWidth: { value: 1.2 },
        uColor: { value: new THREE.Color(0xb0b0b0) },
        uBgColor: { value: new THREE.Color(0x0c0c0c) },
      },
      vertexShader: `
        varying vec3 vWorldPosition;

        void main() {
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        varying vec3 vWorldPosition;

        uniform float uTime;
        uniform float uSpeed;
        uniform float uCellSize;
        uniform float uLineWidth;
        uniform vec3 uColor;
        uniform vec3 uBgColor;

        // Guaranteed smooth fade from 1.0 at startFade to 0.0 at endFade
        float fade(float val, float startFade, float endFade) {
          float t = clamp((endFade - val) / (endFade - startFade), 0.0, 1.0);
          return t * t * (3.0 - 2.0 * t);
        }

        void main() {
          // World space grid coordinates
          vec2 coord = vWorldPosition.xz / uCellSize;
          coord.y -= uTime * uSpeed;

          // GPU Subpixel Antialiased Grid Lines (never flickers, never drops frames)
          vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
          float line = min(grid.x, grid.y);
          float lineAlpha = 1.0 - min(line / uLineWidth, 1.0);

          // 1. Lateral smooth dissolve on sides (X axis) — zero visible side borders
          float sideFade = fade(abs(vWorldPosition.x), 20.0, 60.0);

          // 2. Far horizon dissolve (Far -Z) — fades into atmospheric infinity
          float farFade = fade(-vWorldPosition.z, 20.0, 85.0);

          // 3. Near camera dissolve (+Z) — fades out smoothly before reaching camera
          float nearFade = fade(vWorldPosition.z, 0.0, 16.0);

          // 4. Soft radial falloff for organic vignette
          float dist = length(vWorldPosition.xz - vec2(0.0, 10.0));
          float radialFade = fade(dist, 25.0, 95.0);

          float totalMask = lineAlpha * sideFade * farFade * nearFade * radialFade;

          // Seamless blend into deep background #0c0c0c (zero limits/borders)
          vec3 finalColor = mix(uBgColor, uColor, totalMask * 0.70);
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      depthWrite: true,
      depthTest: true,
    });

    const floorMesh = new THREE.Mesh(planeGeo, gridMaterial);
    floorMesh.position.set(0, -4.8, -40);
    scene.add(floorMesh);

    // 6. Smooth Clock-based Animation Loop
    const clock = new THREE.Clock();
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      gridMaterial.uniforms.uTime.value += delta;
      renderer.render(scene, camera);
    };
    animate();

    // 7. Responsive Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = window.innerWidth;
      const h = window.innerHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 8. Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      planeGeo.dispose();
      gridMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    />
  );
}
