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

  // Draw Deep Black Bullring Night, Red Burladeros & Yellow Coins
  public drawMap(grid: string[][], tick: number) {
    const ctx = this.ctx;

    // Background: Deep dark bullring arcade black
    ctx.fillStyle = '#050202';
    ctx.fillRect(0, 0, COLS * TILE_SIZE, ROWS * TILE_SIZE);

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
          ctx.fillStyle = '#000000';
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

          // 2. Tablazón de madera de burladero (Rojo Almagre Taurino)
          ctx.fillStyle = '#6b1111'; // Base rojo oscuro de madera
          ctx.fillRect(x + 0.5, y + 0.5, TILE_SIZE - 1, TILE_SIZE - 1);

          // Tablones horizontales de madera roja
          ctx.fillStyle = '#831818';
          ctx.fillRect(x + 1, y + 1, TILE_SIZE - 2, 4); // Tablón superior
          ctx.fillRect(x + 1, y + 6, TILE_SIZE - 2, 4); // Tablón intermedio
          ctx.fillRect(x + 1, y + 11, TILE_SIZE - 2, 4); // Tablón inferior

          // Ranuras oscuras entre tablas de madera
          ctx.fillStyle = '#260404';
          ctx.fillRect(x + 1, y + 5, TILE_SIZE - 2, 1);
          ctx.fillRect(x + 1, y + 10, TILE_SIZE - 2, 1);

          // 3. Franja central decorativa de gala (Rojo carmesí con ribete de oro/albero)
          ctx.fillStyle = '#b91c1c'; // Rojo vivo de barrera
          ctx.fillRect(x + 0.5, y + 5.5, TILE_SIZE - 1, 5);

          // Fino ribete dorado / albero viejo delimitando la franja
          ctx.fillStyle = '#d97706';
          ctx.fillRect(x + 0.5, y + 5.5, TILE_SIZE - 1, 0.8);
          ctx.fillRect(x + 0.5, y + 9.7, TILE_SIZE - 1, 0.8);

          // Emblema o clavo central de gala dorado en bloques alternos
          if ((r + c) % 3 === 0) {
            ctx.fillStyle = '#fbbf24'; // Brass/gold center rivet
            ctx.beginPath();
            ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, 1.2, 0, Math.PI * 2);
            ctx.fill();
          }

          // 4. Pasamanos / Albardilla de remate superior (si tiene camino abierto arriba)
          if (!topW) {
            ctx.fillStyle = '#dc2626'; // Rojo brillante de remate de barrera
            ctx.fillRect(x + 0.5, y, TILE_SIZE - 1, 2.2);

            // Borde dorado en el lomo superior del burladero
            ctx.fillStyle = '#fbbf24';
            ctx.fillRect(x + 0.5, y, TILE_SIZE - 1, 0.9);
          }

          // Rodapié inferior (si tiene camino abierto abajo)
          if (!bottomW) {
            ctx.fillStyle = '#450a0a';
            ctx.fillRect(x + 0.5, y + TILE_SIZE - 1.5, TILE_SIZE - 1, 1.5);
            ctx.fillStyle = '#1a0303';
            ctx.fillRect(x + 0.5, y + TILE_SIZE - 0.6, TILE_SIZE - 1, 0.6);
          }

          // 5. Postes / Maderos laterales de anclaje con remaches dorados
          if (!leftW) {
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(x, y + 0.5, 1.2, TILE_SIZE - 1);
            ctx.fillStyle = '#fbbf24';
            ctx.fillRect(x + 1.5, y + 2, 1.2, 1.2);
            ctx.fillRect(x + 1.5, y + TILE_SIZE - 3.2, 1.2, 1.2);
          }

          if (!rightW) {
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(x + TILE_SIZE - 1.2, y + 0.5, 1.2, TILE_SIZE - 1);
            ctx.fillStyle = '#fbbf24';
            ctx.fillRect(x + TILE_SIZE - 2.7, y + 2, 1.2, 1.2);
            ctx.fillRect(x + TILE_SIZE - 2.7, y + TILE_SIZE - 3.2, 1.2, 1.2);
          }

          // Perfilado exterior nítido en rojo bermellón
          ctx.strokeStyle = '#b91c1c';
          ctx.lineWidth = 0.8;
          ctx.strokeRect(x + 0.4, y + 0.4, TILE_SIZE - 0.8, TILE_SIZE - 0.8);
        } else if (cell === '=') {
          // Puerta del toril (Rejas doradas y rojas)
          ctx.fillStyle = '#eab308';
          ctx.fillRect(x, y + TILE_SIZE / 2 - 1.5, TILE_SIZE, 3);
          ctx.fillStyle = '#fde047';
          ctx.fillRect(x + 3, y + 1, 1.5, TILE_SIZE - 2);
          ctx.fillRect(x + 11, y + 1, 1.5, TILE_SIZE - 2);
        } else if (cell === '.') {
          // Moneda Amarilla Clásica (100% sólida y brillante sobre fondo negro)
          const cx = x + TILE_SIZE / 2;
          const cy = y + TILE_SIZE / 2;

          // Outer yellow glow
          ctx.fillStyle = 'rgba(250, 204, 21, 0.3)';
          ctx.beginPath();
          ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
          ctx.fill();

          // Yellow gold coin body
          ctx.fillStyle = '#eab308'; // Amber-500
          ctx.beginPath();
          ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
          ctx.fill();

          // Bright center sparkle
          ctx.fillStyle = '#fef08a'; // Yellow-200
          ctx.beginPath();
          ctx.arc(cx - 0.6, cy - 0.6, 1.0, 0, Math.PI * 2);
          ctx.fill();
        } else if (cell === 'o') {
          // Monedón de Oro Especial (Power Pellet)
          const cx = x + TILE_SIZE / 2;
          const cy = y + TILE_SIZE / 2;
          const pulse = (Math.sin(tick * 0.18) + 1) / 2; // 0..1
          const radius = 5 + pulse * 2.2;

          // Glowing yellow corona
          ctx.fillStyle = `rgba(250, 204, 21, ${0.3 + pulse * 0.4})`;
          ctx.beginPath();
          ctx.arc(cx, cy, radius + 3, 0, Math.PI * 2);
          ctx.fill();

          // Outer gold rim
          ctx.fillStyle = '#ca8a04';
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.fill();

          // Shiny yellow coin surface
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(cx, cy, radius - 1.2, 0, Math.PI * 2);
          ctx.fill();

          // Central sparkle
          ctx.fillStyle = '#fef9c3';
          ctx.beginPath();
          ctx.arc(cx - 1, cy - 1, radius * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  // Draw Torero Emoji (100% Opaco, Nítido, sin recorte circular mutilador)
  public drawTorero(torero: Torero, tick: number) {
    const ctx = this.ctx;
    const cx = torero.x;
    const cy = torero.y;

    // Dimensions preserving natural 810x929 aspect ratio
    const width = 25;
    const height = 28.6;

    ctx.save();
    ctx.translate(cx, cy);

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
    const bob = Math.sin(tick * 0.3) * 1.2;

    // Draw Capote waving in front
    const capoteWave = Math.sin(tick * 0.4) * 3;
    ctx.save();
    if (dirAngle !== 0) {
      ctx.rotate(dirAngle);
    } else if (flipX) {
      ctx.scale(-1, 1);
    }

    // Magenta & Yellow capote
    ctx.fillStyle = '#e11d48';
    ctx.beginPath();
    ctx.moveTo(6, -6 + capoteWave);
    ctx.lineTo(15, 0);
    ctx.lineTo(6, 6 - capoteWave);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(5, -3 + capoteWave * 0.5);
    ctx.lineTo(12, 0);
    ctx.lineTo(5, 3 - capoteWave * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Draw Torero Emoji Head 100% OPAQUE (NO CIRCULAR CLIPPING)
    if (this.toreroImg) {
      ctx.save();
      if (flipX) {
        ctx.scale(-1, 1);
      }

      // Crisp contrast shadow behind emoji to make it pop boldly against any background
      ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = 3;
      ctx.shadowOffsetY = 1;

      // Draw full solid opaque image
      ctx.globalAlpha = 1.0;
      ctx.drawImage(this.toreroImg, -width / 2, -height / 2 + bob, width, height);
      ctx.restore();
    } else {
      this.drawToreroFallback();
    }

    ctx.restore();
  }

  // Draw Bull Emoji (100% Opaco, Nítido, con cuernos completos)
  public drawGhost(ghost: Ghost, tick: number) {
    const ctx = this.ctx;
    const cx = ghost.x;
    const cy = ghost.y;

    // Dimensions preserving natural 793x781 aspect ratio
    const width = 26;
    const height = 25.6;

    ctx.save();
    ctx.translate(cx, cy);

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
    ctx.lineWidth = 1;

    // Traditional ribbon rosette on top
    ctx.beginPath();
    ctx.arc(0, -height / 2 - 2, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 2. Crisp contrast drop shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 1;

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
      // Draw 100% opaque, no circular clipping! Full horns & head visible
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
    if (dir === 'LEFT') eyeX = -2;
    else if (dir === 'RIGHT') eyeX = 2;
    else if (dir === 'UP') eyeY = -2;
    else if (dir === 'DOWN') eyeY = 2;

    // Sharp ghostly horns
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.moveTo(-4, -3);
    ctx.lineTo(-9, -10);
    ctx.lineTo(-2, -6);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(4, -3);
    ctx.lineTo(9, -10);
    ctx.lineTo(2, -6);
    ctx.fill();

    // Sclera
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-4, 0, 3.2, 0, Math.PI * 2);
    ctx.arc(4, 0, 3.2, 0, Math.PI * 2);
    ctx.fill();

    // Pupil
    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.arc(-4 + eyeX, 0 + eyeY, 1.6, 0, Math.PI * 2);
    ctx.arc(4 + eyeX, 0 + eyeY, 1.6, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawToreroFallback() {
    const ctx = this.ctx;
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-6, -8, 12, 5);
  }

  private drawBullFallback(ghost: Ghost) {
    const ctx = this.ctx;
    ctx.fillStyle = ghost.color;
    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw Bonus Item
  public drawBonus(bonus: BonusItem) {
    if (!bonus.active) return;
    const ctx = this.ctx;
    const x = bonus.col * TILE_SIZE + TILE_SIZE / 2;
    const y = bonus.row * TILE_SIZE + TILE_SIZE / 2;

    ctx.save();
    ctx.font = '16px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(40, 20, 5, 0.5)';
    ctx.shadowBlur = 4;
    ctx.fillText(bonus.icon, x, y);
    ctx.restore();
  }

  // Floating score popups (+200, +400, etc.)
  public drawPopups(popups: ScorePopup[]) {
    const ctx = this.ctx;
    ctx.save();
    popups.forEach((p) => {
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.strokeStyle = '#260404';
      ctx.lineWidth = 2.5;
      ctx.strokeText(`+${p.points}`, p.x, p.y);
      ctx.fillStyle = '#fef08a'; // Bright gold text
      ctx.fillText(`+${p.points}`, p.x, p.y);
    });
    ctx.restore();
  }
}
