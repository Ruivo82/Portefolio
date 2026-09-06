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

    // 4. Large Ground Plane
    const planeGeo = new THREE.PlaneGeometry(160, 220, 1, 1);
    planeGeo.rotateX(-Math.PI / 2);

    // 5. GPU Antialiased Grid Shader (Buttery smooth 60/144 FPS with zero subpixel jitter)
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

        void main() {
          // World coordinates
          vec2 coord = vWorldPosition.xz / uCellSize;
          coord.y -= uTime * uSpeed;

          // GPU Subpixel Antialiased Grid Lines (never flickers, never drops frames)
          vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
          float line = min(grid.x, grid.y);
          float lineAlpha = 1.0 - min(line / uLineWidth, 1.0);

          // Atmospheric Dissolve into Horizon (#0c0c0c)
          float farFade = smoothstep(-105.0, -15.0, vWorldPosition.z);
          float nearFade = smoothstep(18.0, 6.0, vWorldPosition.z);
          float sideFade = smoothstep(65.0, 20.0, abs(vWorldPosition.x));

          float mask = lineAlpha * farFade * nearFade * sideFade;

          vec3 finalColor = mix(uBgColor, uColor, mask * 0.75);
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      depthWrite: true,
      depthTest: true,
    });

    const floorMesh = new THREE.Mesh(planeGeo, gridMaterial);
    floorMesh.position.set(0, -4.8, -25);
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
