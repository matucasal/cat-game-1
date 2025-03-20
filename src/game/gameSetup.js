import * as PIXI from 'pixi.js';
import { Cat } from './entities/Cat';
import { Human } from './entities/Human';
import { createIsometricTile } from './utils/isometricUtils';
import { setupControls } from './controls';
import { setupCollisions } from './collisions';
import { createLevel } from './levels/level1';

export const setupGame = (app) => {
  // Create game container with improved isometric positioning
  const gameContainer = new PIXI.Container();
  gameContainer.sortableChildren = true;
  
  // Better centering of the game world
  gameContainer.position.set(app.screen.width / 2, app.screen.height / 2);
  app.stage.addChild(gameContainer);
  
  // Force update of transform to ensure container position is applied
  gameContainer.updateTransform();
  
  // Create level (floors, walls, furniture, doors, windows)
  const level = createLevel(gameContainer, app);
  
  // Create player character (cat)
  const cat = new Cat(app);
  cat.sprite.position.set(0, 0);
  cat.sprite.zIndex = 10;
  cat.isHiding = false;
  gameContainer.addChild(cat.sprite);
  
  // Create humans
  const human1 = new Human({
    startPosition: { x: 200, y: 100 },
    patrolPoints: [
      { x: 200, y: 100 },
      { x: -100, y: 150 },
      { x: -50, y: 300 },
      { x: 150, y: 250 },
    ],
    speed: 1,
    app: app
  });
  gameContainer.addChild(human1.sprite);
  
  // Setup keyboard controls
  const controls = setupControls(cat);
  
  // Setup collision detection
  // Temporarily comment out collision detection to see if that's the issue
  // setupCollisions(cat, [human1], level.obstacles, level.exits);
  const collisionState = {
    cat,
    humans: [human1],
    obstacles: level.obstacles,
    exits: level.exits
  };
  
  // Game loop
  app.ticker.add((delta) => {
    // Update human positions and line of sight
    human1.update(delta);
    
    // Check if human can see cat
    const catSeen = human1.canSee(cat);
    
    if (catSeen) {
      cat.hide();
    }
    
    // Update cat position based on controls
    if (!catSeen && !cat.isHiding) {
      console.log("About to update cat with delta:", delta);
      const oldPosition = { x: cat.sprite.position.x, y: cat.sprite.position.y };
      cat.update(delta, controls);
      const newPosition = { x: cat.sprite.position.x, y: cat.sprite.position.y };
      
      console.log("Position change:", {
        x: newPosition.x - oldPosition.x,
        y: newPosition.y - oldPosition.y
      });
    } else {
      console.log("Cat is hiding or seen by human. Cannot move.");
    }
    
    // Check for level completion
    level.exits.forEach(exit => {
      if (exit.containsPoint(cat.sprite.position)) {
        console.log("Level completed!");
        alert("You win!");
        // Optionally, reset the game or load a new level
      }
    });
  });
}; 