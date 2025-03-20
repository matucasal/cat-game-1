import * as PIXI from 'pixi.js';

export class Cat {
  constructor(app) {
    // Create a more detailed cat sprite
    const graphics = new PIXI.Graphics();
    
    // Body (slightly larger oval)
    graphics.beginFill(0x333333);
    graphics.drawEllipse(0, 0, 18, 12);
    
    // Head
    graphics.drawCircle(18, -8, 10);
    
    // Ears
    graphics.drawPolygon([18, -13, 24, -22, 21, -13]); // ear 1
    graphics.drawPolygon([18, -13, 12, -22, 15, -13]); // ear 2
    
    // Front legs
    graphics.drawRoundedRect(-12, 3, 5, 12, 2); // left front leg
    graphics.drawRoundedRect(-5, 3, 5, 10, 2);  // right front leg
    
    // Back legs
    graphics.drawRoundedRect(5, 3, 5, 14, 2);   // left back leg
    graphics.drawRoundedRect(12, 3, 5, 12, 2);  // right back leg
    
    // Tail (curved)
    graphics.moveTo(18, 0);
    graphics.bezierCurveTo(
      25, 0,   // control point 1
      35, -5,  // control point 2
      40, -15  // end point
    );
    graphics.lineStyle(4, 0x333333, 1);
    graphics.endFill();
    
    // Eyes
    graphics.beginFill(0x66ff66); // Green cat eyes
    graphics.drawEllipse(15, -10, 2, 4);  // left eye
    graphics.drawEllipse(23, -10, 2, 4);  // right eye
    graphics.endFill();
    
    this.sprite = new PIXI.Sprite(app.renderer.generateTexture(graphics));
    this.sprite.anchor.set(0.5);
    
    this.speed = 10;
    this.isHiding = false;
    this.visibilityTimer = 0;
    
    // Debug property to track position changes
    this.lastPosition = { x: 0, y: 0 };
  }
  
  update(delta, controls) {
    if (this.isHiding) return;
    
    // Store last position for debugging
    this.lastPosition.x = this.sprite.position.x;
    this.lastPosition.y = this.sprite.position.y;
    
    // Adjust movement for proper isometric controls
    if (controls.up) {
      this.sprite.position.y -= this.speed * delta; // Move north
    }
    if (controls.down) {
      this.sprite.position.y += this.speed * delta; // Move south
    }
    if (controls.left) {
      this.sprite.position.x -= this.speed * delta; // Move west
    }
    if (controls.right) {
      this.sprite.position.x += this.speed * delta; // Move east
    }
    
    // Boundary checks (assuming room dimensions)
    const roomWidth = 1000; // Adjust based on your room size
    const roomHeight = 800;  // Adjust based on your room size

    // Prevent going out of bounds
    this.sprite.position.x = Math.max(-400, Math.min(this.sprite.position.x, roomWidth));
    this.sprite.position.y = Math.max(-400, Math.min(this.sprite.position.y, roomHeight));
    
    // Update sprite zIndex based on y position for proper isometric rendering
    this.sprite.zIndex = this.sprite.position.y + 10; // Ensure it's above other objects
    
    // Log position change if it occurred
    if (this.lastPosition.x !== this.sprite.position.x || this.lastPosition.y !== this.sprite.position.y) {
      console.log("Cat actually moved:", {
        from: { x: this.lastPosition.x, y: this.lastPosition.y },
        to: { x: this.sprite.position.x, y: this.sprite.position.y },
        delta: delta
      });
    }
  }
  
  hide() {
    this.isHiding = true;
    this.sprite.alpha = 0.5; // Visual indication of hiding
    
    // Unhide after 2 seconds
    this.visibilityTimer = setTimeout(() => {
      this.isHiding = false;
      this.sprite.alpha = 1;
    }, 2000);
  }
  
  unhide() {
    if (this.visibilityTimer) {
      clearTimeout(this.visibilityTimer);
    }
    this.isHiding = false;
    this.sprite.alpha = 1;
  }
} 