import * as PIXI from 'pixi.js';
import { createIsometricTile } from '../utils/isometricUtils';

export const createLevel = (container, app) => {
  const tileSize = 50;
  const obstacles = [];
  const exits = [];
  
  // Create floor
  const floor = new PIXI.Container();
  floor.zIndex = -10;
  container.addChild(floor);
  
  // Room 1 (Living Room)
  for (let x = -3; x <= 3; x++) {
    for (let y = -3; y <= 3; y++) {
      const tile = createIsometricTile(tileSize, tileSize, 0xe0e0e0);
      tile.position.set(x * tileSize, y * tileSize);
      floor.addChild(tile);
    }
  }
  
  // Room 2 (Bedroom)
  for (let x = 4; x <= 8; x++) {
    for (let y = -3; y <= 3; y++) {
      const tile = createIsometricTile(tileSize, tileSize, 0xd0d0ff);
      tile.position.set(x * tileSize, y * tileSize);
      floor.addChild(tile);
    }
  }
  
  // Create walls
  const walls = new PIXI.Container();
  walls.zIndex = 0;
  container.addChild(walls);
  
  // Room 1 walls
  for (let x = -3; x <= 3; x++) {
    if (x !== 0) { // Leave a door space
      const wallN = createWall(tileSize, 0x8B4513);
      wallN.position.set(x * tileSize, -3 * tileSize);
      walls.addChild(wallN);
      obstacles.push(wallN);
    }
    
    const wallS = createWall(tileSize, 0x8B4513);
    wallS.position.set(x * tileSize, 3 * tileSize);
    walls.addChild(wallS);
    obstacles.push(wallS);
  }
  
  for (let y = -3; y <= 3; y++) {
    const wallW = createWall(tileSize, 0x8B4513);
    wallW.position.set(-3 * tileSize, y * tileSize);
    walls.addChild(wallW);
    obstacles.push(wallW);
    
    if (y === -2) {
      // Create a window (exit point)
      const window = createWindow(tileSize);
      window.position.set(-3 * tileSize, y * tileSize);
      walls.addChild(window);
      exits.push(window);
    }
  }
  
  // Dividing wall between rooms
  for (let y = -3; y <= 3; y++) {
    if (y !== 0) { // Leave a door space
      const divider = createWall(tileSize, 0x8B4513);
      divider.position.set(3 * tileSize, y * tileSize);
      walls.addChild(divider);
      obstacles.push(divider);
    }
  }
  
  // Room 2 walls
  for (let x = 4; x <= 8; x++) {
    const wallN = createWall(tileSize, 0x8B4513);
    wallN.position.set(x * tileSize, -3 * tileSize);
    walls.addChild(wallN);
    obstacles.push(wallN);
    
    const wallS = createWall(tileSize, 0x8B4513);
    wallS.position.set(x * tileSize, 3 * tileSize);
    walls.addChild(wallS);
    obstacles.push(wallS);
  }
  
  for (let y = -3; y <= 3; y++) {
    const wallE = createWall(tileSize, 0x8B4513);
    wallE.position.set(8 * tileSize, y * tileSize);
    walls.addChild(wallE);
    obstacles.push(wallE);
    
    if (y === 2) {
      // Create a window (exit point)
      const window = createWindow(tileSize);
      window.position.set(8 * tileSize, y * tileSize);
      walls.addChild(window);
      exits.push(window);
    }
  }
  
  // Add furniture
  const furniture = new PIXI.Container();
  furniture.zIndex = 5;
  container.addChild(furniture);
  
  // Create furniture with basic shapes first to ensure something renders
  // Living Room furniture
  const sofa = createBetterSofa(tileSize);
  sofa.position.set(-1.5 * tileSize, 2 * tileSize);
  furniture.addChild(sofa);
  obstacles.push(sofa);
  
  const coffeeTable = createBetterTable(tileSize);
  coffeeTable.position.set(0, 0);  
  furniture.addChild(coffeeTable);
  obstacles.push(coffeeTable);
  
  // Bedroom furniture
  const bed = createBetterBed(tileSize);
  bed.position.set(6 * tileSize, -1 * tileSize);
  furniture.addChild(bed);
  obstacles.push(bed);
  
  const dresser = createBetterDresser(tileSize);
  dresser.position.set(7 * tileSize, 1.5 * tileSize);
  furniture.addChild(dresser);
  obstacles.push(dresser);
  
  return { obstacles, exits };
};

// Helper functions for creating walls, windows, and furniture
const createWall = (size, color) => {
  const wall = new PIXI.Graphics();
  wall.beginFill(color);
  wall.drawRect(-size/4, -size, size/2, size);
  wall.endFill();
  
  // Create hitbox
  wall.hitArea = new PIXI.Rectangle(-size/2, -size, size, size*2);
  
  // Set proper z-index
  wall.zIndex = wall.position ? wall.position.y : 0;
  
  return wall;
};

const createWindow = (size) => {
  const window = new PIXI.Graphics();
  
  // Window frame (thicker)
  window.beginFill(0x8B4513);
  window.drawRect(-size/4, -size, size/2, size);
  window.endFill();
  
  // Window glass - make larger and more visible
  window.beginFill(0x87CEEB, 0.7);
  window.drawRect(-size/4 + 3, -size + 3, size/2 - 6, size - 6);
  
  // Add window detail
  window.lineStyle(1, 0xFFFFFF, 0.5);
  window.moveTo(-size/4 + 3, -size/2);
  window.lineTo(-size/4 + size/2 - 3, -size/2); // Horizontal divider
  window.moveTo(-size/4 + size/4, -size + 3);
  window.lineTo(-size/4 + size/4, -size + size - 3); // Vertical divider
  window.endFill();
  
  // Create hitbox
  window.hitArea = new PIXI.Rectangle(-size/4, -size, size/2, size);
  
  // Set proper z-index
  window.zIndex = window.position ? window.position.y : 0;
  
  return window;
};

