/**
 * Side-scrolling runner for the About page: the orange mascot hops over bugs and stack traces,
 * and keeps low under flying errors. Pixel sprites on a 2D canvas, theme colours from CSS tokens.
 */

export type RunnerState = "idle" | "run" | "paused" | "over";

type Hooks = {
  score: (n: number) => void;
  state: (s: RunnerState, score: number) => void;
};

type Obstacle = {
  kind: "bugs" | "stack" | "error";
  x: number;
  /** Height of the bottom edge above the ground. */
  y: number;
  w: number;
  h: number;
  /** bugs: how many; stack: bar widths. */
  n: number;
  bars: number[];
  label: string;
};

const PX = 3;
const ORANGE = "#d97757";
const EYE = "#141413";

const GRAVITY = 2400;
const JUMP_V = 760;
/** Letting go early caps the rise speed, so a tap is a short hop and a hold is a full jump. */
const CUT_V = 420;
const SPEED_0 = 330;
const SPEED_MAX = 760;
const ACCEL = 9;
/** A press this close before landing still jumps. */
const BUFFER = 0.12;
const GROUND_PAD = 22;
const HIT_INSET = 3;
const ERRORS = ["NaN", "null", "undefined", "segfault", "404", "OOM", "panic!"];

// O body, E eye. The body sits on one of the leg pairs below.
const BODY = [
  "..OOOOOOOOOO..",
  "..OOEOOOOEOO..",
  "..OOEOOOOEOO..",
  "OOOOOOOOOOOOOO",
  "OOOOOOOOOOOOOO",
  "..OOOOOOOOOO..",
  "..OOOOOOOOOO..",
];
const BODY_DEAD = [BODY[0], BODY[0], "..OEEOOOOEEO..", ...BODY.slice(3)];
const LEGS = {
  stand: ["...O.O..O.O...", "...O.O..O.O..."],
  runA: ["...O.O..O.O...", "...O....O....."],
  runB: ["...O.O..O.O...", ".....O.....O.."],
  air: ["...O.O..O.O...", ".............."],
};
const MASCOT_W = BODY[0].length * PX;
const MASCOT_H = (BODY.length + 2) * PX;

const BUG = [
  ["..O...O..", "...O.O...", "..OOOOO..", "O.OOOOO.O", ".OOOOOOO.", "O.OOOOO.O", "..OOOOO..", ".O.....O."],
  ["..O...O..", "...O.O...", "..OOOOO..", ".OOOOOOO.", "O.OOOOO.O", ".OOOOOOO.", "..OOOOO..", "O.......O"],
];
const BUG_W = BUG[0][0].length * PX;
const BUG_H = BUG[0].length * PX;
const BUG_GAP = 4;

const rand = (a: number, b: number) => a + Math.random() * (b - a);

export class RunnerEngine {
  private ctx: CanvasRenderingContext2D;
  private w = 0;
  private h = 0;
  private raf = 0;
  private last = 0;
  private colors = { fg: "#ecebe6", faint: "#3a3a38" };
  private font = "monospace";

  private state: RunnerState = "idle";
  private t = 0;
  private dist = 0;
  private speed = SPEED_0;
  private score = 0;
  private y = 0;
  private vy = 0;
  private held = false;
  private buffered = -1;
  private diedAt = 0;
  private obs: Obstacle[] = [];
  private untilNext = 0;
  private afterError = false;
  private specks: { x: number; dy: number; w: number }[] = [];

