"use client";

import { useIconGrid } from "@/hooks/useIconGrid";

export default function IconGridPage() {
  const { gridItems, gridSize } = useIconGrid();

  return (
    <div
      className="flex flex-wrap"
      style={{
        width: `${gridSize.width * 40}px`,
        height: `${gridSize.height * 40}px`,
      }}
    >
      {gridItems.map((item, index) => {
        const IconComponent = item.icon.component;

        return (
          <div
            key={index}
            className={`size-10 flex items-center justify-center ${item.bgColor}`}
          >
            <IconComponent className={`size-8 ${item.iconColor}`} />
          </div>
        );
      })}
    </div>
  );
}
