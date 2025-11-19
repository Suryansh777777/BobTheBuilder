import React from "react";
import { useStore, BrickType, ToolType } from "@/store/useStore";
import {
  MousePointer2,
  Plus,
  PaintBucket,
  Eraser,
  RotateCw,
  Undo2,
  Redo2,
  Trash2,
  Save,
  Grid3X3,
  Sun,
  Search,
} from "lucide-react";
import { clsx } from "clsx";

const BRICK_TYPES: BrickType[] = ["1x1", "1x2", "2x2", "2x4"];
const COLORS = [
  "#ef4444", // Red
  "#3b82f6", // Blue
  "#eab308", // Yellow
  "#22c55e", // Green
  "#ffffff", // White
  "#1f2937", // Black
  "#9ca3af", // Gray
  "#a855f7", // Purple
];

export const UI = () => {
  const {
    selectedTool,
    setTool,
    selectedBrickType,
    setBrickType,
    selectedColor,
    setColor,
    undo,
    redo,
    clearAll,
    showGrid,
    toggleGrid,
    showShadows,
    toggleShadows,
    rotateSelection,
    selectedBrickId,
    bricks,
  } = useStore();

  const selectedBrick = bricks.find((b) => b.id === selectedBrickId);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between">
      {/* Top Toolbar */}
      <div className="pointer-events-auto bg-gray-800 text-white p-2 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <h1 className="font-bold text-xl mr-4 px-2">BobTheBuilder</h1>

          <div className="flex bg-gray-700 rounded-lg p-1 gap-1">
            <ToolButton
              active={selectedTool === "select"}
              onClick={() => setTool("select")}
              icon={<MousePointer2 size={18} />}
              label="Select"
            />
            <ToolButton
              active={selectedTool === "add"}
              onClick={() => setTool("add")}
              icon={<Plus size={18} />}
              label="Add"
            />
            <ToolButton
              active={selectedTool === "paint"}
              onClick={() => setTool("paint")}
              icon={<PaintBucket size={18} />}
              label="Paint"
            />
            <ToolButton
              active={selectedTool === "erase"}
              onClick={() => setTool("erase")}
              icon={<Eraser size={18} />}
              label="Erase"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ActionButton
            onClick={undo}
            icon={<Undo2 size={18} />}
            label="Undo"
          />
          <ActionButton
            onClick={redo}
            icon={<Redo2 size={18} />}
            label="Redo"
          />
          <div className="w-px h-6 bg-gray-600 mx-1" />
          <ActionButton
            onClick={clearAll}
            icon={<Trash2 size={18} />}
            label="Clear"
          />
          <ActionButton
            onClick={() => alert("Save feature not implemented yet!")}
            icon={<Save size={18} />}
            label="Save"
          />
        </div>
      </div>

      {/* Main Content Area (Overlay) */}
      <div className="flex-1 flex justify-between overflow-hidden">
        {/* Left Sidebar - Library */}
        <div className="pointer-events-auto w-64 bg-gray-900/90 backdrop-blur-sm text-white p-4 flex flex-col gap-4 border-r border-gray-700">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search bricks..."
              className="w-full bg-gray-800 rounded-md py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Bricks
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {BRICK_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setBrickType(type)}
                  className={clsx(
                    "p-3 rounded-md border-2 transition-all flex flex-col items-center gap-2",
                    selectedBrickType === type
                      ? "border-blue-500 bg-blue-500/20"
                      : "border-gray-700 hover:border-gray-500 bg-gray-800"
                  )}
                >
                  <div className="w-8 h-8 bg-gray-600 rounded-sm" />{" "}
                  {/* Placeholder for brick preview */}
                  <span className="text-xs font-medium">{type}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="pointer-events-auto w-72 bg-gray-900/90 backdrop-blur-sm text-white p-4 flex flex-col gap-6 border-l border-gray-700 overflow-y-auto">
          {/* Colors */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Colors
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setColor(color)}
                  className={clsx(
                    "w-10 h-10 rounded-full border-2 transition-transform hover:scale-110",
                    selectedColor === color
                      ? "border-white scale-110"
                      : "border-transparent"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Transform / Selection Info */}
          {selectedBrick ? (
            <div className="flex flex-col gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Selection
              </h3>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-gray-900 p-2 rounded text-center">
                  <span className="text-gray-500 block">X</span>
                  {selectedBrick.position[0]}
                </div>
                <div className="bg-gray-900 p-2 rounded text-center">
                  <span className="text-gray-500 block">Y</span>
                  {selectedBrick.position[1].toFixed(1)}
                </div>
                <div className="bg-gray-900 p-2 rounded text-center">
                  <span className="text-gray-500 block">Z</span>
                  {selectedBrick.position[2]}
                </div>
              </div>

              <button
                onClick={rotateSelection}
                className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 py-2 rounded-md transition-colors"
              >
                <RotateCw size={16} />
                <span>Rotate 90°</span>
              </button>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 text-sm border border-dashed border-gray-700 rounded-lg">
              No brick selected
            </div>
          )}

          {/* Scene Settings */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Scene
            </h3>
            <div className="flex flex-col gap-2">
              <Toggle
                label="Show Grid"
                active={showGrid}
                onClick={toggleGrid}
                icon={<Grid3X3 size={16} />}
              />
              <Toggle
                label="Shadows"
                active={showShadows}
                onClick={toggleShadows}
                icon={<Sun size={16} />}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToolButton = ({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) => (
  <button
    onClick={onClick}
    className={clsx(
      "p-2 rounded-md transition-colors flex items-center gap-2",
      active
        ? "bg-blue-600 text-white"
        : "text-gray-400 hover:text-white hover:bg-gray-700"
    )}
    title={label}
  >
    {icon}
  </button>
);

const ActionButton = ({
  onClick,
  icon,
  label,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) => (
  <button
    onClick={onClick}
    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
    title={label}
  >
    {icon}
  </button>
);

const Toggle = ({
  label,
  active,
  onClick,
  icon,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={clsx(
      "flex items-center justify-between p-3 rounded-md border transition-all",
      active
        ? "bg-blue-500/10 border-blue-500/50 text-blue-400"
        : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
    )}
  >
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-sm">{label}</span>
    </div>
    <div
      className={clsx(
        "w-2 h-2 rounded-full",
        active ? "bg-blue-500" : "bg-gray-600"
      )}
    />
  </button>
);
