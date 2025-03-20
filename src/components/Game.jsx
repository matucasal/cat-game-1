import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { setupGame } from '../game/gameSetup';
import '../styles/Game.css';

const Game = () => {
  const gameContainerRef = useRef(null);
  const appRef = useRef(null);

  useEffect(() => {
    // Make sure we only run this once and gameContainerRef is available
    if (!appRef.current && gameContainerRef.current) {
      try {
        // Create the PIXI application using v7 API pattern
        const app = new PIXI.Application({
          width: 1000,
          height: 800,
          backgroundColor: 0xf0f0f0,
          antialias: true,
          resolution: window.devicePixelRatio || 1,
        });
        
        // Store the PIXI application in ref
        appRef.current = app;
        
        // Add the PIXI canvas to our React container
        gameContainerRef.current.appendChild(app.view);
        
        // Setup the game
        setupGame(app);
        
        console.log("PIXI Application initialized successfully");
      } catch (error) {
        console.error("Error initializing PIXI Application:", error);
      }
    }
    
    // Cleanup function to destroy PIXI app when component unmounts
    return () => {
      if (appRef.current) {
        try {
          // First remove the view from DOM to prevent React issues
          if (appRef.current.view && appRef.current.view.parentNode) {
            appRef.current.view.parentNode.removeChild(appRef.current.view);
          }
          
          // Destroy the PIXI application
          appRef.current.destroy(true, {children: true});
          appRef.current = null;
          console.log("PIXI Application destroyed successfully");
        } catch (error) {
          console.error("Error destroying PIXI Application:", error);
        }
      }
    };
  }, []);

  return (
    <div className="game-container">
      <div className="game-canvas" ref={gameContainerRef}></div>
      <div className="game-ui">
        <div className="game-controls">
          <p>Use arrow keys to move the cat</p>
          <p>Hide from humans' line of sight!</p>
        </div>
      </div>
    </div>
  );
};

export default Game; 