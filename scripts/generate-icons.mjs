import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const OUT_DIR = path.join(process.cwd(), "public", "icons");
fs.mkdirSync(OUT_DIR, { recursive: true });

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

// hex color -> [r,g,b]
function hex(c) {
  const v = c.replace("#", "");
  return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
}

const BG = hex("#2a78d6");
const BG_DARK = hex("#184f95");
const WHITE = [255, 255, 255];

function inShieldOutline(x, y, size) {
  // Normalize to 0..1
  const nx = x / size;
  const ny = y / size;
  const cx = 0.5;
  const topY = 0.14;
  const bottomY = 0.88;
  const width = 0.62;

  if (ny < topY || ny > bottomY) return false;
  const halfWidth = width / 2;

  if (ny < 0.72) {
    // rectangular-ish upper body with slightly rounded top corners
    const withinX = Math.abs(nx - cx) <= halfWidth;
    if (!withinX) return false;
    if (ny < topY + 0.05) {
      // rounded top corners
      const cornerR = 0.08;
      const leftCorner = Math.hypot(nx - (cx - halfWidth + cornerR), ny - (topY + cornerR));
      const rightCorner = Math.hypot(nx - (cx + halfWidth - cornerR), ny - (topY + cornerR));
      if (nx < cx - halfWidth + cornerR && ny < topY + cornerR && leftCorner > cornerR) return false;
      if (nx > cx + halfWidth - cornerR && ny < topY + cornerR && rightCorner > cornerR) return false;
    }
    return true;
  }
  // pointed bottom (triangular taper)
  const t = (ny - 0.72) / (bottomY - 0.72); // 0..1
  const currentHalfWidth = halfWidth * (1 - t);
  return Math.abs(nx - cx) <= currentHalfWidth;
}

function inCheckmark(x, y, size) {
  const nx = x / size;
  const ny = y / size;
  // simple checkmark polyline using distance-to-segment thresholds
  const p1 = [0.34, 0.5];
  const p2 = [0.46, 0.62];
  const p3 = [0.68, 0.36];
  const thickness = 0.045;

  function distSeg(px, py, ax, ay, bx, by) {
    const abx = bx - ax;
    const aby = by - ay;
    const apx = px - ax;
    const apy = py - ay;
    const lenSq = abx * abx + aby * aby;
    let t = lenSq > 0 ? (apx * abx + apy * aby) / lenSq : 0;
    t = Math.max(0, Math.min(1, t));
    const cx = ax + abx * t;
    const cy = ay + aby * t;
    return Math.hypot(px - cx, py - cy);
  }

  return distSeg(nx, ny, p1[0], p1[1], p2[0], p2[1]) < thickness || distSeg(nx, ny, p2[0], p2[1], p3[0], p3[1]) < thickness;
}

function buildPng(size) {
  const raw = Buffer.alloc(size * (1 + size * 4));
  for (let y = 0; y < size; y++) {
    const rowStart = y * (1 + size * 4);
    raw[rowStart] = 0; // filter type: none
    for (let x = 0; x < size; x++) {
      const pxStart = rowStart + 1 + x * 4;
      const t = y / size;
      const bgR = Math.round(BG[0] + (BG_DARK[0] - BG[0]) * t);
      const bgG = Math.round(BG[1] + (BG_DARK[1] - BG[1]) * t);
      const bgB = Math.round(BG[2] + (BG_DARK[2] - BG[2]) * t);

      let r = bgR;
      let g = bgG;
      let b = bgB;
      let a = 255;

      if (inShieldOutline(x, y, size)) {
        if (inCheckmark(x, y, size)) {
          r = BG[0];
          g = BG[1];
          b = BG[2];
        } else {
          r = WHITE[0];
          g = WHITE[1];
          b = WHITE[2];
        }
      }

      raw[pxStart] = r;
      raw[pxStart + 1] = g;
      raw[pxStart + 2] = b;
      raw[pxStart + 3] = a;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const idat = zlib.deflateSync(raw, { level: 9 });

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([signature, chunk("IHDR", ihdr), chunk("IDAT", idat), chunk("IEND", Buffer.alloc(0))]);
}

for (const size of [192, 512]) {
  const png = buildPng(size);
  fs.writeFileSync(path.join(OUT_DIR, `icon-${size}.png`), png);
  console.log(`Generated icon-${size}.png (${png.length} bytes)`);
}

fs.writeFileSync(path.join(OUT_DIR, "apple-touch-icon.png"), buildPng(180));
console.log("Generated apple-touch-icon.png");
