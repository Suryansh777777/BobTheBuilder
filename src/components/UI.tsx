import React, { useState, useRef, useEffect } from "react";
import { useStore, BrickType } from "@/store/useStore";
import { MODELS } from "@/data/models";
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
  Moon,
  Box,
  Palette,
  ChevronLeft,
  ChevronRight,
  Github,
  Zap,
  Hammer,
  LayoutTemplate,
  Star,
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
    darkMode,
    toggleTheme,
    rotateSelection,
    selectedBrickId,
    bricks,
    isExploded,
    setExploded,
    loadModel,
  } = useStore();

  const selectedBrick = bricks.find((b) => b.id === selectedBrickId);
  const [isLibraryOpen, setIsLibraryOpen] = useState(true);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(true);
  const [isRebuildMenuOpen, setIsRebuildMenuOpen] = useState(false);
  const rebuildMenuRef = useRef<HTMLDivElement>(null);

  // Close rebuild menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        rebuildMenuRef.current &&
        !rebuildMenuRef.current.contains(event.target as Node)
      ) {
        setIsRebuildMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleLibrary = () => {
    setIsLibraryOpen(!isLibraryOpen);
    if (!isLibraryOpen && window.innerWidth < 768) {
      setIsPropertiesOpen(false);
    }
  };

  const toggleProperties = () => {
    setIsPropertiesOpen(!isPropertiesOpen);
    if (!isPropertiesOpen && window.innerWidth < 768) {
      setIsLibraryOpen(false);
    }
  };

  const handleLoadModel = (modelName: string) => {
    loadModel(MODELS[modelName]);
    setExploded(false);
    setIsRebuildMenuOpen(false);
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between z-10 overflow-hidden">
      {/* Header / Top Bar */}
      <header className="pointer-events-auto flex items-center justify-between p-4 sm:p-6">
        <div
          className={clsx(
            "flex items-center gap-3 backdrop-blur-xl border p-3 pr-6 rounded-2xl shadow-2xl group transition-colors cursor-default",
            darkMode
              ? "bg-black/40 border-white/10 hover:bg-black/50"
              : "bg-white/60 border-black/5 hover:bg-white/80"
          )}
        >
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
            <h1
              className={clsx(
                "font-bold text-lg leading-none tracking-tight group-hover:text-blue-500 transition-colors",
                darkMode ? "text-white" : "text-slate-900"
              )}
            >
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

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/Suryansh777777/BobTheBuilder"
            target="_blank"
            rel="noopener noreferrer"
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-xs transition-all shadow-lg border group duration-500",
              darkMode
                ? "bg-black/40 border-white/10 text-gray-300 hover:text-white hover:bg-white/10"
                : "bg-white/60 border-black/5 text-gray-600 hover:text-slate-900 hover:bg-black/5"
            )}
          >
            <Star
              size={14}
              className="text-yellow-500 group-hover:scale-110 transition-transform"
              fill="currentColor"
            />
            <span>Star on GitHub</span>
          </a>
          <div
            className={clsx(
              "hidden md:flex items-center gap-3 text-xs font-medium text-gray-400 backdrop-blur-xl border px-4 py-2 rounded-xl shadow-lg transition-all duration-500",
              darkMode
                ? "bg-black/40 border-white/10 text-gray-300 hover:text-white hover:bg-white/10"
                : "bg-white/60 border-black/5 text-gray-600 hover:text-slate-900 hover:bg-black/5"
            )}
          >
            <span>Made by Suryansh</span>
            <div
              className={clsx(
                "w-px h-3",
                darkMode ? "bg-white/10" : "bg-black/10"
              )}
            />
            <a
              href="https://github.com/Suryansh777777/BobTheBuilder"
              target="_blank"
              rel="noopener noreferrer"
              className={clsx(
                "transition-colors",
                darkMode ? "hover:text-white" : "hover:text-slate-900"
              )}
              title="GitHub"
            >
              <Github size={14} />
            </a>
            <a
              href="https://x.com/suryansh777777"
              target="_blank"
              rel="noopener noreferrer"
              className={clsx(
                "transition-colors",
                darkMode ? "hover:text-white" : "hover:text-slate-900"
              )}
              title="X (Twitter)"
            >
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="currentColor"
                className="text-current"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* Main Workspace Area */}
      <div className="flex-1 relative flex items-center justify-between px-4 sm:px-6 pointer-events-none">
        {/* Left Panel: Brick Library */}
        <div
          className={clsx(
            "pointer-events-auto transition-all duration-300 ease-out flex flex-col gap-4 h-auto max-h-[70vh]",
            isLibraryOpen && !isExploded
              ? "translate-x-0 opacity-100"
              : "-translate-x-[120%] opacity-0 absolute"
          )}
        >
          <div
            className={clsx(
              "w-[calc(100vw-2rem)] sm:w-64 backdrop-blur-xl border rounded-3xl p-4 flex flex-col gap-4 shadow-2xl",
              darkMode
                ? "bg-black/60 border-white/10"
                : "bg-white/60 border-black/5"
            )}
          >
            <div className="flex items-center justify-between">
              <h2
                className={clsx(
                  "text-sm font-bold uppercase tracking-wider flex items-center gap-2",
                  darkMode ? "text-white" : "text-gray-500"
                )}
              >
                <Box size={14} className="text-blue-500" /> Library
              </h2>
              {/* Close button for mobile */}
              <button
                onClick={toggleLibrary}
                className={clsx(
                  "sm:hidden p-1.5 rounded-lg text-gray-400 hover:text-white",
                  darkMode
                    ? "bg-white/5 text-gray-400 hover:text-white"
                    : "bg-black/5 text-gray-500 hover:text-slate-900"
                )}
              >
                <ChevronLeft size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-1 custom-scrollbar content-start">
              {BRICK_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setBrickType(type)}
                  className={clsx(
                    "relative p-4 rounded-2xl border transition-all duration-200 flex flex-col items-center gap-3 group overflow-hidden",
                    selectedBrickType === type
                      ? "bg-blue-500/10 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                      : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5"
                  )}
                >
                  <div
                    className={clsx(
                      "w-full aspect-4/3 rounded-xl transition-all duration-300 flex items-center justify-center relative",
                      selectedBrickType === type
                        ? "bg-blue-500/5"
                        : "bg-black/20"
                    )}
                  >
                    {/* Brick Preview */}
                    <div
                      className="relative transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                      style={{
                        width: "60%",
                        display: "grid",
                        gap: "4px",
                        padding: "4px",
                        backgroundColor:
                          selectedBrickType === type
                            ? selectedColor
                            : darkMode
                            ? "#4b5563"
                            : "#cbd5e1",
                        borderRadius: "4px",
                        boxShadow:
                          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255,255,255,0.1)",
                        gridTemplateColumns: `repeat(${
                          type.split("x")[0]
                        }, 1fr)`,
                      }}
                    >
                      {Array.from({
                        length:
                          parseInt(type.split("x")[0]) *
                          parseInt(type.split("x")[1]),
                      }).map((_, i) => (
                        <div
                          key={i}
                          className="aspect-square rounded-full shadow-inner"
                          style={{
                            backgroundColor: "rgba(0,0,0,0.2)",
                            boxShadow:
                              "inset 0 1px 2px rgba(0,0,0,0.2), 0 1px 0 rgba(255,255,255,0.2)",
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-0.5">
                    <span
                      className={clsx(
                        "text-sm font-bold",
                        selectedBrickType === type
                          ? "text-blue-400"
                          : "text-gray-300 group-hover:text-white"
                      )}
                    >
                      {type}
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium">
                      Standard Brick
                    </span>
                  </div>

                  {selectedBrickType === type && (
                    <div className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Toggle Library Button (Visible when closed) */}
        {!isLibraryOpen && !isExploded && (
          <div className="absolute left-6 pointer-events-auto">
            <button
              onClick={toggleLibrary}
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
            isPropertiesOpen && !isExploded
              ? "translate-x-0 opacity-100"
              : "translate-x-[120%] opacity-0 absolute right-6"
          )}
        >
          <div
            className={clsx(
              "w-[calc(100vw-2rem)] sm:w-72 backdrop-blur-xl border rounded-3xl p-4 flex flex-col gap-6 shadow-2xl overflow-y-auto custom-scrollbar",
              darkMode
                ? "bg-black/60 border-white/10"
                : "bg-white/60 border-black/5"
            )}
          >
            {/* Header for Mobile Close */}
            <div className="flex items-center justify-between sm:hidden">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                Properties
              </h3>
              <button
                onClick={toggleProperties}
                className={clsx(
                  "p-1.5 rounded-lg",
                  darkMode
                    ? "bg-white/5 text-gray-400 hover:text-white"
                    : "bg-black/5 text-gray-500 hover:text-slate-900"
                )}
              >
                <ChevronRight size={16} />
              </button>
            </div>

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

            <div
              className={clsx("h-px", darkMode ? "bg-white/10" : "bg-black/10")}
            />

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
                      darkMode={darkMode}
                    />
                    <CoordinateLabel
                      label="Y"
                      value={selectedBrick.position[1].toFixed(1)}
                      darkMode={darkMode}
                    />
                    <CoordinateLabel
                      label="Z"
                      value={selectedBrick.position[2]}
                      darkMode={darkMode}
                    />
                  </div>
                  <button
                    onClick={rotateSelection}
                    className={clsx(
                      "w-full py-2.5 border rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors",
                      darkMode
                        ? "bg-white/5 hover:bg-white/10 border-white/10 text-white"
                        : "bg-black/5 hover:bg-black/10 border-black/5 text-slate-900"
                    )}
                  >
                    <RotateCw size={16} /> Rotate 90°
                  </button>
                </div>
              ) : (
                <div
                  className={clsx(
                    "p-4 rounded-xl border border-dashed text-center text-xs",
                    darkMode
                      ? "border-white/10 text-gray-500 bg-white/5"
                      : "border-black/10 text-gray-500 bg-black/5"
                  )}
                >
                  Select a brick to transform
                </div>
              )}
            </div>

            <div
              className={clsx("h-px", darkMode ? "bg-white/10" : "bg-black/10")}
            />

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
                  darkMode={darkMode}
                />
                <Toggle
                  active={showShadows}
                  onClick={toggleShadows}
                  label="Shadows"
                  icon={<Sun size={16} />}
                  darkMode={darkMode}
                />
                <Toggle
                  active={darkMode}
                  onClick={toggleTheme}
                  label={darkMode ? "Dark" : "Light"}
                  icon={darkMode ? <Moon size={16} /> : <Sun size={16} />}
                  darkMode={darkMode}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Toggle Properties Button (Visible when closed) */}
        {!isPropertiesOpen && !isExploded && (
          <div className="absolute right-6 pointer-events-auto">
            <button
              onClick={toggleProperties}
              className={clsx(
                "p-3 backdrop-blur-xl border rounded-xl transition-colors shadow-xl",
                darkMode
                  ? "bg-black/60 border-white/10 text-white hover:bg-white/10"
                  : "bg-white/60 border-black/5 text-slate-900 hover:bg-black/5"
              )}
            >
              <ChevronLeft size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Bottom Toolbar */}
      <div
        className={clsx(
          "pointer-events-auto pb-8 px-4 flex justify-center items-end transition-transform duration-300 translate-y-0"
        )}
      >
        <div
          className={clsx(
            "backdrop-blur-xl border p-2 rounded-3xl shadow-2xl flex items-center gap-2 md:gap-4",
            darkMode
              ? "bg-black/60 border-white/10"
              : "bg-white/60 border-black/5"
          )}
        >
          <div
            className={clsx(
              "flex items-center gap-1 p-1 rounded-2xl",
              darkMode ? "bg-white/5" : "bg-black/5"
            )}
          >
            <ToolButton
              active={selectedTool === "select"}
              onClick={() => setTool("select")}
              icon={<MousePointer2 size={20} />}
              label="Select"
              shortcut="V"
              darkMode={darkMode}
            />
            <ToolButton
              active={selectedTool === "add"}
              onClick={() => setTool("add")}
              icon={<Plus size={20} />}
              label="Add"
              shortcut="A"
              darkMode={darkMode}
            />
            <ToolButton
              active={selectedTool === "paint"}
              onClick={() => setTool("paint")}
              icon={<PaintBucket size={20} />}
              label="Paint"
              shortcut="B"
              darkMode={darkMode}
            />
            <ToolButton
              active={selectedTool === "erase"}
              onClick={() => setTool("erase")}
              icon={<Eraser size={20} />}
              label="Erase"
              shortcut="E"
              darkMode={darkMode}
            />
          </div>

          <div
            className={clsx(
              "w-px h-8",
              darkMode ? "bg-white/10" : "bg-black/10"
            )}
          />

          <div className="flex items-center gap-1">
            <IconButton
              onClick={undo}
              icon={<Undo2 size={20} />}
              label="Undo"
              darkMode={darkMode}
            />
            <IconButton
              onClick={redo}
              icon={<Redo2 size={20} />}
              label="Redo"
              darkMode={darkMode}
            />
            <div
              className={clsx(
                "w-px h-8 mx-1",
                darkMode ? "bg-white/10" : "bg-black/10"
              )}
            />
            <IconButton
              onClick={clearAll}
              icon={<Trash2 size={20} />}
              label="Clear All"
              danger
              darkMode={darkMode}
            />
          </div>

          <div
            className={clsx(
              "w-px h-8",
              darkMode ? "bg-white/10" : "bg-black/10"
            )}
          />

          {/* Rebuild / Templates / Explode */}
          <div className="relative flex gap-2" ref={rebuildMenuRef}>
            {/* Rebuild Menu Trigger */}
            <button
              onClick={() =>
                isExploded
                  ? setExploded(false)
                  : setIsRebuildMenuOpen(!isRebuildMenuOpen)
              }
              className={clsx(
                "flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all shadow-lg border min-w-[120px] justify-center",
                isExploded
                  ? "bg-green-600 border-green-500 text-white hover:bg-green-500"
                  : clsx(
                      darkMode
                        ? "bg-white/10 border-white/10 text-white hover:bg-white/20"
                        : "bg-black/5 border-black/5 text-slate-900 hover:bg-black/10"
                    )
              )}
            >
              {isExploded ? (
                <>
                  <Hammer size={18} />
                  <span>Rebuild</span>
                </>
              ) : (
                <>
                  <LayoutTemplate size={18} />
                  <span>Templates</span>
                </>
              )}
            </button>

            {/* Explosion Button (Only visible when not exploded) */}
            {!isExploded && (
              <button
                onClick={() => setExploded(true)}
                className="p-2 bg-red-600/80 border border-red-500/50 rounded-xl text-white hover:bg-red-600 transition-all shadow-lg"
                title="Explode"
              >
                <Zap size={20} />
              </button>
            )}

            {/* Dropdown Menu - Upwards */}
            {isRebuildMenuOpen && !isExploded && (
              <div
                className={clsx(
                  "absolute bottom-full right-0 mb-2 w-48 backdrop-blur-xl border rounded-2xl shadow-2xl p-2 flex flex-col gap-1 animate-in fade-in slide-in-from-bottom-2 z-50",
                  darkMode
                    ? "bg-black/80 border-white/10"
                    : "bg-white/80 border-black/5"
                )}
              >
                <h3 className="text-[10px] font-bold text-gray-500 uppercase px-2 py-1">
                  Load Model
                </h3>
                {Object.keys(MODELS).map((model) => (
                  <button
                    key={model}
                    onClick={() => handleLoadModel(model)}
                    className={clsx(
                      "flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors text-left capitalize",
                      darkMode
                        ? "hover:bg-white/10 text-white"
                        : "hover:bg-black/5 text-slate-900"
                    )}
                  >
                    <Box size={14} className="text-blue-400" />
                    {model.toLowerCase()}
                  </button>
                ))}
                <div
                  className={clsx(
                    "h-px my-1",
                    darkMode ? "bg-white/10" : "bg-black/10"
                  )}
                />
                <button
                  onClick={() => {
                    clearAll();
                    setIsRebuildMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-500/20 text-sm text-red-400 hover:text-red-300 transition-colors text-left"
                >
                  <Trash2 size={14} />
                  Clear Scene
                </button>
              </div>
            )}
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
  darkMode: boolean;
}

const ToolButton = ({
  active,
  onClick,
  icon,
  label,
  shortcut,
  darkMode,
}: ToolButtonProps) => (
  <button
    onClick={onClick}
    className={clsx(
      "relative p-3 sm:p-4 rounded-xl transition-all duration-200 flex flex-col items-center justify-center gap-1 group",
      active
        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25 translate-y-[-2px]"
        : clsx(
            "text-gray-400",
            darkMode
              ? "hover:text-white hover:bg-white/10"
              : "hover:text-slate-900 hover:bg-black/5"
          )
    )}
    title={`${label} (${shortcut})`}
  >
    {icon}
    <span
      className={clsx(
        "text-[10px] font-medium hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 px-2 py-1 rounded whitespace-nowrap pointer-events-none",
        active ? "hidden" : "",
        darkMode
          ? "bg-black/80 text-white"
          : "bg-white/80 text-slate-900 shadow-lg border border-black/5"
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
  darkMode: boolean;
}

const IconButton = ({
  onClick,
  icon,
  label,
  danger,
  darkMode,
}: IconButtonProps) => (
  <button
    onClick={onClick}
    className={clsx(
      "p-3 rounded-xl transition-colors text-gray-400",
      danger
        ? "hover:bg-red-500/20 hover:text-red-500"
        : clsx(
            darkMode
              ? "hover:text-white hover:bg-white/10"
              : "hover:text-slate-900 hover:bg-black/5"
          )
    )}
    title={label}
  >
    {icon}
  </button>
);

const CoordinateLabel = ({
  label,
  value,
  darkMode,
}: {
  label: string;
  value: number | string;
  darkMode: boolean;
}) => (
  <div
    className={clsx(
      "rounded-lg p-2 border flex flex-col items-center",
      darkMode ? "bg-black/40 border-white/5" : "bg-white/40 border-black/5"
    )}
  >
    <span className="text-[10px] text-gray-500 font-bold mb-0.5">{label}</span>
    <span
      className={clsx(
        "text-xs font-mono",
        darkMode ? "text-white" : "text-slate-900"
      )}
    >
      {value}
    </span>
  </div>
);

interface ToggleProps {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
  darkMode: boolean;
}

const Toggle = ({ active, onClick, label, icon, darkMode }: ToggleProps) => (
  <button
    onClick={onClick}
    className={clsx(
      "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all",
      active
        ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
        : clsx(
            "text-gray-400",
            darkMode
              ? "bg-white/5 border-white/5 hover:border-white/20 hover:text-white"
              : "bg-black/5 border-black/5 hover:border-black/20 hover:text-slate-900"
          )
    )}
  >
    {icon}
    <span className="text-xs font-medium">{label}</span>
  </button>
);
