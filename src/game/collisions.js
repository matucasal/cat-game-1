import * as PIXI from 'pixi.js';

/**
 * Sets up collision detection for game entities
 */
export const setupCollisions = (cat, humans, obstacles, exits) => {
  // Track the entities for collision checks in the game loop
  const collisionState = {
    cat,
    humans,
    obstacles,
    exits,
    lastPosition: { x: cat.sprite.position.x, y: cat.sprite.position.y }
  };

  // Add collision detection to the cat's update method
  const originalUpdate = cat.update;
  cat.update = (delta, controls) => {
    // Store the current position before movement
    collisionState.lastPosition.x = cat.sprite.position.x;
    collisionState.lastPosition.y = cat.sprite.position.y;
    
    // Call the original update method to handle movement
    originalUpdate.call(cat, delta, controls);
    
    // Check for collisions with obstacles after movement
    if (checkObstacleCollisions(cat, obstacles)) {
      // If collision detected, revert to the previous position
      cat.sprite.position.x = collisionState.lastPosition.x;
      cat.sprite.position.y = collisionState.lastPosition.y;
    }
  };

  return collisionState;
};

/**
 * Checks if the cat is colliding with any obstacles in isometric space
 */
const checkObstacleCollisions = (cat, obstacles) => {
  if (!obstacles || obstacles.length === 0) {
    console.warn("No obstacles to check against!");
    return false;
  }
  
  // Get the cat's actual parent container 
  const catParent = cat.sprite.parent;
  
  // Create a more accurate bounding box for the cat in LOCAL space
  const catBounds = {
    x: cat.sprite.position.x - 20,
    y: cat.sprite.position.y - 15,
    width: 40,
    height: 30
  };
  
  // Debugging info
  console.log(`Cat position: (${cat.sprite.position.x}, ${cat.sprite.position.y})`);
  console.log(`Cat bounds: ${JSON.stringify(catBounds)}`);
  
  for (let obstacle of obstacles) {
    if (!obstacle.hitArea) {
      console.log("Obstacle missing hitArea", obstacle);
      continue;
    }
    
    // If cat and obstacle are in different containers, convert to a common space
    let obstacleGlobalPos;
    if (obstacle.parent === catParent) {
      // Same parent, use local positions
      obstacleGlobalPos = { x: obstacle.position.x, y: obstacle.position.y };
    } else {
      // Different parents, convert to global space
      const catGlobalPos = cat.sprite.getGlobalPosition();
      obstacleGlobalPos = obstacle.getGlobalPosition();
      
      // Convert cat bounds to global space
      catBounds.x = catGlobalPos.x - 20;
      catBounds.y = catGlobalPos.y - 15;
    }
    
    // Create obstacle bounds
    const obstacleBounds = {
      x: obstacleGlobalPos.x,
      y: obstacleGlobalPos.y,
      width: obstacle.hitArea.width,
      height: obstacle.hitArea.height
    };
    
    // Remove or comment out debug logging
    // console.log(`Obstacle at (${obstacleGlobalPos.x}, ${obstacleGlobalPos.y})`);
    // console.log(`Obstacle bounds: ${JSON.stringify(obstacleBounds)}`);
    
    // REMOVE DEBUG VISUALIZATION
    // if (window.debugGraphics) {
    //   window.debugGraphics.clear();
    // } else {
    //   window.debugGraphics = new PIXI.Graphics();
    //   catParent.addChild(window.debugGraphics);
    //   window.debugGraphics.zIndex = 10000;
    // }
    
    // // Draw cat hitbox
    // window.debugGraphics.lineStyle(2, 0xFF0000);
    // window.debugGraphics.drawRect(catBounds.x, catBounds.y, catBounds.width, catBounds.height);
    
    // // Draw obstacle hitbox (converted to cat's space if needed)
    // window.debugGraphics.lineStyle(2, 0x00FF00);
    // window.debugGraphics.drawRect(obstacleBounds.x, obstacleBounds.y, obstacleBounds.width, obstacleBounds.height);
    
    // Check for intersection
    if (hitTestRectangle(catBounds, obstacleBounds)) {
      // console.log("COLLISION DETECTED");
      return true;
    }
  }
  
  return false;
};

/**
 * Simple rectangle vs rectangle hit testing
 */
const hitTestRectangle = (rect1, rect2) => {
  return !(rect2.x > rect1.x + rect1.width ||
           rect2.x + rect2.width < rect1.x ||
           rect2.y > rect1.y + rect1.height ||
           rect2.y + rect2.height < rect1.y);
};

// Helper function to draw debug boxes (can be enabled for testing)
function drawDebugBox(rect, color) {
  const graphics = new PIXI.Graphics();
  graphics.lineStyle(2, color, 1);
  graphics.drawRect(rect.x, rect.y, rect.width, rect.height);
  // You would need a way to add this to the stage temporarily
} 