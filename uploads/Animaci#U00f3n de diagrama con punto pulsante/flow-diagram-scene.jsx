// flow-diagram-scene.jsx — the animated diagram piece, mounted by the DC via
// <x-import component-from-global-scope="FlowDiagramPiece" from="./animations-v3.jsx ./flow-diagram-scene.jsx">
// Relies on globals from animations-v3.jsx: useComposition, Easing, clamp.

const CN = {
  bg: '#0A0E2E',
  card: '#0E1339',
  cardBorder: 'rgba(255,255,255,0.08)',
  nodeBg: '#141A47',
  nodeBorder: 'rgba(255,255,255,0.10)',
  ia: '#3A7BE0',
  iaGlow: 'rgba(138,63,209,0.65)',
  text: '#E4E5EF',
  textDim: 'rgba(228,229,239,0.45)',
  arrow: 'rgba(228,229,239,0.30)',
  ball: '#b8ff3d',
  blue: '#3A7BE0',
  divider: 'rgba(255,255,255,0.08)',
};

const CARD_W = 1400, CARD_H = 600;
const CARD_X = (1920 - CARD_W) / 2, CARD_Y = (1080 - CARD_H) / 2;
const ROW_Y = 150;
const NODE_W = 190, NODE_H = 74;

const EMAIL_C = { x: 245, y: ROW_Y };
const IA_C = { x: 548, y: ROW_Y };
const DECIDE_C = { x: 852, y: ROW_Y };
const NOTION_C = { x: 1155, y: ROW_Y };
const BRANCH_C = { x: (IA_C.x + DECIDE_C.x) / 2, y: ROW_Y };
const CRM_C = { x: BRANCH_C.x, y: ROW_Y + 210 };

const LOOP_DUR = 12;
const TRAVEL_DUR = 8; // ball reaches Notion at t=8, then holds for END_PAUSE_DUR before looping
const END_PAUSE_DUR = LOOP_DUR - TRAVEL_DUR;
const PAUSE_AT_INDEX = 1; // pauses after reaching waypoint[1] = IA_C

const WAYPOINTS = [EMAIL_C, IA_C, BRANCH_C, CRM_C, BRANCH_C, DECIDE_C, NOTION_C];

function dist(a, b) { return Math.hypot(b.x - a.x, b.y - a.y); }

// Build segment schedule for a given IA-pause duration: [{t0,t1,p0,p1,isPause}]
function buildSegments(pauseDur) {
  let lens = [];
  for (let i = 0; i < WAYPOINTS.length - 1; i++) lens.push(dist(WAYPOINTS[i], WAYPOINTS[i + 1]));
  const totalLen = lens.reduce((a, b) => a + b, 0);
  const travelDur = TRAVEL_DUR - pauseDur;
  const timePerUnit = travelDur / totalLen;
  let segs = [];
  let t = 0;
  for (let i = 0; i < lens.length; i++) {
    const dur = lens[i] * timePerUnit;
    segs.push({ t0: t, t1: t + dur, p0: WAYPOINTS[i], p1: WAYPOINTS[i + 1], isPause: false });
    t += dur;
    if (i === PAUSE_AT_INDEX) {
      segs.push({ t0: t, t1: t + pauseDur, p0: WAYPOINTS[i + 1], p1: WAYPOINTS[i + 1], isPause: true });
      t += pauseDur;
    }
  }
  // final hold at Notion before the loop wraps
  segs.push({ t0: t, t1: t + END_PAUSE_DUR, p0: WAYPOINTS[WAYPOINTS.length - 1], p1: WAYPOINTS[WAYPOINTS.length - 1], isPause: true, isEndPause: true });
  return segs;
}

function ballPos(rawT, segments) {
  const t = ((rawT % LOOP_DUR) + LOOP_DUR) % LOOP_DUR;
  for (const s of segments) {
    if (t >= s.t0 && t <= s.t1) {
      const local = s.t1 > s.t0 ? (t - s.t0) / (s.t1 - s.t0) : 1;
      const e = Easing.easeInOutQuad(local);
      return { x: s.p0.x + (s.p1.x - s.p0.x) * e, y: s.p0.y + (s.p1.y - s.p0.y) * e };
    }
  }
  return WAYPOINTS[0];
}

function isGlowing(rawT, segments) {
  const t = ((rawT % LOOP_DUR) + LOOP_DUR) % LOOP_DUR;
  const pause = segments.find(s => s.isPause && !s.isEndPause);
  return t >= pause.t0 && t <= pause.t1;
}

