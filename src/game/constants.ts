export const TILE_SIZE = 16;
export const COLS = 35;
export const ROWS = 41;

export const CANVAS_WIDTH = COLS * TILE_SIZE; // 560
export const CANVAS_HEIGHT = ROWS * TILE_SIZE; // 656

export const TUNNEL_ROWS: number[] = [];

// Complicated, extensive 35x41 labyrinth with red burladeros,
// 100% enclosed perimeter with zero exits, and 555 yellow coins.
export const INITIAL_MAP: string[] = [
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW', // 0
  'W................W................W', // 1
  'W.WWWW.WWWWW.WWW.W.WWW.WWWWW.WWWW.W', // 2
  'WoWWWW.WWWWW.WWW.W.WWW.WWWWW.WWWWoW', // 3 - power pellets
  'W.WWWW.WWWWW.WWW.W.WWW.WWWWW.WWWW.W', // 4
  'W................W................W', // 5
  'W.WWWW.WW.WWWWWW.W.WWWWWW.WW.WWWW.W', // 6
  'W.WWWW.WW.WWWWWW.W.WWWWWW.WW.WWWW.W', // 7
  'W......WW....WWW.W.WWW....WW......W', // 8
  'WWWWWW.WWWWW.WWW.W.WWW.WWWWW.WWWWWW', // 9
  'WWWWWW.WWWWW.WW..W..WW.WWWWW.WWWWWW', // 10 (Sealed with burladero wall)
  'WWWWWW.WW........W........WW.WWWWWW', // 11
  'W......WW.WWWWWW.W.WWWWWW.WW......W', // 12
  'W.WWWW.WW.WWWWWW.W.WWWWWW.WW.WWWW.W', // 13
  'W.WWWW.WW........ ........WW.WWWW.W', // 14
  'W.WWWW.WWWW.WW=======WW.WWWW.WWWW.W', // 15 (Toril Door ==)
  'W.WWWW.WWWW.W---------W.WWWW.WWWW.W', // 16
  'W...........W---------W...........W', // 17
  'W.WWWW.WWWW.W---------W.WWWW.WWWW.W', // 18
  'W.WWWW.WWWW.WWWWWWWWWWW.WWWW.WWWW.W', // 19 (Toril Enclosure)
  'W......WW........W........WW......W', // 20
  'WWWWWW.WW.WWWWWW.W.WWWWWW.WW.WWWWWW', // 21
  'WWWWWW.WW.WWWWWW.W.WWWWWW.WW.WWWWWW', // 22 (Sealed)
  'WWWWWW.WW........W........WW.WWWWWW', // 23 (Sealed)
  'WWWWWW.WW.WWWWWW.W.WWWWWW.WW.WWWWWW', // 24
  'W................W................W', // 25
  'W.WWWW.WWWWWW.WW.W.WW.WWWWWW.WWWW.W', // 26
  'W.WWWW.WWWWWW.WW.W.WW.WWWWWW.WWWW.W', // 27
  'Wo..WW....WW.....W.....WW....WW..oW', // 28 - power pellets
  'WWW.WW.WW.WW.WWW.W.WWW.WW.WW.WW.WWW', // 29
  'WWWWWW.WW.WW.  . . .  .WW.WW.WWWWWW', // 30 (Sealed with burladero wall)
  'WWWWWW.WW.WW.WWW.W.WWW.WW.WW.WWWWWW', // 31
  'W......WW....WW..W..WW....WW......W', // 32
  'W.WWWWWWWWWW.WW.WWW.WW.WWWWWWWWWW.W', // 33
  'W.WWWWWWWWWW.WW.WWW.WW.WWWWWWWWWW.W', // 34
  'W................W................W', // 35
  'W.WWWW.WWWWWWWW..W..WWWWWWWW.WWWW.W', // 36
  'W.WWWW.WWWWWWWW..W..WWWWWWWW.WWWW.W', // 37
  'W...WW...........W...........WW...W', // 38
  'W................W................W', // 39
  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW', // 40
];

export const GHOST_CONFIGS = [
  {
    id: 'blinky' as const,
    name: 'Bravo',
    alias: 'El Rojo',
    color: '#ef4444', // Red
    scaredColor: '#3b82f6',
    scatterCol: 33,
    scatterRow: 0,
    spawnCol: 17,
    spawnRow: 14,
    startInHouse: false,
    houseTimer: 0,
  },
  {
    id: 'pinky' as const,
    name: 'Veloz',
    alias: 'La Rosa',
    color: '#f43f5e', // Pink
    scaredColor: '#3b82f6',
    scatterCol: 1,
    scatterRow: 0,
    spawnCol: 17,
    spawnRow: 17,
    startInHouse: true,
    houseTimer: 80,
  },
  {
    id: 'inky' as const,
    name: 'Listo',
    alias: 'El Cian',
    color: '#06b6d4', // Cyan
    scaredColor: '#3b82f6',
    scatterCol: 33,
    scatterRow: 40,
    spawnCol: 15,
    spawnRow: 17,
    startInHouse: true,
    houseTimer: 200,
  },
  {
    id: 'clyde' as const,
    name: 'Pasmado',
    alias: 'El Naranja',
    color: '#f97316', // Orange
    scaredColor: '#3b82f6',
    scatterCol: 1,
    scatterRow: 40,
    spawnCol: 19,
    spawnRow: 17,
    startInHouse: true,
    houseTimer: 350,
  },
  {
    id: 'morlaco' as const,
    name: 'Morlaco',
    alias: 'El Quinto Malo',
    color: '#a855f7', // Majestic Purple / Capote de Paseo
    scaredColor: '#3b82f6',
    scatterCol: 33,
    scatterRow: 1,
    spawnCol: 17,
    spawnRow: 18,
    startInHouse: true,
    houseTimer: 460,
  },
];

export const TORERO_SPAWN = {
  col: 17,
  row: 25,
};

export const SPEED_BASE = 2.0; // pixels per tick at 60fps
export const SPEED_GHOST_NORMAL = 1.85;
export const SPEED_GHOST_FRIGHTENED = 1.15;
export const SPEED_GHOST_EATEN = 4.0;
export const SPEED_GHOST_TUNNEL = 1.0;

export const FRIGHTENED_DURATION_TICKS = 480; // 8 seconds
export const FRIGHTENED_FLASH_TICKS = 140;

export const BONUS_ITEMS = [
  { name: 'Montera de Oro', points: 100, icon: '👑' },
  { name: 'Banderillas Reales', points: 300, icon: '🗡️' },
  { name: 'Bota de Jerez', points: 500, icon: '🍷' },
  { name: 'Gran Jamón', points: 700, icon: '🍖' },
  { name: 'Capote Bordado', points: 1000, icon: '✨' },
  { name: 'Trofeo Ruedo de Oro', points: 2000, icon: '🏆' },
];
