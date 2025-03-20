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
    graphics.beginFill(0x333333);
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
    
    // Line of sight visualization
    this.sightLine = new PIXI.Graphics();
    this.sightLine.zIndex = 100;
    this.sprite.addChild(this.sightLine);
    
    // Field of view (120 degrees)
    this.fov = Math.PI * 2/3;
    this.sightRange = 200;
  }
  
  update(delta) {
    const target = this.patrolPoints[this.currentPoint];
    
    // Calculate direction to target
    const dx = target.x - this.sprite.position.x;
    const dy = target.y - this.sprite.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // If we've reached the target (or close enough)
    if (distance < 5) {
      // Move to next patrol point
      this.currentPoint = (this.currentPoint + 1) % this.patrolPoints.length;
    } else {
      // Move towards target
      this.sprite.position.x += (dx / distance) * this.speed * delta;
      this.sprite.position.y += (dy / distance) * this.speed * delta;
      
      // Update zIndex for proper layering
      this.sprite.zIndex = this.sprite.position.y;
    }
    
    // Calculate direction the human is facing
    this.direction = Math.atan2(dy, dx);
    
    // Update sight line visualization
    this.updateSightLine();
  }
  
  updateSightLine() {
    this.sightLine.clear();
    this.sightLine.lineStyle(1, 0xff0000, 0.5);
    
    // Draw field of view cone
    this.sightLine.beginFill(0xff0000, 0.2);
    this.sightLine.moveTo(0, 0);
    
    const angleStep = this.fov / 10;
    const startAngle = this.direction - this.fov / 2;
    
    for (let i = 0; i <= 10; i++) {
      const angle = startAngle + angleStep * i;
      const x = Math.cos(angle) * this.sightRange;
      const y = Math.sin(angle) * this.sightRange;
      this.sightLine.lineTo(x, y);
    }
    
    this.sightLine.lineTo(0, 0);
    this.sightLine.endFill();
  }
  
  canSee(cat) {
    // Vector from human to cat
    const dx = cat.sprite.position.x - this.sprite.position.x;
    const dy = cat.sprite.position.y - this.sprite.position.y;
    
    // Distance from human to cat
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // If cat is out of range, can't see it
    if (distance > this.sightRange) return false;
    
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