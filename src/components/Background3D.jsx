'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Background3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Transparent Scene (Canvas 100% transparente para usar o fundo CSS nativo sem cortes)
    const scene = new THREE.Scene();
    scene.background = null;

    // 2. Camera — Vista elevada para o horizonte
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 7.5, 22);
    camera.lookAt(0, -1.5, -20);

    // 3. WebGL Renderer com Fundo 100% Transparente
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 4. Plano do Chão (Geometria 600x600)
    const planeGeo = new THREE.PlaneGeometry(600, 600, 1, 1);
    planeGeo.rotateX(-Math.PI / 2);

    // 5. Shader GPU que desenha APENAS as linhas (o resto é 100% transparente)
    const gridMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      extensions: {
        derivatives: true,
      },
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: 0.35 },
        uCellSize: { value: 5.0 },
        uLineWidth: { value: 0.85 },
        uColor: { value: new THREE.Color(0xb5b5b5) },
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

        float fade(float val, float startFade, float endFade) {
          float t = clamp((endFade - val) / (endFade - startFade), 0.0, 1.0);
          return t * t * (3.0 - 2.0 * t);
        }

        void main() {
          vec2 coord = vWorldPosition.xz / uCellSize;
          coord.y -= uTime * uSpeed;

          // Cálculo das linhas do piso com anti-aliasing
          vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
          float line = min(grid.x, grid.y);
          float lineAlpha = 1.0 - min(line / uLineWidth, 1.0);

          // Se não for uma linha, descarta imediatamente o pixel
          if (lineAlpha <= 0.005) {
            discard;
          }

          // Dissolução para evitar aglomeração de linhas no horizonte
          float lineDensity = max(fwidth(coord).x, fwidth(coord).y);
          float densityFade = 1.0 - smoothstep(0.12, 0.45, lineDensity);

          // Dissolução suave lateral
          float sideFade = fade(abs(vWorldPosition.x), 15.0, 50.0);

          // Dissolução suave no horizonte — desaparece antes do texto
          float farFade = fade(-vWorldPosition.z, 0.0, 42.0);

          // Dissolução suave perto da câmara
          float nearFade = fade(vWorldPosition.z, -5.0, 14.0);

          float alpha = lineAlpha * densityFade * sideFade * farFade * nearFade * 0.40;

          if (alpha <= 0.005) {
            discard;
          }

          // Desenha unicamente a linha com transparência suave sobre o fundo do site
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
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
