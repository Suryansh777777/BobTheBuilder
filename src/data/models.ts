import { BrickData } from "@/store/useStore";
import { BRICK_HEIGHT } from "@/components/Brick";

// Helper to create a voxel-like brick
const b = (
  x: number,
  y: number,
  z: number,
  color: string,
  type: "1x1" | "1x2" | "2x2" | "2x4" = "1x1",
  rotation: number = 0
): BrickData => ({
  id: "", // Will be generated on load
  type,
  position: [x, y * BRICK_HEIGHT + BRICK_HEIGHT / 2, z],
  rotation,
  color,
});

const createHut = (): BrickData[] => {
  const bricks: BrickData[] = [];
  
  // Floor 7x7
  for (let x = -3; x <= 3; x++) {
    for (let z = -3; z <= 3; z++) {
      bricks.push(b(x, 0, z, "#78350f")); // Wood
    }
  }

  // Walls
  for (let y = 1; y <= 4; y++) {
    for (let x = -3; x <= 3; x++) {
      for (let z = -3; z <= 3; z++) {
        if (x === -3 || x === 3 || z === -3 || z === 3) {
           // Door gap
           if (z === 3 && x === 0 && y < 3) continue;
           bricks.push(b(x, y, z, "#9ca3af")); // Stone
        }
      }
    }
  }

  // Roof
  for (let i = 0; i <= 3; i++) {
      const size = 4 - i; // 4, 3, 2, 1
      const y = 5 + i;
      for(let x = -size; x <= size; x++) {
          for(let z = -size; z <= size; z++) {
             bricks.push(b(x, y, z, "#78350f"));
          }
      }
  }
  
  return bricks;
};

export const MODELS: Record<string, BrickData[]> = {
  HUT: createHut(),
  RUBIK: [
    // Bottom Layer (Green)
    b(-1, 0, -1, "#22c55e"),
    b(0, 0, -1, "#22c55e"),
    b(1, 0, -1, "#22c55e"),
    b(-1, 0, 0, "#22c55e"),
    b(0, 0, 0, "#22c55e"),
    b(1, 0, 0, "#22c55e"),
    b(-1, 0, 1, "#22c55e"),
    b(0, 0, 1, "#22c55e"),
    b(1, 0, 1, "#22c55e"),

    // Middle Layer (Red/Blue/Orange/White/Yellow sides mixed)
    b(-1, 1, -1, "#ef4444"),
    b(0, 1, -1, "#ffffff"),
    b(1, 1, -1, "#f97316"),
    b(-1, 1, 0, "#3b82f6"),
    b(0, 1, 0, "#1f2937"),
    b(1, 1, 0, "#eab308"), // Center is black (core)
    b(-1, 1, 1, "#ef4444"),
    b(0, 1, 1, "#ffffff"),
    b(1, 1, 1, "#f97316"),

    // Top Layer (Blue)
    b(-1, 2, -1, "#3b82f6"),
    b(0, 2, -1, "#3b82f6"),
    b(1, 2, -1, "#3b82f6"),
    b(-1, 2, 0, "#3b82f6"),
    b(0, 2, 0, "#3b82f6"),
    b(1, 2, 0, "#3b82f6"),
    b(-1, 2, 1, "#3b82f6"),
    b(0, 2, 1, "#3b82f6"),
    b(1, 2, 1, "#3b82f6"),
  ],

  EAGLE: [
    // Feet/Branch
    b(0, 0, 0, "#78350f", "2x4", 1), // Branch
    b(0, 1, 0, "#eab308", "1x2", 1), // Feet

    // Body (Feathers)
    b(0, 2, 0, "#78350f", "2x2"),
    b(0, 3, 0, "#78350f", "2x2"),
    b(0, 4, 0, "#78350f", "2x2"),

    // Wings
    b(-1.5, 3, 0, "#78350f", "1x2", 1),
    b(1.5, 3, 0, "#78350f", "1x2", 1),
    b(-2.5, 4, 0, "#78350f", "1x2", 1),
    b(2.5, 4, 0, "#78350f", "1x2", 1),

    // Head
    b(0, 5, 0, "#ffffff", "2x2"),
    b(0, 6, 0, "#ffffff", "2x2"),

    // Beak
    b(0, 5.5, 1.5, "#eab308", "1x1"),
  ],

  RABBIT: [
    // Body
    b(0, 0, 0, "#ffffff", "2x4"),
    b(0, 1, 0, "#ffffff", "2x4"),
    b(0, 2, 0, "#ffffff", "2x2"), // Neck/Head base

    // Head
    b(0, 3, 0.5, "#ffffff", "2x2"),

    // Ears
    b(-0.5, 4, 0.5, "#ec4899", "1x2", 1),
    b(0.5, 4, 0.5, "#ec4899", "1x2", 1),

    // Tail
    b(0, 0.5, -2.5, "#ffffff", "1x1"),

    // Feet
    b(-1, 0, 1, "#ffffff", "1x2"),
    b(1, 0, 1, "#ffffff", "1x2"),
    b(-1, 0, -1, "#ffffff", "1x2"),
    b(1, 0, -1, "#ffffff", "1x2"),
  ],

  CASTLE: [
    // Base
    b(0, 0, 0, "#9ca3af", "2x4"),
    b(2, 0, 0, "#9ca3af", "2x4"),
    b(-2, 0, 0, "#9ca3af", "2x4"),
    b(0, 0, 2, "#9ca3af", "2x4", 1),
    b(0, 0, -2, "#9ca3af", "2x4", 1),

    // Walls
    b(3, 1, 0, "#9ca3af", "1x2"),
    b(-3, 1, 0, "#9ca3af", "1x2"),
    b(0, 1, 3, "#9ca3af", "1x2", 1),
    b(0, 1, -3, "#9ca3af", "1x2", 1),

    // Towers
    b(3.5, 0, 3.5, "#1f2937", "2x2"),
    b(3.5, 1, 3.5, "#1f2937", "2x2"),
    b(3.5, 2, 3.5, "#1f2937", "2x2"),
    b(-3.5, 0, 3.5, "#1f2937", "2x2"),
    b(-3.5, 1, 3.5, "#1f2937", "2x2"),
    b(-3.5, 2, 3.5, "#1f2937", "2x2"),
    b(3.5, 0, -3.5, "#1f2937", "2x2"),
    b(3.5, 1, -3.5, "#1f2937", "2x2"),
    b(3.5, 2, -3.5, "#1f2937", "2x2"),
    b(-3.5, 0, -3.5, "#1f2937", "2x2"),
    b(-3.5, 1, -3.5, "#1f2937", "2x2"),
    b(-3.5, 2, -3.5, "#1f2937", "2x2"),

    // Keep
    b(0, 1, 0, "#9ca3af", "2x2"),
    b(0, 2, 0, "#9ca3af", "2x2"),
    b(0, 3, 0, "#9ca3af", "2x2"),
    // Flag
    b(0, 4, 0, "#ef4444", "1x1"),
  ],
};
