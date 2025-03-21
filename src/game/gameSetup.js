import * as PIXI from 'pixi.js';
import { Cat } from './entities/Cat';
import { Human } from './entities/Human';
import { cartesianToIsometric } from './utils/isometricUtils';
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
  
  // Create level and get obstacles
  const { obstacles, exits } = createLevel(gameContainer, app);
  
  // Create player character (cat)
  const cat = new Cat(app);

  // Position the cat in the center of the room
  const startPos = cartesianToIsometric(0, 0);
  cat.sprite.position.set(startPos.x, startPos.y);
  cat.sprite.zIndex = 100;

  // Ensure cat is visible
  cat.sprite.visible = true;
  cat.sprite.alpha = 1.0;

  gameContainer.addChild(cat.sprite);
  
  // Create human NPC
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
  setupCollisions(cat, [human1], obstacles, exits);
  
  // Add coordinates display
  const coordsDisplay = document.createElement('div');
  coordsDisplay.style.position = 'absolute';
  coordsDisplay.style.bottom = '10px';
  coordsDisplay.style.left = '10px';
  coordsDisplay.style.color = 'white';
  coordsDisplay.style.fontFamily = 'monospace';
  coordsDisplay.style.padding = '5px';
  coordsDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  document.body.appendChild(coordsDisplay);
  
  // Add status message display
  const statusDisplay = document.createElement('div');
  statusDisplay.style.position = 'absolute';
  statusDisplay.style.top = '10px';
  statusDisplay.style.left = '50%';
  statusDisplay.style.transform = 'translateX(-50%)';
  statusDisplay.style.color = 'white';
  statusDisplay.style.fontFamily = 'monospace';
  statusDisplay.style.padding = '5px';
  statusDisplay.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
  statusDisplay.style.borderRadius = '5px';
  statusDisplay.style.display = 'none';
  statusDisplay.textContent = "YOU'VE BEEN SPOTTED!";
  document.body.appendChild(statusDisplay);
  
  // Game loop
  app.ticker.add((delta) => {
    // Update human positions
    human1.update(delta);
    
    // Check if human sees the cat
    if (!cat.caught && human1.canSee(cat.sprite.position.x, cat.sprite.position.y)) {
      cat.getCaught();
      // Show caught message
      statusDisplay.style.display = 'block';
      setTimeout(() => {
        statusDisplay.style.display = 'none';
      }, 2000);
    }
    
    // Update cat with controls
    cat.update(delta, controls);
    
    // Update coordinates display
    coordsDisplay.textContent = `Cat Position: (${Math.round(cat.sprite.position.x)}, ${Math.round(cat.sprite.position.y)})`;
  });
}; 