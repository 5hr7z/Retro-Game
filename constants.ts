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

// Helper to cage the exit so the door is the ONLY way in.
const gateExit = (map: number[][], exitX: number, exitY: number, doorX: number, doorY: number) => {
    // Surround the exit tile with walls
    if (map[exitY-1]) map[exitY-1][exitX] = 1;
    if (map[exitY+1]) map[exitY+1][exitX] = 1;
    if (map[exitY]) map[exitY][exitX-1] = 1;
    if (map[exitY]) map[exitY][exitX+1] = 1;

    // Open the spot for the door (it will be occupied by the door entity, acting as a wall until opened)
    // We don't need to set it to 1 here because the Entity takes care of collision.
    // We just ensure the path AROUND the door is blocked.
    // Actually, to be safe, let's wall off the corners of the exit too.
    if (map[exitY-1]) { map[exitY-1][exitX-1] = 1; map[exitY-1][exitX+1] = 1; }
    if (map[exitY+1]) { map[exitY+1][exitX-1] = 1; map[exitY+1][exitX+1] = 1; }
    
    // Clear the specific tile where the door sits (so it's not a permanent wall)
    if (map[doorY] && map[doorY][doorX] !== undefined) map[doorY][doorX] = 0;
    
    // Clear the exit tile itself
    if (map[exitY] && map[exitY][exitX] !== undefined) map[exitY][exitX] = 0;
};


// --- LEVEL 1: OMEGLE (The Maze) ---
const map1 = createRoom(20, 15);
for(let x=2; x<18; x+=2) map1[2][x] = 1;
for(let x=2; x<18; x+=2) map1[4][x] = 1;
for(let x=2; x<18; x+=2) map1[6][x] = 1;
for(let x=2; x<18; x+=2) map1[10][x] = 1;
map1[8][10] = 1; map1[8][11] = 1; 
gateExit(map1, 18, 13, 17, 13); // Exit 18,13 | Door 17,13

// --- LEVEL 2: PIZZA ---
const map2 = createRoom(20, 15);
gateExit(map2, 18, 2, 17, 2); // Exit 18,2 | Door 17,2

// --- LEVEL 3: SHADOW ---
const map3 = createRoom(20, 15);
gateExit(map3, 18, 13, 17, 13);

// --- LEVEL 4: GYM ---
const map4 = createRoom(20, 15);
map4[5][5] = 1; map4[5][14] = 1; // Pillars
gateExit(map4, 18, 7, 17, 7); // Exit 18,7 | Door 17,7

// --- LEVEL 5: SHOW ---
const map5 = createRoom(20, 15);
gateExit(map5, 18, 13, 17, 13);

// --- LEVEL 6: TIME ---
const map6 = createRoom(20, 15);
for(let y=2; y<13; y++) { map6[y][6] = 1; map6[y][13] = 1; }
map6[12][6] = 0; map6[2][13] = 0; // Gaps
gateExit(map6, 18, 7, 17, 7);

// --- LEVEL 7: FOOD ---
const map7 = createRoom(20, 15);
gateExit(map7, 18, 13, 17, 13);

// --- LEVEL 8: ARGUMENT ---
const map8 = createRoom(20, 15);
for(let i=2; i<18; i+=3) for(let j=2; j<13; j+=3) map8[j][i] = 1;
gateExit(map8, 18, 13, 17, 13);

