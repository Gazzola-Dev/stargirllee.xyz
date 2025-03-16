"use client";

import { useGame } from "@/hooks/useGame";
import { useEffect } from "react";
import PlayerCharacter from "./PlayerCharacter";

export default function IconGrid() {
  const { gridItems, gridSize, isInitialized, completeInitialization } =
    useGame();

  // Mark initialization as complete after mounting
  useEffect(() => {
    if (!isInitialized) {
      completeInitialization();
    }
  }, [isInitialized, completeInitialization]);

  return (
    <div className="flex justify-center items-center min-h-screen">
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
              key={`${item.position.x}-${item.position.y}`}
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
          }}
        >
          <PlayerCharacter />
        </div>
      </div>
    </div>
  );
}
