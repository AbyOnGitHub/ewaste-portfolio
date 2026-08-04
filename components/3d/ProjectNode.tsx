'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Project } from '@/types/project';
import { FileText, Image as ImageIcon, Video, Award, Code, Compass } from 'lucide-react';

interface ProjectNodeProps {
  project: Project;
  position: [number, number, number];
  onSelect: (project: Project, position: [number, number, number]) => void;
  isSelected?: boolean;
}

export function ProjectNode({ project, position, onSelect, isSelected }: ProjectNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Pulse animation on node ring
  useFrame(({ clock }) => {
    if (ringRef.current) {
      const t = clock.getElapsedTime();
      const scale = 1 + Math.sin(t * 4) * 0.25;
      ringRef.current.scale.set(scale, scale, scale);
    }
  });

  // Color mapping based on project category
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Poster':
        return '#A7F3D0'; // Mint
      case 'PDF & Research':
        return '#38bdf8'; // Sky Teal
      case 'Prototype':
        return '#D4A373'; // Amber Gold
      case 'Video & Reel':
        return '#f472b6'; // Vibrant Pink/Rose
      case 'Certificate':
        return '#facc15'; // Yellow
      default:
        return '#87A96B'; // Sage
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Poster':
        return <ImageIcon className="w-3.5 h-3.5 text-[#A7F3D0]" />;
      case 'PDF & Research':
        return <FileText className="w-3.5 h-3.5 text-sky-400" />;
      case 'Prototype':
        return <Code className="w-3.5 h-3.5 text-[#D4A373]" />;
      case 'Video & Reel':
        return <Video className="w-3.5 h-3.5 text-pink-400" />;
      case 'Certificate':
        return <Award className="w-3.5 h-3.5 text-yellow-400" />;
      default:
        return <Compass className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  const color = getCategoryColor(project.category);

  return (
    <group position={position}>
      {/* Outer pulsing ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[0.07, 0.1, 16]} />
        <meshBasicMaterial
          color={color}
          side={THREE.DoubleSide}
          transparent
          opacity={hovered || isSelected ? 0.9 : 0.4}
        />
      </mesh>

      {/* Core glowing node mesh */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(project, position);
        }}
      >
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered || isSelected ? 2.5 : 1.2}
          roughness={0.2}
        />
      </mesh>

      {/* Hover & Selection Floating Label Overlay */}
      {(hovered || isSelected) && (
        <Html
          position={[0, 0.18, 0]}
          center
          distanceFactor={8}
          className="pointer-events-none select-none transition-all duration-300 transform scale-100"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0b2b20]/90 backdrop-blur-md border border-[#87A96B]/40 shadow-xl whitespace-nowrap text-xs font-medium text-[#F5F3EA]">
            {getCategoryIcon(project.category)}
            <span>{project.title}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-950/80 text-[#A7F3D0] border border-[#A7F3D0]/30">
              {project.category}
            </span>
          </div>
        </Html>
      )}
    </group>
  );
}
