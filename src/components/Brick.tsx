import React, { useMemo } from "react";
import { ThreeEvent } from "@react-three/fiber";
import { BrickType } from "@/store/useStore";
import * as THREE from "three";

interface BrickProps {
  id?: string;
  type: BrickType;
  position: [number, number, number];
  rotation: number; // 0, 1, 2, 3
  color: string;
  isGhost?: boolean;
  isSelected?: boolean;
  onClick?: (e: ThreeEvent<MouseEvent>) => void;
  onPointerMove?: (e: ThreeEvent<MouseEvent>) => void;
  onPointerOut?: (e: ThreeEvent<MouseEvent>) => void;
}

export const BRICK_DIMENSIONS: Record<
  BrickType,
  { width: number; depth: number }
> = {
  "1x1": { width: 1, depth: 1 },
  "1x2": { width: 1, depth: 2 },
  "2x2": { width: 2, depth: 2 },
  "2x4": { width: 2, depth: 4 },
};

export const BRICK_HEIGHT = 1.2;
export const STUD_HEIGHT = 0.2;
export const STUD_RADIUS = 0.3;

export const Brick: React.FC<BrickProps> = ({
  id,
  type,
  position,
  rotation,
  color,
  isGhost = false,
  isSelected = false,
  onClick,
  onPointerMove,
  onPointerOut,
  ...props
}) => {
  const { width, depth } = BRICK_DIMENSIONS[type];

  // Create geometry for studs
  const studs = useMemo(() => {
    const studArray = [];
    for (let x = 0; x < width; x++) {
      for (let z = 0; z < depth; z++) {
        studArray.push({
          position: [
            x - width / 2 + 0.5,
            BRICK_HEIGHT / 2 + STUD_HEIGHT / 2,
            z - depth / 2 + 0.5,
          ] as [number, number, number],
        });
      }
    }
    return studArray;
  }, [width, depth]);

  // Adjust rotation
  const rotationRadians = (rotation * Math.PI) / 2;

  return (
    <group
      position={position}
      rotation={[0, rotationRadians, 0]}
      onClick={onClick}
      onPointerMove={onPointerMove}
      onPointerOut={onPointerOut}
      {...props}
    >
      {/* Main Brick Body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, BRICK_HEIGHT, depth]} />
        <meshStandardMaterial
          color={color}
          transparent={isGhost}
          opacity={isGhost ? 0.5 : 1}
          emissive={isSelected ? "#444" : "#000"}
        />
      </mesh>

      {/* Studs */}
      {studs.map((stud, i) => (
        <mesh key={i} position={stud.position} castShadow receiveShadow>
          <cylinderGeometry
            args={[STUD_RADIUS, STUD_RADIUS, STUD_HEIGHT, 16]}
          />
          <meshStandardMaterial
            color={color}
            transparent={isGhost}
            opacity={isGhost ? 0.5 : 1}
            emissive={isSelected ? "#444" : "#000"}
          />
        </mesh>
      ))}

      {/* Selection Outline (optional, but good for UX) */}
      {isSelected && (
        <lineSegments>
          <edgesGeometry
            args={[new THREE.BoxGeometry(width, BRICK_HEIGHT, depth)]}
          />
          <lineBasicMaterial color="white" />
        </lineSegments>
      )}
    </group>
  );
};
