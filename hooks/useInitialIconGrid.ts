import getRandomIcons from "@/lib/iconList.util";
import { Heart, LucideProps } from "lucide-react";
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

export const useInitialIconGrid = (initialDensity = 0.33) => {
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
  const [density, setDensity] = useState(initialDensity);

  // Available icons collection
  const availableIcons = getRandomIcons({
    friends: 4,
    inventory: 4,
    animals: 6,
  });

  // Available colors collection
  const iconColors = [
    "text-red-500",
    "text-blue-500",
    "text-green-500",
    "text-yellow-400",
    "text-purple-500",
    "text-pink-500",
    "text-orange-500",
    "text-teal-500",
    "text-indigo-500",
    "text-rose-500",
  ];

  // Generate empty black grid item
  const generateEmptyItem = (x: number, y: number): GridItem => {
    return {
      icon: { name: "heart", component: Heart }, // Default icon, will be invisible due to color
      iconColor: "text-black", // Black icon on black background = invisible
      bgColor: "bg-transparent", // No background color
      position: { x, y },
    };
  };

  // Function to get a random item from an array
  const getRandomItem = <T>(items: T[]): T => {
    return items[Math.floor(Math.random() * items.length)];
  };

  // This function is no longer needed since we're now using currentDensity parameter directly

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

  // Update density function
  const updateDensity = (newDensity: number) => {
    const clampedDensity = Math.max(0, Math.min(1, newDensity));
    setDensity(clampedDensity);

    // Re-initialize the grid with the new density
    if (isInitialized) {
      setIsInitialized(false);
      initializeGrid(clampedDensity);
    }
  };

  // Initialize grid with random icons based on density
  const initializeGrid = (currentDensity: number) => {
    if (typeof window === "undefined") return;

    // Set the density state with the current density parameter
    setDensity(currentDensity);

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
        // Generate base empty item
        const baseItem = generateEmptyItem(x, y);

        // For the center position, always place a heart with a star on top
        if (x === centerPosition.x && y === centerPosition.y) {
          items.push({
            ...baseItem,
            icon: { name: "heart", component: Heart },
            iconColor: "text-red-500",
            bgColor: "bg-transparent",
          });
          continue;
        }

        // For other positions, randomly place icons based on density
        // Use the passed-in currentDensity parameter for the check
        if (Math.random() < currentDensity) {
          const randomIcon = getRandomItem(availableIcons);
          const randomColor = getRandomItem(iconColors);

          items.push({
            ...baseItem,
            icon: randomIcon,
            iconColor: randomColor,
            bgColor: "bg-transparent",
          });
        } else {
          // Keep empty (transparent) items
          items.push(baseItem);
        }
      }
    }

    setGridItems(items);
  };

  // Initialize grid when component mounts
  useEffect(() => {
    initializeGrid(density);

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
    density,
    updateDensity,
  };
};
