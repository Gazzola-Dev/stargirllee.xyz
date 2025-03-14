"use client";

import { useGame } from "@/hooks/useGame";
import { Heart, Star } from "lucide-react";
import { useEffect } from "react";

export default function IconGrid() {
  const {
    gridItems,
    gridSize,
    centerPosition,
    setIconAt,
    isInitialized,
    completeInitialization,
  } = useGame();

  // Set center icon after the grid initializes, but only once
  useEffect(() => {
    if (isInitialized) {
      return; // Skip if already initialized
    }

    // Set a heart icon at the center (will be under the star)
    setIconAt(
      centerPosition,
      { name: "heart", component: Heart },
      "text-red-500",
      "bg-black"
    );

    // Mark initialization as complete
    completeInitialization();
  }, [centerPosition, setIconAt, isInitialized, completeInitialization]);

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
          const IconComponent = item.icon.component;

          // Check if this is the center position
          const isCenter =
            item.position.x === centerPosition.x &&
            item.position.y === centerPosition.y;

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
