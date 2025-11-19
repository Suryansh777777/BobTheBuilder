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
    for (let x = -size; x <= size; x++) {
      for (let z = -size; z <= size; z++) {
        bricks.push(b(x, y, z, "#78350f"));
      }
    }
  }

  return bricks;
};

const createLighthouse = (): BrickData[] => {
  const bricks: BrickData[] = [];
  const RED = "#ef4444";
  const WHITE = "#f3f4f6";
  const GLASS = "#93c5fd"; // Light blue
  const STONE = "#4b5563";

  // Base Foundation (Stone) - 5x5 area
  for (let x = -2; x <= 2; x++) {
    for (let z = -2; z <= 2; z++) {
      bricks.push(b(x, 0, z, STONE));
    }
  }

  // The Tower (Striped) - Height 1 to 12
  for (let y = 1; y <= 12; y++) {
    const color = Math.floor((y - 1) / 2) % 2 === 0 ? WHITE : RED; // Alternating bands of 2

    // Create a hollow 3x3 square
    for (let x = -1; x <= 1; x++) {
      for (let z = -1; z <= 1; z++) {
        // Fill corners and edges, leave center empty for a "ladder" feel if you wanted
        bricks.push(b(x, y, z, color));
      }
    }
  }

  // The Walkway (Balcony) at top
  for (let x = -2; x <= 2; x++) {
    for (let z = -2; z <= 2; z++) {
      if (x === -2 || x === 2 || z === -2 || z === 2) {
        bricks.push(b(x, 13, z, STONE, "1x1")); // Railing base
      }
    }
  }

  // The Lantern Room (Glass)
  bricks.push(b(0, 13, 0, "#facc15", "2x2")); // The Light source (Yellow) inside

  // Glass walls around light
  bricks.push(b(1, 13, 0, GLASS));
  bricks.push(b(-1, 13, 0, GLASS));
  bricks.push(b(0, 13, 1, GLASS));
  bricks.push(b(0, 13, -1, GLASS));
  bricks.push(b(1, 13, 1, GLASS)); // Corners
  bricks.push(b(-1, 13, -1, GLASS));
  bricks.push(b(1, 13, -1, GLASS));
  bricks.push(b(-1, 13, 1, GLASS));

  // Roof (Cone-ish)
  bricks.push(b(0, 14, 0, STONE, "2x2"));
  bricks.push(b(0, 15, 0, STONE, "1x1"));

  return bricks;
};

//  Generates a layered tree
const createPineTree = (): BrickData[] => {
  const bricks: BrickData[] = [];
  const WOOD = "#451a03";
  const LEAF_DARK = "#14532d";
  const LEAF_LIGHT = "#16a34a";

  // Trunk
  for (let y = 0; y < 4; y++) {
    bricks.push(b(0, y, 0, WOOD, "2x2"));
  }

  // Layers of leaves (Wide to Narrow)
  const layers = [
    { y: 4, size: 3, color: LEAF_DARK },
    { y: 5, size: 3, color: LEAF_DARK },
    { y: 6, size: 2, color: LEAF_LIGHT },
    { y: 7, size: 2, color: LEAF_LIGHT },
    { y: 8, size: 1, color: LEAF_DARK },
    { y: 9, size: 1, color: LEAF_LIGHT },
  ];

  layers.forEach((layer) => {
    for (let x = -layer.size; x <= layer.size; x++) {
      for (let z = -layer.size; z <= layer.size; z++) {
        // Circle approximation: Skip corners if it's a large layer
        if (
          layer.size > 1 &&
          Math.abs(x) === layer.size &&
          Math.abs(z) === layer.size
        )
          continue;

        bricks.push(b(x, layer.y, z, layer.color));
      }
    }
  });

  // Topper
  bricks.push(b(0, 10, 0, LEAF_LIGHT, "1x1"));

  return bricks;
};
export const MODELS: Record<string, BrickData[]> = {
  HUT: createHut(),
  LIGHTHOUSE: createLighthouse(),
  PINETREE: createPineTree(),
  RACECAR: [
    // -- Chassis --
    // Center Body
    b(0, 1, 0, "#dc2626", "2x4"), // Main body Red
    b(2, 1, 0, "#dc2626", "2x4"), // Front Body Red
    b(-2, 1, 0, "#dc2626", "2x2"), // Rear Engine

    // Nose cone
    b(4, 1, 0, "#dc2626", "1x2"),

    // -- Wings --
    // Front Wing
    b(4.5, 0.5, 1.5, "#1f2937", "1x2", 1), // Black Wing Left
    b(4.5, 0.5, -1.5, "#1f2937", "1x2", 1), // Black Wing Right

    // Rear Spoiler (Elevated)
    b(-3, 2, 0, "#1f2937", "1x2", 1), // Spoiler strut
    b(-3, 3, 0, "#000000", "2x4", 1), // Top Spoiler Blade

    // -- Cockpit --
    b(0, 2, 0, "#1f2937", "1x1"), // Seat
    b(1, 2, 0, "#93c5fd", "1x2", 1), // Windshield glass (sloped illusion)

    // -- Wheels (Using half-offsets for width) --
    // Rear Wheels
    b(-2, 0.5, 2, "#000000", "2x2", 1),
    b(-2, 0.5, -2, "#000000", "2x2", 1),
    // Front Wheels
    b(2.5, 0.5, 2, "#000000", "2x2", 1),
    b(2.5, 0.5, -2, "#000000", "2x2", 1),
  ],
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
