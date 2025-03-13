"use client";

import { useInitialIconGrid } from "@/hooks/useInitialIconGrid";
import {
  Cloud,
  Droplets,
  Flashlight,
  Heart,
  Moon,
  Snowflake,
  Star,
  Sun,
} from "lucide-react";
import { useEffect } from "react";

export default function IconGrid() {
  const {
    gridItems,
    gridSize,
    centerPosition,
    setIconAt,
    isInitialized,
    completeInitialization,
  } = useInitialIconGrid();

  // Set some custom icons after the grid initializes, but only once
  useEffect(() => {
    if (isInitialized) {
      return; // Skip if already initialized
    }

    // Set a heart icon at the center
    setIconAt(
      centerPosition,
      { name: "heart", component: Heart },
      "text-red-500",
      "bg-pink-900"
    );

    // Create a pattern around the center
    setIconAt(
      { x: centerPosition.x + 1, y: centerPosition.y },
      { name: "star", component: Star },
      "text-yellow-400",
      "bg-yellow-900"
    );

    setIconAt(
      { x: centerPosition.x - 1, y: centerPosition.y },
      { name: "flashlight", component: Flashlight },
      "text-blue-400",
      "bg-blue-900"
    );

    setIconAt(
      { x: centerPosition.x, y: centerPosition.y + 1 },
      { name: "sun", component: Sun },
      "text-yellow-300",
      "bg-orange-900"
    );

    setIconAt(
      { x: centerPosition.x, y: centerPosition.y - 1 },
      { name: "moon", component: Moon },
      "text-purple-300",
      "bg-indigo-900"
    );

    // Add diagonal icons
    setIconAt(
      { x: centerPosition.x + 1, y: centerPosition.y + 1 },
      { name: "cloud", component: Cloud },
      "text-blue-200",
      "bg-blue-800"
    );

    setIconAt(
      { x: centerPosition.x - 1, y: centerPosition.y - 1 },
      { name: "snowflake", component: Snowflake },
      "text-blue-100",
      "bg-blue-950"
    );

    setIconAt(
      { x: centerPosition.x + 1, y: centerPosition.y - 1 },
      { name: "droplets", component: Droplets },
      "text-blue-400",
      "bg-cyan-900"
    );

    setIconAt(
      { x: centerPosition.x - 1, y: centerPosition.y + 1 },
      { name: "star", component: Star },
      "text-yellow-200",
      "bg-amber-900"
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

          // Highlight the center position
          const isCenter =
            item.position.x === centerPosition.x &&
            item.position.y === centerPosition.y;

          const centerClass = isCenter ? "" : "";

          return (
            <div
              key={`${item.position.x}-${item.position.y}`}
              className={`size-10 flex items-center justify-center ${item.bgColor} ${centerClass}`}
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
      </div>
    </div>
  );
}
