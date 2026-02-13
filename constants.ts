import { LevelConfig, EntityType } from "./types";

export const TILE_SIZE = 48;
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;

export const COLORS = {
  bg: '#1a1016',
  wall: '#b06c85',
  floor: '#ffccaa',
  text: '#ffffff',
};

export const STORY_BRIEF = `
TOP SECRET: DESI FIRANGAN'S FILE
--------------------------------
SUBJECT: Harvey (aka Desi Firangan)
TARGET: Shruti (aka Madame Spice)
MISSION DURATION: 992 Days (and counting)

MISSION: 
Navigate the complexities of your relationship. 
Beware: The challenges are now ACTIVE. 
Doubt will chase you. 
Gym Bros will block you. 
The Argument will confuse you.

Good luck, Desi Prince.
`;

const createRoom = (w: number, h: number, fill = 0) => {
  return Array(h).fill(null).map((_, y) => 
    Array(w).fill(null).map((_, x) => 
      (x === 0 || x === w - 1 || y === 0 || y === h - 1) ? 1 : fill
    )
  );
};

// --- LEVEL 1: OMEGLE (The Maze) ---
const map1 = createRoom(20, 15);
// Maze structure
for(let x=2; x<18; x+=2) map1[2][x] = 1;
for(let x=2; x<18; x+=2) map1[4][x] = 1;
for(let x=2; x<18; x+=2) map1[6][x] = 1;
for(let x=2; x<18; x+=2) map1[10][x] = 1;
map1[8][10] = 1; map1[8][11] = 1; // Obstacle center

// --- LEVEL 4: GYM ---
const map4 = createRoom(20, 15);
map4[5][5] = 1; map4[5][14] = 1; // Pillars

// --- LEVEL 6: LONG DISTANCE ---
const map6 = createRoom(20, 15);
for(let y=2; y<13; y++) { map6[y][6] = 1; map6[y][13] = 1; }
map6[12][6] = 0; map6[2][13] = 0; // Gaps

// --- LEVEL 8: ARGUMENT ---
const map8 = createRoom(20, 15);
for(let i=2; i<18; i+=3) for(let j=2; j<13; j+=3) map8[j][i] = 1;


