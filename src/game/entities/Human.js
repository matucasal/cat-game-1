import * as PIXI from 'pixi.js';

export class Human {
  constructor({ startPosition, patrolPoints, speed, app }) {
    // More detailed human sprite
    const graphics = new PIXI.Graphics();
    
    // Body
    graphics.beginFill(0x996633);
    graphics.drawRoundedRect(-12, -60, 24, 30, 5); // torso
    
    // Head
    graphics.beginFill(0xffcc99);
    graphics.drawCircle(0, -70, 10); // head
    
    // Arms
    graphics.beginFill(0x996633);
    graphics.drawRoundedRect(-18, -55, 6, 20, 2); // left arm
    graphics.drawRoundedRect(12, -55, 6, 20, 2);  // right arm
    
    // Legs
    graphics.beginFill(0x3366cc); // Blue pants
    graphics.drawRoundedRect(-10, -30, 8, 30, 2); // left leg
    graphics.drawRoundedRect(2, -30, 8, 30, 2);   // right leg
    
    // Simple face details
    graphics.beginFill(0x000000);
    graphics.drawCircle(-4, -70, 1); // left eye
    graphics.drawCircle(4, -70, 1);  // right eye
    graphics.endFill();
    
    graphics.lineStyle(1, 0x000000);
    graphics.moveTo(-3, -65);
    graphics.lineTo(3, -65); // mouth
    
    this.sprite = new PIXI.Sprite(app.renderer.generateTexture(graphics));
    this.sprite.anchor.set(0.5, 1);
    this.sprite.position.set(startPosition.x, startPosition.y);
    this.sprite.zIndex = startPosition.y;
    
    this.patrolPoints = patrolPoints;
    this.currentPoint = 0;
    this.speed = speed;
    this.app = app;
    
    // Initialize direction property
    this.direction = 0; // Default facing right (will be updated in update)
    
    // Line of sight visualization
    this.sightLine = new PIXI.Graphics();
    this.sightLine.zIndex = 100;
    this.sprite.addChild(this.sightLine);
    
    // Field of view (120 degrees)
    this.fov = Math.PI * 2/3;
    this.sightRange = 200;
  }
  
  update(delta) {
    // If we have patrol points, move toward the current target
    if (this.patrolPoints.length > 0) {
      const currentTarget = this.patrolPoints[this.currentPoint];
      
      // Calculate distance to target
      const dx = currentTarget.x - this.sprite.position.x;
      const dy = currentTarget.y - this.sprite.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Update direction (stored as radians)
      this.direction = Math.atan2(dy, dx);
      
      // If we're close enough to the target, move to the next point
      if (distance < 5) {
        this.currentPoint = (this.currentPoint + 1) % this.patrolPoints.length;
      } else {
        // Move toward the target
        const moveX = (dx / distance) * this.speed * delta;
        const moveY = (dy / distance) * this.speed * delta;
        
        this.sprite.position.x += moveX;
        this.sprite.position.y += moveY;
      }
      
      // Update zIndex for proper depth sorting
      this.sprite.zIndex = this.sprite.position.y;
      
      // Update line of sight visualization
      this.updateSightLine();
    }
  }
  
  updateSightLine() {
    // Clear previous sight line
    this.sightLine.clear();
    
    // Calculate sight cone endpoints
    const leftAngle = this.direction - this.fov / 2;
    const rightAngle = this.direction + this.fov / 2;
    
    // Draw sight cone
    this.sightLine.lineStyle(2, 0xff0000, 0.5);
    this.sightLine.beginFill(0xff0000, 0.2);
    this.sightLine.moveTo(0, 0);
    this.sightLine.lineTo(
      Math.cos(leftAngle) * this.sightRange,
      Math.sin(leftAngle) * this.sightRange
    );
    
    // Draw arc
    const steps = 10;
    for (let i = 0; i <= steps; i++) {
      const angle = leftAngle + (rightAngle - leftAngle) * (i / steps);
      this.sightLine.lineTo(
        Math.cos(angle) * this.sightRange,
        Math.sin(angle) * this.sightRange
      );
    }
    
    this.sightLine.lineTo(0, 0);
    this.sightLine.endFill();
  }
  
  canSee(catX, catY) {
    if (catX === undefined || catY === undefined) {
      return false; // Can't see if no valid coordinates
    }
    
    // Calculate distance to cat
    const dx = catX - this.sprite.position.x;
    const dy = catY - this.sprite.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // If cat is out of range, can't see it
    if (distance > this.sightRange) return false;
    
    // Make sure direction is defined
    if (this.direction === undefined) {
      this.direction = 0; // Default direction
    }
    
    // Angle to cat
    const angle = Math.atan2(dy, dx);
    
    // Normalize angles
    const normalizedDirection = (this.direction + 2 * Math.PI) % (2 * Math.PI);
    const normalizedAngle = (angle + 2 * Math.PI) % (2 * Math.PI);
    
    // Calculate the difference between angles
    let angleDiff = Math.abs(normalizedDirection - normalizedAngle);
    if (angleDiff > Math.PI) {
      angleDiff = 2 * Math.PI - angleDiff;
    }
    
    // If cat is within field of view
    return angleDiff <= this.fov / 2;
  }
} 