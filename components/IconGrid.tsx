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
    <div className="flex justify-center items-center min-h-screen">
      <div
        className="flex flex-wrap relative"
        style={{
          width: `${gridSize.width * 40}px`,
          height: `${gridSize.height * 40}px`,
        }}
      >
        {gridItems.map((item) => {
          return (
            <div
              key={`${item.position.x}-${item.position.y}`}
              className={`relative`}
              style={{
                position: "absolute",
                left: `${item.renderPosition.x * 40}px`,
                top: `${item.renderPosition.y * 40}px`,
                width: "40px",
                height: "40px",
              }}
            >
              <div
                className="absolute flex flex-col items-center"
                style={{
                  top: "20px", // Center the first icon vertically in the parent square
                  left: "20px", // Center horizontally
                  transform: "translate(-50%, -50%)", // Adjust to center the items
                  zIndex: 10,
                }}
              >
                {item.icons.map((icon, iconIndex) => {
                  const IconComponent = icon.component;
                  return (
                    <div
                      key={`icon-${iconIndex}`}
                      className="flex items-center justify-center"
                      style={{
                        width: "32px", // size-8 = 2rem = 32px
                        height: "32px",
                        marginTop: iconIndex > 0 ? "8px" : "0",
                      }}
                    >
                      <IconComponent className={`size-8 ${icon.iconColor}`} />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
