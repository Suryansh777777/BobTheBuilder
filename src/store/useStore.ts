import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

export type BrickType = "1x1" | "1x2" | "2x2" | "2x4";
export type ToolType = "add" | "select" | "paint" | "erase";

export interface BrickData {
  id: string;
  type: BrickType;
  position: [number, number, number];
  rotation: number; // 0, 1, 2, 3 (multiples of 90 degrees)
  color: string;
}

interface State {
  bricks: BrickData[];
  history: BrickData[][];
  historyIndex: number;

  selectedBrickType: BrickType;
  selectedColor: string;
  selectedTool: ToolType;
  selectedBrickId: string | null;

  showGrid: boolean;
  showShadows: boolean;
  showFog: boolean;
  isExploded: boolean;
  darkMode: boolean;

  // Actions
  addBrick: (brick: Omit<BrickData, "id">) => void;
  removeBrick: (id: string) => void;
  updateBrick: (id: string, data: Partial<BrickData>) => void;
  selectBrick: (id: string | null) => void;
  setTool: (tool: ToolType) => void;
  setBrickType: (type: BrickType) => void;
  setColor: (color: string) => void;
  toggleGrid: () => void;
  toggleShadows: () => void;
  toggleFog: () => void;
  toggleTheme: () => void;
  rotateSelection: () => void;

  undo: () => void;
  redo: () => void;
  clearAll: () => void;
  setExploded: (exploded: boolean) => void;
  loadModel: (bricks: BrickData[]) => void;
}

const MAX_HISTORY = 50;

export const useStore = create<State>((set, get) => ({
  bricks: [],
  history: [[]],
  historyIndex: 0,

  selectedBrickType: "2x4",
  selectedColor: "#ef4444", // Red
  selectedTool: "add",
  selectedBrickId: null,

  showGrid: true,
  showShadows: true,
  showFog: true,
  isExploded: false,
  darkMode: false,

  loadModel: (newBricks) => {
    const { history, historyIndex } = get();
    const bricksCopy = newBricks.map((b) => ({ ...b, id: uuidv4() }));

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(bricksCopy);
    if (newHistory.length > MAX_HISTORY) newHistory.shift();

    set({
      bricks: bricksCopy,
      history: newHistory,
      historyIndex: newHistory.length - 1,
      isExploded: false,
      selectedBrickId: null,
    });
  },

  addBrick: (brickData) => {
    const { bricks, history, historyIndex } = get();
    const newBrick = { ...brickData, id: uuidv4() };
    const newBricks = [...bricks, newBrick];

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newBricks);
    if (newHistory.length > MAX_HISTORY) newHistory.shift();

    set({
      bricks: newBricks,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  removeBrick: (id) => {
    const { bricks, history, historyIndex } = get();
    const newBricks = bricks.filter((b) => b.id !== id);

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newBricks);
    if (newHistory.length > MAX_HISTORY) newHistory.shift();

    set({
      bricks: newBricks,
      history: newHistory,
      historyIndex: newHistory.length - 1,
      selectedBrickId: null,
    });
  },

  updateBrick: (id, data) => {
    const { bricks, history, historyIndex } = get();
    const newBricks = bricks.map((b) => (b.id === id ? { ...b, ...data } : b));

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newBricks);
    if (newHistory.length > MAX_HISTORY) newHistory.shift();

    set({
      bricks: newBricks,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  selectBrick: (id) => set({ selectedBrickId: id }),
  setTool: (tool) => set({ selectedTool: tool, selectedBrickId: null }),
  setBrickType: (type) => set({ selectedBrickType: type }),
  setColor: (color) => {
    const { selectedBrickId, updateBrick } = get();
    if (selectedBrickId) {
      updateBrick(selectedBrickId, { color });
    }
    set({ selectedColor: color });
  },
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  toggleShadows: () => set((state) => ({ showShadows: !state.showShadows })),
  toggleFog: () => set((state) => ({ showFog: !state.showFog })),
  toggleTheme: () => set((state) => ({ darkMode: !state.darkMode })),

  rotateSelection: () => {
    const { selectedBrickId, bricks, updateBrick } = get();
    if (selectedBrickId) {
      const brick = bricks.find((b) => b.id === selectedBrickId);
      if (brick) {
        updateBrick(selectedBrickId, { rotation: (brick.rotation + 1) % 4 });
      }
    }
  },

  undo: () => {
    const { historyIndex, history } = get();
    if (historyIndex > 0) {
      set({
        historyIndex: historyIndex - 1,
        bricks: history[historyIndex - 1],
      });
    }
  },

  redo: () => {
    const { historyIndex, history } = get();
    if (historyIndex < history.length - 1) {
      set({
        historyIndex: historyIndex + 1,
        bricks: history[historyIndex + 1],
      });
    }
  },

  clearAll: () => {
    const { history, historyIndex } = get();
    const newBricks: BrickData[] = [];
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newBricks);

    set({
      bricks: newBricks,
      history: newHistory,
      historyIndex: newHistory.length - 1,
      selectedBrickId: null,
    });
  },

  setExploded: (exploded) => set({ isExploded: exploded }),
}));
