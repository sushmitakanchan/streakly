// Shared layout components for Login and Signup pages.
import React from 'react';
import { Logo, ScallopBadge, Sparkle } from '../revamp/primitives';

const BTN_PRIMARY = {
  fontFamily: "var(--f-sans)", fontWeight: 600, fontSize: 15,
  padding: "14px 22px", border: "2px solid var(--ink)",
  background: "var(--cobalt)", color: "var(--cream-100)",
  cursor: "pointer", boxShadow: "3px 3px 0 var(--ink)",
  borderRadius: 8, letterSpacing: "-0.01em",
  width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
};

function AuthShell({ side, children }) {
  return (
    <div style={{ width: '100%', minHeight: '100vh', display: "grid", gridTemplateColumns: "1fr 1fr", background: "var(--cream-50)", color: "var(--ink)", fontFamily: "var(--f-body)" }}>
      {side}
      <div style={{ padding: "48px 64px", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative" }} className="bg-grid">
        {children}
      </div>
    </div>
  );
}

function PosterSide({ kicker, headline, sub, badge, stats, testimonial }) {
  return (
    <div style={{ background: "var(--cobalt)", color: "var(--cream-100)", padding: "40px 48px", position: "relative", overflow: "hidden", borderRight: "2px solid var(--ink)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.18, backgroundImage: `radial-gradient(circle at 12px 18px, var(--cream-100) 1.4px, transparent 1.6px)`, backgroundSize: "40px 40px", pointerEvents: "none" }}/>
      <svg width="320" height="320" viewBox="0 0 320 320" style={{ position: "absolute", top: -80, right: -80, opacity: 0.4 }}>
        <circle cx="160" cy="160" r="150" fill="none" stroke="var(--cream-100)" strokeDasharray="4 6" strokeWidth="1.5"/>
        <circle cx="160" cy="160" r="110" fill="none" stroke="var(--cream-100)" strokeWidth="1" opacity="0.5"/>
        <circle cx="160" cy="160" r="70" fill="none" stroke="var(--cream-100)" strokeDasharray="2 4" strokeWidth="1"/>
      </svg>

      <div style={{ position: "relative", zIndex: 2 }}>
        <Logo size={28} color="var(--cream-100)" />
      </div>

      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{ fontFamily: "var(--f-mono)", fontSize: 12, letterSpacing: "0.22em", opacity: 0.85, marginBottom: 18 }}>{kicker}</div>
        <h2 style={{ fontFamily: "var(--f-display)", fontSize: 84, lineHeight: 0.92, margin: 0, letterSpacing: "-0.02em" }}>{headline}</h2>
        {sub && <p style={{ fontSize: 16, lineHeight: 1.55, opacity: 0.9, marginTop: 18, maxWidth: 420 }}>{sub}</p>}
        {stats && (
          <div style={{ display: "flex", gap: 28, marginTop: 28 }}>
            {stats.map((s) => (
              <div key={s.l}>
                <div style={{ fontFamily: "var(--f-display)", fontSize: 44, lineHeight: 1 }}>{s.k}</div>
                <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: "0.15em", opacity: 0.85, marginTop: 4 }}>{s.l}</div>
              </div>
            ))}
          </div>
        )}
        {badge && (
          <div style={{ position: "absolute", top: -30, right: 0 }}>
            <ScallopBadge size={130} fill="var(--mustard)" rotate={-10}>
              <div style={{ color: "var(--ink)" }}>
                <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: "0.1em" }}>{badge.kicker}</div>
                <div style={{ fontSize: badge.bigSize || 32, lineHeight: 0.9, marginTop: 4 }}>{badge.big}</div>
                <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: "0.1em", marginTop: 4 }}>{badge.sub}</div>
              </div>
            </ScallopBadge>
          </div>
        )}
      </div>

      <div style={{ position: "relative", zIndex: 2 }}>
        {testimonial && (
          <div style={{ background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 10, padding: 20 }}>
            <div style={{ fontFamily: "var(--f-display)", fontSize: 22, lineHeight: 1.25, fontStyle: "italic" }}>"{testimonial.q}"</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--mustard)", color: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--f-display)", fontSize: 16, border: "1.5px solid var(--ink)" }}>{testimonial.initial}</div>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.1em", opacity: 0.85 }}>{testimonial.who}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, type = "text", placeholder, helper, right, reg, error }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <label style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(15,26,61,0.7)" }}>{label}</label>
        {right && <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--cobalt)" }}>{right}</span>}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        {...(reg || {})}
        style={{
          width: "100%", padding: "13px 14px",
          border: `2px solid ${error ? "var(--red)" : "var(--ink)"}`,
          borderRadius: 8, background: "var(--cream-50)",
          fontSize: 15, fontFamily: "var(--f-body)", color: "var(--ink)",
          boxShadow: "3px 3px 0 var(--ink)", outline: "none", boxSizing: "border-box",
        }}
      />
      {error
        ? <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--red)", marginTop: 6 }}>{error}</div>
        : helper && <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "rgba(15,26,61,0.55)", marginTop: 6 }}>{helper}</div>
      }
    </div>
  );
}

function SocialRow() {
  const style = {
    flex: 1, padding: "11px 12px", border: "2px solid var(--ink)", borderRadius: 8,
    background: "var(--cream-50)", fontFamily: "var(--f-sans)", fontSize: 13, fontWeight: 600,
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    boxShadow: "3px 3px 0 var(--ink)",
  };
  return (
    <div style={{ display: "flex", gap: 10 }}>
      <button type="button" style={style}>
        <svg width="16" height="16" viewBox="0 0 16 16"><path fill="#1E3FA8" d="M8 0a8 8 0 0 0-2.5 15.6c.4.1.5-.2.5-.4v-1.4c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.2 1.9.9 2.4.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.2-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8a7.5 7.5 0 0 1 4 0c1.5-1 2.2-.8 2.2-.8.5 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.2 0 3.1-1.9 3.8-3.6 4 .3.3.6.8.6 1.6v2.3c0 .2.1.5.5.4A8 8 0 0 0 8 0Z"/></svg>
        GitHub
      </button>
      <button type="button" style={style}>
        <svg width="16" height="16" viewBox="0 0 16 16"><path fill="#D94A3D" d="M14.7 6.6H8v2.7h3.9c-.2.9-1.4 2.7-3.9 2.7-2.3 0-4.2-1.9-4.2-4.3S5.7 3.4 8 3.4c1.3 0 2.2.6 2.7 1l1.9-1.8C11.3 1.4 9.8.8 8 .8 4 .8.8 4 .8 8s3.2 7.2 7.2 7.2c4.2 0 6.9-2.9 6.9-7 0-.5 0-.9-.2-1.6Z"/></svg>
        Google
      </button>
    </div>
  );
}

function Divider({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
      <div style={{ flex: 1, height: 1, background: "rgba(15,26,61,0.2)" }}/>
      <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.16em", color: "rgba(15,26,61,0.55)", textTransform: "uppercase" }}>{children}</span>
      <div style={{ flex: 1, height: 1, background: "rgba(15,26,61,0.2)" }}/>
    </div>
  );
}

export { AuthShell, PosterSide, Field, SocialRow, Divider, BTN_PRIMARY, Sparkle };
