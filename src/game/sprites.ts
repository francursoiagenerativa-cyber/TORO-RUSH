import { Direction, Ghost, Torero, ScorePopup, BonusItem } from './types';
import { TILE_SIZE, COLS, ROWS } from './constants';
import toreroTrimmedSrc from '../assets/images/torero_trimmed.png';
import bullTrimmedSrc from '../assets/images/bull_trimmed.png';
import bullFrightenedSrc from '../assets/images/bull_frightened.png';
import bullFlashingSrc from '../assets/images/bull_flashing.png';

export class SpriteRenderer {
  public ctx: CanvasRenderingContext2D;
  private toreroImg: HTMLImageElement | null = null;
  private bullImg: HTMLImageElement | null = null;
  private bullFrightenedImg: HTMLImageElement | null = null;
  private bullFlashingImg: HTMLImageElement | null = null;
  private imagesLoaded = false;
  private staticMapCanvas: HTMLCanvasElement | null = null;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.loadAssets();
  }

  private loadAssets() {
    if (typeof window === 'undefined') return;

    let loadedCount = 0;
    const checkAll = () => {
      loadedCount++;
      if (loadedCount >= 4) {
        this.imagesLoaded = true;
      }
    };

    const tImg = new Image();
    tImg.src = toreroTrimmedSrc;
    tImg.onload = () => {
      this.toreroImg = tImg;
      checkAll();
    };

    const bImg = new Image();
    bImg.src = bullTrimmedSrc;
    bImg.onload = () => {
      this.bullImg = bImg;
      checkAll();
    };

    const bfImg = new Image();
    bfImg.src = bullFrightenedSrc;
    bfImg.onload = () => {
      this.bullFrightenedImg = bfImg;
      checkAll();
    };

    const bflImg = new Image();
    bflImg.src = bullFlashingSrc;
    bflImg.onload = () => {
      this.bullFlashingImg = bflImg;
      checkAll();
    };
  }

  // Pre-render the static labyrinth walls ONCE on an offscreen canvas for extreme mobile performance
  private initStaticMap(grid: string[][]) {
    if (typeof document === 'undefined') return;

    const offscreen = document.createElement('canvas');
    offscreen.width = COLS * TILE_SIZE;
    offscreen.height = ROWS * TILE_SIZE;
    const offCtx = offscreen.getContext('2d');
    if (!offCtx) return;

    // Background: Deep dark bullring arcade black
    offCtx.fillStyle = '#050202';
    offCtx.fillRect(0, 0, offscreen.width, offscreen.height);

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cell = grid[r][c];
        const x = c * TILE_SIZE;
        const y = r * TILE_SIZE;

        if (cell === 'W') {
          // Burladero Tradicional Rojo de Plaza de Toros
          const topW = r > 0 && grid[r - 1][c] === 'W';
          const bottomW = r < ROWS - 1 && grid[r + 1][c] === 'W';
          const leftW = c > 0 && grid[r][c - 1] === 'W';
          const rightW = c < COLS - 1 && grid[r][c + 1] === 'W';

          // 1. Sombra posterior del refugio / callejón del burladero
          offCtx.fillStyle = '#000000';
          offCtx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

          // 2. Tablazón de madera de burladero (Rojo Almagre Taurino)
          offCtx.fillStyle = '#6b1111'; // Base rojo oscuro de madera
          offCtx.fillRect(x + 0.5, y + 0.5, TILE_SIZE - 1, TILE_SIZE - 1);

          // Tablones horizontales de madera roja
          offCtx.fillStyle = '#831818';
          offCtx.fillRect(x + 1, y + 1, TILE_SIZE - 2, 7); // Tablón superior
          offCtx.fillRect(x + 1, y + 10, TILE_SIZE - 2, 8); // Tablón intermedio
          offCtx.fillRect(x + 1, y + 20, TILE_SIZE - 2, 7); // Tablón inferior

          // Ranuras oscuras entre tablas de madera
          offCtx.fillStyle = '#260404';
          offCtx.fillRect(x + 1, y + 9, TILE_SIZE - 2, 1.2);
          offCtx.fillRect(x + 1, y + 19, TILE_SIZE - 2, 1.2);

          // 3. Franja central decorativa de gala (Rojo carmesí con ribete de oro/albero)
          offCtx.fillStyle = '#b91c1c'; // Rojo vivo de barrera
          offCtx.fillRect(x + 0.5, y + 9.5, TILE_SIZE - 1, 9);

          // Fino ribete dorado / albero viejo delimitando la franja
          offCtx.fillStyle = '#d97706';
          offCtx.fillRect(x + 0.5, y + 9.5, TILE_SIZE - 1, 1.2);
          offCtx.fillRect(x + 0.5, y + 17.5, TILE_SIZE - 1, 1.2);

          // Emblema o clavo central de gala dorado en bloques alternos
          if ((r + c) % 3 === 0) {
            offCtx.fillStyle = '#fbbf24'; // Brass/gold center rivet
            offCtx.beginPath();
            offCtx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, 2.0, 0, Math.PI * 2);
            offCtx.fill();
          }

          // 4. Pasamanos / Albardilla de remate superior (si tiene camino abierto arriba)
          if (!topW) {
            offCtx.fillStyle = '#dc2626'; // Rojo brillante de remate de barrera
            offCtx.fillRect(x + 0.5, y, TILE_SIZE - 1, 3.5);

            // Borde dorado en el lomo superior del burladero
            offCtx.fillStyle = '#fbbf24';
            offCtx.fillRect(x + 0.5, y, TILE_SIZE - 1, 1.4);
          }

          // Rodapié inferior (si tiene camino abierto abajo)
          if (!bottomW) {
            offCtx.fillStyle = '#450a0a';
            offCtx.fillRect(x + 0.5, y + TILE_SIZE - 2.5, TILE_SIZE - 1, 2.5);
            offCtx.fillStyle = '#1a0303';
            offCtx.fillRect(x + 0.5, y + TILE_SIZE - 1.0, TILE_SIZE - 1, 1.0);
          }

          // 5. Postes / Maderos laterales de anclaje con remaches dorados
          if (!leftW) {
            offCtx.fillStyle = '#ef4444';
            offCtx.fillRect(x, y + 0.5, 2.0, TILE_SIZE - 1);
            offCtx.fillStyle = '#fbbf24';
            offCtx.fillRect(x + 2.5, y + 3, 2.0, 2.0);
            offCtx.fillRect(x + 2.5, y + TILE_SIZE - 5, 2.0, 2.0);
          }

          if (!rightW) {
            offCtx.fillStyle = '#ef4444';
            offCtx.fillRect(x + TILE_SIZE - 2.0, y + 0.5, 2.0, TILE_SIZE - 1);
            offCtx.fillStyle = '#fbbf24';
            offCtx.fillRect(x + TILE_SIZE - 4.5, y + 3, 2.0, 2.0);
            offCtx.fillRect(x + TILE_SIZE - 4.5, y + TILE_SIZE - 5, 2.0, 2.0);
          }

          // Perfilado exterior nítido en rojo bermellón
          offCtx.strokeStyle = '#b91c1c';
          offCtx.lineWidth = 1.0;
          offCtx.strokeRect(x + 0.5, y + 0.5, TILE_SIZE - 1.0, TILE_SIZE - 1.0);
        } else if (cell === '=') {
          // Puerta del toril (Rejas doradas y rojas)
          offCtx.fillStyle = '#eab308';
          offCtx.fillRect(x, y + TILE_SIZE / 2 - 2.5, TILE_SIZE, 5);
          offCtx.fillStyle = '#fde047';
          offCtx.fillRect(x + 5, y + 2, 2.5, TILE_SIZE - 4);
          offCtx.fillRect(x + 20, y + 2, 2.5, TILE_SIZE - 4);
        }
      }
    }

    this.staticMapCanvas = offscreen;
  }

  // Draw Arena: 1 Blit for all static walls + fast dynamic render for active coins
  public drawMap(grid: string[][], tick: number) {
    const ctx = this.ctx;

    if (!this.staticMapCanvas) {
      this.initStaticMap(grid);
    }

    // Blit pre-rendered static arena background in 1 single ultra-fast operation
    if (this.staticMapCanvas) {
      ctx.drawImage(this.staticMapCanvas, 0, 0);
    } else {
      ctx.fillStyle = '#050202';
      ctx.fillRect(0, 0, COLS * TILE_SIZE, ROWS * TILE_SIZE);
    }

    // Dynamic pass: ONLY draw active coins and pulsing power pellets
    const pulse = (Math.sin(tick * 0.18) + 1) / 2; // 0..1
    const pelletRadius = 8 + pulse * 3.5;
    const pelletAlpha = 0.35 + pulse * 0.4;

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cell = grid[r][c];
        if (cell !== '.' && cell !== 'o') continue;

        const x = c * TILE_SIZE;
        const y = r * TILE_SIZE;
        const cx = x + TILE_SIZE / 2;
        const cy = y + TILE_SIZE / 2;

        if (cell === '.') {
          // Moneda Amarilla Clásica
          // Outer yellow glow
          ctx.fillStyle = 'rgba(250, 204, 21, 0.35)';
          ctx.beginPath();
          ctx.arc(cx, cy, 6.0, 0, Math.PI * 2);
          ctx.fill();

          // Yellow gold coin body
          ctx.fillStyle = '#eab308'; // Amber-500
          ctx.beginPath();
          ctx.arc(cx, cy, 4.2, 0, Math.PI * 2);
          ctx.fill();

          // Bright center sparkle
          ctx.fillStyle = '#fef08a'; // Yellow-200
          ctx.beginPath();
          ctx.arc(cx - 1, cy - 1, 1.8, 0, Math.PI * 2);
          ctx.fill();
        } else if (cell === 'o') {
          // Monedón de Oro Especial (Power Pellet)
          // Glowing yellow corona
          ctx.fillStyle = `rgba(250, 204, 21, ${pelletAlpha})`;
          ctx.beginPath();
          ctx.arc(cx, cy, pelletRadius + 5, 0, Math.PI * 2);
          ctx.fill();

          // Outer gold rim
          ctx.fillStyle = '#ca8a04';
          ctx.beginPath();
          ctx.arc(cx, cy, pelletRadius, 0, Math.PI * 2);
          ctx.fill();

          // Shiny yellow coin surface
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(cx, cy, pelletRadius - 2, 0, Math.PI * 2);
          ctx.fill();

          // Central sparkle
          ctx.fillStyle = '#fef9c3';
          ctx.beginPath();
          ctx.arc(cx - 1.5, cy - 1.5, pelletRadius * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  // Draw Torero Emoji (High-Performance Hardware Rendering, No Expensive shadowBlur)
  public drawTorero(torero: Torero, tick: number) {
    const ctx = this.ctx;
    const cx = torero.x;
    const cy = torero.y;

    // Dimensions scaled up for 28px tiles (natural 810x929 aspect ratio)
    const width = 42;
    const height = 48.2;

    ctx.save();
    ctx.translate(cx, cy);

    // Fast GPU ground shadow on arena sand
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(0, height / 2 - 2, width * 0.35, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    if (torero.isDead) {
      const progress = torero.deathFrame / 60;
      const angle = progress * Math.PI * 8;
      const scale = Math.max(0, 1 - progress);

      ctx.rotate(angle);
      ctx.scale(scale, scale);

      if (this.toreroImg) {
        ctx.drawImage(this.toreroImg, -width / 2, -height / 2, width, height);
      } else {
        this.drawToreroFallback();
      }

      ctx.restore();
      return;
    }

    let dirAngle = 0;
    let flipX = false;
    if (torero.direction === 'UP') dirAngle = -Math.PI / 2;
    else if (torero.direction === 'DOWN') dirAngle = Math.PI / 2;
    else if (torero.direction === 'LEFT') flipX = true;
    else if (torero.direction === 'RIGHT') flipX = false;

    // Movement bobbing
    const bob = Math.sin(tick * 0.3) * 1.8;

    // Draw Capote waving in front
    const capoteWave = Math.sin(tick * 0.4) * 4.5;
    ctx.save();
    if (dirAngle !== 0) {
      ctx.rotate(dirAngle);
    } else if (flipX) {
      ctx.scale(-1, 1);
    }

    // Magenta & Yellow capote (scaled)
    ctx.fillStyle = '#e11d48';
    ctx.beginPath();
    ctx.moveTo(10, -10 + capoteWave);
    ctx.lineTo(24, 0);
    ctx.lineTo(10, 10 - capoteWave);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(8, -5 + capoteWave * 0.5);
    ctx.lineTo(19, 0);
    ctx.lineTo(8, 5 - capoteWave * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Draw Torero Emoji Head 100% Opaque with Fast Direct Hardware Blitting
    if (this.toreroImg) {
      ctx.save();
      if (flipX) {
        ctx.scale(-1, 1);
      }
      ctx.globalAlpha = 1.0;
      ctx.drawImage(this.toreroImg, -width / 2, -height / 2 + bob, width, height);
      ctx.restore();
    } else {
      this.drawToreroFallback();
    }

    ctx.restore();
  }

  // Draw Bull Emoji (High-Performance Hardware Rendering, No Expensive shadowBlur)
  public drawGhost(ghost: Ghost, tick: number) {
    const ctx = this.ctx;
    const cx = ghost.x;
    const cy = ghost.y;

    // Dimensions scaled up for 28px tiles (natural 793x781 aspect ratio)
    const width = 44;
    const height = 43.3;

    ctx.save();
    ctx.translate(cx, cy);

    // Fast GPU ground shadow on arena sand
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.ellipse(0, height / 2 - 2, width * 0.38, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();

    if (ghost.mode === 'EATEN') {
      this.drawBullEyesAndHorns(ghost.direction);
      ctx.restore();
      return;
    }

    const isFrightened = ghost.mode === 'FRIGHTENED';
    const isFlashing =
      isFrightened &&
      ghost.frightenedTimer < 140 &&
      Math.floor(ghost.frightenedTimer / 10) % 2 === 0;

    const flipX = ghost.direction === 'LEFT';

    // Characteristic color badge for each bull
    const badgeColor = isFrightened ? (isFlashing ? '#ffffff' : '#3b82f6') : ghost.color;

    // 1. Crisp solid colored ribbon / divisa on top of the bull
    ctx.save();
    ctx.fillStyle = badgeColor;
    ctx.strokeStyle = '#020617';
    ctx.lineWidth = 1.2;

    // Traditional ribbon rosette on top
    ctx.beginPath();
    ctx.arc(0, -height / 2 - 3, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Select the appropriate 100% OPAQUE image
    let targetImg: HTMLImageElement | null = this.bullImg;
    if (isFrightened) {
      targetImg = isFlashing ? this.bullFlashingImg : this.bullFrightenedImg;
    }

    if (targetImg) {
      ctx.save();
      if (flipX) {
        ctx.scale(-1, 1);
      }
      ctx.globalAlpha = 1.0;
      ctx.drawImage(targetImg, -width / 2, -height / 2, width, height);
      ctx.restore();
    } else {
      this.drawBullFallback(ghost);
    }

    ctx.restore();
    ctx.restore();
  }

  private drawBullEyesAndHorns(dir: Direction) {
    const ctx = this.ctx;
    let eyeX = 0;
    let eyeY = 0;
    if (dir === 'LEFT') eyeX = -3;
    else if (dir === 'RIGHT') eyeX = 3;
    else if (dir === 'UP') eyeY = -3;
    else if (dir === 'DOWN') eyeY = 3;

    // Sharp ghostly horns
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.moveTo(-6, -4);
    ctx.lineTo(-14, -16);
    ctx.lineTo(-3, -9);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(6, -4);
    ctx.lineTo(14, -16);
    ctx.lineTo(3, -9);
    ctx.fill();

    // Sclera
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-6, 0, 5, 0, Math.PI * 2);
    ctx.arc(6, 0, 5, 0, Math.PI * 2);
    ctx.fill();

    // Pupil
    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.arc(-6 + eyeX, 0 + eyeY, 2.5, 0, Math.PI * 2);
    ctx.arc(6 + eyeX, 0 + eyeY, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawToreroFallback() {
    const ctx = this.ctx;
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-10, -14, 20, 8);
  }

  private drawBullFallback(ghost: Ghost) {
    const ctx = this.ctx;
    ctx.fillStyle = ghost.color;
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw Bonus Item
  public drawBonus(bonus: BonusItem) {
    if (!bonus.active) return;
    const ctx = this.ctx;
    const x = bonus.col * TILE_SIZE + TILE_SIZE / 2;
    const y = bonus.row * TILE_SIZE + TILE_SIZE / 2;

    ctx.save();
    ctx.font = '26px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(bonus.icon, x, y);
    ctx.restore();
  }

  // Floating score popups (+200, +400, etc.)
  public drawPopups(popups: ScorePopup[]) {
    const ctx = this.ctx;
    ctx.save();
    popups.forEach((p) => {
      ctx.font = 'bold 15px monospace';
      ctx.textAlign = 'center';
      ctx.strokeStyle = '#260404';
      ctx.lineWidth = 3;
      ctx.strokeText(`+${p.points}`, p.x, p.y);
      ctx.fillStyle = '#fef08a'; // Bright gold text
      ctx.fillText(`+${p.points}`, p.x, p.y);
    });
    ctx.restore();
  }
}
