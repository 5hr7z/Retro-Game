export enum GameState {
  MENU,
  PLAYING,
  DIALOGUE,
  QUIZ,
  GAME_OVER,
  VICTORY,
  BRIEF
}

export enum EntityType {
  PLAYER,
  OBSTACLE,     // Static damage (spikes)
  ENEMY,        // Moving damage
  COLLECTIBLE,  // Points/Items
  NPC,          // Dialogue
  EXIT,         // Next Level
  DOOR,         // Locked path
  KEY,          // Unlocks Door
  FAKE_WALL,    // Walkable wall
  TRAP,         // Hidden damage
  TELEPORTER    // Moves player (Omegle style)
}

export type EnemyBehavior = 'static' | 'patrol_h' | 'patrol_v' | 'chase' | 'random';

export interface Position {
  x: number;
  y: number;
}

export interface Entity {
  id: string;
  type: EntityType;
  pos: Position;
  color?: string;
  interactable?: boolean;
  spriteKey?: string; // Specific asset look
  
  // Interaction Properties
  message?: string[];        // For NPCs
  reqItem?: string;          // For Doors needing keys
  quizQuestion?: string;     // For Quiz Doors
  quizAnswer?: string;       // Correct answer for Quiz
  isLocked?: boolean;        // State for doors
  targetPos?: Position;      // For Teleporters
  
  // Enemy Properties
  behavior?: EnemyBehavior;
  speed?: number;            // Movement speed factor
  patrolRange?: number;      // How far they go
  originalPos?: Position;    // For patrolling
  dir?: number;              // Current direction (1 or -1)

  // Visibility
  visibilityRadius?: number; // Distance in pixels within which entity is visible
}

export interface LevelConfig {
  id: number;
  name: string;
  gridSize: number;
  mapData: number[][]; // 0: floor, 1: wall
  entities: Entity[];
  startPos: Position;
  background: string;
  fogOfWar?: boolean; // If true, only show area around player
  chaosMode?: boolean; // If true, controls are reversed/jittery
}

export interface PlayerStats {
  hearts: number;
  maxHearts: number;
  inventory: string[];
}