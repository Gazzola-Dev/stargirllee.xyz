import { icons } from "@/lib/iconList.util";
import { LucideProps } from "lucide-react";
import { useEffect, useState } from "react";

// Type definitions
export type IconInfo = {
  name: string;
  component: React.ComponentType<LucideProps>;
};

export type AnimationType =
  | "pulse"
  | "bounce"
  | "spin"
  | "shake"
  | "flip"
  | "none";

export type GridItem = {
  icon: IconInfo;
  iconColor: string;
  bgColor: string;
  animation: AnimationType;
  isAnimating: boolean;
};

export const useIconGrid = () => {
  const [gridItems, setGridItems] = useState<GridItem[]>([]);
  const [gridSize, setGridSize] = useState({ width: 0, height: 0 });

  // Color options
  const iconColors = [
    "text-red-400",
    "text-blue-400",
    "text-green-400",
    "text-yellow-300",
    "text-purple-400",
    "text-pink-400",
    "text-indigo-400",
    "text-teal-400",
  ];

  const bgColors = [
    "bg-red-900",
    "bg-blue-900",
    "bg-green-900",
    "bg-yellow-900",
    "bg-purple-900",
    "bg-pink-900",
    "bg-indigo-900",
    "bg-teal-900",
  ];

  const animations: AnimationType[] = [
    "pulse",
    "bounce",
    "spin",
    "shake",
    "flip",
  ];

  // Generate a random item for the grid
  const generateRandomItem = (): GridItem => {
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    const randomIconColor =
      iconColors[Math.floor(Math.random() * iconColors.length)];
    const randomBgColor = bgColors[Math.floor(Math.random() * bgColors.length)];
    const randomAnimation =
      animations[Math.floor(Math.random() * animations.length)];

    return {
      icon: randomIcon,
      iconColor: randomIconColor,
      bgColor: randomBgColor,
      animation: randomAnimation,
      isAnimating: false,
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

  // Function to handle icon click
  const handleIconClick = (index: number) => {
    setGridItems((prevItems) => {
      const newItems = [...prevItems];
      newItems[index] = {
        ...newItems[index],
        isAnimating: true,
      };

      // Reset animation after 1 second
      setTimeout(() => {
        setGridItems((prevItems) => {
          const items = [...prevItems];
          if (items[index]) {
            items[index] = {
              ...items[index],
              isAnimating: false,
            };
          }
          return items;
        });
      }, 1000);

      return newItems;
    });
  };

  return {
    gridItems,
    gridSize,
    handleIconClick,
  };
};
