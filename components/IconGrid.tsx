"use client";

import { useGame } from "@/hooks/useGame";
import { useEffect } from "react";
import PlayerCharacter from "./PlayerCharacter";

export default function IconGrid() {
  const {
    gridItems,
    gridSize,
    isInitialized,
    completeInitialization,
    currentZLevel,
    maxZLevel,
  } = useGame();

  // Mark initialization as complete after mounting
  useEffect(() => {
    if (!isInitialized) {
      completeInitialization();
    }
  }, [isInitialized, completeInitialization]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      {/* Z-level indicator */}
      <div className="text-xl mb-4 font-mono bg-black/20 backdrop-blur-sm text-white px-4 py-2 rounded-full">
        Level: {currentZLevel} / {maxZLevel}
        <span className="ml-2 text-sm">(Press Q to go up, E to go down)</span>
      </div>

      <div
        className="flex flex-wrap relative"
        style={{
          width: `${gridSize.width * 40}px`,
          height: `${gridSize.height * 40}px`,
        }}
      >
        {gridItems.map((item) => {
          // Skip rendering empty items completely
          if (item.icon.name === "empty") {
            return null;
          }

          const IconComponent = item.icon.component;

          return (
            <div
              key={`${item.position.x}-${item.position.y}-${item.position.z}`}
              className={`size-10 flex items-center justify-center ${
                item.bgColor
              } ${
                item.isAdjacentToPlayer
                  ? "ring-2 ring-white ring-opacity-50 rounded-full"
                  : ""
              }`}
              style={{
                position: "absolute",
                left: `${item.renderPosition.x * 40}px`,
                top: `${item.renderPosition.y * 40}px`,
                transition: "all 0.3s ease-in-out",
                opacity: item.opacity ?? 1,
                // Scale down items that are not on the current z-level
                transform: `scale(${
                  item.position.z === currentZLevel
                    ? 1
                    : Math.max(
                        0.6,
                        1 - Math.abs(item.position.z - currentZLevel) * 0.1
                      )
                })`,
              }}
            >
              <IconComponent className={`size-8 ${item.iconColor}`} />
            </div>
          );
        })}

        {/* Player character is always centered on screen, not part of the grid */}
        <div
          className="absolute"
          style={{
            left: `${Math.floor(gridSize.width / 2) * 40}px`,
            top: `${Math.floor(gridSize.height / 2) * 40}px`,
            transform: "translate(-50%, -50%)",
            marginLeft: "20px",
            marginTop: "20px",
            zIndex: 50,
          }}
        >
          <PlayerCharacter />
        </div>
      </div>
    </div>
  );
}
