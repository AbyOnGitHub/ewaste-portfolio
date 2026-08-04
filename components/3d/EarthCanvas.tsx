'use client';

import React, { useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import gsap from 'gsap';
import { Project } from '@/types/project';
import { EarthModel } from './EarthModel';

interface EarthCanvasProps {
  projects: Project[];
  selectedProject: Project | null;
  onSelectProject: (project: Project, pos: [number, number, number]) => void;
}

// Camera controller component to handle GSAP smooth zoom to selected nodes
function CameraController({
  selectedPos,
}: {
  selectedPos: [number, number, number] | null;
}) {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  useEffect(() => {
    if (selectedPos && controlsRef.current) {
      const [x, y, z] = selectedPos;
      // Calculate target camera vector slightly offset outside node
      const targetVec = new THREE.Vector3(x, y, z).multiplyScalar(2.2);

      gsap.to(camera.position, {
        x: targetVec.x,
        y: targetVec.y,
        z: targetVec.z,
        duration: 1.8,
        ease: 'power3.inOut',
        onUpdate: () => {
          camera.lookAt(0, 0, 0);
          controlsRef.current?.update();
        },
      });
    } else if (controlsRef.current) {
      // Reset camera to default position
      gsap.to(camera.position, {
        x: 0,
        y: 1,
        z: 5.2,
        duration: 1.5,
        ease: 'power2.out',
        onUpdate: () => {
          camera.lookAt(0, 0, 0);
          controlsRef.current?.update();
        },
      });
    }
  }, [selectedPos, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableZoom={true}
      minDistance={3.2}
      maxDistance={8}
      dampingFactor={0.05}
      rotateSpeed={0.8}
    />
  );
}

export function EarthCanvas({
  projects,
  selectedProject,
  onSelectProject,
}: EarthCanvasProps) {
  const [selectedPos, setSelectedPos] = React.useState<[number, number, number] | null>(null);

  const handleSelect = (project: Project, pos: [number, number, number]) => {
    setSelectedPos(pos);
    onSelectProject(project, pos);
  };

  useEffect(() => {
    if (!selectedProject) {
      setSelectedPos(null);
    }
  }, [selectedProject]);

  return (
    <div className="relative w-full h-full min-h-[500px]">
      <Canvas
        camera={{ position: [0, 1, 5.2], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        className="w-full h-full touch-none"
      >
        {/* Ambient & Directional Lighting setup */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#F5F3EA" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#0E7490" />
        <pointLight position={[0, 0, 10]} intensity={0.8} color="#A7F3D0" />

        {/* Ambient star particle field */}
        <Stars radius={100} depth={50} count={2500} factor={4} saturation={0} fade speed={1} />

        {/* Earth 3D Mesh */}
        <EarthModel
          projects={projects}
          selectedProject={selectedProject}
          onSelectProject={handleSelect}
          isAutoRotate={!selectedProject}
        />

        {/* Camera Control Controller */}
        <CameraController selectedPos={selectedPos} />
      </Canvas>

      {/* Interactive Helper Overlay hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none z-10 bg-[#0b2b20]/80 backdrop-blur-md px-4 py-2 rounded-full border border-[#87A96B]/30 text-xs text-[#cream-muted] flex items-center gap-2 shadow-lg">
        <span className="w-2 h-2 rounded-full bg-[#A7F3D0] animate-ping" />
        <span>Drag globe to explore • Click glowing nodes to open assignment</span>
      </div>
    </div>
  );
}
