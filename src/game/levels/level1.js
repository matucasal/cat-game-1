import * as PIXI from 'pixi.js';
import { createIsometricTile, cartesianToIsometric } from '../utils/isometricUtils';



export const createLevel = (container, app) => {
  const tileSize = 50;
  
  // Create floor
  const floor = new PIXI.Container();
  floor.zIndex = -10;
  container.addChild(floor);
  
  // Helper function for isometric positioning
  const iso = (x, y) => {
    return cartesianToIsometric(x, y);
  };
  
  // Room 1 (Living Room) - Already isometric
  for (let x = -10; x <= 10; x++) {
    for (let y = -10; y <= 10; y++) {
      const tile = createIsometricTile(tileSize, tileSize/2, 0xe0e0e0);
      const pos = iso(x, y);
      tile.position.set(pos.x, pos.y);
      
      // Add grid lines to each tile
      const gridLines = new PIXI.Graphics();
      gridLines.lineStyle(0.5, 0x999999, 0.3);
      gridLines.drawPolygon([
        0, tileSize/4,
        tileSize/2, 0,
        tileSize, tileSize/4,
        tileSize/2, tileSize/2
      ]);
      tile.addChild(gridLines);
      
      floor.addChild(tile);
    }
  }
  
  // Return empty collections since we removed all obstacles and exits
  return { obstacles: [], exits: [] };
};


