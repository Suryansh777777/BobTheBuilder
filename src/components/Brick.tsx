import React, { useMemo, useRef, useEffect } from "react";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { BrickType } from "@/store/useStore";
import * as THREE from "three";
import { RigidBody, RapierRigidBody, CuboidCollider } from "@react-three/rapier";

interface BrickProps {
  id?: string;
  type: BrickType;
  position: [number, number, number];
  rotation: number; // 0, 1, 2, 3
  color: string;
  isGhost?: boolean;
  isSelected?: boolean;
  isExploded?: boolean; // New prop
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

const BrickMesh: React.FC<Omit<BrickProps, "id" | "isExploded">> = ({
  type,
  rotation,
  color,
  isGhost,
  isSelected,
  onClick,
  onPointerMove,
  onPointerOut,
}) => {
  const { width, depth } = BRICK_DIMENSIONS[type];
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

  // Adjust rotation for visual mesh only if it's NOT handled by RigidBody parent
  // But here we assume this mesh is inside a group or RigidBody that handles position/rotation.
  // Wait, if we are in a RigidBody, the RigidBody handles the transform.
  // If we are static, we need to apply rotation here.

  return (
    <group
      onClick={onClick}
      onPointerMove={onPointerMove}
      onPointerOut={onPointerOut}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, BRICK_HEIGHT, depth]} />
        <meshStandardMaterial
          color={color}
          transparent={isGhost}
          opacity={isGhost ? 0.5 : 1}
          emissive={isSelected ? "#444" : "#000"}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

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
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>
      ))}

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

export const Brick: React.FC<BrickProps> = ({
  id,
  type,
  position,
  rotation,
  color,
  isGhost = false,
  isSelected = false,
  isExploded = false,
  onClick,
  onPointerMove,
  onPointerOut,
}) => {
  const { width, depth } = BRICK_DIMENSIONS[type];
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  
  // Calculate initial rotation in radians
  const rotationRadians = (rotation * Math.PI) / 2;
  const quaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotationRadians);

  // Effect to apply explosion impulse
  useEffect(() => {
    if (isExploded && rigidBodyRef.current) {
        // Random impulse direction mostly upwards
        const angle = Math.random() * Math.PI * 2;
        const force = 10 + Math.random() * 20; // Much bigger force
        const impulse = {
            x: Math.cos(angle) * force,
            y: 15 + Math.random() * 15, // Much higher upward pop
            z: Math.sin(angle) * force
        };
        const torque = {
             x: (Math.random() - 0.5) * 10,
             y: (Math.random() - 0.5) * 20,
             z: (Math.random() - 0.5) * 10
        };
        
        rigidBodyRef.current.applyImpulse(impulse, true);
        rigidBodyRef.current.applyTorqueImpulse(torque, true);
        rigidBodyRef.current.setLinearDamping(0.1); // Less damping for more chaos
        rigidBodyRef.current.setAngularDamping(0.1);
    } else if (!isExploded && rigidBodyRef.current) {
        // Reset logic handled by parent or key prop change usually
        // But if we stay mounted, we need to reset.
        // Actually, if !isExploded, we are usually creating a new static instance or resetting this one.
        // We'll handle position reset via key/remount in Scene.tsx or kinematic translation.
        // For now, let's trust the Scene to handle the "Rebuild" by remounting or switching mode.
    }
  }, [isExploded]);

  // Rebuild Animation Logic (Simple Lerp)
  // If we are transitioning from Exploded -> Static, we might want to animate.
  // But for now, let's just snap back or let the user click "Rebuild" which resets state.

  if (isExploded) {
    return (
      <RigidBody
        ref={rigidBodyRef}
        position={position}
        rotation={[0, rotationRadians, 0]}
        colliders="cuboid"
        type="dynamic"
        restitution={0.5}
        friction={0.5}
      >
        {/* We use a slightly smaller collider to avoid initial overlapping issues if bricks are tight */}
        <CuboidCollider args={[width / 2 - 0.05, BRICK_HEIGHT / 2 - 0.05, depth / 2 - 0.05]} />
        <BrickMesh
          type={type}
          position={[0, 0, 0]}
          rotation={0} // Rotation handled by RigidBody
          color={color}
        />
      </RigidBody>
    );
  }

  return (
    <group position={position} rotation={[0, rotationRadians, 0]}>
       <BrickMesh
        type={type}
        position={[0, 0, 0]}
        rotation={0}
        color={color}
        isGhost={isGhost}
        isSelected={isSelected}
        onClick={onClick}
        onPointerMove={onPointerMove}
        onPointerOut={onPointerOut}
       />
    </group>
  );
};