function ballOpacity(rawT) {
  const t = ((rawT % LOOP_DUR) + LOOP_DUR) % LOOP_DUR;
  if (t < 0.3) return t / 0.3;
  if (t > LOOP_DUR - 0.3) return (LOOP_DUR - t) / 0.3;
  return 1;
}

function formatMinutes(mins) {
  if (mins >= 60) {
    const h = Math.floor(mins / 60);
    const m = Math.round(mins % 60);
    return `${h}h ${m}m`;
  }
  return `${Math.max(2, Math.round(mins))} min`;
}

function counterValue(rawT) {
  const t = clamp(rawT, 0, LOOP_DUR);
  const progress = clamp(t / TRAVEL_DUR, 0, 1);
  const startMin = 167, endMin = 2;
  return startMin - (startMin - endMin) * progress;
}

// ---- Icons (lucide-style, stroke-only, 2px, rounded) ----
const iconProps = { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
const ICONS = {
  mail: (
    <svg {...iconProps}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  ),
  sparkles: (
    <svg {...iconProps}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
    </svg>
  ),
  split: (
    <svg {...iconProps}>
      <circle cx="6" cy="18" r="2.4" />
      <circle cx="18" cy="6" r="2.4" />
      <path d="M6 15.6V9c0-2 2-4 4-4h8" />
      <path d="M15 2l3 3-3 3" />
    </svg>
  ),
  clipboard: (
    <svg {...iconProps}>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
      <path d="M9 11h6M9 15h6M9 19h3" />
    </svg>
  ),
  database: (
    <svg {...iconProps}>
      <ellipse cx="12" cy="5" rx="7" ry="2.8" />
      <path d="M5 5v6c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8V5" />
      <path d="M5 11v6c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-6" />
    </svg>
  ),
};

function Node({ c, label, icon, active }) {
  return (
    <div style={{
      position: 'absolute',
      left: CARD_X + c.x - NODE_W / 2,
      top: CARD_Y + c.y - NODE_H / 2,
      width: NODE_W, height: NODE_H,
      borderRadius: 20,
      background: active ? CN.ia : CN.nodeBg,
      border: `1px solid ${active ? 'rgba(255,255,255,0.18)' : CN.nodeBorder}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      color: '#fff',
      fontFamily: "'Poppins', sans-serif",
      fontSize: 20, fontWeight: 600,
      boxShadow: active ? `0 0 0 1px rgba(255,255,255,0.06)` : 'none',
    }}>
      <span style={{ display: 'flex', color: active ? '#fff' : 'rgba(228,229,239,0.75)' }}>{icon}</span>
      {label}
    </div>
  );
}

function GlowRing({ c, active, T }) {
  if (!active) return null;
  const pulse = 0.5 + 0.5 * Math.sin(T * 6);
  const scale = 1.08 + 0.05 * pulse;
  return (
    <div style={{
      position: 'absolute',
      left: CARD_X + c.x - NODE_W / 2 * scale,
      top: CARD_Y + c.y - NODE_H / 2 * scale,
      width: NODE_W * scale, height: NODE_H * scale,
      borderRadius: 24,
      pointerEvents: 'none',
      boxShadow: `0 0 ${34 + 24 * pulse}px ${8 + 4 * pulse}px ${CN.iaGlow}`,
      opacity: 0.75 + 0.25 * pulse,
      transition: 'none',
    }} />
  );
}

function Arrow({ from, to, vertical }) {
  const midX = CARD_X + (from.x + to.x) / 2;
  const midY = CARD_Y + (from.y + to.y) / 2;
  return (
    <svg style={{ position: 'absolute', left: midX - 20, top: midY - 20, overflow: 'visible' }} width="40" height="40" viewBox="0 0 40 40">
      {vertical ? (
        <g stroke={CN.arrow} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6v20" />
          <path d="M13 20l7 8 7-8" />
        </g>
      ) : (
        <g stroke={CN.arrow} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 20h20" />
          <path d="M20 13l8 7-8 7" />
        </g>
      )}
    </svg>
  );
}

function Ball({ x, y, opacity, size, alpha }) {
  return (
    <div style={{
      position: 'absolute',
      left: CARD_X + x - size / 2,
      top: CARD_Y + y - size / 2,
      width: size, height: size,
      borderRadius: '50%',
      background: CN.ball,
      opacity: opacity * alpha,
      boxShadow: `0 0 ${size * 1.4}px ${size * 0.35}px rgba(184,255,61,${0.55 * alpha})`,
    }} />
  );
}

function FlowDiagramPiece({ showTrail = true, pauseSeconds = 3 }) {
  const { T } = useComposition();
  const segments = buildSegments(pauseSeconds);
  const t = ((T % LOOP_DUR) + LOOP_DUR) % LOOP_DUR;
  const pos = ballPos(T, segments);
  const glowing = isGlowing(T, segments);
  const baseOpacity = ballOpacity(T);

  // heartbeat pulse scale for the main ball
  const heartbeat = 1 + 0.18 * Math.max(0, Math.sin(t * 2 * Math.PI * 1.4));
  const baseSize = 22;

  const trail = showTrail ? [1, 2, 3, 4, 5].map(i => {
    const dt = i * 0.09;
    const p = ballPos(T - dt, segments);
    return { p, alpha: (1 - i / 6) * 0.5, size: baseSize * (1 - i * 0.11) };
  }) : [];

  const consumedMin = counterValue(t);
  const displayVal = formatMinutes(consumedMin);

  return (
    <div style={{ position: 'absolute', inset: 0, background: CN.bg, fontFamily: "'Poppins', sans-serif" }}>
      <div style={{
        position: 'absolute', left: CARD_X, top: CARD_Y, width: CARD_W, height: CARD_H,
        borderRadius: 28, background: CN.card, border: `1px solid ${CN.cardBorder}`,
        boxShadow: '0 30px 60px rgba(10,14,46,0.35)',
      }} />

      <Arrow from={EMAIL_C} to={IA_C} />
      <Arrow from={IA_C} to={DECIDE_C} />
      <Arrow from={DECIDE_C} to={NOTION_C} />
      <Arrow from={BRANCH_C} to={CRM_C} vertical />

      <GlowRing c={IA_C} active={glowing} T={T} />

      <Node c={EMAIL_C} label="Email" icon={ICONS.mail} />
      <Node c={IA_C} label="IA" icon={ICONS.sparkles} active />
      <Node c={DECIDE_C} label="Decide" icon={ICONS.split} />
      <Node c={NOTION_C} label="Notion" icon={ICONS.clipboard} />
      <Node c={CRM_C} label="CRM" icon={ICONS.database} />

      {trail.map((tr, i) => (
        <Ball key={i} x={tr.p.x} y={tr.p.y} size={tr.size} opacity={baseOpacity} alpha={tr.alpha} />
      ))}
      <Ball x={pos.x} y={pos.y} size={baseSize * heartbeat} opacity={baseOpacity} alpha={1} />

      <div style={{
        position: 'absolute',
        left: CARD_X + 60, top: CARD_Y + CARD_H - 130,
        width: CARD_W - 120, height: 1, background: CN.divider,
      }} />

      <div style={{
        position: 'absolute',
        left: CARD_X, top: CARD_Y + CARD_H - 100,
        width: CARD_W, display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 20,
      }}>
        <span style={{ fontSize: 22, color: CN.textDim, fontWeight: 600 }}>Hoy</span>
        <span style={{ fontSize: 30, color: CN.textDim, textDecoration: 'line-through', fontWeight: 500 }}>2h 47m</span>
        <svg width="28" height="18" viewBox="0 0 28 18" style={{ color: CN.textDim }}>
          <path d="M2 9h20M16 3l8 6-8 6" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ fontSize: 40, color: CN.blue, fontWeight: 800, fontFamily: "'Nunito', sans-serif", minWidth: 160, textAlign: 'left' }}>{displayVal}</span>
        <span style={{ fontSize: 22, color: CN.textDim, fontWeight: 600 }}>con agentes IA</span>
      </div>
    </div>
  );
}

function FlowDiagramApp() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  return (
    <React.Fragment>
      <CompositionStage width={1920} height={1080} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg="#0A0E2E">
        <FlowDiagramPiece showTrail={t.showTrail} pauseSeconds={t.pauseSeconds} />
      </CompositionStage>
      <TweaksPanel>
        <TweakSection label="Reproducci\u00f3n" />
        <TweakToggle label="Editor de tiempos" value={t.motionEditor} onChange={(v) => setTweak('motionEditor', v)} />
        <TweakSection label="Comportamiento" />
        <TweakToggle label="Mostrar estela" value={t.showTrail} onChange={(v) => setTweak('showTrail', v)} />
        <TweakSlider label="Pausa en nodo IA" value={t.pauseSeconds} min={1} max={5} step={0.5} unit="s" onChange={(v) => setTweak('pauseSeconds', v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

window.FlowDiagramApp = FlowDiagramApp;
