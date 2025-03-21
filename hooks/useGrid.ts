import { useEffect, useState } from "react";

export type GridPosition = {
  x: number;
  y: number;
};

export type GridItem = {
  position: GridPosition;
  renderPosition: GridPosition;
};

export const useGrid = () => {
  // Fixed grid size of 50x50
  const gridWidth = 50;
  const gridHeight = 50;

  const [gridItems, setGridItems] = useState<GridItem[]>([]);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [centerPosition] = useState<GridPosition>({
    x: Math.floor(gridWidth / 2),
    y: Math.floor(gridHeight / 2),
  });

  // Initialize grid when component mounts
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Calculate viewport size in grid units (40px per grid cell)
    const calculateViewportSize = () => {
      const squareSize = 40; // size-10 = 2.5rem = 40px
      const viewportColumns = Math.floor(window.innerWidth / squareSize);
      const viewportRows = Math.floor(window.innerHeight / squareSize);

      return {
        width: Math.min(viewportColumns, gridWidth),
        height: Math.min(viewportRows, gridHeight),
      };
    };

    // Initialize the empty grid
    const initializeGrid = () => {
      const newViewportSize = calculateViewportSize();
      setViewportSize(newViewportSize);

      // Generate initial grid items for the entire 50x50 grid
      const items: GridItem[] = [];

      for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
          items.push({
            position: { x, y },
            renderPosition: { x: 0, y: 0 }, // Will be calculated later
          });
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
