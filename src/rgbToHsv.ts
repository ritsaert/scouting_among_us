const BYTETOVAL = 1/255;

export function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  r *= BYTETOVAL;
  g *= BYTETOVAL;
  b *= BYTETOVAL;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const v = max;
  const d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max === min) {
    h = 0;
  } else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
  }
  return [h * 60, s, v];
}

type TripleNumber = [number, number, number];

const deg60 = 1/60;

export function hsvToRgb(h: number, s: number, v: number): TripleNumber {
  const hh = h * deg60;     // hh falls in range of [0, 6>
  const i = Math.floor(hh);
  const f = hh - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: return [Math.round(v * 255), Math.round(t * 255), Math.round(p * 255)];
    case 1: return [Math.round(q * 255), Math.round(v * 255), Math.round(p * 255)];
    case 2: return [Math.round(p * 255), Math.round(v * 255), Math.round(t * 255)];
    case 3: return [Math.round(p * 255), Math.round(q * 255), Math.round(v * 255)];
    case 4: return [Math.round(t * 255), Math.round(p * 255), Math.round(v * 255)];
    case 5: return [Math.round(v * 255), Math.round(p * 255), Math.round(q * 255)];
  }
  return [0, 0, 0];
}