// --- LEVEL 9: MOVIE ---
const map9 = createRoom(20, 15);
gateExit(map9, 18, 2, 17, 2);

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: "Lvl 1: 01010011", 
    gridSize: 20,
    background: '#111111',
    startPos: { x: 2, y: 3 },
    mapData: map1,
    fogOfWar: true,
    entities: [
      { id: 'exit', type: EntityType.EXIT, pos: { x: 18, y: 13 } },
      { id: 'ChatRoom', type: EntityType.DOOR, pos: { x: 17, y: 13 }, isLocked: true, reqItem: 'ConnectionKey' },
      { id: 'npc_stranger', type: EntityType.NPC, pos: { x: 2, y: 1 }, message: ["Where strangers become friends...", "Find the Key of 'M' to proceed."] },
      { id: 'ConnectionKey', type: EntityType.KEY, pos: { x: 18, y: 1 } }, 
      { id: 'glitch1', type: EntityType.ENEMY, pos: { x: 8, y: 3 }, spriteKey: 'enemy_glitch', behavior: 'random', speed: 0.05 },
      { id: 'glitch2', type: EntityType.ENEMY, pos: { x: 14, y: 5 }, spriteKey: 'enemy_glitch', behavior: 'random', speed: 0.05 },
      { id: 'glitch3', type: EntityType.ENEMY, pos: { x: 5, y: 12 }, spriteKey: 'enemy_glitch', behavior: 'random', speed: 0.08 }
    ]
  },
  {
    id: 2,
    name: "Lvl 2: The Forbidden Fruit",
    gridSize: 20,
    background: '#442200',
    startPos: { x: 2, y: 12 },
    mapData: map2,
    entities: [
      { id: 'exit', type: EntityType.EXIT, pos: { x: 18, y: 2 } },
      { id: 'door_pizza', type: EntityType.DOOR, pos: { x: 17, y: 2 }, isLocked: true, 
        quizQuestion: "Italian Nightmare. Hawaiian Dream. Spiky armor, yellow heart. What am I?", 
        quizAnswer: "Pineapple" 
      },
      { id: 'npc_chef', type: EntityType.NPC, pos: { x: 2, y: 10 }, message: ["The culinary police are watching.", "Choose your allegiance wisely."] },
      { id: 'police1', type: EntityType.ENEMY, pos: { x: 6, y: 5 }, spriteKey: 'enemy_gymbro', behavior: 'patrol_h', patrolRange: 5, speed: 0.1, dir: 1 },
      { id: 'police2', type: EntityType.ENEMY, pos: { x: 12, y: 9 }, spriteKey: 'enemy_gymbro', behavior: 'patrol_h', patrolRange: 5, speed: 0.15, dir: -1 },
    ]
  },
  {
    id: 3,
    name: "Lvl 3: The Shadow",
    gridSize: 20,
    background: '#222244',
    startPos: { x: 2, y: 2 },
    mapData: map3,
    entities: [
      { id: 'exit', type: EntityType.EXIT, pos: { x: 18, y: 13 } },
      { id: 'door_worth', type: EntityType.DOOR, pos: { x: 17, y: 13 }, isLocked: true, 
        quizQuestion: "I creep in at 3AM. I tell you you aren't enough. I am the voice that says 'She deserves better'. What am I?", 
        quizAnswer: "Doubt" 
      },
      { id: 'npc_doubt', type: EntityType.NPC, pos: { x: 5, y: 2 }, message: ["Run all you want.", "You can't outrun your own mind."] },
      { id: 'fake_wall1', type: EntityType.FAKE_WALL, pos: { x: 10, y: 10 } }, 
      { id: 'doubt1', type: EntityType.ENEMY, pos: { x: 15, y: 10 }, spriteKey: 'enemy_ghost', behavior: 'chase', speed: 0.035 },
      { id: 'doubt2', type: EntityType.ENEMY, pos: { x: 10, y: 10 }, spriteKey: 'enemy_ghost', behavior: 'chase', speed: 0.03 },
    ]
  },
  {
    id: 4,
    name: "Lvl 4: The Temple of Iron",
    gridSize: 20,
    background: '#333333',
    startPos: { x: 2, y: 7 },
    mapData: map4,
    entities: [
      { id: 'exit', type: EntityType.EXIT, pos: { x: 18, y: 7 } },
      { id: 'door_gym', type: EntityType.DOOR, pos: { x: 17, y: 7 }, isLocked: true, reqItem: 'ProteinShake' },
      { id: 'w1', type: EntityType.OBSTACLE, pos: { x: 9, y: 5 }, spriteKey: 'weight' },
      { id: 'w2', type: EntityType.OBSTACLE, pos: { x: 11, y: 5 }, spriteKey: 'weight' },
      { id: 'npc_bro', type: EntityType.NPC, pos: { x: 2, y: 5 }, message: ["Do you even lift, bro?", "Find the elixir of gains."] },
      { id: 'ProteinShake', type: EntityType.KEY, pos: { x: 18, y: 2 }, color: '#fff' },
      { id: 'bro1', type: EntityType.ENEMY, pos: { x: 8, y: 2 }, spriteKey: 'enemy_gymbro', behavior: 'patrol_v', patrolRange: 10, speed: 0.15, dir: 1 },
      { id: 'bro2', type: EntityType.ENEMY, pos: { x: 12, y: 12 }, spriteKey: 'enemy_gymbro', behavior: 'patrol_v', patrolRange: 10, speed: 0.15, dir: -1 },
    ]
  },
  {
    id: 5,
    name: "Lvl 5: The Unwanted",
    gridSize: 20,
    background: '#1a051a',
    startPos: { x: 2, y: 2 },
    mapData: map5,
    entities: [
      { id: 'exit', type: EntityType.EXIT, pos: { x: 18, y: 13 } },
      { id: 'door_show', type: EntityType.DOOR, pos: { x: 17, y: 13 }, isLocked: true, 
        quizQuestion: "A podcast host falls for a Rabbi. It's our favorite show. Title: Nobody Wants ____", 
        quizAnswer: "This" 
      },
      { id: 'npc_critic', type: EntityType.NPC, pos: { x: 10, y: 8 }, message: ["It's not just a show.", "It's a lifestyle."] },
      { id: 'ghost1', type: EntityType.ENEMY, pos: { x: 10, y: 2 }, spriteKey: 'enemy_ghost', behavior: 'random', speed: 0.05 },
    ]
  },
  {
    id: 6,
    name: "Lvl 6: 12:30 AM vs 6:00 PM",
    gridSize: 20,
    background: '#000033',
    startPos: { x: 2, y: 7 },
    mapData: map6,
    entities: [
      { id: 'exit', type: EntityType.EXIT, pos: { x: 18, y: 7 } },
      { id: 'door_time', type: EntityType.DOOR, pos: { x: 17, y: 7 }, isLocked: true, 
        quizQuestion: "I measure the distance not in miles, but in hours. I am the thief of shared sunsets. What am I?", 
        quizAnswer: "Time Zone" 
      },
      { id: 'npc_time', type: EntityType.NPC, pos: { x: 2, y: 6 }, message: ["Sync your watches.", "The lag is the enemy."] },
      { id: 'lag1', type: EntityType.ENEMY, pos: { x: 8, y: 3 }, spriteKey: 'enemy_glitch', behavior: 'patrol_v', patrolRange: 10, speed: 0.3, dir: 1 },
      { id: 'lag2', type: EntityType.ENEMY, pos: { x: 11, y: 11 }, spriteKey: 'enemy_glitch', behavior: 'patrol_v', patrolRange: 10, speed: 0.3, dir: -1 },
    ]
  },
  {
    id: 7,
    name: "Lvl 7: Red Flag / Green Flag",
    gridSize: 20,
    background: '#330000',
    startPos: { x: 2, y: 2 },
    mapData: map7,
    entities: [
      { id: 'exit', type: EntityType.EXIT, pos: { x: 18, y: 13 } },
      { id: 'door_biryani', type: EntityType.DOOR, pos: { x: 17, y: 13 }, isLocked: true, reqItem: 'Biryani' },
      { id: 'npc_spice', type: EntityType.NPC, pos: { x: 4, y: 4 }, message: ["Some flags are red.", "Some are delicious.", "Find the comfort food."] },
      ...Array.from({length: 12}, (_, i) => ({ id: `trap_${i}`, type: EntityType.TRAP, pos: { x: 5 + Math.floor(Math.random()*10), y: 3 + Math.floor(Math.random()*10) } })),
      { id: 'Biryani', type: EntityType.KEY, pos: { x: 18, y: 2 }, spriteKey: 'pineapple' }, // Using Key type for inventory
    ]
  },
  {
    id: 8,
    name: "Lvl 8: The Misunderstanding",
    gridSize: 20,
    background: '#200',
    startPos: { x: 10, y: 7 },
    mapData: map8,
    chaosMode: true,
    entities: [
      { id: 'exit', type: EntityType.EXIT, pos: { x: 18, y: 13 } },
      { id: 'door_sorry', type: EntityType.DOOR, pos: { x: 17, y: 13 }, isLocked: true, 
        quizQuestion: "When the controls of life flip and nothing makes sense, what is the only 5-letter word that fixes the glitch?", 
        quizAnswer: "Sorry" 
      },
      { id: 'npc_sad', type: EntityType.NPC, pos: { x: 10, y: 10 }, message: ["I didn't mean it.", "Why am I walking backwards?"] },
       { id: 'regret', type: EntityType.ENEMY, pos: { x: 2, y: 2 }, spriteKey: 'enemy_ghost', behavior: 'chase', speed: 0.02 },
    ]
  },
  {
    id: 9,
    name: "Lvl 9: The Grand Gesture",
    gridSize: 20,
    background: '#440044',
    startPos: { x: 2, y: 12 },
    mapData: map9,
    entities: [
      { id: 'exit', type: EntityType.EXIT, pos: { x: 18, y: 2 } },
      { id: 'door_wedding', type: EntityType.DOOR, pos: { x: 17, y: 2 }, isLocked: true, 
        quizQuestion: "Silent cards on a doorstep. A boombox held high. To me, you are perfect. Name the movie.", 
        quizAnswer: "Love Actually" 
      },
      { id: 'npc_dance', type: EntityType.NPC, pos: { x: 5, y: 12 }, message: ["Get ready.", "Practice your moves."] },
    ]
  },
  {
    id: 10,
    name: "Lvl 10: 38.6431° N, 34.8289° E",
    gridSize: 20,
    background: '#87CEEB', 
    startPos: { x: 10, y: 13 },
    mapData: createRoom(20, 15),
    entities: [
      // Balloons
      { id: 'balloon1', type: EntityType.COLLECTIBLE, pos: { x: 4, y: 10 }, spriteKey: 'balloon' },
      { id: 'balloon2', type: EntityType.COLLECTIBLE, pos: { x: 16, y: 10 }, spriteKey: 'balloon' },
      { id: 'balloon3', type: EntityType.COLLECTIBLE, pos: { x: 2, y: 5 }, spriteKey: 'balloon' },
      { id: 'balloon4', type: EntityType.COLLECTIBLE, pos: { x: 18, y: 5 }, spriteKey: 'balloon' },
      { id: 'balloon5', type: EntityType.COLLECTIBLE, pos: { x: 8, y: 2 }, spriteKey: 'balloon' },
      { id: 'balloon6', type: EntityType.COLLECTIBLE, pos: { x: 12, y: 2 }, spriteKey: 'balloon' },
      
      // Madame Spice
      { id: 'Madame Spice', type: EntityType.NPC, pos: { x: 10, y: 4 }, spriteKey: 'madame_spice', interactable: true }
    ]
  }
];