  constructor(
    private canvas: HTMLCanvasElement,
    private hooks: Hooks,
  ) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("2D canvas unavailable");
    this.ctx = ctx;
    this.recolor();
  }

  /** Space / tap: start, resume, or jump. */
  press() {
    this.held = true;
    if (this.state === "idle" || this.state === "over") {
      if (this.state === "over" && performance.now() - this.diedAt < 450) return;
      this.reset();
      this.set("run");
      this.loop();
    } else if (this.state === "paused") {
      this.set("run");
      this.loop();
    } else if (!this.jump()) {
      this.buffered = this.t;
    }
  }

  release() {
    this.held = false;
    if (this.vy > CUT_V) this.vy = CUT_V;
  }

  pause() {
    this.held = false;
    if (this.state !== "run") return;
    this.set("paused");
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  resize(w: number, h: number) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = w;
    this.h = h;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.specks = Array.from({ length: Math.ceil(w / 16) }, () => ({
      x: rand(0, w),
      dy: 4 + PX * Math.floor(rand(0, 4)),
      w: PX * Math.ceil(rand(0, 2)),
    }));
    this.draw();
  }

  /** Re-read the theme tokens (call when the theme changes). */
  recolor() {
    const s = getComputedStyle(this.canvas);
    this.colors = {
      fg: s.getPropertyValue("--fg").trim() || this.colors.fg,
      faint: s.getPropertyValue("--faint").trim() || this.colors.faint,
    };
    this.font = s.fontFamily || this.font;
    if (this.state !== "run") this.draw();
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  // ---------- game ----------

  private set(state: RunnerState) {
    this.state = state;
    if (state === "over") this.diedAt = performance.now();
    this.hooks.state(state, this.score);
  }

  private reset() {
    this.t = 0;
    this.dist = 0;
    this.speed = SPEED_0;
    this.score = 0;
    this.y = 0;
    this.vy = 0;
    this.buffered = -1;
    this.obs = [];
    this.untilNext = 220;
    this.afterError = false;
    this.hooks.score(0);
  }

  private jump() {
    if (this.y > 0 || this.vy !== 0) return false;
    this.vy = this.held ? JUMP_V : CUT_V;
    return true;
  }

  private loop() {
    this.last = performance.now();
    if (!this.raf) this.raf = requestAnimationFrame(this.frame);
  }

  private frame = (now: number) => {
    this.raf = 0;
    if (this.state !== "run") return;
    // Clamp so a dropped frame never teleports anything through the mascot.
    const dt = Math.min(1 / 30, (now - this.last) / 1000);
    this.last = now;
    this.step(dt);
    this.draw();
    if (this.state === "run") this.raf = requestAnimationFrame(this.frame);
  };

  private step(dt: number) {
    this.t += dt;
    this.speed = Math.min(SPEED_MAX, SPEED_0 + ACCEL * this.t);
    const dx = this.speed * dt;
    this.dist += dx;

    if (this.y > 0 || this.vy > 0) {
      this.vy -= GRAVITY * dt;
      this.y += this.vy * dt;
      if (this.y <= 0) {
        this.y = 0;
        this.vy = 0;
        if (this.t - this.buffered < BUFFER) this.jump();
      }
    }

    for (const o of this.obs) o.x -= dx;
    this.obs = this.obs.filter((o) => o.x + o.w > -8);
    this.untilNext -= dx;
    if (this.untilNext <= 0) this.spawn();

    for (const s of this.specks) {
      s.x -= dx;
      if (s.x < -s.w) s.x += this.w + s.w;
    }

    const mx = this.mascotX();
    for (const o of this.obs) {
      const overlapX = mx + HIT_INSET < o.x + o.w - HIT_INSET && o.x + HIT_INSET < mx + MASCOT_W - HIT_INSET;
      const overlapY = this.y + HIT_INSET < o.y + o.h - HIT_INSET && o.y + HIT_INSET < this.y + MASCOT_H - HIT_INSET;
      if (overlapX && overlapY) {
        this.set("over");
        return;
      }
    }

    const score = Math.floor(this.dist / 10);
    if (score !== this.score) {
      this.score = score;
      this.hooks.score(score);
    }
  }

  private spawn() {
    const r = Math.random();
    const base = { x: this.w + 8, y: 0, n: 0, bars: [] as number[], label: "" };
    let o: Obstacle;
    if (this.score > 120 && !this.afterError && r < 0.22) {
      // Flies at head height: stay on the ground and let it pass over.
      this.ctx.font = `12px ${this.font}`;
      const label = ERRORS[Math.floor(rand(0, ERRORS.length))];
      o = { ...base, kind: "error", label, y: MASCOT_H + 8, w: this.ctx.measureText(label).width, h: 12 };
    } else if (r < 0.55) {
      const rows = 4 + Math.floor(rand(0, 2));
      const w = PX * (5 + Math.floor(rand(0, 4)));
      const bars = Array.from({ length: rows }, (_, i) =>
        i === rows - 1 ? w : PX * Math.max(2, Math.round((w / PX) * rand(0.45, 1))),
      );
      o = { ...base, kind: "stack", w, h: rows * 9 - 3, bars };
    } else {
      const n = 1 + Number(Math.random() < 0.4) + Number(this.speed > 450 && Math.random() < 0.3);
      o = { ...base, kind: "bugs", n, w: n * BUG_W + (n - 1) * BUG_GAP, h: BUG_H };
    }
    this.obs.push(o);
    // Gaps are measured in time, so they stay jumpable as the speed climbs.
    const isError = o.kind === "error";
    this.untilNext = o.w + this.speed * (rand(0.75, 1.55) + (isError || this.afterError ? 0.3 : 0));
    this.afterError = isError;
  }

  // ---------- drawing ----------

  private mascotX() {
    return Math.max(20, Math.min(56, this.w * 0.06));
  }

  private sprite(rows: string[], x: number, top: number, fills: Record<string, string>) {
    const c = this.ctx;
    const x0 = Math.round(x);
    const y0 = Math.round(top);
    for (let r = 0; r < rows.length; r++) {
      for (let i = 0; i < rows[r].length; i++) {
        const fill = fills[rows[r][i]];
        if (!fill) continue;
        c.fillStyle = fill;
        c.fillRect(x0 + i * PX, y0 + r * PX, PX, PX);
      }
    }
  }

  private draw() {
    const { ctx: c, w, h, colors } = this;
    if (!w || !h) return;
    const g = Math.round(h - GROUND_PAD);
    c.clearRect(0, 0, w, h);

    c.fillStyle = colors.faint;
    c.fillRect(0, g, w, 1);
    for (const s of this.specks) c.fillRect(Math.round(s.x), g + s.dy, s.w, 1);

    const fg = { O: colors.fg };
    const bugFrame = BUG[Math.floor(this.t * 8) % 2];
    for (const o of this.obs) {
      if (o.kind === "bugs") {
        for (let k = 0; k < o.n; k++) this.sprite(bugFrame, o.x + k * (BUG_W + BUG_GAP), g - BUG_H, fg);
      } else if (o.kind === "stack") {
        c.fillStyle = colors.fg;
        o.bars.forEach((bw, i) => c.fillRect(Math.round(o.x), g - o.h + i * 9, bw, 6));
      } else {
        c.fillStyle = colors.fg;
        c.font = `12px ${this.font}`;
        c.textBaseline = "bottom";
        c.fillText(o.label, Math.round(o.x), g - o.y);
      }
    }

    const dead = this.state === "over";
    const legs = dead ? LEGS.stand
      : this.y > 0 ? LEGS.air
      : this.state !== "run" ? LEGS.stand
      : Math.floor(this.dist / 18) % 2 ? LEGS.runA : LEGS.runB;
    this.sprite([...(dead ? BODY_DEAD : BODY), ...legs], this.mascotX(), g - this.y - MASCOT_H, { O: ORANGE, E: EYE });
  }
}
