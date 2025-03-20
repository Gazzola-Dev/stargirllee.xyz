import getRandomIcons, { icons } from "@/lib/_iconList.util";
import { useEffect, useState } from "react";

export type GridPosition = {
  x: number;
  y: number;
};

export type IconItem = {
  name: string;
  component: React.FC<React.SVGProps<SVGSVGElement>>;
  iconColor: string;
};

export type GridItem = {
  position: GridPosition;
  renderPosition: GridPosition;
  icons: IconItem[];
  bgColor: string;
};

export const useGrid = () => {
  // Fixed grid size of 100x100 (doubled from 50x50 since we're halving the square size)
  const gridWidth = 100;
  const gridHeight = 100;

  const [gridItems, setGridItems] = useState<GridItem[]>([]);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [centerPosition] = useState<GridPosition>({
    x: Math.floor(gridWidth / 2),
    y: Math.floor(gridHeight / 2),
  });

  // Define possible colors for icons and backgrounds
  const iconColors = [
    "text-black dark:text-white",
    "text-red-500",
    "text-blue-500",
    "text-green-500",
    "text-yellow-500",
    "text-purple-500",
    "text-pink-500",
    "text-indigo-500",
  ];

  const bgColors = [
    "bg-transparent",
    "bg-red-100 dark:bg-red-900",
    "bg-blue-100 dark:bg-blue-900",
    "bg-green-100 dark:bg-green-900",
    "bg-yellow-100 dark:bg-yellow-900",
    "bg-purple-100 dark:bg-purple-900",
    "bg-pink-100 dark:bg-pink-900",
    "bg-indigo-100 dark:bg-indigo-900",
  ];

  // Function to get a random item from an array
  const getRandomItem = <T>(items: T[]): T => {
    return items[Math.floor(Math.random() * items.length)];
  };

  // Function to generate a random icon with a color
  const getRandomIconWithColor = (): IconItem => {
    // Get icons from random categories
    const randomIcons = getRandomIcons();
    const icon =
      randomIcons.length > 0
        ? getRandomItem(randomIcons)
        : getRandomItem(icons);

    return {
      name: icon.name,
      component: icon.component,
      iconColor: getRandomItem(iconColors),
    };
  };

  // Generate a single icon instead of a stack
  const generateSingleIcon = (): IconItem[] => {
    return [getRandomIconWithColor()];
  };

  // Initialize grid when component mounts
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Calculate viewport size in grid units (20px per grid cell - half of the original 40px)
    const calculateViewportSize = () => {
      const squareSize = 20; // Half of the original size (40px)
      const viewportColumns = Math.floor(window.innerWidth / squareSize);
      const viewportRows = Math.floor(window.innerHeight / squareSize);

      return {
        width: Math.min(viewportColumns, gridWidth),
        height: Math.min(viewportRows, gridHeight),
      };
    };

    // Initialize the grid with sparse icons
    const initializeGrid = () => {
      const newViewportSize = calculateViewportSize();
      setViewportSize(newViewportSize);

      // Generate initial grid items sparsely (only about 10% of grid cells will have icons)
      const items: GridItem[] = [];

      for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
          // Only create an icon at ~10% of positions
          if (Math.random() < 0.1) {
            items.push({
              position: { x, y },
              renderPosition: { x: 0, y: 0 }, // Will be calculated later
              icons: generateSingleIcon(),
              bgColor: getRandomItem(bgColors),
            });
          }
        }
      }

      setGridItems(items);
    };

    initializeGrid();

    // Handle window resize
    const handleResize = () => {
      setViewportSize(calculateViewportSize());
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Calculate visible area and render positions based on the center position
  const calculateVisibleItems = () => {
    if (gridItems.length === 0) return [];

    // Calculate viewport offset to center the grid
    const startX = Math.max(
      0,
      centerPosition.x - Math.floor(viewportSize.width / 2)
    );
    const startY = Math.max(
      0,
      centerPosition.y - Math.floor(viewportSize.height / 2)
    );

    // Handle edge cases when center is near grid edges
    const endX = Math.min(gridWidth, startX + viewportSize.width);
    const endY = Math.min(gridHeight, startY + viewportSize.height);

    // Re-adjust startX and startY if we're at grid edges
    const adjustedStartX = Math.max(
      0,
      gridWidth - viewportSize.width < 0
        ? (gridWidth - viewportSize.width) / 2
        : startX
    );
    const adjustedStartY = Math.max(
      0,
      gridHeight - viewportSize.height < 0
        ? (gridHeight - viewportSize.height) / 2
        : startY
    );

    // Filter grid items for visible area and calculate render positions
    return gridItems
      .filter((item) => {
        return (
          item.position.x >= adjustedStartX &&
          item.position.x < endX &&
          item.position.y >= adjustedStartY &&
          item.position.y < endY
        );
      })
      .map((item) => {
        return {
          ...item,
          renderPosition: {
            x: item.position.x - adjustedStartX,
            y: item.position.y - adjustedStartY,
          },
        };
      });
  };

  // Get the visible items and their render positions
  const visibleItems = calculateVisibleItems();

  return {
    gridItems: visibleItems,
    gridSize: {
      width: viewportSize.width,
      height: viewportSize.height,
    },
    totalGridSize: {
      width: gridWidth,
      height: gridHeight,
    },
    centerPosition,
  };
};

export default useGrid;
