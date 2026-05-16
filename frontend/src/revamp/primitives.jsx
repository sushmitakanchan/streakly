// Streakly — shared primitives across landing/dashboard/profile.
// Drawn assets are kept simple (squares/circles/diamonds + SVG paths
// generated parametrically). No hand-drawn illustrative SVGs.

import React, { useMemo } from 'react';

// ── Decorative star (4-point sparkle, pamphlet-style)
function Sparkle({ size = 14, color = "var(--cobalt)", style }) {
  const s = size;
  const path = `M ${s/2} 0 L ${s*0.58} ${s*0.42} L ${s} ${s/2} L ${s*0.58} ${s*0.58} L ${s/2} ${s} L ${s*0.42} ${s*0.58} L 0 ${s/2} L ${s*0.42} ${s*0.42} Z`;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={style}>
      <path d={path} fill={color} />
    </svg>
  );
}

// ── Scalloped circular badge (the "25% off" sticker shape)
function ScallopBadge({ size = 110, points = 18, fill = "var(--cobalt)", children, rotate = -8, style }) {
  const r = size / 2;
  const inner = r * 0.84;
  const bump = r * 0.16;
  const pts = [];
  for (let i = 0; i < points * 2; i++) {
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const rad = i % 2 === 0 ? r : inner;
    pts.push(`${r + Math.cos(a) * rad},${r + Math.sin(a) * rad}`);
  }
  // Use circles around perimeter for true scallop look
  const circles = [];
  for (let i = 0; i < points; i++) {
    const a = (i / points) * Math.PI * 2;
    circles.push(
      <circle key={i} cx={r + Math.cos(a) * (r - bump)} cy={r + Math.sin(a) * (r - bump)} r={bump} fill={fill} />
    );
  }
  return (
    <div style={{ position: "relative", width: size, height: size, transform: `rotate(${rotate}deg)`, ...style }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: "absolute", inset: 0 }}>
        {circles}
        <circle cx={r} cy={r} r={r - bump * 0.6} fill={fill} />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        color: "var(--cream-100)", fontFamily: "var(--f-display)", lineHeight: 1, textAlign: "center", padding: 8,
      }}>{children}</div>
    </div>
  );
}

// ── Streakly wordmark logo
function Logo({ size = 24, color = "var(--ink)" }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color }}>
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <rect x="2" y="2" width="28" height="28" rx="6" fill="var(--cobalt)" />
        <path d="M16 7 C 13 12, 11 14, 11 18 C 11 22, 13 24, 16 24 C 19 24, 21 22, 21 18 C 21 16, 20 15, 19 14 C 18.5 16, 17.5 16, 17 15 C 16.5 13, 17 10, 16 7 Z" fill="var(--mustard)"/>
      </svg>
      <span style={{ fontFamily: "var(--f-display)", fontSize: size * 0.95, letterSpacing: "-0.02em", lineHeight: 1 }}>
        streakly
      </span>
    </div>
  );
}

// ── Difficulty pill
function Difficulty({ level }) {
  const cls = level === "Easy" ? "easy" : level === "Medium" ? "med" : "hard";
  return <span className={`pill ${cls}`}>{level}</span>;
}

// ── GitHub-style heatmap (calendar)
function Heatmap({ weeks = 26, scale = 12, gap = 3, data = null }) {
  const cells = useMemo(() => {
    const arr = [];
    for (let w = 0; w < weeks; w++) {
      for (let d = 0; d < 7; d++) {
        // pseudo-random but deterministic
        const seed = (w * 7 + d) * 9301 + 49297;
        const r = ((seed % 233280) / 233280);
        let v = 0;
        if (r > 0.35) v = 1;
        if (r > 0.55) v = 2;
        if (r > 0.75) v = 3;
        if (r > 0.92) v = 4;
        // simulate streak: last 3 weeks all >=2
        if (w > weeks - 4 && r > 0.2) v = Math.max(v, 2);
        arr.push(v);
      }
    }
    return data || arr;
  }, [weeks, data]);

  const colors = [
    "var(--cream-200)",
    "rgba(30,63,168,0.25)",
    "rgba(30,63,168,0.5)",
    "rgba(30,63,168,0.75)",
    "var(--cobalt)",
  ];

  return (
    <svg width={weeks * (scale + gap)} height={7 * (scale + gap)} style={{ display: "block" }}>
      {cells.map((v, i) => {
        const w = Math.floor(i / 7), d = i % 7;
        return (
          <rect
            key={i}
            x={w * (scale + gap)}
            y={d * (scale + gap)}
            width={scale}
            height={scale}
            rx={2}
            fill={colors[v]}
            stroke="rgba(15,26,61,0.08)"
            strokeWidth={0.6}
          />
        );
      })}
    </svg>
  );
}

