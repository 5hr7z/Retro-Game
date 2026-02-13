const createPixelSprite = (color: string, type: string): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const size = 32;
    canvas.width = size;
    canvas.height = size;
  
    if (!ctx) return '';
    ctx.imageSmoothingEnabled = false;
  
    if (type === 'hero') {
      ctx.fillStyle = '#333'; 
      ctx.fillRect(10, 18, 12, 14); 
      ctx.fillStyle = '#ff9900'; 
      ctx.fillRect(8, 10, 16, 10);
      ctx.fillStyle = '#ffccaa'; 
      ctx.fillRect(10, 4, 12, 8); 
      ctx.fillStyle = '#5c3a21'; 
      ctx.fillRect(10, 2, 12, 4);
      ctx.fillStyle = 'black';
      ctx.fillRect(12, 6, 2, 2);
      ctx.fillRect(18, 6, 2, 2);
    } 
    else if (type === 'madame_spice') {
      // Long dark hair
      ctx.fillStyle = '#2a1d1d';
      ctx.fillRect(8, 4, 16, 16); 
      ctx.fillRect(6, 6, 4, 18); // Hair falling down sides
      ctx.fillRect(22, 6, 4, 18);
      
      // Face
      ctx.fillStyle = '#ffccaa'; 
      ctx.fillRect(10, 6, 12, 10);
      
      // Pink Dress
      ctx.fillStyle = '#ff0055'; 
      ctx.fillRect(10, 16, 12, 14);
      ctx.fillStyle = '#ff6699'; // Dress detail
      ctx.fillRect(12, 18, 8, 8);

      // Eyes
      ctx.fillStyle = 'black';
      ctx.fillRect(12, 9, 2, 2);
      ctx.fillRect(18, 9, 2, 2);
      
      // Smile
      ctx.fillStyle = '#a00';
      ctx.fillRect(14, 13, 4, 1);
    }
    else if (type === 'pineapple') {
      ctx.fillStyle = '#ffd700'; 
      ctx.fillRect(10, 12, 12, 14);
      ctx.fillStyle = '#00aa00'; 
      ctx.beginPath();
      ctx.moveTo(10, 12); ctx.lineTo(6, 4); ctx.lineTo(16, 12);
      ctx.moveTo(22, 12); ctx.lineTo(26, 4); ctx.lineTo(16, 12);
      ctx.moveTo(16, 12); ctx.lineTo(16, 2); 
      ctx.fill();
    }
    else if (type === 'weight') {
      ctx.fillStyle = '#333';
      ctx.beginPath();
      ctx.arc(16, 16, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#111';
      ctx.beginPath();
      ctx.arc(16, 16, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '8px monospace';
      ctx.fillText('20kg', 10, 18);
    }
    else if (type === 'balloon') {
      ctx.fillStyle = color || '#ff5555';
      ctx.beginPath();
      ctx.arc(16, 12, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(16, 22); ctx.lineTo(16, 30);
      ctx.stroke();
    }
    else if (type === 'key') {
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(10, 10, 12, 12); 
      ctx.clearRect(13, 13, 6, 6);
      ctx.fillRect(14, 20, 4, 10);
    }
    else if (type === 'boombox') {
        ctx.fillStyle = '#222';
        ctx.fillRect(4, 8, 24, 16);
        ctx.fillStyle = '#555'; // Speakers
        ctx.beginPath(); ctx.arc(10, 16, 4, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(22, 16, 4, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#999'; // Handle
        ctx.fillRect(8, 4, 16, 4);
    }
    else if (type === 'door') {
      ctx.fillStyle = '#5c3a21';
      ctx.fillRect(2, 2, 28, 28);
      ctx.fillStyle = '#c0c0c0'; 
      ctx.lineWidth = 2;
      ctx.strokeRect(2, 2, 28, 28);
      ctx.fillStyle = 'gold'; 
      ctx.beginPath();
      ctx.arc(24, 16, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    else if (type === 'wall') {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(0, 0, size, 2);
      ctx.fillRect(0, 16, size, 2);
    } 
    else if (type === 'npc') {
       ctx.fillStyle = color;
       ctx.beginPath();
       ctx.moveTo(16, 4); ctx.lineTo(28, 28); ctx.lineTo(4, 28);
       ctx.fill();
       ctx.fillStyle = '#5c3a21';
       ctx.beginPath();
       ctx.arc(16, 8, 6, 0, Math.PI * 2);
       ctx.fill();
    } 
    else if (type === 'trap') {
      ctx.fillStyle = '#500';
      ctx.fillRect(4, 4, 24, 24);
      ctx.fillStyle = '#f00';
      ctx.font = '20px Arial';
      ctx.fillText('!', 12, 24);
    }
    else if (type === 'item') {
      ctx.fillStyle = '#00ffff';
      ctx.beginPath();
      ctx.arc(16, 16, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    else if (type === 'enemy_glitch') {
        ctx.fillStyle = '#0f0';
        ctx.font = '20px monospace';
        ctx.fillText('err', 0, 20);
    }
    else if (type === 'enemy_ghost') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(16, 12, 10, Math.PI, 0);
        ctx.lineTo(26, 28);
        ctx.lineTo(16, 24);
        ctx.lineTo(6, 28);
        ctx.lineTo(6, 12);
        ctx.fill();
        ctx.fillStyle = 'black';
        ctx.beginPath(); ctx.arc(12, 12, 2, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(20, 12, 2, 0, Math.PI*2); ctx.fill();
    }
    else if (type === 'enemy_gymbro') {
        ctx.fillStyle = '#f00'; // Muscle shirt
        ctx.fillRect(6, 6, 20, 20);
        ctx.fillStyle = '#ffccaa'; // Arms
        ctx.fillRect(2, 8, 4, 12);
        ctx.fillRect(26, 8, 4, 12);
        ctx.fillStyle = 'black'; // Shades
        ctx.fillRect(10, 10, 12, 4);
    }
  
    return canvas.toDataURL();
};
  
export const ASSETS = {
    hero: createPixelSprite('#00aaff', 'hero'),
    madame_spice: createPixelSprite('#ff0055', 'madame_spice'),
    wall: createPixelSprite('#b06c85', 'wall'),
    npc: createPixelSprite('#ffaa00', 'npc'),
    key: createPixelSprite('', 'key'),
    door: createPixelSprite('', 'door'),
    trap: createPixelSprite('', 'trap'),
    pineapple: createPixelSprite('', 'pineapple'),
    weight: createPixelSprite('', 'weight'),
    balloon: createPixelSprite('#ff77aa', 'balloon'),
    item: createPixelSprite('', 'item'),
    boombox: createPixelSprite('', 'boombox'),
    enemy_glitch: createPixelSprite('', 'enemy_glitch'),
    enemy_ghost: createPixelSprite('', 'enemy_ghost'),
    enemy_gymbro: createPixelSprite('', 'enemy_gymbro'),
};