// New helper functions for better furniture
const createBetterSofa = (tileSize) => {
  const sofa = new PIXI.Graphics();
  
  // Base of sofa - isometric shape
  sofa.beginFill(0x6B8E23); // Olive green
  sofa.moveTo(0, tileSize/2);
  sofa.lineTo(tileSize, 0);
  sofa.lineTo(tileSize*2, tileSize/2);
  sofa.lineTo(tileSize, tileSize);
  sofa.lineTo(0, tileSize/2);
  
  // Back of sofa
  sofa.beginFill(0x556B2F); // Darker green
  sofa.moveTo(0, tileSize/2);
  sofa.lineTo(tileSize, 0);
  sofa.lineTo(tileSize, -tileSize/4);
  sofa.lineTo(0, tileSize/4);
  sofa.lineTo(0, tileSize/2);
  
  // Right arm
  sofa.beginFill(0x556B2F);
  sofa.moveTo(tileSize*2, tileSize/2);
  sofa.lineTo(tileSize, tileSize);
  sofa.lineTo(tileSize, tileSize*0.75);
  sofa.lineTo(tileSize*2, tileSize/4);
  sofa.lineTo(tileSize*2, tileSize/2);
  
  // Details - cushion lines
  sofa.lineStyle(1, 0x333333, 0.5);
  sofa.moveTo(tileSize/2, tileSize/4);
  sofa.lineTo(tileSize*1.5, tileSize/4);
  sofa.endFill();
  
  // Create hitbox
  sofa.hitArea = new PIXI.Polygon([
    0, tileSize/2,
    tileSize, 0,
    tileSize*2, tileSize/2,
    tileSize, tileSize
  ]);
  
  sofa.zIndex = sofa.position ? sofa.position.y + tileSize/2 : 0;
  
  return sofa;
};

const createBetterTable = (tileSize) => {
  const table = new PIXI.Graphics();
  
  // Table top (isometric)
  table.beginFill(0x8B4513); // Brown
  table.moveTo(0, tileSize/2);
  table.lineTo(tileSize/2, 0);
  table.lineTo(tileSize, tileSize/2);
  table.lineTo(tileSize/2, tileSize);
  table.lineTo(0, tileSize/2);
  
  // Table leg detail
  table.beginFill(0x5C3317); // Darker brown
  table.drawRect(tileSize/4, tileSize/2, tileSize/8, tileSize/3);
  table.drawRect(tileSize*5/8, tileSize/2, tileSize/8, tileSize/3);
  table.endFill();
  
  // Create hitbox
  table.hitArea = new PIXI.Polygon([
    0, tileSize/2,
    tileSize/2, 0,
    tileSize, tileSize/2,
    tileSize/2, tileSize
  ]);
  
  table.zIndex = table.position ? table.position.y + tileSize/2 : 0;
  
  return table;
};

const createBetterBed = (tileSize) => {
  const bed = new PIXI.Graphics();
  
  // Bed base (isometric shape)
  bed.beginFill(0x4169e1); // Royal blue for blanket
  bed.moveTo(0, tileSize/2);
  bed.lineTo(tileSize, 0);
  bed.lineTo(tileSize*2, tileSize/2);
  bed.lineTo(tileSize, tileSize);
  bed.lineTo(0, tileSize/2);
  
  // Pillow
  bed.beginFill(0xFFFFFF);
  bed.drawRoundedRect(tileSize*0.3, tileSize*0.2, tileSize*0.7, tileSize*0.3, 5);
  
  // Create hitbox
  bed.hitArea = new PIXI.Polygon([
    0, tileSize/2,
    tileSize, 0,
    tileSize*2, tileSize/2,
    tileSize, tileSize
  ]);
  
  bed.zIndex = bed.position ? bed.position.y + tileSize/2 : 0;
  
  return bed;
};

const createBetterDresser = (tileSize) => {
  const dresser = new PIXI.Graphics();
  
  // Dresser body (isometric shape)
  dresser.beginFill(0x8B4513); // Brown
  dresser.moveTo(0, tileSize/2);
  dresser.lineTo(tileSize/2, 0);
  dresser.lineTo(tileSize, tileSize/2);
  dresser.lineTo(tileSize/2, tileSize);
  dresser.lineTo(0, tileSize/2);
  
  // Drawer lines
  dresser.lineStyle(1, 0x000000);
  dresser.moveTo(tileSize/4, tileSize/4);
  dresser.lineTo(tileSize*3/4, tileSize/4);
  
  dresser.moveTo(tileSize/4, tileSize/2);
  dresser.lineTo(tileSize*3/4, tileSize/2);
  
  dresser.moveTo(tileSize/4, tileSize*3/4);
  dresser.lineTo(tileSize*3/4, tileSize*3/4);
  
  // Drawer handles
  dresser.beginFill(0xFFD700); // Gold handles
  dresser.drawCircle(tileSize/2, tileSize/4, 2);
  dresser.drawCircle(tileSize/2, tileSize/2, 2);
  dresser.drawCircle(tileSize/2, tileSize*3/4, 2);
  dresser.endFill();
  
  // Create hitbox
  dresser.hitArea = new PIXI.Polygon([
    0, tileSize/2,
    tileSize/2, 0,
    tileSize, tileSize/2,
    tileSize/2, tileSize
  ]);
  
  dresser.zIndex = dresser.position ? dresser.position.y + tileSize/2 : 0;
  
  return dresser;
}; 