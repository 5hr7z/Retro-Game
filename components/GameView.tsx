import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Entity, GameState, LevelConfig, EntityType, Position } from '../types';
import { TILE_SIZE, COLORS, CANVAS_WIDTH, CANVAS_HEIGHT, LEVELS } from '../constants';
import { ASSETS } from '../utils/assets';

interface GameViewProps {
  onGameOver: (win: boolean) => void;
  onExit: () => void;
}

const GameView: React.FC<GameViewProps> = ({ onGameOver, onExit }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [levelIndex, setLevelIndex] = useState(0);
  
  // UI States
  const [dialogue, setDialogue] = useState<string[] | null>(null);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [quizEntity, setQuizEntity] = useState<Entity | null>(null);
  const [quizInput, setQuizInput] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [shake, setShake] = useState(0); 

  // Player Stats
  const [hearts, setHearts] = useState(3);
  const [inventory, setInventory] = useState<string[]>([]);
  
  // Game State Refs
  const playerGridPos = useRef<Position>({ x: 0, y: 0 }); 
  const playerVisualPos = useRef<Position>({ x: 0, y: 0 }); 
  const entitiesRef = useRef<Entity[]>([]);
  const isMoving = useRef(false);
  const movementProgress = useRef(0);
  const moveStartPos = useRef<Position>({ x: 0, y: 0 });
  const moveTargetPos = useRef<Position>({ x: 0, y: 0 });
  
  // Enemy Movement Refs
  const lastEnemyUpdate = useRef<number>(0);
  const chaosTimer = useRef<number>(0);
  const controlsFlipped = useRef<boolean>(false);

  const currentLevel = LEVELS[levelIndex];

  // Initialize Level
  useEffect(() => {
    playerGridPos.current = { ...currentLevel.startPos };
    playerVisualPos.current = { x: currentLevel.startPos.x * TILE_SIZE, y: currentLevel.startPos.y * TILE_SIZE };
    
    // Initialize entities with original positions for patrolling
    const initialEntities = JSON.parse(JSON.stringify(currentLevel.entities));
    initialEntities.forEach((e: Entity) => {
        if (e.type === EntityType.ENEMY) {
            e.originalPos = { ...e.pos };
            // Convert grid pos to visual pos for smooth movement
            e.pos = { x: e.pos.x * TILE_SIZE, y: e.pos.y * TILE_SIZE }; 
            e.dir = e.dir || 1;
        }
    });

    entitiesRef.current = initialEntities;
    setDialogue(null);
    setQuizEntity(null);
    isMoving.current = false;
    setShake(0);
    controlsFlipped.current = false;
    
    setFeedback(`START: ${currentLevel.name}`);
    setTimeout(() => setFeedback(null), 2000);

  }, [levelIndex, currentLevel]);

  // Handle Input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (dialogue || quizEntity || feedback) {
        if (dialogue && e.key === ' ') {
          if (dialogueIndex < dialogue.length - 1) {
             setDialogueIndex(prev => prev + 1);
          } else {
             setDialogue(null);
             setDialogueIndex(0);
          }
        }
        return;
      }

      if (isMoving.current) return;

      let dx = 0;
      let dy = 0;

      // Chaos Logic for Level 8
      let isFlipped = currentLevel.chaosMode ? controlsFlipped.current : false;
      
      const up = isFlipped ? 'ArrowDown' : 'ArrowUp';
      const down = isFlipped ? 'ArrowUp' : 'ArrowDown';
      const left = isFlipped ? 'ArrowRight' : 'ArrowLeft';
      const right = isFlipped ? 'ArrowLeft' : 'ArrowRight';

      if (e.key === up || e.key === 'w') dy = -1;
      if (e.key === down || e.key === 's') dy = 1;
      if (e.key === left || e.key === 'a') dx = -1;
      if (e.key === right || e.key === 'd') dx = 1;

      if (dx !== 0 || dy !== 0) {
        attemptMove(dx, dy);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dialogue, dialogueIndex, quizEntity, feedback, currentLevel]);

  const attemptMove = (dx: number, dy: number) => {
    const newX = playerGridPos.current.x + dx;
    const newY = playerGridPos.current.y + dy;

    if (newX < 0 || newX >= currentLevel.gridSize || newY < 0 || newY >= currentLevel.gridSize) return;
    if (currentLevel.mapData[newY] && currentLevel.mapData[newY][newX] === 1) return;

    // Check Grid entities (Static ones)
    const collidedEntity = entitiesRef.current.find(e => 
       e.type !== EntityType.ENEMY && e.pos.x === newX && e.pos.y === newY
    );

    if (collidedEntity) {
      if (collidedEntity.type === EntityType.DOOR && collidedEntity.isLocked) {
        handleDoorInteraction(collidedEntity);
        return;
      }
      if (collidedEntity.type === EntityType.OBSTACLE || collidedEntity.type === EntityType.NPC) {
         handleCollision(collidedEntity);
         return; 
      }
    }

    isMoving.current = true;
    moveStartPos.current = { ...playerVisualPos.current };
    moveTargetPos.current = { x: newX * TILE_SIZE, y: newY * TILE_SIZE };
    playerGridPos.current = { x: newX, y: newY };
    movementProgress.current = 0;

    if (collidedEntity) {
       handleCollision(collidedEntity);
    }
  };

  const handleDoorInteraction = (door: Entity) => {
    if (door.quizQuestion) {
      setQuizEntity(door);
      setQuizInput("");
    } else if (door.reqItem) {
      if (inventory.includes(door.reqItem)) {
        door.isLocked = false;
        entitiesRef.current = entitiesRef.current.filter(e => e.id !== door.id); 
        setFeedback("UNLOCKED!");
        setTimeout(() => setFeedback(null), 1000);
      } else {
        setFeedback(`LOCKED! Need ${door.reqItem}`);
        setShake(5);
        setTimeout(() => { setFeedback(null); setShake(0); }, 1000);
      }
    }
  };

  const submitQuiz = () => {
    if (!quizEntity) return;
    const correct = quizEntity.quizAnswer?.toLowerCase().trim();
    const attempt = quizInput.toLowerCase().trim();

    if (attempt === correct || (correct && attempt.includes(correct))) {
       setQuizEntity(null);
       quizEntity.isLocked = false;
       entitiesRef.current = entitiesRef.current.filter(e => e.id !== quizEntity.id);
       setFeedback("CORRECT! Smart Boy.");
       setTimeout(() => setFeedback(null), 1500);
    } else {
       setFeedback("WRONG! Try again.");
       setHearts(h => h - 1);
       setShake(10);
       setTimeout(() => { setFeedback(null); setShake(0); }, 1000);
    }
  };

  const takeDamage = () => {
      setHearts(prev => {
         const h = prev - 1;
         if (h <= 0) setTimeout(() => onGameOver(false), 500);
         return h;
      });
      setFeedback("OUCH!");
      setShake(15);
      setTimeout(() => { setFeedback(null); setShake(0); }, 800);
  };

  const handleCollision = (entity: Entity) => {
    if (entity.type === EntityType.NPC && entity.message) {
      setDialogue(entity.message);
      setDialogueIndex(0);
    }
    else if (entity.type === EntityType.COLLECTIBLE) {
      entitiesRef.current = entitiesRef.current.filter(e => e.id !== entity.id);
      setInventory(prev => [...prev, entity.id]);
      setFeedback(`Found ${entity.id}!`);
      setTimeout(() => setFeedback(null), 1000);
    }
    else if (entity.type === EntityType.TRAP || entity.type === EntityType.OBSTACLE) {
       if (entity.type === EntityType.TRAP) {
         takeDamage();
       }
    }
    else if (entity.type === EntityType.EXIT) {
      if (levelIndex < LEVELS.length - 1) {
        setLevelIndex(prev => prev + 1);
      } else {
        onGameOver(true);
      }
    }
  };

  // Update Enemy Logic
  const updateEnemies = () => {
    const now = Date.now();
    // Only update chaos timer every second
    if (currentLevel.chaosMode && now - chaosTimer.current > 3000) {
        chaosTimer.current = now;
        controlsFlipped.current = Math.random() > 0.5;
        if (controlsFlipped.current) {
             setFeedback("CONTROLS FLIPPED!");
             setTimeout(() => setFeedback(null), 1000);
        }
    }

    entitiesRef.current.forEach(entity => {
        if (entity.type !== EntityType.ENEMY) return;
        
        const speed = (entity.speed || 0.05) * TILE_SIZE;
        let dx = 0;
        let dy = 0;

        if (entity.behavior === 'patrol_h') {
             entity.pos.x += speed * (entity.dir || 1);
             const dist = Math.abs(entity.pos.x - (entity.originalPos?.x || 0) * TILE_SIZE);
             if (dist > (entity.patrolRange || 3) * TILE_SIZE) entity.dir = (entity.dir || 1) * -1;
        } 
        else if (entity.behavior === 'patrol_v') {
             entity.pos.y += speed * (entity.dir || 1);
             const dist = Math.abs(entity.pos.y - (entity.originalPos?.y || 0) * TILE_SIZE);
             if (dist > (entity.patrolRange || 3) * TILE_SIZE) entity.dir = (entity.dir || 1) * -1;
        }
        else if (entity.behavior === 'chase') {
             // Move towards player
             const targetX = playerVisualPos.current.x;
             const targetY = playerVisualPos.current.y;
             const angle = Math.atan2(targetY - entity.pos.y, targetX - entity.pos.x);
             entity.pos.x += Math.cos(angle) * speed;
             entity.pos.y += Math.sin(angle) * speed;
        }
        else if (entity.behavior === 'random') {
             if (Math.random() < 0.05) {
                 entity.dir = Math.random() * Math.PI * 2;
             }
             const angle = entity.dir || 0;
             entity.pos.x += Math.cos(angle) * speed;
             entity.pos.y += Math.sin(angle) * speed;
             
             // Bounce off bounds mostly
             if (entity.pos.x < 0 || entity.pos.x > currentLevel.gridSize * TILE_SIZE) entity.dir = angle + Math.PI;
             if (entity.pos.y < 0 || entity.pos.y > currentLevel.gridSize * TILE_SIZE) entity.dir = angle + Math.PI;
        }

        // Enemy Collision with Player
        const pCx = playerVisualPos.current.x + TILE_SIZE/2;
        const pCy = playerVisualPos.current.y + TILE_SIZE/2;
        const eCx = entity.pos.x + TILE_SIZE/2;
        const eCy = entity.pos.y + TILE_SIZE/2;
        
        const dist = Math.sqrt(Math.pow(pCx - eCx, 2) + Math.pow(pCy - eCy, 2));
        if (dist < TILE_SIZE * 0.6) {
             // Hit!
             takeDamage();
             // Knockback
             playerVisualPos.current.x -= (eCx - pCx) * 2;
             playerVisualPos.current.y -= (eCy - pCy) * 2;
             moveTargetPos.current = { ...playerVisualPos.current };
             isMoving.current = false;
             // Update grid pos to match approx
             playerGridPos.current = { 
                 x: Math.floor((playerVisualPos.current.x + TILE_SIZE/2) / TILE_SIZE),
                 y: Math.floor((playerVisualPos.current.y + TILE_SIZE/2) / TILE_SIZE)
             };
        }
    });
  };

  // Game Loop
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Movement Logic
    if (isMoving.current) {
      movementProgress.current += 0.2; 
      if (movementProgress.current >= 1) {
        movementProgress.current = 1;
        isMoving.current = false;
        playerVisualPos.current = { ...moveTargetPos.current };
      } else {
        playerVisualPos.current = {
          x: moveStartPos.current.x + (moveTargetPos.current.x - moveStartPos.current.x) * movementProgress.current,
          y: moveStartPos.current.y + (moveTargetPos.current.y - moveStartPos.current.y) * movementProgress.current
        };
      }
    }

    // AI Logic
    updateEnemies();

    // Shake Effect logic
    let shakeX = 0;
    let shakeY = 0;
    if (shake > 0) {
        shakeX = (Math.random() - 0.5) * shake;
        shakeY = (Math.random() - 0.5) * shake;
    }

    // Clear
    ctx.fillStyle = currentLevel.background;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Camera
    const cameraX = Math.max(0, Math.min(playerVisualPos.current.x - CANVAS_WIDTH / 2 + TILE_SIZE/2, (currentLevel.gridSize * TILE_SIZE) - CANVAS_WIDTH));
    const cameraY = Math.max(0, Math.min(playerVisualPos.current.y - CANVAS_HEIGHT / 2 + TILE_SIZE/2, (currentLevel.gridSize * TILE_SIZE) - CANVAS_HEIGHT));
    
    ctx.save();
    ctx.translate(-cameraX + shakeX, -cameraY + shakeY);

    // Draw Map
    for (let y = 0; y < currentLevel.mapData.length; y++) {
      for (let x = 0; x < currentLevel.mapData[y].length; x++) {
        const tile = currentLevel.mapData[y][x];
        
        let isVisible = true;
        if (currentLevel.fogOfWar) {
          const dist = Math.sqrt(Math.pow(x * TILE_SIZE - playerVisualPos.current.x, 2) + Math.pow(y * TILE_SIZE - playerVisualPos.current.y, 2));
          if (dist > 250) isVisible = false; // Pixel distance
        }

        if (isVisible) {
          if (tile === 1) {
            const img = new Image();
            img.src = ASSETS.wall;
            ctx.drawImage(img, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
          } else {
             const fakeWall = entitiesRef.current.find(e => e.type === EntityType.FAKE_WALL && e.pos.x === x && e.pos.y === y);
             if (fakeWall) {
                ctx.globalAlpha = 0.5;
                const img = new Image();
                img.src = ASSETS.wall;
                ctx.drawImage(img, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                ctx.globalAlpha = 1.0;
             } else {
                ctx.fillStyle = 'rgba(255,255,255,0.05)';
                ctx.fillRect(x * TILE_SIZE + 2, y * TILE_SIZE + 2, 4, 4);
             }
          }
        } else {
          ctx.fillStyle = '#000';
          ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
      }
    }

    // Draw Entities
    entitiesRef.current.forEach(entity => {
      // Enemy Vis check
      if (currentLevel.fogOfWar && entity.type !== EntityType.EXIT) {
         const dist = Math.sqrt(Math.pow(entity.pos.x - playerVisualPos.current.x, 2) + Math.pow(entity.pos.y - playerVisualPos.current.y, 2));
         if (dist > 250) return;
      }

      // For Enemies, pos is pixels. For others, pos is grid.
      let x, y;
      if (entity.type === EntityType.ENEMY) {
          x = entity.pos.x;
          y = entity.pos.y;
      } else {
          x = entity.pos.x * TILE_SIZE;
          y = entity.pos.y * TILE_SIZE;
      }
      
      let img = new Image();
      if (entity.spriteKey) {
        // @ts-ignore
        img.src = ASSETS[entity.spriteKey];
      } else {
        if (entity.type === EntityType.NPC) img.src = ASSETS.npc;
        else if (entity.type === EntityType.COLLECTIBLE) img.src = ASSETS.item;
        else if (entity.type === EntityType.KEY) img.src = ASSETS.key;
        else if (entity.type === EntityType.DOOR) img.src = ASSETS.door;
        else if (entity.type === EntityType.TRAP) img.src = ASSETS.trap;
        else if (entity.type === EntityType.OBSTACLE) {
             ctx.fillStyle = entity.color || 'red';
             ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        }
      }

      if (img.src) {
        ctx.drawImage(img, x, y, TILE_SIZE, TILE_SIZE);
      } else if (entity.type === EntityType.EXIT) {
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 3;
        ctx.strokeRect(x + 5, y + 5, TILE_SIZE - 10, TILE_SIZE - 10);
      }
    });

    // Draw Player
    const pImg = new Image();
    pImg.src = ASSETS.hero;
    ctx.drawImage(pImg, playerVisualPos.current.x, playerVisualPos.current.y, TILE_SIZE, TILE_SIZE);

    ctx.restore();

    requestAnimationFrame(render);
  }, [currentLevel, shake]);

  useEffect(() => {
    const loop = requestAnimationFrame(render);
    return () => cancelAnimationFrame(loop);
  }, [render]);


  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black">
      
      {/* HUD */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 font-pixel pointer-events-none">
        <div className="flex gap-1">
          {Array.from({ length: hearts }).map((_, i) => (
            <span key={i} className="text-3xl text-red-500 drop-shadow-md">♥</span>
          ))}
        </div>
        <div className="text-white text-xs mt-1 bg-black/60 p-2 rounded border border-white/20 backdrop-blur-sm">
           AREA: {currentLevel.name}
        </div>
      </div>

      <div className="absolute top-4 right-4 z-10">
         <button onClick={onExit} className="text-white hover:text-red-400 text-xs bg-black/50 px-3 py-1 border border-white/50">
            ABORT MISSION
         </button>
      </div>

      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-4 border-gray-800 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.8)] bg-black"
        style={{ imageRendering: 'pixelated' }}
      />

      {/* Center Feedback Text */}
      {feedback && (
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-30 w-full">
            <h2 className="text-2xl md:text-4xl text-white font-bold stroke-black drop-shadow-[0_4px_0_#000] animate-bounce">
              {feedback}
            </h2>
         </div>
      )}

      {/* QUIZ MODAL */}
      {quizEntity && (
        <div className="absolute inset-0 z-40 bg-black/80 flex items-center justify-center p-4">
           <div className="bg-purple-900 border-4 border-pink-500 p-6 max-w-md w-full shadow-2xl relative">
              <h3 className="text-pink-300 text-sm mb-4">HARVEY'S CHALLENGE</h3>
              <p className="text-white text-lg mb-6 leading-relaxed">
                {quizEntity.quizQuestion}
              </p>
              <input 
                autoFocus
                type="text"
                value={quizInput}
                onChange={(e) => setQuizInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitQuiz()}
                className="w-full bg-black border-2 border-purple-500 text-white p-3 font-mono mb-4 focus:outline-none focus:border-pink-500"
                placeholder="Type answer..."
              />
              <button 
                onClick={submitQuiz}
                className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 border-b-4 border-pink-800 active:border-b-0 active:translate-y-1"
              >
                ANSWER
              </button>
           </div>
        </div>
      )}

      {/* DIALOGUE */}
      {dialogue && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[90%] md:w-[600px] bg-blue-900/95 border-4 border-white p-6 z-20 shadow-lg backdrop-blur-sm">
          <div className="text-white text-lg leading-relaxed">
            {dialogue[dialogueIndex]}
          </div>
          <div className="text-right mt-4 text-xs text-yellow-300 animate-pulse">
            PRESS SPACE OR TAP
          </div>
        </div>
      )}

      {/* Mobile Controls */}
      <div className="absolute bottom-4 right-4 md:hidden grid grid-cols-3 gap-2 opacity-60">
         <div />
         <button className="bg-white/10 p-4 rounded active:bg-white/30" onTouchStart={() => attemptMove(0, -1)}>▲</button>
         <div />
         <button className="bg-white/10 p-4 rounded active:bg-white/30" onTouchStart={() => attemptMove(-1, 0)}>◀</button>
         <button className="bg-white/10 p-4 rounded active:bg-white/30" onTouchStart={() => attemptMove(0, 1)}>▼</button>
         <button className="bg-white/10 p-4 rounded active:bg-white/30" onTouchStart={() => attemptMove(1, 0)}>▶</button>
      </div>
    </div>
  );
};

export default GameView;