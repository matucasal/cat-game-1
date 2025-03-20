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
  // Debug info
  console.log("Checking collisions for cat at:", {
    position: {x: cat.sprite.position.x, y: cat.sprite.position.y}
  });
  
  // TEMPORARILY DISABLE COLLISIONS FOR TESTING
  return false; // No collisions detected, allowing free movement
  
  // Original code will be re-enabled after testing
  /*
  for (let obstacle of obstacles) {
    if (!obstacle.hitArea) continue;
    ...
  */
};

/**
 * Simple rectangle vs polygon/rectangle hit testing
 */
const hitTestRectangle = (rect1, rect2) => {
  return !(rect2.x > rect1.x + rect1.width ||
           rect2.x + rect2.width < rect1.x ||
           rect2.y > rect1.y + rect1.height ||
           rect2.y + rect2.height < rect1.y);
}; 