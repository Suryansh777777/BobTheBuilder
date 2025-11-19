import React, { useState, useRef, useCallback, useEffect } from "react";
import { Canvas, ThreeEvent } from "@react-three/fiber";
import {
  OrbitControls,
  Grid,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import { useStore, BrickData, BrickType } from "@/store/useStore";
import { Brick, BRICK_HEIGHT, BRICK_DIMENSIONS } from "./Brick";
import * as THREE from "three";

const SceneContent = () => {
  const {
    bricks,
    addBrick,
    removeBrick,
    selectBrick,
    selectedBrickType,
    selectedColor,
    selectedTool,
    selectedBrickId,
    setColor,
    showGrid,
    showShadows,
    isExploded, // Get exploded state
    darkMode, // Get dark mode state
  } = useStore();

  const [ghostPosition, setGhostPosition] = useState<
    [number, number, number] | null
  >(null);
  const [ghostRotation, setGhostRotation] = useState(0);

  const { width, depth } = BRICK_DIMENSIONS[selectedBrickType];

  // Helper to snap position to grid
  const snapToGrid = (val: number, size: number) => {
    return size % 2 === 0 ? Math.round(val - 0.5) + 0.5 : Math.round(val);
  };

  const handlePointerMove = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      if (isExploded) return; // Disable placement during explosion

      e.stopPropagation();
      if (selectedTool !== "add") {
        setGhostPosition(null);
        return;
      }

      // Calculate rotation based on current ghost rotation
      const currentRotation = 0;

      if (e.object.userData.isFloor) {
        // Raycast to floor
        const x = snapToGrid(e.point.x, width);
        const z = snapToGrid(e.point.z, depth);
        setGhostPosition([x, BRICK_HEIGHT / 2, z]);
      } else {
        // Raycast to another brick
        // Get the normal of the face we hit
        if (!e.face) return;

        const normal = e.face.normal.clone();
        // Transform normal to world space to account for rotation
        normal.transformDirection(e.object.matrixWorld);

        const point = e.point;

        // If top face (y > 0.5) - using a threshold to account for float errors
        if (normal.y > 0.9) {
          const x = snapToGrid(point.x, width);
          const z = snapToGrid(point.z, depth);

          // Stack on top
          const brickGroup = e.object.parent;
          if (brickGroup) {
            const brickPos = brickGroup.position;
            const y = brickPos.y + BRICK_HEIGHT;
            setGhostPosition([x, y, z]);
          }
        } else {
          // Side placement
          let x = point.x;
          let z = point.z;

          // Shift by half the dimension in the direction of the normal
          if (Math.abs(normal.x) > 0.9) {
            x += normal.x * (width / 2);
          }
          if (Math.abs(normal.z) > 0.9) {
            z += normal.z * (depth / 2);
          }

          x = snapToGrid(x, width);
          z = snapToGrid(z, depth);

          const brickGroup = e.object.parent;
          if (brickGroup) {
            const y = brickGroup.position.y;
            setGhostPosition([x, y, z]);
          }
        }
      }
    },
    [selectedTool, selectedBrickType, width, depth, isExploded]
  );

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      if (isExploded) return; // Disable interactions during explosion

      e.stopPropagation();

      if (selectedTool === "add" && ghostPosition) {
        addBrick({
          type: selectedBrickType,
          position: ghostPosition,
          rotation: 0, // TODO: Allow rotation
          color: selectedColor,
        });
      } else if (selectedTool === "select") {
        // If we clicked a brick (handled in Brick component usually, but we can do it here via bubbling)
        // If we clicked floor, deselect
        if (e.object.userData.isFloor) {
          selectBrick(null);
        }
      }
    },
    [
      selectedTool,
      ghostPosition,
      selectedBrickType,
      selectedColor,
      addBrick,
      selectBrick,
      isExploded,
    ]
  );

  const handleBrickClick = (e: ThreeEvent<MouseEvent>, brick: BrickData) => {
    if (isExploded) return;

    e.stopPropagation();
    if (selectedTool === "erase") {
      removeBrick(brick.id);
    } else if (selectedTool === "paint") {
      setColor(selectedColor); // This updates the selected color in store, but we want to paint the brick
      // Wait, `setColor` in store updates `selectedColor`.
      // We need an action to update a specific brick's color.
      // The store has `updateBrick`.
      useStore.getState().updateBrick(brick.id, { color: selectedColor });
    } else if (selectedTool === "select") {
      selectBrick(brick.id);
    } else if (selectedTool === "add") {
      // If we click a brick in add mode, we place a new brick (handled by handleClick via bubbling? No, stopPropagation)
      // We need to manually trigger the add logic here if we want to stack on click
      if (ghostPosition) {
        addBrick({
          type: selectedBrickType,
          position: ghostPosition,
          rotation: 0,
          color: selectedColor,
        });
      }
    }
  };

  return (
    <Physics gravity={[0, -15, 0]}>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <Environment preset="city" />

      {showShadows && !isExploded && (
        <ContactShadows
          position={[0, 0, 0]}
          opacity={darkMode ? 0.4 : 0.6}
          scale={100}
          blur={darkMode ? 2 : 2.5}
          far={50}
          resolution={1024}
          color="#000000"
        />
      )}

      {showGrid && (
        <Grid
          infiniteGrid
          fadeDistance={30}
          sectionColor={darkMode ? "#444" : "#94a3b8"}
          cellColor={darkMode ? "#888" : "#cbd5e1"}
        />
      )}

      {/* Floor Plane for Raycasting */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        userData={{ isFloor: true }}
        onPointerMove={handlePointerMove}
        onClick={handleClick}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {/* Invisible Floor for Physics */}
      {isExploded && (
        <RigidBody type="fixed" position={[0, -0.5, 0]} friction={0.5}>
          <mesh>
            <boxGeometry args={[100, 1, 100]} />
            <meshBasicMaterial visible={false} />
          </mesh>
        </RigidBody>
      )}

      {/* Placed Bricks */}
      {bricks.map((brick) => (
        <Brick
          key={brick.id}
          {...brick}
          isSelected={selectedBrickId === brick.id}
          isExploded={isExploded}
          onClick={(e) => handleBrickClick(e, brick)}
          onPointerMove={handlePointerMove}
        />
      ))}

      {/* Ghost Brick */}
      {selectedTool === "add" && ghostPosition && !isExploded && (
        <Brick
          type={selectedBrickType}
          position={ghostPosition}
          rotation={0}
          color={selectedColor}
          isGhost
        />
      )}

      <OrbitControls makeDefault />
    </Physics>
  );
};

export const Scene = () => {
  const { darkMode } = useStore();
  return (
    <div className="w-full h-full bg-transparent">
      <Canvas shadows camera={{ position: [8, 8, 8], fov: 45 }}>
        <color attach="background" args={[darkMode ? "#0f172a" : "#f1f5f9"]} />
        <SceneContent />
        <fog attach="fog" args={[darkMode ? "#0f172a" : "#f1f5f9", 10, 40]} />
      </Canvas>
    </div>
  );
};
