import * as PIXI from 'pixi.js';

// Constants for tile dimensions
const TILE_WIDTH = 50;
const TILE_HEIGHT = 25; // Height is usually half of width for isometric tiles
const TILE_WIDTH_HALF = TILE_WIDTH / 2;
const TILE_HEIGHT_HALF = TILE_HEIGHT / 2;

// Convert Cartesian to Isometric screen coordinates
export const cartesianToIsometric = (cartX, cartY) => {
  return {
    x: (cartX - cartY) * TILE_WIDTH_HALF,
    y: (cartX + cartY) * TILE_HEIGHT_HALF
  };
};

// Convert Isometric screen coordinates to Cartesian
export const isometricToCartesian = (isoX, isoY) => {
  return {
    x: (isoX / TILE_WIDTH_HALF + isoY / TILE_HEIGHT_HALF) / 2,
    y: (isoY / TILE_HEIGHT_HALF - isoX / TILE_WIDTH_HALF) / 2
  };
};

// Create a better isometric tile with proper diamond shape
export const createIsometricTile = (width, height, color = 0xcccccc, borderColor = 0x999999) => {
  const graphics = new PIXI.Graphics();
  
  // Draw diamond shape
  graphics.beginFill(color);
  graphics.lineStyle(1, borderColor);
  
  // Use proper isometric diamond proportions
  graphics.moveTo(0, height/2);             // Left point
  graphics.lineTo(width/2, 0);              // Top point
  graphics.lineTo(width, height/2);         // Right point
  graphics.lineTo(width/2, height);         // Bottom point
  graphics.lineTo(0, height/2);             // Back to left point
  
  graphics.endFill();
  
  // Add depth shading
  const shadeColor = multiplyColor(color, 0.8); // Darken for shading
  graphics.beginFill(shadeColor, 0.5);
  graphics.drawPolygon([
    width/2, height/2,
    width, height/2,
    width/2, height
  ]);
  graphics.endFill();
  
  return graphics;
};

// Helper to multiply a hex color by a factor (for shading)
function multiplyColor(color, factor) {
  const r = ((color >> 16) & 0xff) * factor;
  const g = ((color >> 8) & 0xff) * factor;
  const b = (color & 0xff) * factor;
  return (Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(b);
}

// Get the z-index for proper depth sorting in isometric view
export const getIsometricZIndex = (x, y, height = 0) => {
  return y + x/2 + height;
}; 