import * as PIXI from 'pixi.js';

export class Cat {
  constructor(app) {
    // Create a cat sprite with graphics
    const graphics = new PIXI.Graphics();
    
    // Cat body - using BLACK color
    graphics.beginFill(0x000000); // Black
    graphics.drawEllipse(0, 0, 15, 10);
    
    // Cat head
    graphics.beginFill(0x000000); // Black
    graphics.drawCircle(-12, 0, 8);
    
    // Cat ears
    graphics.beginFill(0x000000); // Black
    graphics.drawPolygon([-18, -4, -16, -10, -14, -6]);
    graphics.drawPolygon([-14, -4, -12, -10, -10, -6]);
    
    // Cat eyes
    graphics.beginFill(0x00FF00); // Keep eyes green
    graphics.drawEllipse(-14, -1, 2, 3);
    graphics.drawEllipse(-10, -1, 2, 3);
    
    // Cat tail
    graphics.beginFill(0x000000); // Black
    graphics.drawPolygon([10, 0, 20, -10, 22, -8, 15, 2]);
    
    // Create sprite from graphics
    this.sprite = new PIXI.Sprite(app.renderer.generateTexture(graphics));
    this.sprite.anchor.set(0.5);
    this.sprite.scale.set(1.5);
    this.sprite.zIndex = 100; // Increased zIndex to always be on top
    
    // Movement parameters
    this.speed = 4;
    this.lastPosition = { x: 0, y: 0 };
    
    // Add "caught" state
    this.caught = false;
    this.respawnTimer = 0;
    this.respawnDelay = 120; // frames to wait before respawning (2 seconds at 60fps)
  }
  
  update(delta, controls) {
    // Check if cat is caught
    if (this.caught) {
      this.respawnTimer -= delta;
      
      // If timer expired, respawn the cat
      if (this.respawnTimer <= 0) {
        this.caught = false;
        this.sprite.visible = true;
        this.sprite.alpha = 1.0;
      }
      return; // Skip the rest of the update if caught
    }
    
    // Store last position for debugging
    this.lastPosition.x = this.sprite.position.x;
    this.lastPosition.y = this.sprite.position.y;
    
    // Create a movement vector
    let dx = 0;
    let dy = 0;
    
    // Isometric controls - convert keypress to isometric direction
    if (controls.up) {
      dx -= this.speed * 0.7071 * delta; // Move northwest
      dy -= this.speed * 0.7071 * delta;
    }
    if (controls.down) {
      dx += this.speed * 0.7071 * delta; // Move southeast
      dy += this.speed * 0.7071 * delta;
    }
    if (controls.left) {
      dx -= this.speed * 0.7071 * delta; // Move southwest
      dy += this.speed * 0.7071 * delta;
    }
    if (controls.right) {
      dx += this.speed * 0.7071 * delta; // Move northeast
      dy -= this.speed * 0.7071 * delta;
    }
    
    // Apply movement
    this.sprite.position.x += dx;
    this.sprite.position.y += dy;
    
    // Expand safe boundaries to prevent disappearing
    const roomWidth = 1500;
    const roomHeight = 1200;
    this.sprite.position.x = Math.max(-800, Math.min(this.sprite.position.x, roomWidth));
    this.sprite.position.y = Math.max(-800, Math.min(this.sprite.position.y, roomHeight));
    
    // ALWAYS ensure the cat is visible with higher priority
    this.sprite.visible = true;
    this.sprite.alpha = 1.0;
    
    // Force zIndex to be very high to always appear on top
    this.sprite.zIndex = 1000;
    
    // Print position when near the problem area
    if (this.sprite.position.x < -150 && this.sprite.position.x > -250 &&
        this.sprite.position.y > 0 && this.sprite.position.y < 100) {
      console.log("CAT IN PROBLEM AREA:", 
                 {x: this.sprite.position.x, y: this.sprite.position.y, 
                  visible: this.sprite.visible, alpha: this.sprite.alpha});
    }
  }
  
  // Method to handle being caught by a human
  getCaught() {
    if (!this.caught) {
      this.caught = true;
      this.respawnTimer = this.respawnDelay;
      this.sprite.visible = false; // Hide the cat when caught
      
      // Display a message or effect for being caught
      console.log("CAT CAUGHT! Respawning in 2 seconds...");
    }
  }
} 