# BobTheBuilder

A 3D LEGO-style brick editor built with Next.js, React Three Fiber, and Zustand.

## Features

- **3D Viewport**: Infinite grid, OrbitControls (Rotate, Zoom, Pan).
- **Brick Logic**: Procedural bricks with studs, snapping to grid, and stacking logic.
- **Library**: Select different brick sizes (1x1, 1x2, 2x2, 2x4).
- **Tools**:
  - **Add**: Place bricks (with ghost preview).
  - **Select**: Select existing bricks to view properties or rotate.
  - **Paint**: Change color of existing bricks.
  - **Erase**: Remove bricks.
- **Properties**: Change colors, rotate bricks.
- **History**: Undo/Redo support.

## Controls

- **Left Click**: Action (Place, Select, Paint, Erase).
- **Right Click / Drag**: Rotate camera.
- **Scroll**: Zoom.
- **Middle Click / Drag**: Pan camera.

## Development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000).

## Architecture

- `src/store/useStore.ts`: Zustand store managing global state (bricks, history, selection).
- `src/components/Scene.tsx`: The 3D canvas, raycasting logic, and rendering of bricks.
- `src/components/Brick.tsx`: The visual component for a brick (Box + Cylinders).
- `src/components/UI.tsx`: The overlay UI for tools and library.