// ── Progress ring
function Ring({ size = 80, stroke = 8, value = 0.6, color = "var(--cobalt)", track = "var(--cream-200)", label, sub }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} stroke={track} strokeWidth={stroke} fill="none"/>
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={c * (1 - value)} strokeLinecap="round"/>
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "var(--f-display)", fontSize: size * 0.28, lineHeight: 1 }}>{label}</div>
        {sub && <div style={{ fontFamily: "var(--f-mono)", fontSize: size * 0.11, color: "rgba(15,26,61,0.6)", marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

// ── Flame icon (chain link motif uses small flames)
function Flame({ size = 24, color = "var(--red)" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 3 C 9 8, 7 10, 7 14 C 7 18, 9 21, 12 21 C 15 21, 17 18, 17 14 C 17 12, 16 11, 15 10 C 14.5 12, 13.5 12, 13 11 C 12.5 9, 13 6, 12 3 Z" fill={color}/>
      <path d="M12 11 C 11 13, 10 14, 10 16 C 10 18, 11 19, 12 19 C 13 19, 14 18, 14 16 C 14 15, 13 14, 12 11 Z" fill="var(--mustard)"/>
    </svg>
  );
}

// ── Day chain (last N days)
function DayChain({ days = 14, current = 12 }) {
  const arr = Array.from({ length: days }, (_, i) => i < current);
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
      {arr.map((on, i) => (
        <div key={i} title={`Day ${i+1}`} style={{
          width: 22, height: 28, borderRadius: 4,
          border: `1.5px solid ${on ? "var(--cobalt)" : "rgba(15,26,61,0.2)"}`,
          background: on ? "var(--cobalt)" : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {on && <Flame size={12} color="var(--mustard)" />}
        </div>
      ))}
    </div>
  );
}

// ── Imagery placeholder (subtle striped, like the system prompt suggests)
function ImgPlaceholder({ label = "image", w = "100%", h = 180, accent = "var(--cobalt)" }) {
  return (
    <div style={{
      width: w, height: h,
      backgroundImage: `repeating-linear-gradient(45deg, rgba(30,63,168,0.06) 0 8px, transparent 8px 16px)`,
      backgroundColor: "var(--cream-200)",
      border: `1.5px dashed ${accent}`,
      borderRadius: 6,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--f-mono)", fontSize: 11, color: accent, textTransform: "uppercase", letterSpacing: "0.08em",
    }}>{label}</div>
  );
}

// ── "Marquee tape" — repeated text strip (pamphlet uses this)
function Tape({ text = "★ STREAKLY ", count = 12, bg = "var(--ink)", color = "var(--cream-100)", angle = -2, height = 36, fontSize = 16 }) {
  return (
    <div style={{
      background: bg, color, transform: `rotate(${angle}deg)`,
      padding: `${(height - fontSize) / 2}px 0`, overflow: "hidden",
      fontFamily: "var(--f-display)", fontSize, letterSpacing: "0.06em",
      whiteSpace: "nowrap", borderTop: "2px solid var(--ink)", borderBottom: "2px solid var(--ink)",
    }}>
      {Array.from({ length: count }).map((_, i) => <span key={i} style={{ marginRight: 24 }}>{text}</span>)}
    </div>
  );
}

export { Sparkle, ScallopBadge, Logo, Difficulty, Heatmap, Ring, Flame, DayChain, ImgPlaceholder, Tape };
