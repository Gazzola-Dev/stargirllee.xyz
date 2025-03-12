"use client";

import { useIconGrid } from "@/hooks/useIconGrid";

export default function IconGridPage() {
  const { gridItems, gridSize, handleIconClick } = useIconGrid();

  // Animation classes mapping
  const getAnimationClass = (animation: string, isAnimating: boolean) => {
    if (!isAnimating) return "";

    switch (animation) {
      case "pulse":
        return "animate-pulse";
      case "bounce":
        return "animate-bounce";
      case "spin":
        return "animate-spin";
      case "shake":
        return "animate-shake";
      case "flip":
        return "animate-flip";
      default:
        return "";
    }
  };

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
        const animationClass = getAnimationClass(
          item.animation,
          item.isAnimating
        );

        return (
          <div
            key={index}
            className={`size-10 flex items-center justify-center ${item.bgColor} cursor-pointer`}
            onClick={() => handleIconClick(index)}
          >
            <IconComponent
              className={`size-8 ${item.iconColor} ${animationClass}`}
            />
          </div>
        );
      })}
    </div>
  );
}
