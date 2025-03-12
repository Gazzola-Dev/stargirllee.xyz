"use client";

import { icons } from "@/lib/iconList.util";
import { LucideProps } from "lucide-react";
import React, { useEffect, useState } from "react";

// Type definitions
type IconInfo = {
  name: string;
  component: React.ComponentType<LucideProps>;
};

type GridItem = {
  icon: IconInfo;
  iconColor: string;
  bgColor: string;
};

export default function IconGridPage() {
  const [gridItems, setGridItems] = useState<GridItem[]>([]);
  const [gridSize, setGridSize] = useState({ width: 0, height: 0 });

  // Color options
  const iconColors = [
    "text-red-500",
    "text-blue-500",
    "text-green-500",
    "text-yellow-500",
    "text-purple-500",
    "text-pink-500",
    "text-indigo-500",
    "text-teal-500",
  ];

  const bgColors = [
    "bg-red-100",
    "bg-blue-100",
    "bg-green-100",
    "bg-yellow-100",
    "bg-purple-100",
    "bg-pink-100",
    "bg-indigo-100",
    "bg-teal-100",
  ];

  // Generate a random item for the grid
  const generateRandomItem = (): GridItem => {
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    const randomIconColor =
      iconColors[Math.floor(Math.random() * iconColors.length)];
    const randomBgColor = bgColors[Math.floor(Math.random() * bgColors.length)];

    return {
      icon: randomIcon,
      iconColor: randomIconColor,
      bgColor: randomBgColor,
    };
  };

  // Initialize grid when component mounts and when window resizes
  useEffect(() => {
    const calculateGridSize = () => {
      if (typeof window === "undefined") return;

      // Calculate how many squares we can fit
      const squareSize = 40; // size-10 = 2.5rem = 40px
      const columns = Math.floor(window.innerWidth / squareSize);
      const rows = Math.floor(window.innerHeight / squareSize);

      setGridSize({ width: columns, height: rows });

      // Generate grid items based on calculated grid dimensions
      const totalSquares = columns * rows;
      const newItems = Array(totalSquares)
        .fill(null)
        .map(() => generateRandomItem());
      setGridItems(newItems);
    };

    // Calculate initial grid
    calculateGridSize();

    // Update grid when window resizes
    window.addEventListener("resize", calculateGridSize);

    return () => {
      window.removeEventListener("resize", calculateGridSize);
    };
  }, []);

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
