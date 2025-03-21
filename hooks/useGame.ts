import useIsMounted from "@/hooks/useIsMounted";
import { icons } from "@/lib/iconList.util";
import { Heart, LucideProps } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

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
  renderPosition?: {
    x: number;
    y: number;
  };
  isAdjacentToPlayer?: boolean;
};

export type GridPosition = {
  x: number;
  y: number;
};

export type ViewportInfo = {
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
};

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

export const useGame = (initialDensity = 0.33) => {
  const isMounted = useIsMounted();

  // Fixed grid size of 50x50
  const gridWidth = 50;
  const gridHeight = 50;

  // Full grid state - stores all 50x50 grid items
  const [fullGridItems, setFullGridItems] = useState<GridItem[]>([]);

  // Viewport state - represents what's visible on screen
  const [viewport, setViewport] = useState<ViewportInfo>({
    width: 0,
    height: 0,
    offsetX: 0,
    offsetY: 0,
  });

  // Center position of the grid
  const [centerPosition] = useState<GridPosition>({
    x: Math.floor(gridWidth / 2),
    y: Math.floor(gridHeight / 2),
  });

  const [isInitialized, setIsInitialized] = useState(false);
  const [density, setDensity] = useState(initialDensity);

  // Available icons collection
  const availableIcons = icons;

  // Generate empty grid item
  const generateEmptyItem = (x: number, y: number): GridItem => {
    return {
      icon: { name: "empty", component: Heart }, // Just a placeholder, won't be rendered
      iconColor: "text-transparent", // Transparent, so it's invisible
      bgColor: "bg-transparent", // No background color
      position: { x, y },
      isAdjacentToPlayer: false,
    };
  };

  // Get a random item from an array
  const getRandomItem = <T>(items: T[]): T => {
    return items[Math.floor(Math.random() * items.length)];
  };

  // Set an icon at a specific position - only works before initialization is complete
  const setIconAt = useCallback(
    (
      position: GridPosition,
      icon: IconInfo,
      iconColor: string,
      bgColor: string
    ) => {
      if (isInitialized) {
        // Block functionality after initialization
        return;
      }

      setFullGridItems((prevItems) => {
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
            isAdjacentToPlayer: false,
          });
        }

        return newItems;
      });
    },
    [isInitialized]
  );

  // Initialize the full grid with icons
  const initializeFullGrid = useCallback(() => {
    if (typeof window === "undefined") return;

    // Calculate viewport size in grid units
    const squareSize = 40; // size-10 = 2.5rem = 40px
    const viewportColumns = Math.floor(window.innerWidth / squareSize);
    const viewportRows = Math.floor(window.innerHeight / squareSize);

    // Update viewport state
    setViewport({
      width: Math.min(viewportColumns, gridWidth),
      height: Math.min(viewportRows, gridHeight),
      offsetX: Math.max(0, centerPosition.x - Math.floor(viewportColumns / 2)),
      offsetY: Math.max(0, centerPosition.y - Math.floor(viewportRows / 2)),
    });

    // Generate items for the entire 50x50 grid
    const items: GridItem[] = [];

    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        // For all positions, randomly place icons based on density
        if (Math.random() < density) {
          const randomIcon = getRandomItem(availableIcons);
          const randomColor = getRandomItem(iconColors);

          items.push({
            ...generateEmptyItem(x, y),
            icon: randomIcon,
            iconColor: randomColor,
          });
        } else {
          // Keep empty items
          items.push(generateEmptyItem(x, y));
        }
      }
    }

    setFullGridItems(items);
  }, [availableIcons, centerPosition.x, centerPosition.y, density]);

  // Determine which grid items are adjacent to the player
  const updateAdjacentItems = useCallback(() => {
    // The player is at the center of the viewport
    const playerX = viewport.offsetX + Math.floor(viewport.width / 2);
    const playerY = viewport.offsetY + Math.floor(viewport.height / 2);

    // Check the 4 grid positions that meet at the player's vertex
    // These are the top-left, top-right, bottom-left, and bottom-right squares from the player's position
    const adjacentPositions = [
      { x: playerX, y: playerY }, // top-left
      { x: playerX + 1, y: playerY }, // top-right
      { x: playerX, y: playerY + 1 }, // bottom-left
      { x: playerX + 1, y: playerY + 1 }, // bottom-right
    ];

    setFullGridItems((prevItems) => {
      // Create a new array to avoid mutating the state directly
      return prevItems.map((item) => {
        // Check if this item is in one of the 4 adjacent positions
        const isAdjacent = adjacentPositions.some(
          (pos) => pos.x === item.position.x && pos.y === item.position.y
        );

        // Update only the adjacency flag, not the color
        return {
          ...item,
          isAdjacentToPlayer: isAdjacent,
        };
      });
    });
  }, [viewport]);

  // Check if moving in a direction would reach the map boundary at the player position
  const wouldReachMapBoundary = useCallback(
    (dx: number, dy: number) => {
      // Player position in world coordinates
      const playerWorldX = viewport.offsetX + Math.floor(viewport.width / 2);
      const playerWorldY = viewport.offsetY + Math.floor(viewport.height / 2);

      // Calculate new position after potential movement
      const newPlayerWorldX = playerWorldX + dx;
      const newPlayerWorldY = playerWorldY + dy;

      // Check if the new position would be outside the map boundaries
      // For right and bottom edges, subtract 1 to prevent going beyond the map
      // Since grid is 0-indexed, the valid range is 0 to gridWidth-1 and 0 to gridHeight-1
      if (
        newPlayerWorldX < 0 ||
        newPlayerWorldX >= gridWidth - 1 || // Subtract 1 for right edge
        newPlayerWorldY < 0 ||
        newPlayerWorldY >= gridHeight - 1 // Subtract 1 for bottom edge
      ) {
        return true;
      }

      return false;
    },
    [viewport, gridWidth, gridHeight]
  );

  // Update viewport position (for scrolling/movement)
  const moveViewport = useCallback(
    (dx: number, dy: number) => {
      // Check if moving would reach the map boundary
      if (wouldReachMapBoundary(dx, dy)) {
        // If so, don't allow the movement
        return;
      }

      setViewport((prev) => {
        // Calculate new offset - enforce grid boundaries
        const newOffsetX = prev.offsetX + dx;
        const newOffsetY = prev.offsetY + dy;

        return {
          ...prev,
          offsetX: newOffsetX,
          offsetY: newOffsetY,
        };
      });

      // We'll update adjacent items after the state update is complete
      // using the useEffect below, not here
    },
    [wouldReachMapBoundary]
  );

  // Mark initialization as complete
  const completeInitialization = useCallback(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      // Initial update of adjacent items
      updateAdjacentItems();
    }
  }, [isInitialized, updateAdjacentItems]);

  // Get visible grid items based on current viewport
  const getVisibleItems = useCallback(() => {
    // Check if viewport and grid are initialized
    if (
      viewport.width === 0 ||
      viewport.height === 0 ||
      fullGridItems.length === 0
    ) {
      return [];
    }

    // Filter grid items within the current viewport
    const visibleItems = fullGridItems.filter((item) => {
      return (
        item.position.x >= viewport.offsetX &&
        item.position.x < viewport.offsetX + viewport.width &&
        item.position.y >= viewport.offsetY &&
        item.position.y < viewport.offsetY + viewport.height
      );
    });

    // Add render positions for visible items
    return visibleItems.map((item) => ({
      ...item,
      renderPosition: {
        x: item.position.x - viewport.offsetX,
        y: item.position.y - viewport.offsetY,
      },
    }));
  }, [fullGridItems, viewport]);

  useEffect(() => {
    if (isMounted) return;
    initializeFullGrid();

    // Handle window resize
    const handleResize = () => {
      const squareSize = 40;
      const viewportColumns = Math.floor(window.innerWidth / squareSize);
      const viewportRows = Math.floor(window.innerHeight / squareSize);

      setViewport((prev) => ({
        width: Math.min(viewportColumns, gridWidth),
        height: Math.min(viewportRows, gridHeight),
        offsetX: prev.offsetX,
        offsetY: prev.offsetY,
      }));
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [initializeFullGrid, gridWidth, gridHeight, isMounted]);

  // Effect to update adjacent items whenever the viewport changes
  useEffect(() => {
    if (isInitialized) {
      // This ensures we update the adjacent items after the viewport has changed
      updateAdjacentItems();
    }
  }, [viewport.offsetX, viewport.offsetY, isInitialized, updateAdjacentItems]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isInitialized) return;

      switch (e.key) {
        case "ArrowDown":
          // When player moves up, grid should move down
          moveViewport(0, 1);
          break;
        case "ArrowUp":
          // When player moves down, grid should move up
          moveViewport(0, -1);
          break;
        case "ArrowRight":
          // When player moves left, grid should move right
          moveViewport(1, 0);
          break;
        case "ArrowLeft":
          // When player moves right, grid should move left
          moveViewport(-1, 0);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isInitialized, moveViewport]);

  return {
    gridItems: getVisibleItems(),
    allGridItems: fullGridItems,
    gridSize: {
      width: viewport.width,
      height: viewport.height,
    },
    totalGridSize: {
      width: gridWidth,
      height: gridHeight,
    },
    centerPosition,
    setIconAt,
    isInitialized,
    completeInitialization,
    density,
    updateDensity: setDensity,
    moveViewport,
  };
};

export default useGame;
