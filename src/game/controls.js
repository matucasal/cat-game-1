export const setupControls = (cat) => {
  const controls = {
    up: false,
    down: false,
    left: false,
    right: false
  };
  
  // Debug key press detection
  console.log("Setting up keyboard controls");
  
  // Handle key down events
  const handleKeyDown = (e) => {
    console.log("Key pressed:", e.key); // Debug log
    
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        e.preventDefault(); // Prevent page scrolling
        controls.up = true;
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        e.preventDefault(); // Prevent page scrolling
        controls.down = true;
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        e.preventDefault(); // Prevent page scrolling
        controls.left = true;
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        e.preventDefault(); // Prevent page scrolling
        controls.right = true;
        break;
    }
  };
  
  // Handle key up events
  const handleKeyUp = (e) => {
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        controls.up = false;
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        controls.down = false;
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        controls.left = false;
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        controls.right = false;
        break;
    }
  };
  
  // Add event listeners
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  
  // Ensure the game has focus
  window.focus();
  
  return controls;
}; 