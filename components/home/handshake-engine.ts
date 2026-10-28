/**
 * ASCII handshake intro: two hands drawn from a density map slide in, touch, and flow into the
 * name; afterwards the name idles with cursor repulsion, ripples and glitches. Pure canvas, no React.
 */

type HandData = { x: number; y: number; w: number; h: number; rows: string[]; v?: Float32Array };
type HandsFile = { gw: number; gh: number; cell: number; hands: HandData[] };
type Pt = { x: number; y: number };
type Grid = { W: number; H: number; cols: number; rows: number; cw: number; lh: number; fs: number };
/** `fw`: finger weights at each bend sub-sample (BEND_N × 3), or null for cells no finger moves. */
type Cell = { hx: number; hy: number; d: number; seed: number; hand: number; fw: Float32Array | null };
type Bone = { k: Pt; e: Pt; r: number };
type Target = { x: number; y: number; d: number; seed: number; sh?: boolean };
type Part = Cell & { res: number; cd: number };
/** One on-screen character of the final hand frame, on its way into the name. */
type Morph = { sx: number; sy: number; d: number; seed: number; tgt: Target | null; delay: number; qx: number; qy: number };
type Spawn = { tgt: Target; delay: number };
type Fx = { x: number; y: number; vx: number; vy: number; life: number; age: number; g: number };
/** `e`: seconds after the entry starts before this cell decodes in (see ENTER). */
type HomeCell = { x: number; y: number; d: number; sh?: boolean; seed: number; ox: number; oy: number; g: number; e: number };
type Rig = { arm: Pt; k: Pt[]; sg: number; ph: number[] };
type PoseT = { x: number; y: number; arm: number; ac: number; as: number; fa: number[]; g: Rig };

export type EngineOptions = {
  monoFamily: string;
  nameFamily: string;
  nameWeight?: string;
  /** Fraction of viewport height the name's cap height should fill. */
  nameHeight?: number;
  skipIntro?: boolean;
  /** When the intro is skipped, decode the name in left to right instead of showing it at once. */
  animateEntry?: boolean;
  cursorFx?: boolean;
  handsUrl?: string;
  onLog: (lines: string[]) => void;
  onUi: (show: boolean) => void;
  onTagTop: (px: number) => void;
};

const WORD = "DHRUTI";
const FG = "#ecebe6";
const SCR = "!<>-_/\\[]{}=+*^?#%@&$;:~01";
const RAMP = ".:-=+*#%@";
// Seconds. After the touch the wave ripples out, then (at `morph`) the hands flow straight into the name.
const T = { s0: 0.5, s1: 2.9, touch: 4.2, morph: 4.85, dmax: 0.55, dur: 1.1 };
// Home entry when the intro is skipped: cells start across `sweep` seconds left to right (plus a
// little jitter) and each takes `dur` to resolve from scrambled glyphs into the name.
const ENTER = { sweep: 0.55, jitter: 0.15, dur: 0.35 };
const LOG = [
  "$ ./handshake --peer=visitor",
  "› locating peer ............ found",
  "› handshake ................ ok",
  "› compiling identity → dhrutinandan",
];
// Finger rigs in source-image pixels (3840-wide photo): knuckle → tip, radius.
const FING = [
  { arm: [-260, 470], f: [{ k: [940, 700], e: [1180, 762], r: 46 }, { k: [880, 720], e: [1020, 900], r: 56 }, { k: [720, 735], e: [700, 890], r: 66 }] },
  { arm: [2840, 720], f: [{ k: [1880, 690], e: [1485, 712], r: 58 }, { k: [1900, 880], e: [1880, 1190], r: 80 }, { k: [2110, 1010], e: [2100, 1175], r: 56 }] },
];

// Cells a finger moves are sampled on a finer grid than the rest of the hand, so a bending
// finger stretches without opening holes between characters.
const BEND_SUB = 3, BEND_N = BEND_SUB * BEND_SUB;
const BEND_OFF = Array.from({ length: BEND_SUB }, (_, i) => (i + 0.5) / BEND_SUB);

const cl = (u: number) => (u < 0 ? 0 : u > 1 ? 1 : u);

/** How much a point follows a finger bone: 1 along the finger, easing to 0 at the knuckle and edges. */
function boneWeight(f: Bone, qx: number, qy: number) {
  const vx = f.e.x - f.k.x, vy = f.e.y - f.k.y;
  const t = ((qx - f.k.x) * vx + (qy - f.k.y) * vy) / (vx * vx + vy * vy);
  if (t < -0.1 || t > 1.3) return 0;
  const d = Math.hypot(qx - (f.k.x + vx * t), qy - (f.k.y + vy * t));
  const fall = d < f.r ? 1 : d < f.r * 1.4 ? 1 - (d - f.r) / (f.r * 0.4) : 0;
  const u = cl((t + 0.05) / 0.6);
  return u * u * (3 - 2 * u) * fall;
}
const eb = (u: number) => { const c = 0.8, v = u - 1; return 1 + (c + 1) * v * v * v + c * v * v; };
const eio = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
const rnd = () => (Math.random() * 1e9) | 0;

