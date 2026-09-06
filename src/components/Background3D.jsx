'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Background3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Deep Dark Background with Seamless Atmospheric Horizon Fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0c0c);
    scene.fog = new THREE.FogExp2(0x0c0c0c, 0.02);

    // 2. Camera — Looking across the digital floor from a clean vantage point
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 7.5, 22);
    camera.lookAt(0, -1.5, -20);

    // 3. High-Quality WebGL Renderer (Sem flickering / anti-aliased)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 4. Subtle Lighting
    const ambientLight = new THREE.AmbientLight(0x333333, 2.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(0, 25, 20);
    scene.add(dirLight);

    // 5. True Architectural Floor Grid (Piso Reto e Nivelado no Chão)
    const gridGroup = new THREE.Group();
    // Piso horizontal nivelado, a começar a meio e a recuar para o horizonte
    gridGroup.position.set(0, -4.8, -12);
    gridGroup.rotation.set(0, 0, 0); // Perfeitamente nivelado como um piso real
    scene.add(gridGroup);

    // Dimensões do piso — lajes amplas e espaçadas ("menos quadrados")
    const floorWidth = 140;
    const floorLength = 160;
    const step = 5.0; // Tamanho ideal de lajes de piso espaçoso
    const halfW = floorWidth / 2;
    const halfL = floorLength / 2;

    // Função smoothstep matemática
    const smoothstep = (min, max, value) => {
      const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
      return x * x * (3 - 2 * x);
    };

    const vertices = [];
    const colors = [];
    const bgR = 12 / 255;  // #0c0c0c
    const bgG = 12 / 255;
    const bgB = 12 / 255;
    const fgR = 0.70;      // Cinza claro elegante
    const fgG = 0.70;
    const fgB = 0.70;

    // Cálculo do desvanecimento suave nas 4 direções para NUNCA se ver nenhuma borda/limite
    const calcFade = (x, z) => {
      const fadeX = smoothstep(halfW, halfW - 25, Math.abs(x));
      const fadeNear = smoothstep(halfL, halfL - 32, z);
      const fadeFar = smoothstep(-halfL, -halfL + 35, z);
      return fadeX * fadeNear * fadeFar;
    };

    const pushVertex = (x, y, z) => {
      vertices.push(x, y, z);
      const alpha = calcFade(x, z);
      // O vértice funde-se perfeitamente com a cor de fundo (#0c0c0c) nas bordas
      colors.push(
        bgR + (fgR - bgR) * alpha,
        bgG + (fgG - bgG) * alpha,
        bgB + (fgB - bgB) * alpha
      );
    };

    // Subdivisão dos segmentos de linha para que a transição de cor seja ultra-suave
    const subStep = step;

    // A. Linhas longitudinais (eixo Z - perspetiva)
    for (let x = -halfW; x <= halfW + 0.001; x += step) {
      for (let z = -halfL; z < halfL - 0.001; z += subStep) {
        const nextZ = Math.min(halfL, z + subStep);
        pushVertex(x, 0, z);
        pushVertex(x, 0, nextZ);
      }
    }

    // B. Linhas transversais (eixo X - lajes)
    for (let z = -halfL; z <= halfL + 0.001; z += step) {
      for (let x = -halfW; x < halfW - 0.001; x += subStep) {
        const nextX = Math.min(halfW, x + subStep);
        pushVertex(x, 0, z);
        pushVertex(nextX, 0, z);
      }
    }

    const gridGeo = new THREE.BufferGeometry();
    gridGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    gridGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    // Material de linha nativo Three.js — 100% livre de flickering ("zero piscar")
    const gridMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
    });
    const gridMesh = new THREE.LineSegments(gridGeo, gridMat);
    gridGroup.add(gridMesh);

    // 6. Smooth Autonomous Forward Glide Animation Loop
    let animationFrameId;
    const startTime = performance.now();

    const animate = () => {
      const elapsedTime = (performance.now() - startTime) * 0.001;
      const speed = 1.6;
      // Deslize infinito impercetível dentro da zona invisível nas bordas
      gridMesh.position.z = (elapsedTime * speed) % step;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    // 7. Responsive Handling
    const handleResize = () => {
      if (!container) return;
      const w = window.innerWidth;
      const h = window.innerHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);

      gridGroup.position.set(0, -4.8, -12);
      gridGroup.scale.setScalar(w < 768 ? 0.75 : 1);
    };
    window.addEventListener('resize', handleResize);

    // 8. Proper Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      gridGeo.dispose();
      gridMat.dispose();
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
