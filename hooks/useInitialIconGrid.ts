import { icons } from "@/lib/iconList.util";
import { LucideProps } from "lucide-react";
import { useEffect, useState } from "react";

// Type definitions
export type IconInfo = {
  name: string;
  component: React.ComponentType<LucideProps>;
};

export type GridItem = {
  icon: IconInfo;
  iconColor: string;
  bgColor: string;
  position: {
    x: number;
    y: number;
  };
};

export type GridPosition = {
  x: number;
  y: number;
};

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

export const useInitialIconGrid = () => {
  // Fixed grid size of 50x50
  const fixedGridWidth = 50;
  const fixedGridHeight = 50;

  const [gridItems, setGridItems] = useState<GridItem[]>([]);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [centerPosition] = useState<GridPosition>({
    x: Math.floor(fixedGridWidth / 2),
    y: Math.floor(fixedGridHeight / 2),
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // Generate a random item for the grid
  const generateRandomItem = (x: number, y: number): GridItem => {
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    const randomIconColor =
      iconColors[Math.floor(Math.random() * iconColors.length)];
    const randomBgColor = bgColors[Math.floor(Math.random() * bgColors.length)];

    return {
      icon: randomIcon,
      iconColor: randomIconColor,
      bgColor: randomBgColor,
      position: { x, y },
    };
  };

  // Function to set an icon at a specific position - only works before initialization is complete
  const setIconAt = (
    position: GridPosition,
    icon: IconInfo,
    iconColor: string,
    bgColor: string
  ) => {
    if (isInitialized) {
      // Block functionality after initialization
      return;
    }

    setGridItems((prevItems) => {
      // Create a new array to avoid mutating the state directly
      const newItems = [...prevItems];

      // Find the index of the item at the given position
      const itemIndex = newItems.findIndex(
        (item) =>
          item.position.x === position.x && item.position.y === position.y
      );

      // If an item exists at the position, update it
      if (itemIndex !== -1) {
        newItems[itemIndex] = {
          ...newItems[itemIndex],
          icon,
          iconColor,
          bgColor,
        };
      } else {
        // If no item exists, add a new one
        newItems.push({
          icon,
          iconColor,
          bgColor,
          position,
        });
      }

      return newItems;
    });
  };

  // Initialize grid when component mounts
  useEffect(() => {
    const initializeGrid = () => {
      if (typeof window === "undefined") return;

      // Calculate viewport size in grid units
      const squareSize = 40; // size-10 = 2.5rem = 40px
      const viewportColumns = Math.floor(window.innerWidth / squareSize);
      const viewportRows = Math.floor(window.innerHeight / squareSize);

      setViewportSize({
        width: Math.min(viewportColumns, fixedGridWidth),
        height: Math.min(viewportRows, fixedGridHeight),
      });

      // Generate initial grid items for the entire 50x50 grid
      const items: GridItem[] = [];

      for (let y = 0; y < fixedGridHeight; y++) {
        for (let x = 0; x < fixedGridWidth; x++) {
          items.push(generateRandomItem(x, y));
        }
      }

      setGridItems(items);
    };

    // Initialize the grid
    initializeGrid();

    // Handle window resize
    const handleResize = () => {
      const squareSize = 40;
      const viewportColumns = Math.floor(window.innerWidth / squareSize);
      const viewportRows = Math.floor(window.innerHeight / squareSize);

      setViewportSize({
        width: Math.min(viewportColumns, fixedGridWidth),
        height: Math.min(viewportRows, fixedGridHeight),
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Mark initialization as complete after component setup and initial customizations
  const completeInitialization = () => {
    if (!isInitialized) {
      setIsInitialized(true);
    }
  };

  // Calculate visible area based on the center position
  const calculateVisibleItems = () => {
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
    const endX = Math.min(fixedGridWidth, startX + viewportSize.width);
    const endY = Math.min(fixedGridHeight, startY + viewportSize.height);

    // Re-adjust startX and startY if we're at grid edges
    const adjustedStartX = Math.max(
      0,
      fixedGridWidth - viewportSize.width < 0
        ? (fixedGridWidth - viewportSize.width) / 2
        : startX
    );
    const adjustedStartY = Math.max(
      0,
      fixedGridHeight - viewportSize.height < 0
        ? (fixedGridHeight - viewportSize.height) / 2
        : startY
    );

    // Filter grid items for visible area
    return gridItems.filter((item) => {
      return (
        item.position.x >= adjustedStartX &&
        item.position.x < endX &&
        item.position.y >= adjustedStartY &&
        item.position.y < endY
      );
    });
  };

  // Get the visible items and their render positions
  const visibleItems = calculateVisibleItems().map((item) => {
    // Calculate the viewport offset
    const startX = Math.max(
      0,
      centerPosition.x - Math.floor(viewportSize.width / 2)
    );
    const startY = Math.max(
      0,
      centerPosition.y - Math.floor(viewportSize.height / 2)
    );

    // Adjust for edge cases
    const adjustedStartX = Math.max(
      0,
      fixedGridWidth - viewportSize.width < 0
        ? (fixedGridWidth - viewportSize.width) / 2
        : startX
    );
    const adjustedStartY = Math.max(
      0,
      fixedGridHeight - viewportSize.height < 0
        ? (fixedGridHeight - viewportSize.height) / 2
        : startY
    );

    // Calculate render position relative to viewport
    return {
      ...item,
      renderPosition: {
        x: item.position.x - adjustedStartX,
        y: item.position.y - adjustedStartY,
      },
    };
  });

  return {
    gridItems: visibleItems,
    allGridItems: gridItems,
    gridSize: {
      width: viewportSize.width,
      height: viewportSize.height,
    },
    totalGridSize: {
      width: fixedGridWidth,
      height: fixedGridHeight,
    },
    centerPosition,
    setIconAt,
    isInitialized,
    completeInitialization,
  };
};
