import * as PIXI from 'pixi.js';
import { createIsometricTile, cartesianToIsometric } from '../utils/isometricUtils';



export const createLevel = (container, app) => {
  const tileSize = 50;
  const obstacles = []; // Track obstacles for collision detection
  
  // Create floor
  const floor = new PIXI.Container();
  floor.zIndex = -10;
  container.addChild(floor);
  
  // Helper function for isometric positioning
  const iso = (x, y) => {
    return cartesianToIsometric(x, y);
  };
  
  // Room floor tiles
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
  
  // Create a container for walls
  const walls = new PIXI.Container();
  walls.sortableChildren = true;
  container.addChild(walls);
  
  // Create the left wall
  for (let y = -10; y <= 10; y++) {
    const x = -10; // Fixed X for left wall
    const wallHeight = 60;
    
    // Get the isometric position for this grid coordinate
    const pos = iso(x, y);
    
    // Create wall segment
    const wallSegment = new PIXI.Graphics();
    
    // Wall base - brown color
    wallSegment.beginFill(0x8B4513); // Brown color
    
    // Draw the wall with proper dimensions
    wallSegment.drawRect(0, -wallHeight, tileSize/2, wallHeight);
    
    // Shading for 3D effect
    wallSegment.beginFill(0x6B3513, 0.7); // Darker brown for side
    wallSegment.drawRect(tileSize/2, -wallHeight, tileSize/4, wallHeight);
    wallSegment.endFill();
    
    // Position and add the segment
    wallSegment.position.set(pos.x, pos.y - tileSize/4);
    wallSegment.zIndex = pos.y;
    walls.addChild(wallSegment);
    
    // Create collision box that matches the wall exactly
    const collisionBox = new PIXI.Sprite();
    collisionBox.width = tileSize/2 + tileSize/4;
    collisionBox.height = wallHeight;
    
    // Position it at the same place as the wall segment
    collisionBox.position.set(pos.x, pos.y - wallHeight);
    
    // Make interactive and set hit area
    collisionBox.interactive = true;
    collisionBox.hitArea = new PIXI.Rectangle(0, 0, tileSize/2 + tileSize/4, wallHeight);
    
    // Add to the same container as the cat for easier position comparison
    container.addChild(collisionBox);
    
    // Make collision box completely invisible
    collisionBox.alpha = 0;
    
    // Store for collision detection
    obstacles.push(collisionBox);
  }
  
  return { obstacles, exits: [] };
};


