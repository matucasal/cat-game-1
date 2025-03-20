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
  gameContainer.position.set(app.screen.width / 2, app.screen.height / 2 - 100);
  gameContainer.scale.set(0.8, 0.8);
  app.stage.addChild(gameContainer);
  
  // Force update of transform to ensure container position is applied
  gameContainer.updateTransform();
  
  // Create level (floors, walls, furniture, doors, windows)
  const level = createLevel(gameContainer, app);
  
  // Create player character (cat)
  const cat = new Cat(app);
  cat.sprite.position.set(0, 0);
  cat.sprite.zIndex = 100;
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
  const collisionState = setupCollisions(cat, [human1], level.obstacles, level.exits);
  
  // Add debug button for testing
  const debugButton = document.createElement('button');
  debugButton.textContent = 'Unhide Cat';
  debugButton.style.position = 'absolute';
  debugButton.style.bottom = '10px';
  debugButton.style.right = '10px';
  debugButton.style.padding = '8px';
  debugButton.style.zIndex = 1000;
  document.body.appendChild(debugButton);

  debugButton.addEventListener('click', () => {
    cat.unhide();
    console.log("Cat unhidden via debug button");
  });
  
  // Add these lines right after creating the controls (around line 48)
  console.log("Controls initially:", controls);
  // Display control state on screen
  const controlsDisplay = document.createElement('div');
  controlsDisplay.style.position = 'absolute';
  controlsDisplay.style.bottom = '50px';
  controlsDisplay.style.right = '10px';
  controlsDisplay.style.padding = '8px';
  controlsDisplay.style.backgroundColor = 'rgba(0,0,0,0.7)';
  controlsDisplay.style.color = 'white';
  controlsDisplay.style.fontFamily = 'monospace';
  controlsDisplay.style.zIndex = 1000;
  document.body.appendChild(controlsDisplay);
  
  // Add this after your debug button (around line 65)
  const moveButtons = document.createElement('div');
  moveButtons.style.position = 'absolute';
  moveButtons.style.bottom = '100px';
  moveButtons.style.right = '10px';
  moveButtons.style.padding = '8px';
  moveButtons.style.backgroundColor = 'rgba(0,0,0,0.7)';
  moveButtons.style.zIndex = 1000;
  document.body.appendChild(moveButtons);

  // Create directional buttons
  const directions = ['Up', 'Down', 'Left', 'Right'];
  directions.forEach(dir => {
    const btn = document.createElement('button');
    btn.textContent = dir;
    btn.style.margin = '5px';
    btn.style.padding = '8px';
    
    btn.addEventListener('click', () => {
      cat.unhide();
      // Move cat directly without using controls
      const amount = 20; // Larger movement to be noticeable
      switch(dir) {
        case 'Up': cat.sprite.position.y -= amount; break;
        case 'Down': cat.sprite.position.y += amount; break;
        case 'Left': cat.sprite.position.x -= amount; break;
        case 'Right': cat.sprite.position.x += amount; break;
      }
      console.log(`Manual ${dir} movement applied, new position:`, {
        x: cat.sprite.position.x,
        y: cat.sprite.position.y
      });
    });
    
    moveButtons.appendChild(btn);
  });
  
  // Game loop
  app.ticker.add((delta) => {
    // Update human positions and line of sight
    human1.update(delta);
    
    // Check if human can see cat
    const catSeen = human1.canSee(cat);
    
    if (catSeen) {
      cat.hide();
      console.log("Cat was seen! Hiding.");
    }
    
    // Update cat position based on controls
    if (!cat.isHiding) {
      console.log("Controls state:", controls);
      controlsDisplay.textContent = `Controls: up=${controls.up}, down=${controls.down}, left=${controls.left}, right=${controls.right}`;
      
      console.log("About to update cat with delta:", delta);
      const oldPosition = { x: cat.sprite.position.x, y: cat.sprite.position.y };
      cat.update(delta, controls);
      const newPosition = { x: cat.sprite.position.x, y: cat.sprite.position.y };
      
      // Add this to log control and position in one place for easier debugging
      console.log("Movement debug:", {
        controls: {...controls},
        delta: delta,
        posChange: {
          x: newPosition.x - oldPosition.x,
          y: newPosition.y - oldPosition.y
        }
      });
    } else {
      console.log("Cat is hiding. Cannot move.");
    }
    
    // Check for level completion
    level.exits.forEach(exit => {
      if (exit.containsPoint(cat.sprite.position)) {
        console.log("Level completed!");
        // Create a win message overlay
        const winMessage = new PIXI.Text('You Win!', {
          fontSize: 48,
          fill: 0x00ff00,
          fontWeight: 'bold',
          stroke: 0x000000,
          strokeThickness: 6
        });
        winMessage.anchor.set(0.5);
        winMessage.position.set(app.screen.width / 2, app.screen.height / 2);
        app.stage.addChild(winMessage);
        
        // Optional: Pause game or restart after a delay
        setTimeout(() => {
          alert("Congratulations! You escaped the house!");
          // Restart game or go to next level
        }, 2000);
      }
    });
  });
}; 