// generate-icons.js
// Generates PWA icons (192px and 512px) from scratch using Canvas API
// Run with: node generate-icons.js

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

function drawIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const r = size * 0.208; // border-radius ratio

  // --- Background: rounded square with gradient ---
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, '#4f46e5');
  grad.addColorStop(1, '#7c3aed');

  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(size - r, 0);
  ctx.quadraticCurveTo(size, 0, size, r);
  ctx.lineTo(size, size - r);
  ctx.quadraticCurveTo(size, size, size - r, size);
  ctx.lineTo(r, size);
  ctx.quadraticCurveTo(0, size, 0, size - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // --- Shine on top half ---
  const shine = ctx.createLinearGradient(0, 0, 0, size * 0.5);
  shine.addColorStop(0, 'rgba(255,255,255,0.12)');
  shine.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = shine;
  ctx.fill(); // reuse path

  const s = size / 192; // scale factor

  ctx.save();
  ctx.scale(s, s);

  // --- Graduation cap ---
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  // Board top
  ctx.beginPath();
  ctx.roundRect(52, 82, 88, 10, 4);
  ctx.fill();

  // Diamond/cap top
  ctx.beginPath();
  ctx.moveTo(96, 54);
  ctx.lineTo(140, 82);
  ctx.lineTo(96, 92);
  ctx.lineTo(52, 82);
  ctx.closePath();
  ctx.fill();

  // Tassel string
  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(140, 82);
  ctx.lineTo(140, 108);
  ctx.stroke();

  // Tassel ball
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(140, 112, 5, 0, Math.PI * 2);
  ctx.fill();

  // Tassel threads
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2;
  [[136,117,134,128],[140,117,140,130],[144,117,146,128]].forEach(([x1,y1,x2,y2]) => {
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
  });

  // Book
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 1.5;
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.beginPath();
  ctx.roundRect(68, 96, 56, 36, 4);
  ctx.fill();
  ctx.stroke();

  // Book spine
  ctx.beginPath();
  ctx.moveTo(96,96); ctx.lineTo(96,132);
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.stroke();

  // Book lines left
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  [[74,108,91,108],[74,115,91,115]].forEach(([x1,y1,x2,y2]) => {
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
  });
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.beginPath(); ctx.moveTo(74,122); ctx.lineTo(91,122); ctx.stroke();

  // Book lines right
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  [[101,108,118,108],[101,115,118,115]].forEach(([x1,y1,x2,y2]) => {
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
  });
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.beginPath(); ctx.moveTo(101,122); ctx.lineTo(118,122); ctx.stroke();

  ctx.restore();

  return canvas.toBuffer('image/png');
}

const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir);

try {
  fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), drawIcon(192));
  console.log('[OK] icon-192.png generated');
  fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), drawIcon(512));
  console.log('[OK] icon-512.png generated');
} catch(e) {
  console.error('[ERROR] canvas module not found. Run: npm install canvas');
  console.error(e.message);
}
