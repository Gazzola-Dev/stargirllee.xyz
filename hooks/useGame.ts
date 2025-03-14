import { CircleOff, Heart, LucideIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { GridPosition, useGrid } from "./useGrid";

// Type definitions for game items
export type GameIconInfo = {
  name: string;
  component: LucideIcon;
};

export type GameGridItem = {
  icon: GameIconInfo;
  iconColor: string;
  bgColor: string;
  position: GridPosition;
  renderPosition: GridPosition;
  isCenter?: boolean;
};

// Direction type for movement
type Direction = "up" | "down" | "left" | "right";

export const useGame = () => {
  // Get basic grid functionality from useGrid
  const { gridItems, gridSize, totalGridSize, centerPosition } = useGrid();

  // Game state
  const [gameMap, setGameMap] = useState<GameGridItem[]>([]);
  const [initialized, setInitialized] = useState(false);

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

  // Placeholder empty icon
  const emptyIcon: GameIconInfo = {
    name: "empty",
    component: CircleOff,
  };

  // Initialize the game map
  const initializeGameMap = useCallback(() => {
    if (gridItems.length === 0) return;

    const newGameMap: GameGridItem[] = gridItems.map((item) => {
      // Check if this is the center position
      const isCenter =
        item.position.x === centerPosition.x &&
        item.position.y === centerPosition.y;

      if (isCenter) {
        // Center position gets heart with specific styling
        return {
          icon: { name: "heart", component: Heart },
          iconColor: "text-red-500",
          bgColor: "bg-black",
          position: item.position,
          renderPosition: item.renderPosition,
          isCenter: true,
        };
      }

      // Random chance to place an icon (around 33%)
      if (Math.random() < 0.33) {
        // Get a random color
        const randomColor =
          iconColors[Math.floor(Math.random() * iconColors.length)];

        return {
          icon: emptyIcon, // We'll just use empty icons for now
          iconColor: randomColor,
          bgColor: "bg-transparent",
          position: item.position,
          renderPosition: item.renderPosition,
          isCenter: false,
        };
      }

      // Default empty item
      return {
        icon: emptyIcon,
        iconColor: "text-transparent",
        bgColor: "bg-transparent",
        position: item.position,
        renderPosition: item.renderPosition,
        isCenter: false,
      };
    });

    setGameMap(newGameMap);
    setInitialized(true);
  }, [gridItems, centerPosition]);

  // Initialize game when grid is ready
  useEffect(() => {
    if (gridItems.length > 0 && !initialized) {
      initializeGameMap();
    }
  }, [gridItems, initialized, initializeGameMap]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          moveItems("up");
          break;
        case "ArrowDown":
          moveItems("down");
          break;
        case "ArrowLeft":
          moveItems("left");
          break;
        case "ArrowRight":
          moveItems("right");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameMap]);

  // Move items in the opposite direction of the key press
  const moveItems = (direction: Direction) => {
    setGameMap((prevMap) => {
      const newMap = [...prevMap];

      // We'll move all non-center items in the opposite direction
      newMap.forEach((item) => {
        if (item.isCenter) return; // Skip the center item

        const newPosition = { ...item.position };

        switch (direction) {
          case "up":
            // Move down (opposite of up)
            newPosition.y = (newPosition.y + 1) % totalGridSize.height;
            break;
          case "down":
            // Move up (opposite of down)
            newPosition.y =
              (newPosition.y - 1 + totalGridSize.height) % totalGridSize.height;
            break;
          case "left":
            // Move right (opposite of left)
            newPosition.x = (newPosition.x + 1) % totalGridSize.width;
            break;
          case "right":
            // Move left (opposite of right)
            newPosition.x =
              (newPosition.x - 1 + totalGridSize.width) % totalGridSize.width;
            break;
        }

        item.position = newPosition;
      });

      return newMap;
    });
  };

  // Filter game items to match visible grid items
  const visibleGameItems = gameMap
    .filter((item) =>
      gridItems.some(
        (gridItem) =>
          gridItem.position.x === item.position.x &&
          gridItem.position.y === item.position.y
      )
    )
    .map((item) => {
      // Find the matching grid item to get the current render position
      const matchingGridItem = gridItems.find(
        (gridItem) =>
          gridItem.position.x === item.position.x &&
          gridItem.position.y === item.position.y
      );

      if (matchingGridItem) {
        return {
          ...item,
          renderPosition: matchingGridItem.renderPosition,
        };
      }

      return item;
    });

  return {
    gameItems: visibleGameItems,
    gridSize,
    centerPosition,
    initialized,
  };
};

export default useGame;
