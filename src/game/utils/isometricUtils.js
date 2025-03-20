import * as PIXI from 'pixi.js';

// Convert Cartesian coordinates to isometric
export const cartesianToIsometric = (x, y) => {
  return {
    x: (x - y),
    y: (x + y) / 2
  };
};

// Convert isometric coordinates to Cartesian
export const isometricToCartesian = (x, y) => {
  return {
    x: (2 * y + x) / 2,
    y: (2 * y - x) / 2
  };
};

// Create an isometric tile
export const createIsometricTile = (width, height, color = 0xcccccc, borderColor = 0x999999) => {
  const graphics = new PIXI.Graphics();
  
  // Draw fill
  graphics.beginFill(color);
  graphics.lineStyle(1, borderColor);
  
  // Draw diamond shape
  graphics.moveTo(0, height / 2);
  graphics.lineTo(width / 2, 0);
  graphics.lineTo(width, height / 2);
  graphics.lineTo(width / 2, height);
  graphics.lineTo(0, height / 2);
  
  graphics.endFill();
  
  // Add shading or texture for depth
  graphics.beginFill(0xaaaaaa, 0.5); // Light shading
  graphics.drawRect(0, 0, width, height); // Add a rectangle for shading
  graphics.endFill();
  
  return graphics;
}; 