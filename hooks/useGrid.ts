import getRandomIcons, { icons } from "@/lib/_iconList.util";
import { useCallback, useEffect, useRef, useState } from "react";
import useInterval from "use-interval";

export type GridPosition = {
  x: number;
  y: number;
};

export type IconItem = {
  name: string;
  component: React.FC<React.SVGProps<SVGSVGElement>>;
  iconColor: string;
  opacity: number;
  isNew: boolean;
  createdAt: number;
  fadeSteps: number; // Track fade steps for discrete opacity changes
};

export type GridItem = {
  position: GridPosition;
  renderPosition: GridPosition;
  icons: IconItem[];
  bgColor: string;
  active: boolean;
};

const chanceRandomActive = 0.0001;
const chanceRandomName = 0.05;

const getRandomItem = <T>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
};

const getRandomIconWithColor = (isNew = false): IconItem => {
  // Get icons from random categories
  const randomIcons = getRandomIcons();
  const icon =
    randomIcons.length > 0 ? getRandomItem(randomIcons) : getRandomItem(icons);

  // Initial opacity is 1.0
  const opacity = 1.0;

  return {
    name: icon.name,
    component: icon.component,
    iconColor: getRandomItem(iconColors),
    opacity: opacity,
    isNew: isNew,
    createdAt: Date.now(),
    fadeSteps: 0, // Initial fade steps count
  };
};

// Define possible colors for icons and backgrounds
const iconColors = [
  "text-green-500",
  "text-green-400",
  "text-green-300",
  "text-green-200",
];

const bgColors = ["bg-transparent"];

// Generate a single icon
const generateSingleIcon = (isNew = false): IconItem[] => {
  return [getRandomIconWithColor(isNew)];
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

  // For tracking if animation is currently running
  const [isAnimating, setIsAnimating] = useState(true);

  // Keep track of the grid state for efficient updates
  const gridStateRef = useRef<Map<string, GridItem>>(new Map());
  // Define the number of steps for fading
  const totalFadeSteps = 12; // Will result in 12 * 250ms = 3 seconds of fade time

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

    // Initialize the grid with a few random active cells at the top
    const initializeGrid = () => {
      const newViewportSize = calculateViewportSize();
      setViewportSize(newViewportSize);

      // Create initial grid structure (all cells, mostly inactive)
      const items: GridItem[] = [];
      const tempGridState = new Map<string, GridItem>();

      for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
          // Only make the top row cells active with a 5% chance
          const active = y === 0 && Math.random() < 0.0;

          const gridItem: GridItem = {
            position: { x, y },
            renderPosition: { x: 0, y: 0 }, // Will be calculated later
            icons: active ? generateSingleIcon(true) : [], // Only active cells have icons
            bgColor: getRandomItem(bgColors),
            active: active,
          };

          items.push(gridItem);
          tempGridState.set(`${x}-${y}`, gridItem);
        }
      }

      setGridItems(items);
      gridStateRef.current = tempGridState;
    };

    initializeGrid();

    // Handle window resize
    const handleResize = () => {
      setViewportSize(calculateViewportSize());
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      setIsAnimating(false);
    };
  }, []);

  // Matrix animation function as a useCallback
  const updateMatrixAnimation = useCallback(() => {
    const currentTime = Date.now();
    const newGridState = new Map(gridStateRef.current);

    // Process grid cells from top to bottom for the cascading effect
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        const key = `${x}-${y}`;
        const gridItem = newGridState.get(key);

        if (!gridItem) continue;

        // Handle icon opacity step changes for existing active cells
        if (gridItem.active && gridItem.icons.length > 0) {
          const icon = gridItem.icons[0];

          // Apply the fading effect after 2 seconds
          if (currentTime - icon.createdAt > 2000) {
            // Check if we need to update the fade step
            icon.fadeSteps += 1;

            // Calculate new opacity based on fade steps
            if (icon.fadeSteps >= totalFadeSteps) {
              // Icon has fully faded, deactivate the cell
              gridItem.active = false;
              gridItem.icons = [];
            } else {
              // Decrease opacity in discrete steps
              icon.opacity = 1.0 - icon.fadeSteps / totalFadeSteps;
            }
          } else {
            // Reset the "new" status after the first interval
            icon.isNew = false;
          }

          console.count("updateMatrixAnimation");

          // 10% chance to change to a different icon
          if (Math.random() < chanceRandomName) {
            const newIconData = getRandomIconWithColor();
            icon.name = newIconData.name;
            icon.component = newIconData.component;
            // Keep original opacity, creation time and fade steps
          }
        }

        // Logic for activating new cells
        if (!gridItem.active) {
          // Check if the cell above is active (cascade effect)
          let shouldActivate = false;

          if (y > 0) {
            const cellAboveKey = `${x}-${y - 1}`;
            const cellAbove = newGridState.get(cellAboveKey);

            if (
              cellAbove &&
              cellAbove.active &&
              cellAbove.icons.length > 0 &&
              !cellAbove.icons[0].isNew
            ) {
              // Cell above was active in the last interval and not just created
              shouldActivate = true;
            }
          }

          // 5% random chance to activate any cell
          if (!shouldActivate && Math.random() < chanceRandomActive) {
            shouldActivate = true;
          }

          if (shouldActivate) {
            gridItem.active = true;
            gridItem.icons = generateSingleIcon(true); // Mark as new
          }
        }

        // Update the grid state
        newGridState.set(key, gridItem);
      }
    }

    // Update the grid state reference and trigger a re-render
    gridStateRef.current = newGridState;
    setGridItems(Array.from(newGridState.values()));
  }, []);

  // Use useInterval hook instead of window.setInterval
  useInterval(updateMatrixAnimation, isAnimating ? 50 : null);

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
          item.position.y < endY &&
          item.active // Only return active items
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
