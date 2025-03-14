"use client";

import useGame from "@/hooks/useGame";
import { Star } from "lucide-react";

export default function IconGrid() {
  const { gameItems, gridSize, initialized } = useGame();

  // Wait until the game is initialized
  if (!initialized) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div
        className="flex flex-wrap relative"
        style={{
          width: `${gridSize.width * 40}px`,
          height: `${gridSize.height * 40}px`,
        }}
      >
        {gameItems.map((item) => {
          const IconComponent = item.icon.component;
          const isCenter = item.isCenter;

          return (
            <div
              key={`${item.position.x}-${item.position.y}`}
              className={`size-10 flex items-center justify-center ${item.bgColor}`}
              style={{
                position: "absolute",
                left: `${item.renderPosition.x * 40}px`,
                top: `${item.renderPosition.y * 40}px`,
                transition: "all 0.3s ease-in-out",
              }}
            >
              <IconComponent className={`size-8 ${item.iconColor}`} />

              {/* Add star icon on top of heart at center position */}
              {isCenter && (
                <Star className="size-8 text-yellow-400 absolute z-10" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
