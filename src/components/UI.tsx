import React, { useState } from "react";
import { useStore, BrickType } from "@/store/useStore";
import {
  MousePointer2,
  Plus,
  PaintBucket,
  Eraser,
  RotateCw,
  Undo2,
  Redo2,
  Trash2,
  Grid3X3,
  Sun,
  Search,
  Box,
  Settings2,
  Palette,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import { clsx } from "clsx";

const BRICK_TYPES: BrickType[] = ["1x1", "1x2", "2x2", "2x4"];
const COLORS = [
  "#ef4444", // Red
  "#f97316", // Orange
  "#eab308", // Yellow
  "#22c55e", // Green
  "#06b6d4", // Cyan
  "#3b82f6", // Blue
  "#a855f7", // Purple
  "#ec4899", // Pink
  "#ffffff", // White
  "#9ca3af", // Gray
  "#1f2937", // Black
  "#78350f", // Brown
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
  const [isLibraryOpen, setIsLibraryOpen] = useState(true);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(true);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between z-10 overflow-hidden">
      {/* Header / Top Bar */}
      <header className="pointer-events-auto flex items-center justify-between p-4 sm:p-6">
        <div className="flex items-center gap-3 backdrop-blur-xl bg-black/40 border border-white/10 p-3 pr-6 rounded-2xl shadow-2xl group hover:bg-black/50 transition-colors cursor-default">
          <div className="relative w-10 h-10 flex items-center justify-center bg-linear-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-md"
            >
              <path
                d="M12 21.5L2.5 16V8L12 13.5L21.5 8V16L12 21.5Z"
                fill="#1E40AF"
                fillOpacity="0.5"
              />
              <path d="M12 13.5L2.5 8L12 2.5L21.5 8L12 13.5Z" fill="#60A5FA" />
              <path
                d="M12 13.5V21.5"
                stroke="#1E3A8A"
                strokeOpacity="0.3"
                strokeWidth="1"
              />
              <path
                d="M21.5 8L12 13.5L2.5 8"
                stroke="#1E3A8A"
                strokeOpacity="0.3"
                strokeWidth="1"
              />
              <circle cx="12" cy="6" r="1.5" fill="white" fillOpacity="0.6" />
              <circle
                cx="7.5"
                cy="8.5"
                r="1.5"
                fill="white"
                fillOpacity="0.4"
              />
              <circle
                cx="16.5"
                cy="8.5"
                r="1.5"
                fill="white"
                fillOpacity="0.4"
              />
            </svg>
            <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div>
            <h1 className="font-bold text-white text-lg leading-none tracking-tight group-hover:text-blue-200 transition-colors">
              BobTheBuilder
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                3D Editor
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <PanelButton
            icon={<Settings2 size={20} />}
            label="Settings"
            onClick={() => {}} // Could open a modal
            active={false}
          />
          <PanelButton
            icon={<Download size={20} />}
            label="Export"
            onClick={() => alert("Export feature coming soon!")}
          />
        </div>
      </header>

      {/* Main Workspace Area */}
      <div className="flex-1 relative flex items-center justify-between px-4 sm:px-6 pointer-events-none">
        {/* Left Panel: Brick Library */}
        <div
          className={clsx(
            "pointer-events-auto transition-all duration-300 ease-out flex flex-col gap-4 h-auto max-h-[70vh]",
            isLibraryOpen
              ? "translate-x-0 opacity-100"
              : "-translate-x-[120%] opacity-0 absolute"
          )}
        >
          <div className="w-64 bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-4 flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Box size={14} className="text-blue-500" /> Library
              </h2>
            </div>

            <div className="relative group">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors"
                size={16}
              />
              <input
                type="text"
                placeholder="Search bricks..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 overflow-y-auto pr-1 custom-scrollbar">
              {BRICK_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setBrickType(type)}
                  className={clsx(
                    "relative p-3 rounded-xl border transition-all duration-200 flex flex-col items-center gap-3 group",
                    selectedBrickType === type
                      ? "bg-blue-600/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                      : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20"
                  )}
                >
                  <div
                    className={clsx(
                      "w-full aspect-4/3 rounded-lg transition-colors flex items-center justify-center",
                      selectedBrickType === type
                        ? "bg-blue-500/20"
                        : "bg-white/5 group-hover:bg-white/10"
                    )}
                  >
                    {/* Visual representation of brick size */}
                    <div
                      className="grid gap-0.5"
                      style={{
                        gridTemplateColumns: `repeat(${
                          type.split("x")[0]
                        }, 1fr)`,
                        width: "60%",
                      }}
                    >
                      {Array.from({
                        length:
                          parseInt(type.split("x")[0]) *
                          parseInt(type.split("x")[1]),
                      }).map((_, i) => (
                        <div
                          key={i}
                          className="w-2 h-2 rounded-full bg-current opacity-50"
                        />
                      ))}
                    </div>
                  </div>
                  <span
                    className={clsx(
                      "text-xs font-bold",
                      selectedBrickType === type
                        ? "text-blue-400"
                        : "text-gray-400 group-hover:text-white"
                    )}
                  >
                    {type}
                  </span>

                  {selectedBrickType === type && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Toggle Library Button (Visible when closed) */}
        {!isLibraryOpen && (
          <div className="absolute left-6 pointer-events-auto">
            <button
              onClick={() => setIsLibraryOpen(true)}
              className="p-3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors shadow-xl"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* Right Panel: Properties */}
        <div
          className={clsx(
            "pointer-events-auto transition-all duration-300 ease-out flex flex-col gap-4 h-auto max-h-[70vh]",
            isPropertiesOpen
              ? "translate-x-0 opacity-100"
              : "translate-x-[120%] opacity-0 absolute right-6"
          )}
        >
          <div className="w-72 bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-4 flex flex-col gap-6 shadow-2xl overflow-y-auto custom-scrollbar">
            {/* Colors */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Palette size={14} className="text-pink-500" /> Colors
              </h3>
              <div className="grid grid-cols-6 gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setColor(color)}
                    className={clsx(
                      "w-8 h-8 rounded-full transition-transform shadow-lg relative group",
                      selectedColor === color
                        ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-black"
                        : "hover:scale-105 hover:ring-2 hover:ring-white/50 hover:ring-offset-1 hover:ring-offset-black"
                    )}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            <div className="h-px bg-white/10" />

            {/* Selection Transform */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <RotateCw size={14} className="text-green-500" /> Transform
              </h3>

              {selectedBrick ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <CoordinateLabel
                      label="X"
                      value={selectedBrick.position[0]}
                    />
                    <CoordinateLabel
                      label="Y"
                      value={selectedBrick.position[1].toFixed(1)}
                    />
                    <CoordinateLabel
                      label="Z"
                      value={selectedBrick.position[2]}
                    />
                  </div>
                  <button
                    onClick={rotateSelection}
                    className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2 transition-colors"
                  >
                    <RotateCw size={16} /> Rotate 90°
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-white/10 text-center text-gray-500 text-xs bg-white/5">
                  Select a brick to transform
                </div>
              )}
            </div>

            <div className="h-px bg-white/10" />

            {/* Scene Toggles */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Scene
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <Toggle
                  active={showGrid}
                  onClick={toggleGrid}
                  label="Grid"
                  icon={<Grid3X3 size={16} />}
                />
                <Toggle
                  active={showShadows}
                  onClick={toggleShadows}
                  label="Shadows"
                  icon={<Sun size={16} />}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Toggle Properties Button (Visible when closed) */}
        {!isPropertiesOpen && (
          <div className="absolute right-6 pointer-events-auto">
            <button
              onClick={() => setIsPropertiesOpen(true)}
              className="p-3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors shadow-xl"
            >
              <ChevronLeft size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Bottom Toolbar */}
      <div className="pointer-events-auto pb-8 px-4 flex justify-center items-end">
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-2 rounded-3xl shadow-2xl flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl">
            <ToolButton
              active={selectedTool === "select"}
              onClick={() => setTool("select")}
              icon={<MousePointer2 size={20} />}
              label="Select"
              shortcut="V"
            />
            <ToolButton
              active={selectedTool === "add"}
              onClick={() => setTool("add")}
              icon={<Plus size={20} />}
              label="Add"
              shortcut="A"
            />
            <ToolButton
              active={selectedTool === "paint"}
              onClick={() => setTool("paint")}
              icon={<PaintBucket size={20} />}
              label="Paint"
              shortcut="B"
            />
            <ToolButton
              active={selectedTool === "erase"}
              onClick={() => setTool("erase")}
              icon={<Eraser size={20} />}
              label="Erase"
              shortcut="E"
            />
          </div>

          <div className="w-px h-8 bg-white/10" />

          <div className="flex items-center gap-1">
            <IconButton
              onClick={undo}
              icon={<Undo2 size={20} />}
              label="Undo"
            />
            <IconButton
              onClick={redo}
              icon={<Redo2 size={20} />}
              label="Redo"
            />
            <div className="w-px h-8 bg-white/10 mx-1" />
            <IconButton
              onClick={clearAll}
              icon={<Trash2 size={20} />}
              label="Clear All"
              danger
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components

interface ToolButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
}

const ToolButton = ({
  active,
  onClick,
  icon,
  label,
  shortcut,
}: ToolButtonProps) => (
  <button
    onClick={onClick}
    className={clsx(
      "relative p-3 sm:p-4 rounded-xl transition-all duration-200 flex flex-col items-center justify-center gap-1 group",
      active
        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25 translate-y-[-2px]"
        : "text-gray-400 hover:text-white hover:bg-white/10"
    )}
    title={`${label} (${shortcut})`}
  >
    {icon}
    <span
      className={clsx(
        "text-[10px] font-medium hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-black/80 px-2 py-1 rounded text-white whitespace-nowrap pointer-events-none",
        active ? "hidden" : "" // Hide tooltip if active? Or keep it.
      )}
    >
      {label}
    </span>
  </button>
);

interface IconButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
}

const IconButton = ({ onClick, icon, label, danger }: IconButtonProps) => (
  <button
    onClick={onClick}
    className={clsx(
      "p-3 rounded-xl transition-colors text-gray-400 hover:text-white",
      danger ? "hover:bg-red-500/20 hover:text-red-500" : "hover:bg-white/10"
    )}
    title={label}
  >
    {icon}
  </button>
);

interface PanelButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}

const PanelButton = ({ icon, label, onClick, active }: PanelButtonProps) => (
  <button
    onClick={onClick}
    className={clsx(
      "flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-colors",
      active
        ? "bg-white/10 text-white"
        : "text-gray-400 hover:text-white hover:bg-white/5"
    )}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </button>
);

const CoordinateLabel = ({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) => (
  <div className="bg-black/40 rounded-lg p-2 border border-white/5 flex flex-col items-center">
    <span className="text-[10px] text-gray-500 font-bold mb-0.5">{label}</span>
    <span className="text-xs font-mono text-white">{value}</span>
  </div>
);

interface ToggleProps {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}

const Toggle = ({ active, onClick, label, icon }: ToggleProps) => (
  <button
    onClick={onClick}
    className={clsx(
      "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all",
      active
        ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
        : "bg-white/5 border-white/5 text-gray-400 hover:border-white/20 hover:text-white"
    )}
  >
    {icon}
    <span className="text-xs font-medium">{label}</span>
  </button>
);