function hash(x: number, y: number) {
  let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function valueNoise(x: number, y: number) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

export class HandshakeEngine {
  private o: EngineOptions;
  private cv: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private dead = false;
  private raf = 0;
  private resizeT: ReturnType<typeof setTimeout> | undefined;

  private ALL = [...new Set((SCR + RAMP + ".*+:o@").split(""))];
  private IDX: Record<string, number> = {};
  private scrIdx: number[];
  private ramp: number[];

  private D: HandsFile | null = null;
  private G!: Grid;
  private dpr = 1;
  private atlas!: HTMLCanvasElement;
  private aw = 0; private ah = 0; private dw = 0; private dh = 0;
  private alphaCache = 1;

  private handT: Cell[][] = [];
  private tips: Pt[] = [];
  private rig: Rig[] = [];
  private targets: Target[] = [];

  private phase: "load" | "intro" | "home" = "load";
  private t = 0;
  private frame = 0;
  private last = 0;
  private logStep = 0;
  private fired = false;
  private uiSet = false;
  private parts: Part[] = [];
  private morph: Morph[] | null = null;
  private lastNl = 0; // cells drawn in the last hand frame (indices live in bL)
  private spawns: Spawn[] = [];
  private fx: Fx[] = [];
  private ring: { t0: number } | null = null;
  private ripples: { x: number; y: number; t: number }[] = [];
  private startOff = [0, 0];
  private touch = [{ dx: 0, dy: 0 }, { dx: 0, dy: 0 }];
  private C: Pt = { x: 0, y: 0 };
  private morphEnd = 0;
  private homeP: HomeCell[] = [];
  private nextRip = 0;
  private glitchLast = 0;
  private enterAt = 0; // performance.now() when the home entry began; 0 once it's done
  private mouse = { x: -1e4, y: -1e4 };

  private stampN = 0;
  private bS = new Int32Array(0); private bD = new Float32Array(0); private bK = new Int32Array(0);
  private bF = new Uint8Array(0); private bL = new Int32Array(0); private bB = new Uint8Array(0);

  constructor(canvas: HTMLCanvasElement, options: EngineOptions) {
    this.cv = canvas;
    this.o = options;
    this.ALL.forEach((c, i) => { this.IDX[c] = i; });
    this.scrIdx = SCR.split("").map((c) => this.IDX[c]);
    this.ramp = RAMP.split("").map((c) => this.IDX[c]);
    window.addEventListener("pointermove", this.onMove);
    window.addEventListener("pointerout", this.onOut);
    window.addEventListener("resize", this.onResize);
  }

  async start() {
    const fonts = Promise.all([
      document.fonts.load(`400 12px ${this.o.monoFamily}`),
      document.fonts.load(this.nameFont(100)),
    ]).catch(() => {});
    const data: HandsFile = await fetch(this.o.handsUrl ?? "/hands.json").then((r) => r.json());
    await Promise.race([fonts, new Promise((r) => setTimeout(r, 2500))]);
    if (this.dead) return;
    data.hands.forEach((h) => {
      const v = new Float32Array(h.w * h.h);
      h.rows.forEach((row, y) => { for (let x = 0; x < h.w; x++) v[y * h.w + x] = parseInt(row[x], 36) / 35; });
      h.v = v;
    });
    this.D = data;
    this.layout();
    if (this.o.skipIntro) this.toHome(this.o.animateEntry ?? false); else this.startIntro();
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.loop);
  }

  skip() {
    if (this.phase !== "intro") return;
    this.fx = [];
    this.ring = null;
    this.toHome();
  }

  destroy() {
    this.dead = true;
    cancelAnimationFrame(this.raf);
    clearTimeout(this.resizeT);
    window.removeEventListener("pointermove", this.onMove);
    window.removeEventListener("pointerout", this.onOut);
    window.removeEventListener("resize", this.onResize);
  }

  // ---------- events ----------
  private onMove = (e: PointerEvent) => {
    const r = this.cv.getBoundingClientRect();
    this.mouse.x = e.clientX - r.left;
    this.mouse.y = e.clientY - r.top;
  };
  private onOut = (e: PointerEvent) => {
    if (!e.relatedTarget) { this.mouse.x = -1e4; this.mouse.y = -1e4; }
  };
  private onResize = () => {
    clearTimeout(this.resizeT);
    this.resizeT = setTimeout(() => {
      if (!this.D || this.dead) return;
      this.layout();
      if (this.phase === "home") this.toHome(); else this.startIntro();
    }, 160);
  };

  // ---------- setup ----------
  private nameFont(size: number) {
    return `${this.o.nameWeight ?? "900"} ${size}px ${this.o.nameFamily}, "Arial Black", sans-serif`;
  }

  private layout() {
    const cv = this.cv;
    const W = cv.clientWidth || window.innerWidth, H = cv.clientHeight || window.innerHeight;
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(W * this.dpr);
    cv.height = Math.round(H * this.dpr);
    this.ctx = cv.getContext("2d")!;
    const cols = Math.max(110, Math.min(300, Math.round(W / 6.2)));
    const cw = W / cols, fs = cw / 0.6, lh = fs * 1.12, rows = Math.ceil(H / lh);
    this.G = { W, H, cols, rows, cw, lh, fs };
    this.buildAtlas();
    this.buildHands();
    this.buildName();
  }

  /** Pre-render every glyph once; frames are then just drawImage blits. */
  private buildAtlas() {
    const { cw, lh, fs } = this.G, dpr = this.dpr;
    const aw = Math.ceil(cw * dpr), ah = Math.ceil(lh * dpr);
    const c = document.createElement("canvas");
    c.width = aw * this.ALL.length;
    c.height = ah;
    const x = c.getContext("2d")!;
    x.font = `400 ${fs * dpr}px ${this.o.monoFamily}, ui-monospace, Menlo, monospace`;
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.fillStyle = FG;
    this.ALL.forEach((ch, i) => x.fillText(ch, i * aw + aw / 2, ah / 2));
    this.atlas = c;
    this.aw = aw; this.ah = ah; this.dw = aw / dpr; this.dh = ah / dpr;
  }

  private buildHands() {
    const D = this.D!, { W, H, cw, lh, cols } = this.G;
    const IW = D.gw * D.cell, IH = D.gh * D.cell;
    const s = Math.max(W / IW, (H / IH) * 0.8);
    const ox = (W - IW * s) / 2, oy = (H - IH * s) / 2, k = D.cell * s;
    this.handT = D.hands.map((h, hi) => {
      const out: Cell[] = [];
      const hv = h.v!;
      const ext = Math.ceil((W * 0.3) / cw);
      let c0 = Math.floor((ox + h.x * k) / cw), c1 = Math.ceil((ox + (h.x + h.w) * k) / cw);
      const r0 = Math.floor((oy + h.y * k) / lh), r1 = Math.ceil((oy + (h.y + h.h) * k) / lh);
      // Extend each arm off-screen so the forearm never ends mid-viewport.
      if (hi === 0) c0 = Math.min(c0, -ext); else c1 = Math.max(c1, cols + ext);
      for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) {
        const gx0 = (c * cw - ox) / k - h.x, gx1 = ((c + 1) * cw - ox) / k - h.x;
        const gy0 = (r * lh - oy) / k - h.y, gy1 = ((r + 1) * lh - oy) / k - h.y;
        let ix0 = Math.floor(gx0), ix1 = Math.ceil(gx1) - 1;
        if (hi === 0 && ix1 < 0) { ix0 = 0; ix1 = 0; } else if (hi === 1 && ix0 > h.w - 1) { ix0 = h.w - 1; ix1 = h.w - 1; }
        ix0 = Math.max(0, ix0); ix1 = Math.min(h.w - 1, ix1);
        const iy0 = Math.max(0, Math.floor(gy0)), iy1 = Math.min(h.h - 1, Math.ceil(gy1) - 1);
        if (ix1 < ix0 || iy1 < iy0) continue;
        let sum = 0, n = 0;
        for (let iy = iy0; iy <= iy1; iy++) for (let ix = ix0; ix <= ix1; ix++) { sum += hv[iy * h.w + ix]; n++; }
        const v = sum / n;
        if (v > 0.1) out.push({ hx: c * cw, hy: r * lh, d: Math.min(1, Math.pow(v, 0.8) * 1.1), seed: rnd(), hand: hi, fw: null });
      }
      return out;
    });

    const tip = (arr: Cell[], dir: number): Pt => {
      let best = dir > 0 ? -1e9 : 1e9;
      arr.forEach((p) => { if (p.d > 0.25 && (dir > 0 ? p.hx > best : p.hx < best)) best = p.hx; });
      const col = arr.filter((p) => p.hx === best && p.d > 0.25);
      const y = col.reduce((a, p) => a + p.hy, 0) / (col.length || 1);
      return { x: best, y: Math.round(y / lh) * lh };
    };
    this.tips = [tip(this.handT[0], 1), tip(this.handT[1], -1)];

    const F = 3840 / 2576;
    const toS = (pt: number[]): Pt => ({ x: ox + pt[0] * F * s, y: oy + pt[1] * F * s });
    this.rig = FING.map((h, hi) => {
      const fz: Bone[] = h.f.map((f) => ({ k: toS(f.k), e: toS(f.e), r: f.r * F * s }));
      // Weight every bend sub-sample to all three finger bones so fingers curl independently.
      // Weights are per point (not per cell) and blended where fingers meet, so the bend changes
      // smoothly across the hand; a per-cell, strongest-finger weight tore gaps into the fingers.
      this.handT[hi].forEach((p) => {
        const fw = new Float32Array(BEND_N * 3);
        let any = false;
        for (let q = 0; q < BEND_N; q++) {
          const qx = p.hx + BEND_OFF[q % BEND_SUB] * cw, qy = p.hy + BEND_OFF[(q / BEND_SUB) | 0] * lh;
          let sum = 0;
          for (let j = 0; j < 3; j++) { const w = boneWeight(fz[j], qx, qy); fw[q * 3 + j] = w; sum += w; }
          if (sum > 1) for (let j = 0; j < 3; j++) fw[q * 3 + j] /= sum;
          if (sum > 0) any = true;
        }
        p.fw = any ? fw : null;
      });
      return { arm: toS(h.arm), k: fz.map((f) => f.k), sg: hi === 0 ? 1 : -1, ph: [0, 1.7, 3.4] };
    });
  }

  /** Rasterise the name onto the character grid with a lit outer edge and noisy fill. */
  private buildName() {
    const { W, H, cols, rows, cw, lh } = this.G;
    const hf = Math.max(0.2, Math.min(0.65, this.o.nameHeight ?? 0.3));
    const c = document.createElement("canvas");
    c.width = Math.ceil(W);
    c.height = Math.ceil(H);
    const x = c.getContext("2d", { willReadFrequently: true })!;
    const tr = 0.06, hasLS = "letterSpacing" in x;
    x.font = this.nameFont(100);
    if (hasLS) x.letterSpacing = `${tr * 100}px`;
    const mw = x.measureText(WORD).width - (hasLS ? tr * 100 : 0);
    const capU = (x.measureText("H").actualBoundingBoxAscent || 72) / 100;
    let size = ((W * 0.84) / mw) * 100, cap = capU * size, sy = 1;
    const tgt = H * hf;
    if (cap > tgt) { size *= tgt / cap; cap = tgt; } else sy = Math.min(2.4, tgt / cap);
    x.font = this.nameFont(size);
    const ls = hasLS ? tr * size : 0;
    const base = H * 0.42 + (cap * sy) / 2;
    x.fillStyle = "#fff";
    x.textAlign = "left";
    x.textBaseline = "alphabetic";
    x.setTransform(1, 0, 0, sy, 0, base * (1 - sy));
    // Per letter, snapped to the grid with ≥1 empty column between letters so strokes never merge.
    if (hasLS) x.letterSpacing = "0px";
    const gl: { ch: string; x: number }[] = [];
    let pen = 0, prevR = -1e9;
    for (const ch of WORD) {
      const m = x.measureText(ch), bl = m.actualBoundingBoxLeft || 0, br = m.actualBoundingBoxRight || m.width;
      const inkL = pen - bl;
      let c0 = Math.round(inkL / cw);
      const minC = Math.ceil(prevR / cw) + 1;
      if (c0 < minC) c0 = minC;
      const dx = c0 * cw - inkL;
      gl.push({ ch, x: pen + dx });
      prevR = pen + br + dx;
      pen += m.width + ls + dx;
    }
    const L0 = gl[0].x - (x.measureText(WORD[0]).actualBoundingBoxLeft || 0);
    const shift = Math.round((W / 2 - (prevR - L0) / 2 - L0) / cw) * cw;
    for (const g of gl) x.fillText(g.ch, g.x + shift, base);

    const img = x.getImageData(0, 0, c.width, c.height).data, iw = c.width, ih = c.height;
    const N = cols * rows, cov = new Float32Array(N);
    for (let r = 0; r < rows; r++) for (let col = 0; col < cols; col++) {
      const x0 = Math.floor(col * cw), x1 = Math.min(iw, Math.floor((col + 1) * cw));
      const y0 = Math.floor(r * lh), y1 = Math.min(ih, Math.floor((r + 1) * lh));
      let sm = 0, n = 0;
      for (let yy = y0; yy < y1; yy += 2) for (let xx = x0; xx < x1; xx += 2) { sm += img[(yy * iw + xx) * 4 + 3]; n++; }
      cov[r * cols + col] = n ? sm / n / 255 : 0;
    }
    // The face's stems bow by a pixel or so (U's are slightly curved), so an edge sitting near the
    // threshold steps in and out down the stem. Give each vertical run of similar edge cells one
    // shared coverage so stems stay straight; curves vary more and keep their own values.
    for (let col = 0; col < cols; col++) {
      let r = 0;
      while (r < rows) {
        const v = cov[r * cols + col];
        if (v < 0.15 || v > 0.85) { r++; continue; }
        let e = r, lo = v, hi = v, sm = 0;
        while (e < rows) {
          const w = cov[e * cols + col];
          if (w < 0.15 || w > 0.85 || Math.max(hi, w) - Math.min(lo, w) > 0.3) break;
          lo = Math.min(lo, w); hi = Math.max(hi, w); sm += w; e++;
        }
        if (e - r >= 3) for (let k = r; k < e; k++) cov[k * cols + col] = sm / (e - r);
        r = e;
      }
    }
    // Distance from the edge (1..4) so the outline can be brighter than the fill.
    const dist = new Uint8Array(N);
    for (let i = 0; i < N; i++) dist[i] = cov[i] > 0.45 ? 255 : 0;
    for (let k = 1; k <= 4; k++) for (let r = 0; r < rows; r++) for (let col = 0; col < cols; col++) {
      const i = r * cols + col;
      if (dist[i] !== 255) continue;
      const m = k - 1;
      if ((col > 0 ? dist[i - 1] : 0) === m || (col < cols - 1 ? dist[i + 1] : 0) === m ||
          (r > 0 ? dist[i - cols] : 0) === m || (r < rows - 1 ? dist[i + cols] : 0) === m) dist[i] = k;
    }
    const out: Target[] = [];
    let rmax = 0;
    for (let i = 0; i < N; i++) {
      const dd = dist[i];
      if (!dd) continue;
      const r = (i / cols) | 0, col = i % cols, rn = Math.random();
      let d: number;
      if (dd === 1) {
        const lit = (r > 0 && !dist[i - cols]) || (col > 0 && !dist[i - 1]);
        d = lit ? 0.9 + 0.1 * rn : 0.72 + 0.16 * rn;
      } else if (dd === 2) d = 0.55 + 0.22 * rn;
      else d = 0.08 + 0.55 * valueNoise(col * 0.09, r * 0.45) + 0.12 * rn;
      out.push({ x: col * cw, y: r * lh, d, seed: rnd() });
      if (r > rmax) rmax = r;
    }
    this.targets = out;
    this.o.onTagTop(Math.round((rmax + 1) * lh + lh * 2.5));
  }

  // ---------- timeline ----------
  private startIntro() {
    this.phase = "intro";
    this.t = 0; this.logStep = 0; this.fired = false; this.uiSet = false;
    this.fx = []; this.ring = null; this.ripples = [];
    const { W, cw, lh } = this.G, [L, R] = this.handT;
    let lMax = -1e9, rMin = 1e9;
    L.forEach((p) => { if (p.hx > lMax) lMax = p.hx; });
    R.forEach((p) => { if (p.hx < rMin) rMin = p.hx; });
    this.startOff = [-(lMax + cw * 4), W - rMin + cw * 4];
    const [a, b] = this.tips, gap = b.x - a.x - cw * 2, dy = (b.y - a.y) / 2;
    this.touch = [{ dx: gap / 2, dy }, { dx: -gap / 2, dy: -dy }];
    this.C = { x: a.x + gap / 2 + cw * 1.5, y: (a.y + b.y) / 2 + lh / 2 };
    const C = this.C;
    this.parts = [...L, ...R].map((p) => ({
      ...p,
      res: T.s0 + 0.3 + Math.random() * 2.0,
      // Distance from the touch point at the touch pose, for the shockwave.
      cd: Math.hypot(p.hx + this.touch[p.hand].dx + cw / 2 - C.x, p.hy + this.touch[p.hand].dy + lh / 2 - C.y),
    }));
    this.morph = null;
    this.spawns = [];
    this.o.onUi(false);
    this.o.onLog([]);
  }

  /**
   * Start the dissolve from exactly what was last on screen: every drawn hand cell becomes a
   * source, so the first morph frame is identical to the last hand frame (no snapping). Sources are
   * matched to name cells left-to-right; spare sources fade out where they are, missing ones fade in.
   */
  private beginMorph() {
    const { cols, cw, lh } = this.G, C = this.C;
    const src: Morph[] = [];
    let maxD = 1;
    const dist: number[] = [];
    for (let n = 0; n < this.lastNl; n++) {
      const i = this.bL[n];
      const sx = (i % cols) * cw, sy = ((i / cols) | 0) * lh;
      const cd = Math.hypot(sx + cw / 2 - C.x, sy + lh / 2 - C.y);
      if (cd > maxD) maxD = cd;
      dist.push(cd);
      src.push({ sx, sy, d: this.bD[i], seed: this.bK[i], tgt: null, delay: 0, qx: 0, qy: 0 });
    }
    // Ripple outward from the handshake.
    src.forEach((p, n) => { p.delay = (dist[n] / maxD) * T.dmax + Math.random() * 0.08; });

    const S = src.slice().sort((a, b) => a.sx - b.sx || a.sy - b.sy);
    const G = this.targets.slice().sort((a, b) => a.x - b.x || a.y - b.y);
    this.spawns = [];
    if (S.length >= G.length) {
      for (let i = 0; i < G.length; i++) S[Math.floor((i * S.length) / G.length)].tgt = G[i];
    } else {
      const used = new Uint8Array(G.length);
      S.forEach((p, j) => { const k = Math.floor((j * G.length) / S.length); p.tgt = G[k]; used[k] = 1; });
      G.forEach((g, k) => { if (!used[k]) this.spawns.push({ tgt: g, delay: 0.3 + Math.random() * T.dmax }); });
    }
    for (const p of S) {
      if (!p.tgt) continue;
      // A gentle arc: slight sideways bow and a small lift, so paths read as one flowing motion.
      const dx = p.tgt.x - p.sx, dy = p.tgt.y - p.sy, k = (Math.random() - 0.5) * 0.25;
      p.qx = (p.sx + p.tgt.x) / 2 - dy * k;
      p.qy = (p.sy + p.tgt.y) / 2 + dx * k - Math.random() * 24;
    }
    this.morph = src;
    this.morphEnd = T.dmax + 0.08 + T.dur + 0.15;
  }

  private toHome(enter = false) {
    this.phase = "home";
    const W = this.G.W || 1;
    this.homeP = this.targets.map((t) => ({
      x: t.x, y: t.y, d: t.d, sh: t.sh, seed: t.seed, ox: 0, oy: 0, g: 0,
      e: (t.x / W) * ENTER.sweep + Math.random() * ENTER.jitter,
    }));
    this.enterAt = enter ? performance.now() : 0;
    this.parts = [];
    this.morph = null;
    this.spawns = [];
    this.nextRip = performance.now() + 1800;
    this.uiSet = true;
    this.o.onUi(true);
  }

  private events(t: number) {
    const at = [0.15, 1.7, T.touch + 0.15, T.morph];
    let changed = false;
    while (this.logStep < 4 && t >= at[this.logStep]) { this.logStep++; changed = true; }
    if (changed) this.o.onLog(LOG.slice(0, this.logStep));
    if (!this.fired && t >= T.touch) { this.fired = true; this.spark(); }
    if (!this.uiSet && t >= T.morph + 1.3) { this.uiSet = true; this.o.onUi(true); }
  }

  private spark() {
    const C = this.C, chs = [".", "*", "+", ":", "o"].map((c) => this.IDX[c]);
    for (let i = 0; i < 110; i++) {
      const an = Math.random() * Math.PI * 2, sp = 60 + Math.random() * 420;
      this.fx.push({ x: C.x, y: C.y, vx: Math.cos(an) * sp, vy: Math.sin(an) * sp * 0.6, life: 0.4 + Math.random() * 0.9, age: 0, g: chs[i % chs.length] });
    }
    this.ring = { t0: this.t };
  }

  // ---------- render ----------
  private base(d: number, seed: number) {
    const r = this.ramp, n = r.length;
    const k = Math.floor(d * n + ((seed & 7) / 7 - 0.5) * 0.9);
    return r[k < 0 ? 0 : k >= n ? n - 1 : k];
  }
  private alpha(d: number) { return 0.7 + 0.3 * d; }
  private ta(t: { sh?: boolean; d: number }) { return t.sh ? 0.4 : this.alpha(t.d); }
  private scr(seed: number) {
    const s = this.scrIdx;
    return s[(seed + (((this.frame + (seed & 3)) / 3) | 0) * 7) % s.length];
  }
  private put(i: number, x: number, y: number, a: number) {
    const ctx = this.ctx, p = this.dpr;
    if (a !== this.alphaCache) { ctx.globalAlpha = a; this.alphaCache = a; }
    ctx.drawImage(this.atlas, i * this.aw, 0, this.aw, this.ah, Math.round(x * p) / p, Math.round(y * p) / p, this.dw, this.dh);
  }

  private loop = (now: number) => {
    if (this.dead) return;
    this.raf = requestAnimationFrame(this.loop);
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    this.frame++;
    const { W, H } = this.G, ctx = this.ctx;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.globalAlpha = 1;
    this.alphaCache = 1;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);
    if (this.phase === "intro") { this.t += dt; this.events(this.t); this.drawIntro(this.t); }
    else if (this.phase === "home") this.drawHome(now);
    this.drawFx(dt);
  };

  private pose(t: number): PoseT[] {
    const ue = cl((t - T.s0) / (T.s1 - T.s0)), e = eb(ue), r = eio(cl((t - T.s1) / (T.touch - T.s1)));
    const life = (1 - r) * cl((t - T.s0) / 0.6), L = this.G.lh;
    const ext = eio(cl((t - (T.s1 - 0.8)) / (T.touch - T.s1 + 0.6)));
    const settle = 1 - cl((t - T.s1) / (T.touch - T.s1));
    const tap = cl((t - T.touch) / 0.45);
    return [0, 1].map((k) => {
      const g = this.rig[k], sg = g.sg;
      const arm = sg * (0.16 * (1 - e) - 0.025 * Math.sin(Math.PI * r) + 0.03 * Math.sin(t * 1.9 + k * 2.3) * life);
      const bob = Math.sin(t * 2.3 + k * 1.7) * L * 0.9 * life;
      const fa = [
        sg * (0.3 * (1 - ext) + 0.04 * Math.sin(t * 6.2) * (1 - ext) - 0.05 * Math.sin(Math.PI * tap)),
        sg * (0.1 * (1 - ext) + 0.05 * Math.sin(t * 5.1 + g.ph[1]) * settle),
        sg * (0.08 * (1 - ext) + 0.05 * Math.sin(t * 4.6 + g.ph[2]) * settle),
      ];
      return { x: this.startOff[k] * (1 - e) + this.touch[k].dx * r, y: this.touch[k].dy * r + bob, arm, ac: Math.cos(arm), as: Math.sin(arm), fa, g };
    });
  }

  /**
   * Fill single empty cells sandwiched between two drawn cells (left/right or above/below) when a
   * bending finger drew one of them: whatever stretching the finer sampling misses. Gaps next to
   * fingers that aren't moving are left alone, so the hand's own outline is kept.
   */
  private closeGaps(nl: number, stamp: number) {
    const { cols, rows } = this.G, { bS, bD, bK, bF, bB, bL: list } = this;
    const end = nl;
    const fill = (i: number, a: number, b: number) => {
      if (bS[i] === stamp || bS[a] !== stamp || bS[b] !== stamp || !(bB[a] | bB[b])) return;
      const src = bD[a] >= bD[b] ? a : b;
      bS[i] = stamp; bD[i] = (bD[a] + bD[b]) / 2; bK[i] = bK[src]; bF[i] = bF[src]; bB[i] = 0;
      list[nl++] = i;
    };
    for (let n = 0; n < end; n++) {
      const i = list[n];
      if (!bB[i]) continue;
      const c = i % cols, r = (i / cols) | 0;
      if (c + 2 < cols) fill(i + 1, i, i + 2);
      if (c >= 2) fill(i - 1, i, i - 2);
      if (r + 2 < rows) fill(i + cols, i, i + 2 * cols);
      if (r >= 2) fill(i - cols, i, i - 2 * cols);
    }
    return nl;
  }

  private drawIntro(t: number) {
    const { cw, lh, cols, rows } = this.G;
    if (t < T.morph) {
      const PO = this.pose(t), wave = t > T.touch ? (t - T.touch) * 850 : -1e4, N = cols * rows;
      if (this.bS.length !== N) {
        this.bS = new Int32Array(N); this.bD = new Float32Array(N); this.bK = new Int32Array(N);
        this.bF = new Uint8Array(N); this.bL = new Int32Array(N); this.bB = new Uint8Array(N); this.stampN = 0;
      }
      const stamp = ++this.stampN, { bS, bD, bK, bF, bB, bL: list } = this;
      const ox4 = [0.25, 0.75, 0.25, 0.75], oy4 = [0.25, 0.25, 0.75, 0.75];
      let nl = 0;
      // Splat sub-samples of each cell through finger + arm rotations, keep the densest per grid cell.
      for (const p of this.parts) {
        const o = PO[p.hand], g = o.g, fw = p.fw;
        const flag = (t < p.res ? 1 : 0) | (wave > 0 && Math.abs(p.cd - wave) < 36 ? 2 : 0);
        const bent = fw ? 1 : 0;
        for (let q = 0, n = fw ? BEND_N : 4; q < n; q++) {
          let x: number, y: number;
          if (fw) {
            x = p.hx + BEND_OFF[q % BEND_SUB] * cw; y = p.hy + BEND_OFF[(q / BEND_SUB) | 0] * lh;
            // Each finger turns the point about its knuckle by its share of the bend; offsets add.
            let mx = 0, my = 0;
            for (let j = 0; j < 3; j++) {
              const ang = o.fa[j] * fw[q * 3 + j];
              if (!ang) continue;
              const K = g.k[j], rx = x - K.x, ry = y - K.y, c = Math.cos(ang), sn = Math.sin(ang);
              mx += rx * c - ry * sn - rx; my += rx * sn + ry * c - ry;
            }
            x += mx; y += my;
          } else { x = p.hx + ox4[q] * cw; y = p.hy + oy4[q] * lh; }
          if (o.arm) { const A = g.arm, dx = x - A.x, dy = y - A.y; x = A.x + dx * o.ac - dy * o.as; y = A.y + dx * o.as + dy * o.ac; }
          x += o.x; y += o.y;
          const c = Math.floor(x / cw), r = Math.floor(y / lh);
          if (c < 0 || c >= cols || r < 0 || r >= rows) continue;
          const i = r * cols + c;
          if (bS[i] !== stamp) { bS[i] = stamp; list[nl++] = i; bD[i] = p.d; bK[i] = p.seed; bF[i] = flag; bB[i] = bent; }
          else { if (p.d > bD[i]) { bD[i] = p.d; bK[i] = p.seed; bF[i] = flag; } bB[i] |= bent; }
        }
      }
      nl = this.closeGaps(nl, stamp);
      for (let n = 0; n < nl; n++) {
        const i = list[n], f = bF[i];
        // Flag 1 (still resolving in): scrambled glyph. Flag 2 (touch shockwave): keep the hand's own
        // glyph and just brighten it. Scrambling the wave band made the arms look like they tore apart.
        this.put(f & 1 ? this.scr(bK[i]) : this.base(bD[i], bK[i]), (i % cols) * cw, ((i / cols) | 0) * lh, f & 2 ? 1 : f ? 0.5 : this.alpha(bD[i]));
      }
      this.lastNl = nl;
      return;
    }
    if (!this.morph) this.beginMorph();
    const tm = t - T.morph;
    for (const p of this.morph!) {
      const u = (tm - p.delay) / T.dur;
      if (!p.tgt) {
        // Spare character: fade out in place as its part of the hand lets go.
        const a = this.alpha(p.d) * (1 - cl((tm - p.delay) / 0.35));
        if (a > 0.01) this.put(this.base(p.d, p.seed), p.sx, p.sy, a);
        continue;
      }
      const tg = p.tgt;
      if (u < 0) this.put(this.base(p.d, p.seed), p.sx, p.sy, this.alpha(p.d));
      else if (u < 1) {
        const q = eio(u), iq = 1 - q;
        this.put(this.scr(p.seed), iq * iq * p.sx + 2 * iq * q * p.qx + q * q * tg.x, iq * iq * p.sy + 2 * iq * q * p.qy + q * q * tg.y, 0.95);
      } else this.put(this.base(tg.d, tg.seed), tg.x, tg.y, u < 1.12 ? 1 : this.ta(tg));
    }
    for (const s of this.spawns) {
      const u = (tm - s.delay) / 0.5;
      if (u < 0) continue;
      const tg = s.tgt;
      if (u < 1) this.put(this.scr(tg.seed), tg.x, tg.y, u * 0.9);
      else this.put(this.base(tg.d, tg.seed), tg.x, tg.y, this.ta(tg));
    }
    if (tm > this.morphEnd) this.toHome();
  }

  private drawHome(now: number) {
    const { cw, lh } = this.G, m = this.mouse, R = 120, fxOn = this.o.cursorFx ?? true, P = this.homeP;
    const ent = this.enterAt ? (now - this.enterAt) / 1000 : Infinity;
    if (ent > ENTER.sweep + ENTER.jitter + ENTER.dur) this.enterAt = 0;
    this.ripples = this.ripples.filter((rp) => now - rp.t < 1600);
    if (now > this.nextRip && P.length) {
      const q = P[(Math.random() * P.length) | 0];
      this.ripples.push({ x: q.x + cw / 2, y: q.y + lh / 2, t: now });
      this.nextRip = now + 3000 + Math.random() * 2000;
    }
    const gdt = Math.min(0.05, (now - (this.glitchLast || now)) / 1000);
    this.glitchLast = now;
    let n = P.length * 0.05 * gdt;
    n = Math.floor(n) + (Math.random() < n % 1 ? 1 : 0);
    for (let k = 0; k < n; k++) P[(Math.random() * P.length) | 0].g = now + 80 + Math.random() * 160;
    for (const p of P) {
      let tx = 0, ty = 0, hot = 0;
      const cx = p.x + cw / 2, cy = p.y + lh / 2;
      if (fxOn) {
        const dx = cx - m.x, dy = cy - m.y, d2 = dx * dx + dy * dy;
        if (d2 < R * R) {
          const d = Math.sqrt(d2) || 1, f = 1 - d / R, f2 = f * f;
          tx = (dx / d) * f2 * 40; ty = (dy / d) * f2 * 40; hot = f;
        }
      }
      for (const rp of this.ripples) {
        const age = (now - rp.t) / 1000, rad = age * 650, dx = cx - rp.x, dy = cy - rp.y;
        const d = Math.hypot(dx, dy) || 1, band = Math.abs(d - rad);
        if (band < 30) {
          const f = (1 - band / 30) * (1 - age / 1.6);
          tx += (dx / d) * f * 14; ty += (dy / d) * f * 14;
          if (f > hot) hot = f;
        }
      }
      p.ox += (tx - p.ox) * 0.16;
      p.oy += (ty - p.oy) * 0.16;
      if (p.g > now && hot < 0.5) hot = 0.5;
      if (ent < p.e + ENTER.dur) {
        // Still decoding in: hidden until its turn, then a scrambled glyph that firms up.
        const u = (ent - p.e) / ENTER.dur;
        if (u >= 0) this.put(this.scr(p.seed), p.x, p.y, 0.35 + 0.6 * u);
        continue;
      }
      const sc = hot > 0.25;
      this.put(sc ? this.scr(p.seed) : this.base(p.d, p.seed), p.x + p.ox, p.y + p.oy, sc ? 1 : Math.min(1, this.ta(p) + hot));
    }
  }

  private drawFx(dt: number) {
    for (let i = this.fx.length - 1; i >= 0; i--) {
      const f = this.fx[i];
      f.age += dt;
      if (f.age > f.life) { this.fx.splice(i, 1); continue; }
      f.x += f.vx * dt; f.y += f.vy * dt; f.vx *= 0.95; f.vy *= 0.95;
      this.put(f.g, f.x, f.y, (1 - f.age / f.life) * 0.9);
    }
    if (!this.ring || this.phase !== "intro") return;
    const age = this.t - this.ring.t0, { cw, lh } = this.G, C = this.C;
    if (age > 1.2) { this.ring = null; return; }
    const R = age * 900, a = (1 - age / 1.2) * 0.55, n = Math.max(8, Math.floor((2 * Math.PI * R) / (cw * 1.4)));
    for (let i = 0; i < n; i++) {
      const an = (i / n) * Math.PI * 2;
      this.put(this.scrIdx[(i + this.frame) % this.scrIdx.length], C.x + Math.cos(an) * R - cw / 2, C.y + Math.sin(an) * R * 0.62 - lh / 2, a);
    }
    if (age < 0.35) {
      const at = this.IDX["@"];
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) this.put(at, C.x - cw / 2 + dx * cw, C.y - lh / 2 + dy * lh, 1 - age / 0.35);
    }
  }
}
