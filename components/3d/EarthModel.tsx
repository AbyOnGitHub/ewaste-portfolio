'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Project } from '@/types/project';
import { ProjectNode } from './ProjectNode';
import { latLngToVector3 } from './FibonacciSphere';

interface EarthModelProps {
  projects: Project[];
  selectedProject: Project | null;
  onSelectProject: (project: Project, pos: [number, number, number]) => void;
  isAutoRotate?: boolean;
}

export function EarthModel({
  projects,
  selectedProject,
  onSelectProject,
  isAutoRotate = true,
}: EarthModelProps) {
  const earthRef = useRef<THREE.Group>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const radius = 2; // Earth sphere radius

  // Slow ambient rotation of the Earth when not interacted with
  useFrame((_, delta) => {
    if (earthRef.current && isAutoRotate && !selectedProject) {
      earthRef.current.rotation.y += delta * 0.12;
    }
    if (cloudsRef.current && isAutoRotate) {
      cloudsRef.current.rotation.y += delta * 0.02;
    }
  });

  // Calculate project positions on Earth surface
  const nodePositions = useMemo(() => {
    return projects.map((p) => {
      const pos = latLngToVector3(p.location.lat, p.location.lng, radius * 1.01);
      return { project: p, position: pos };
    });
  }, [projects, radius]);

  // Safe async texture loading with fallbacks
  const [colorMap, setColorMap] = useState<THREE.Texture | null>(null);
  const [normalMap, setNormalMap] = useState<THREE.Texture | null>(null);
  const [specularMap, setSpecularMap] = useState<THREE.Texture | null>(null);
  const [cloudsMap, setCloudsMap] = useState<THREE.Texture | null>(null);
  const [nightMap, setNightMap] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let mounted = true;
    const loader = new THREE.TextureLoader();

    // Prefer local public textures if available (place files under public/textures/earth/)
    const urls = {
      colorLocal: '/textures/earth/earthmap.jpg',
      normalLocal: '/textures/earth/earth_normal.jpg',
      specularLocal: '/textures/earth/earth_specular.jpg',
      cloudsLocal: '/textures/earth/earth_clouds.png',
      nightLocal: '/textures/earth/earth_night.jpg',
      // Remote fallbacks
      color:
        'https://raw.githubusercontent.com/creativetimofficial/public-assets/master/threejs/earth/earthmap4k.jpg',
      normal:
        'https://raw.githubusercontent.com/creativetimofficial/public-assets/master/threejs/earth/earth_normal_map.jpg',
      specular:
        'https://raw.githubusercontent.com/creativetimofficial/public-assets/master/threejs/earth/earth_specular_map.jpg',
      clouds:
        'https://raw.githubusercontent.com/creativetimofficial/public-assets/master/threejs/earth/earth_clouds.png',
      night:
        'https://raw.githubusercontent.com/creativetimofficial/public-assets/master/threejs/earth/earth_nightmap4k.jpg',
    };

    const load = async (url: string) => {
      try {
        const tex = await loader.loadAsync(url);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.anisotropy = 8;
        return tex;
      } catch (err) {
        return null;
      }
    };

    // Helper: try local path first, else remote fallback
    const tryLoadPair = async (localPath: string | undefined, remoteUrl: string) => {
      if (localPath) {
        try {
          const res = await fetch(localPath, { method: 'HEAD' });
          if (res.ok) return await load(localPath);
        } catch (e) {
          // ignore and fall back
        }
      }
      return await load(remoteUrl);
    };

    (async () => {
      const [c, n, s, cl, ni] = await Promise.all([
        tryLoadPair(urls.colorLocal, urls.color),
        tryLoadPair(urls.normalLocal, urls.normal),
        tryLoadPair(urls.specularLocal, urls.specular),
        tryLoadPair(urls.cloudsLocal, urls.clouds),
        // night map optional; try local only for now
        tryLoadPair(urls.nightLocal, urls.night),
      ]);

      if (!mounted) return;

      // Fallback: if color map missing, create a simple canvas texture
      if (!c) {
        const canvas = document.createElement('canvas');
        canvas.width = 2048;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const grad = ctx.createLinearGradient(0, 0, 0, 1024);
          grad.addColorStop(0, '#041d16');
          grad.addColorStop(0.5, '#072e23');
          grad.addColorStop(1, '#051812');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        const fallback = new THREE.CanvasTexture(canvas);
        fallback.wrapS = THREE.RepeatWrapping;
        fallback.wrapT = THREE.RepeatWrapping;
        setColorMap(fallback);
      } else setColorMap(c);

      setNormalMap(n);
      setSpecularMap(s);
      setCloudsMap(cl);
      setNightMap(ni);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <group ref={earthRef}>
      {/* Primary Earth Sphere */}
      {/* Earth body with color + normal + emissive (night lights) + specular influence */}
      <mesh receiveShadow castShadow>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
          roughness={0.9}
          metalness={0.05}
          // use emissive map for night lights, subtle intensity
          emissiveMap={nightMap}
          emissiveIntensity={0.35}
          // slight tint to blend materials
          color="#ffffff"
        />
      </mesh>

      {/* Optional subtle wire overlay preserved for style */}
      <mesh>
        <sphereGeometry args={[radius * 1.002, 32, 32]} />
        <meshBasicMaterial
          color="#4C7C59"
          wireframe
          transparent
          opacity={0.06}
        />
      </mesh>

      {/* Atmospheric Shell: subtle fresnel-like glow using back-side material */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[radius * 1.12, 48, 48]} />
        <meshBasicMaterial
          color="#0E7490"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer Mint Glow Ring (tonal) */}
      <mesh>
        <sphereGeometry args={[radius * 1.06, 36, 36]} />
        <meshBasicMaterial
          color="#A7F3D0"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Cloud layer (transparent texture slightly above surface) */}
      <mesh ref={cloudsRef} position={[0, 0, 0]}> 
        <sphereGeometry args={[radius * 1.01, 64, 64]} />
        <meshPhongMaterial
          map={cloudsMap}
          transparent
          opacity={0.45}
          depthWrite={false}
          shininess={12}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Project Nodes pinned on Earth surface */}
      {nodePositions.map(({ project, position }) => (
        <ProjectNode
          key={project.slug}
          project={project}
          position={position}
          isSelected={selectedProject?.slug === project.slug}
          onSelect={onSelectProject}
        />
      ))}
    </group>
  );
}