export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: "Lvl 1: Glitch in the Matrix",
    gridSize: 20,
    background: '#111111',
    startPos: { x: 2, y: 3 },
    mapData: map1,
    fogOfWar: true,
    entities: [
      { id: 'exit', type: EntityType.EXIT, pos: { x: 18, y: 13 } },
      { id: 'npc_stranger', type: EntityType.NPC, pos: { x: 2, y: 1 }, message: ["Stranger: ASL?", "It's dangerous to go alone.", "Avoid the glitches!"] },
      { id: 'ConnectionKey', type: EntityType.KEY, pos: { x: 18, y: 1 } }, // Far corner
      { id: 'ChatRoom', type: EntityType.DOOR, pos: { x: 10, y: 8 }, isLocked: true, reqItem: 'ConnectionKey' },
      // Enemies
      { id: 'glitch1', type: EntityType.ENEMY, pos: { x: 8, y: 3 }, spriteKey: 'enemy_glitch', behavior: 'random', speed: 0.05 },
      { id: 'glitch2', type: EntityType.ENEMY, pos: { x: 14, y: 5 }, spriteKey: 'enemy_glitch', behavior: 'random', speed: 0.05 },
      { id: 'glitch3', type: EntityType.ENEMY, pos: { x: 5, y: 12 }, spriteKey: 'enemy_glitch', behavior: 'random', speed: 0.08 }
    ]
  },
  {
    id: 2,
    name: "Lvl 2: The Pineapple Wars",
    gridSize: 20,
    background: '#442200',
    startPos: { x: 2, y: 12 },
    mapData: createRoom(20, 15),
    entities: [
      { id: 'exit', type: EntityType.EXIT, pos: { x: 18, y: 2 } },
      { id: 'npc_chef', type: EntityType.NPC, pos: { x: 2, y: 10 }, message: ["The Italian Police are patrolling!", "Get the pineapple to the oven!"] },
      { id: 'door_pizza', type: EntityType.DOOR, pos: { x: 15, y: 7 }, isLocked: true, quizQuestion: "Does pineapple belong on pizza? (Yes/No)", quizAnswer: "Yes" },
      // Enemies patrolling
      { id: 'police1', type: EntityType.ENEMY, pos: { x: 6, y: 5 }, spriteKey: 'enemy_gymbro', behavior: 'patrol_h', patrolRange: 5, speed: 0.1, dir: 1 },
      { id: 'police2', type: EntityType.ENEMY, pos: { x: 12, y: 9 }, spriteKey: 'enemy_gymbro', behavior: 'patrol_h', patrolRange: 5, speed: 0.15, dir: -1 },
      { id: 'pineapple', type: EntityType.COLLECTIBLE, pos: { x: 2, y: 2 }, spriteKey: 'pineapple' }
    ]
  },
  {
    id: 3,
    name: "Lvl 3: Chasing Doubts",
    gridSize: 20,
    background: '#222244',
    startPos: { x: 2, y: 2 },
    mapData: createRoom(20, 15),
    entities: [
      { id: 'exit', type: EntityType.EXIT, pos: { x: 18, y: 13 } },
      { id: 'npc_doubt', type: EntityType.NPC, pos: { x: 5, y: 2 }, message: ["They are coming for you...", "Don't let the Doubt catch you!"] },
      { id: 'fake_wall1', type: EntityType.FAKE_WALL, pos: { x: 10, y: 10 } }, 
      { id: 'door_worth', type: EntityType.DOOR, pos: { x: 16, y: 4 }, isLocked: true, quizQuestion: "Are you capable enough for her?", quizAnswer: "Yes" },
      // Chasing Enemies
      { id: 'doubt1', type: EntityType.ENEMY, pos: { x: 15, y: 10 }, spriteKey: 'enemy_ghost', behavior: 'chase', speed: 0.035 },
      { id: 'doubt2', type: EntityType.ENEMY, pos: { x: 10, y: 10 }, spriteKey: 'enemy_ghost', behavior: 'chase', speed: 0.03 },
    ]
  },
  {
    id: 4,
    name: "Lvl 4: Gym Bro Patrol",
    gridSize: 20,
    background: '#333333',
    startPos: { x: 2, y: 7 },
    mapData: map4,
    entities: [
      { id: 'exit', type: EntityType.EXIT, pos: { x: 18, y: 7 } },
      // Weights everywhere blocking the path
      { id: 'w1', type: EntityType.OBSTACLE, pos: { x: 9, y: 5 }, spriteKey: 'weight' },
      { id: 'w2', type: EntityType.OBSTACLE, pos: { x: 11, y: 5 }, spriteKey: 'weight' },
      { id: 'npc_bro', type: EntityType.NPC, pos: { x: 2, y: 5 }, message: ["Re-rack your weights!", "Watch out for the Gym Bros!"] },
      // Patrolling Bros
      { id: 'bro1', type: EntityType.ENEMY, pos: { x: 8, y: 2 }, spriteKey: 'enemy_gymbro', behavior: 'patrol_v', patrolRange: 10, speed: 0.15, dir: 1 },
      { id: 'bro2', type: EntityType.ENEMY, pos: { x: 12, y: 12 }, spriteKey: 'enemy_gymbro', behavior: 'patrol_v', patrolRange: 10, speed: 0.15, dir: -1 },
    ]
  },
  {
    id: 5,
    name: "Lvl 5: The Show Quiz",
    gridSize: 20,
    background: '#1a051a',
    startPos: { x: 2, y: 2 },
    mapData: createRoom(20, 15),
    entities: [
      { id: 'exit', type: EntityType.EXIT, pos: { x: 18, y: 13 } },
      { id: 'door_show', type: EntityType.DOOR, pos: { x: 10, y: 8 }, isLocked: true, quizQuestion: "Finish the title: 'Nobody Wants ____'", quizAnswer: "This" },
      { id: 'door_show2', type: EntityType.DOOR, pos: { x: 14, y: 10 }, isLocked: true, quizQuestion: "Where is the Man? (Hint: On the ____)", quizAnswer: "Inside" },
      { id: 'ghost1', type: EntityType.ENEMY, pos: { x: 10, y: 2 }, spriteKey: 'enemy_ghost', behavior: 'random', speed: 0.05 },
    ]
  },
  {
    id: 6,
    name: "Lvl 6: Long Distance Lag",
    gridSize: 20,
    background: '#000033',
    startPos: { x: 2, y: 7 },
    mapData: map6,
    entities: [
      { id: 'exit', type: EntityType.EXIT, pos: { x: 18, y: 7 } },
      { id: 'npc_time', type: EntityType.NPC, pos: { x: 2, y: 6 }, message: ["Lag Spikes incoming!", "Time the gaps carefully."] },
      // Fast horizontal enemies in the lanes
      { id: 'lag1', type: EntityType.ENEMY, pos: { x: 8, y: 3 }, spriteKey: 'enemy_glitch', behavior: 'patrol_v', patrolRange: 10, speed: 0.3, dir: 1 },
      { id: 'lag2', type: EntityType.ENEMY, pos: { x: 11, y: 11 }, spriteKey: 'enemy_glitch', behavior: 'patrol_v', patrolRange: 10, speed: 0.3, dir: -1 },
    ]
  },
  {
    id: 7,
    name: "Lvl 7: Spicy Minefield",
    gridSize: 20,
    background: '#330000',
    startPos: { x: 2, y: 2 },
    mapData: createRoom(20, 15),
    entities: [
      { id: 'exit', type: EntityType.EXIT, pos: { x: 18, y: 13 } },
      { id: 'npc_spice', type: EntityType.NPC, pos: { x: 4, y: 4 }, message: ["Hidden Traps everywhere!", "Tread lightly."] },
      ...Array.from({length: 10}, (_, i) => ({ id: `trap_${i}`, type: EntityType.TRAP, pos: { x: 5 + Math.floor(Math.random()*10), y: 3 + Math.floor(Math.random()*10) } })),
      { id: 'Biryani', type: EntityType.COLLECTIBLE, pos: { x: 18, y: 2 }, spriteKey: 'pineapple' },
    ]
  },
  {
    id: 8,
    name: "Lvl 8: The Argument",
    gridSize: 20,
    background: '#200',
    startPos: { x: 10, y: 7 },
    mapData: map8,
    chaosMode: true, // Controls flip randomly
    entities: [
      { id: 'exit', type: EntityType.EXIT, pos: { x: 18, y: 13 } },
      { id: 'npc_sad', type: EntityType.NPC, pos: { x: 10, y: 10 }, message: ["I'm so confused...", "The controls keep changing!"] },
      // Chasing ghosts of regret
       { id: 'regret', type: EntityType.ENEMY, pos: { x: 2, y: 2 }, spriteKey: 'enemy_ghost', behavior: 'chase', speed: 0.02 },
    ]
  },
  {
    id: 9,
    name: "Lvl 9: The Promise",
    gridSize: 20,
    background: '#440044',
    startPos: { x: 2, y: 12 },
    mapData: createRoom(20, 15),
    entities: [
      { id: 'exit', type: EntityType.EXIT, pos: { x: 18, y: 2 } },
      { id: 'npc_dance', type: EntityType.NPC, pos: { x: 5, y: 12 }, message: ["Almost there...", "Don't forget the dance."] },
      { id: 'door_wedding', type: EntityType.DOOR, pos: { x: 16, y: 4 }, isLocked: true, quizQuestion: "Which movie is the dance from?", quizAnswer: "Love Actually" }
    ]
  },
  {
    id: 10,
    name: "Lvl 10: Cappadocia",
    gridSize: 20,
    background: '#87CEEB', 
    startPos: { x: 10, y: 13 },
    mapData: createRoom(20, 15),
    entities: [
      { id: 'exit', type: EntityType.EXIT, pos: { x: 10, y: 2 } },
      { id: 'balloon1', type: EntityType.COLLECTIBLE, pos: { x: 4, y: 10 }, spriteKey: 'balloon' },
      { id: 'balloon2', type: EntityType.COLLECTIBLE, pos: { x: 16, y: 10 }, spriteKey: 'balloon' },
      { id: 'npc_final', type: EntityType.NPC, pos: { x: 10, y: 11 }, message: ["You made it!", "Go to her."] },
      { id: 'Madame Spice', type: EntityType.NPC, pos: { x: 10, y: 4 }, color: '#ff0055', message: ["I love you Harvey.", "Happy Valentine's Day."] }
    ]
  }
];