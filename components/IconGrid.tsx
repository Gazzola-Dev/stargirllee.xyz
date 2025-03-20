"use client";

import { useGrid } from "@/hooks/useGrid";
import useIsMounted from "@/hooks/useIsMounted";

export default function IconGrid() {
  const { gridItems, gridSize } = useGrid();
  const isMounted = useIsMounted();

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div
        className="flex flex-wrap relative"
        style={{
          width: `${gridSize.width * 20}px`,
          height: `${gridSize.height * 20}px`,
        }}
      >
        {gridItems.map((item) => {
          // Get only the first icon from the stack
          const icon = item.icons[0];
          const IconComponent = icon.component;

          // Determine icon color - white if it's new, otherwise use the assigned color
          const iconColorClass = icon.isNew ? "text-white" : icon.iconColor;

          return (
            <div
              key={`${item.position.x}-${item.position.y}`}
              className={`relative`}
              style={{
                position: "absolute",
                left: `${item.renderPosition.x * 20}px`,
                top: `${item.renderPosition.y * 20}px`,
                width: "20px",
                height: "20px",
              }}
            >
              <div
                className="absolute flex items-center justify-center transition-opacity"
                style={{
                  top: "10px", // Center the icon vertically in the smaller parent square
                  left: "10px", // Center horizontally
                  transform: "translate(-50%, -50%)", // Adjust to center the item
                  zIndex: 10,
                  opacity: icon.opacity,
                }}
              >
                <IconComponent className={`size-4 ${iconColorClass}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
