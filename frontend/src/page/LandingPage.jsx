import React from 'react';
import { Link } from 'react-router-dom';
import { Logo, ScallopBadge, Tape, Heatmap, Difficulty, DayChain, Flame, Sparkle, ImgPlaceholder } from '../revamp/primitives';
import { useAuthStore } from '../store/useAuthStore';

// Inline button styles — avoids conflict with DaisyUI's .btn class
const BTN = {
  fontFamily: "var(--f-sans)", fontWeight: 600, fontSize: 14,
  padding: "12px 20px", border: "2px solid var(--ink)",
  background: "var(--cream-50)", color: "var(--ink)",
  cursor: "pointer", boxShadow: "3px 3px 0 var(--ink)",
  borderRadius: 8, letterSpacing: "-0.01em",
  textDecoration: "none", display: "inline-block", lineHeight: 1,
};
const BTN_PRIMARY = {
  ...BTN,
  background: "var(--cobalt)", color: "var(--cream-100)",
};

function LandingPage() {
  const { authUser, logout } = useAuthStore();

  return (
    <div style={{ width: '100%', minHeight: '100vh', fontFamily: "var(--f-body)", color: "var(--ink)", position: "relative" }} className="bg-grid">
      {/* Top utility bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 48px", borderBottom: "1.5px solid var(--ink)", background: "var(--cream-100)", fontFamily: "var(--f-mono)", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        <div>EST. 2026 — BUILT FOR DAILY PRACTICE</div>
        <div>STREAK COUNT: 12,481 ACTIVE TODAY</div>
      </div>

      {/* Nav */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 48px" }}>
        <Logo size={28} />
        <nav style={{ display: "flex", gap: 28, fontFamily: "var(--f-sans)", fontSize: 14, fontWeight: 500 }}>
          <Link to="/problems" style={{ color: "var(--ink)", textDecoration: "none" }}>Problems</Link>
          <Link to="/dashboard" style={{ color: "var(--ink)", textDecoration: "none" }}>Playlists</Link>
          <Link to="/dashboard" style={{ color: "var(--ink)", textDecoration: "none" }}>Dashboard</Link>
        </nav>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {authUser ? (
            <>
              <span style={{ fontFamily: "var(--f-mono)", fontSize: 12, color: "rgba(15,26,61,0.6)" }}>
                Hey, {authUser.name?.split(' ')[0]}
              </span>
              <Link to="/dashboard" style={BTN}>Dashboard →</Link>
              <button onClick={logout} style={BTN}>Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" style={BTN}>Sign in</Link>
              <Link to="/signup" style={BTN_PRIMARY}>Start streak →</Link>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <section style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 48, padding: "32px 48px 64px", alignItems: "center", position: "relative" }}>
        <div style={{ position: "relative" }}>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 12, letterSpacing: "0.18em", color: "var(--cobalt)", marginBottom: 14 }}>
            ◆ YOUR DAILY ◆ CODING ROUTINE
          </div>
          <h1 style={{
            fontFamily: "var(--f-display)", fontSize: 132, lineHeight: 0.92, margin: 0,
            color: "var(--cobalt)", letterSpacing: "-0.02em",
          }}>
            Happy<br/>
            <span style={{ color: "var(--ink)" }}>coding,</span><br/>
            <em style={{ fontStyle: "italic", color: "var(--cobalt)" }}>daily.</em>
          </h1>
          <p style={{ fontFamily: "var(--f-body)", fontSize: 17, lineHeight: 1.55, marginTop: 28, maxWidth: 480, color: "rgba(15,26,61,0.78)" }}>
            Solve a problem a day. Build a chain you don't want to break. Streakly turns interview prep into a habit you actually keep — with playlists, progress rings, and a calendar that fills up.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 32, alignItems: "center" }}>
            {authUser ? (
              <Link to="/problems" style={{ ...BTN_PRIMARY, fontSize: 16, padding: "14px 24px" }}>Browse problems →</Link>
            ) : (
              <>
                <Link to="/signup" style={{ ...BTN_PRIMARY, fontSize: 16, padding: "14px 24px" }}>Start your streak — free</Link>
                <Link to="/login" style={BTN}>Sign in</Link>
              </>
            )}
          </div>
          <div style={{ display: "flex", gap: 18, marginTop: 32, fontFamily: "var(--f-mono)", fontSize: 12, color: "rgba(15,26,61,0.65)", letterSpacing: "0.06em" }}>
            <span>★ 4.9 / 5 (3,200+)</span><span>·</span><span>4 LANGUAGES</span>
          </div>
        </div>

        <div style={{ position: "relative" }}>
          {/* Hero plate */}
          <div style={{
            aspectRatio: "1/1", width: "100%", maxWidth: 520, margin: "0 auto", position: "relative",
            background: "var(--cream-50)", borderRadius: "50%", border: "2px solid var(--ink)",
            boxShadow: "8px 8px 0 var(--cobalt)",
            overflow: "hidden",
          }}>
            <svg viewBox="0 0 400 400" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
              <circle cx="200" cy="200" r="180" fill="none" stroke="var(--cobalt)" strokeDasharray="4 6" strokeWidth="1.5" />
              <circle cx="200" cy="200" r="150" fill="none" stroke="var(--cobalt)" strokeWidth="1" opacity="0.4" />
              {Array.from({ length: 24 }).map((_, i) => {
                const a = (i / 24) * Math.PI * 2;
                const x = 200 + Math.cos(a) * 165, y = 200 + Math.sin(a) * 165;
                return <circle key={i} cx={x} cy={y} r={i % 4 === 0 ? 3 : 1.5} fill={i % 3 === 0 ? "var(--red)" : "var(--cobalt)"} />;
              })}
            </svg>

            {/* Mock IDE card */}
            <div style={{
              position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%) rotate(-3deg)",
              width: 320, background: "var(--cream-50)", border: "2px solid var(--ink)", borderRadius: 10,
              boxShadow: "4px 4px 0 var(--ink)", overflow: "hidden",
            }}>
              <div style={{ background: "var(--cobalt)", color: "var(--cream-100)", padding: "8px 12px", fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.1em", display: "flex", justifyContent: "space-between" }}>
                <span>TWO-SUM.PY</span><span>● ● ●</span>
              </div>
              <pre style={{ margin: 0, padding: "14px 16px", fontFamily: "var(--f-mono)", fontSize: 12.5, lineHeight: 1.6, color: "var(--ink)" }}>
{`def two_sum(arr, target):
  seen = {}
  for i, n in enumerate(arr):
    if `}<span style={{ color: "var(--cobalt)", fontWeight: 700 }}>target - n</span>{` in seen:
      return [seen[target - n], i]
    seen[n] = i
`}              </pre>
              <div style={{ borderTop: "1.5px solid var(--ink)", padding: "8px 14px", display: "flex", justifyContent: "space-between", fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--moss)" }}>
                <span>✓ ALL TESTS PASS</span><span>+12 XP · DAY 47</span>
              </div>
            </div>

            <div style={{ position: "absolute", top: 30, left: 30, transform: "rotate(-12deg)" }}>
              <span className="pill easy">EASY</span>
            </div>
            <div style={{ position: "absolute", bottom: 60, right: 30, transform: "rotate(8deg)" }}>
              <span className="pill med">MEDIUM</span>
            </div>
            <div style={{ position: "absolute", bottom: 20, left: 50, transform: "rotate(-4deg)" }}>
              <span className="pill hard">HARD</span>
            </div>
          </div>

          {/* Scallop badge */}
          <div style={{ position: "absolute", top: -24, right: 0 }}>
            <ScallopBadge size={150} fill="var(--cobalt)" rotate={-12}>
              <div>
                <div style={{ fontSize: 18, fontFamily: "var(--f-mono)", letterSpacing: "0.1em" }}>FREE</div>
                <div style={{ fontSize: 12, fontFamily: "var(--f-mono)", letterSpacing: "0.1em", marginTop: 4 }}>TRIAL</div>
              </div>
            </ScallopBadge>
          </div>
        </div>
      </section>

      {/* Marquee tape */}
      <Tape text="★ SOLVE  •  TRACK  •  REPEAT  " count={6} fontSize={20} height={50} angle={-1.5} />

      {/* Stats strip */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, padding: "0", borderBottom: "1.5px solid var(--ink)", background: "var(--cream-50)" }}>
        {[
          { k: "2,400+", v: "Curated problems" },
          { k: "180", v: "Community playlists" },
          { k: "47 days", v: "Avg longest streak" },
          { k: "4 langs", v: "Py · JS · Java · C++" },
        ].map((s, i) => (
          <div key={i} style={{ padding: "32px 28px", borderRight: i < 3 ? "1.5px solid var(--ink)" : "none", textAlign: "center" }}>
            <div style={{ fontFamily: "var(--f-display)", fontSize: 48, color: "var(--cobalt)", lineHeight: 1 }}>{s.k}</div>
            <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 8, color: "rgba(15,26,61,0.7)" }}>{s.v}</div>
          </div>
        ))}
      </section>

      {/* Heatmap feature */}
      <section style={{ padding: "72px 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center", background: "var(--cream-100)", borderBottom: "1.5px solid var(--ink)" }}>
        <div>
          <div style={{
            background: "var(--cream-50)", border: "2px solid var(--ink)", borderRadius: 12,
            boxShadow: "10px 10px 0 var(--cobalt)", padding: 24, transform: "rotate(-2deg)",
          }}>
            <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.16em", color: "var(--cobalt)", marginBottom: 10 }}>YOUR STREAK · 47 DAYS</div>
            <div style={{ background: "var(--cream-100)", padding: 18, borderRadius: 8, border: "1.5px solid var(--ink)" }}>
              <Heatmap weeks={26} scale={11} gap={3} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.1em", color: "rgba(15,26,61,0.6)" }}>
              <span>NOV 2025</span><span>MAY 2026</span>
            </div>
          </div>
        </div>
        <div>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 12, letterSpacing: "0.18em", color: "var(--cobalt)", marginBottom: 12 }}>THE WHOLE IDEA</div>
          <h2 style={{ fontFamily: "var(--f-display)", fontSize: 80, lineHeight: 0.95, margin: 0, color: "var(--ink)" }}>
            One <em style={{ color: "var(--cobalt)" }}>blue square</em> a day.
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.55, color: "rgba(15,26,61,0.8)", marginTop: 22, maxWidth: 480 }}>
            That's it. That's the deal. Solve a problem — any problem — and your calendar fills another cobalt cell. Miss a day, lose your chain. Your stats live forever, but your streak earns its color.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 24, alignItems: "center", flexWrap: "wrap" }}>
            <span className="pill cobalt">SOLVED ✓</span>
            <span className="pill" style={{ background: "rgba(30,63,168,0.5)", color: "var(--cream-100)", borderColor: "var(--cobalt)" }}>STARTED</span>
            <span className="pill">SKIPPED</span>
          </div>
        </div>
      </section>

      {/* Three pillars */}
      <section style={{ padding: "72px 48px", background: "var(--cream-100)" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 12, letterSpacing: "0.18em", color: "var(--cobalt)", marginBottom: 12 }}>HOW IT WORKS</div>
          <h2 style={{ fontFamily: "var(--f-display)", fontSize: 64, margin: 0, color: "var(--ink)", lineHeight: 1 }}>
            Three habits, <em style={{ color: "var(--cobalt)" }}>one streak.</em>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {[
            { n: "01", t: "Solve daily", d: "A problem hand-picked for your level shows up every morning. Easy on busy days, hard on weekends.", img: "PROBLEM CARD", to: "/problems" },
            { n: "02", t: "Track everything", d: "Calendar heatmaps, progress rings, language breakdowns. See where you actually spend your time.", img: "DASHBOARD", to: "/dashboard" },
            { n: "03", t: "Make playlists", d: "Curate sets like top arrays or graph problems. Build a library, share with others.", img: "PLAYLIST", to: "/problems" },
          ].map((c) => (
            <Link key={c.n} to={c.to} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{ background: "var(--cream-50)", border: "2px solid var(--ink)", borderRadius: 14, padding: 24, boxShadow: "4px 4px 0 var(--ink)", cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
                  <span style={{ fontFamily: "var(--f-mono)", fontSize: 13, color: "var(--cobalt)", letterSpacing: "0.1em" }}>{c.n}</span>
                  <Sparkle size={16} color="var(--red)" />
                </div>
                <ImgPlaceholder label={c.img} h={160} />
                <h3 style={{ fontFamily: "var(--f-display)", fontSize: 32, margin: "18px 0 8px", color: "var(--cobalt)" }}>{c.t}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.55, color: "rgba(15,26,61,0.75)", margin: 0 }}>{c.d}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Playlist showcase */}
      <section style={{ padding: "72px 48px", background: "var(--cream-200)", borderTop: "1.5px solid var(--ink)", borderBottom: "1.5px solid var(--ink)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 32 }}>
          <div>
            <div style={{ fontFamily: "var(--f-mono)", fontSize: 12, letterSpacing: "0.18em", color: "var(--cobalt)", marginBottom: 10 }}>POPULAR THIS WEEK</div>
            <h2 style={{ fontFamily: "var(--f-display)", fontSize: 56, margin: 0, color: "var(--ink)", lineHeight: 1 }}>Playlists, like Spotify <em style={{ color: "var(--cobalt)" }}>but for problems.</em></h2>
          </div>
          <Link to="/signup" style={{ fontFamily: "var(--f-mono)", fontSize: 13, color: "var(--cobalt)", textDecoration: "underline" }}>Browse all →</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
          {[
            { t: "Top 75 Arrays", n: 75, by: "community", color: "var(--cobalt)" },
            { t: "DP Crash Course", n: 32, by: "community", color: "var(--red)" },
            { t: "Graphs Essentials", n: 18, by: "community", color: "var(--mustard)" },
            { t: "30-Day Sprint", n: 30, by: "streakly", color: "var(--moss)" },
          ].map((p) => (
            <Link key={p.t} to="/signup" style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{ background: "var(--cream-50)", border: "2px solid var(--ink)", borderRadius: 10, overflow: "hidden", boxShadow: "3px 3px 0 var(--ink)", cursor: "pointer" }}>
                <div style={{ height: 130, background: p.color, position: "relative", overflow: "hidden" }}>
                  <svg viewBox="0 0 200 130" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <circle key={i} cx={20 + i * 40} cy={65 + Math.sin(i)*20} r={20 + i*4} fill="none" stroke="var(--cream-100)" strokeWidth="1.5" opacity={0.5} />
                    ))}
                  </svg>
                  <div style={{ position: "absolute", top: 10, left: 12, fontFamily: "var(--f-mono)", color: "var(--cream-100)", fontSize: 11, letterSpacing: "0.1em" }}>PLAYLIST</div>
                  <div style={{ position: "absolute", bottom: 10, right: 12, color: "var(--cream-100)", fontFamily: "var(--f-display)", fontSize: 28 }}>{p.n}</div>
                </div>
                <div style={{ padding: 14 }}>
                  <div style={{ fontFamily: "var(--f-display)", fontSize: 22, lineHeight: 1.1, color: "var(--ink)" }}>{p.t}</div>
                  <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "rgba(15,26,61,0.6)", marginTop: 6, letterSpacing: "0.04em" }}>by {p.by} · {p.n} problems</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA section */}
      <section style={{ padding: "72px 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", background: "var(--cream-100)" }}>
        <div>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 12, letterSpacing: "0.18em", color: "var(--cobalt)", marginBottom: 12 }}>READY?</div>
          <h2 style={{ fontFamily: "var(--f-display)", fontSize: 96, margin: 0, lineHeight: 0.92, color: "var(--cobalt)" }}>
            Day one is<br/><span style={{ color: "var(--ink)" }}>the hardest.</span>
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.55, color: "rgba(15,26,61,0.75)", marginTop: 20, maxWidth: 460 }}>
            Solve a problem today. Repeat tomorrow. We'll handle the streak math.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
            <Link to="/signup" style={{ ...BTN_PRIMARY, padding: "14px 32px", fontSize: 16 }}>Create free account →</Link>
            <Link to="/login" style={{ ...BTN, padding: "14px 24px", fontSize: 16 }}>Sign in</Link>
          </div>
        </div>
        <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
          <div style={{
            background: "var(--cream-50)", border: "2px solid var(--ink)", padding: 28, borderRadius: 12,
            boxShadow: "8px 8px 0 var(--cobalt)", maxWidth: 380, transform: "rotate(2deg)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span className="pill cobalt">DAY 47</span>
              <Flame size={20} />
            </div>
            <div style={{ fontFamily: "var(--f-display)", fontSize: 28, lineHeight: 1.1, color: "var(--ink)" }}>
              Longest Substring Without Repeating Characters
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
              <Difficulty level="Medium" />
              <span className="pill">SLIDING WINDOW</span>
              <span className="pill">HASHMAP</span>
            </div>
            <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <DayChain days={10} current={9} />
              <span style={{ fontFamily: "var(--f-mono)", fontSize: 12, color: "rgba(15,26,61,0.6)" }}>~18 min</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "var(--ink)", color: "var(--cream-100)", padding: "48px 48px 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 32 }}>
          <div>
            <Logo size={28} color="var(--cream-100)" />
            <p style={{ marginTop: 14, fontSize: 14, lineHeight: 1.55, opacity: 0.75, maxWidth: 320 }}>
              A daily coding habit. Built for engineers who want consistency, not cram-sessions.
            </p>
          </div>
          <div>
            <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.16em", marginBottom: 12, opacity: 0.7 }}>PRODUCT</div>
            {[
              { label: "Problems", to: "/problems" },
              { label: "Playlists", to: "/dashboard" },
              { label: "Sign up", to: "/signup" },
            ].map((x) => (
              <div key={x.label} style={{ fontSize: 14, marginBottom: 8 }}>
                <Link to={x.to} style={{ color: "var(--cream-100)", textDecoration: "none", opacity: 0.8 }}>{x.label}</Link>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.16em", marginBottom: 12, opacity: 0.7 }}>ACCOUNT</div>
            {[
              { label: "Sign in", to: "/login" },
              { label: "Register", to: "/signup" },
            ].map((x) => (
              <div key={x.label} style={{ fontSize: 14, marginBottom: 8 }}>
                <Link to={x.to} style={{ color: "var(--cream-100)", textDecoration: "none", opacity: 0.8 }}>{x.label}</Link>
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", marginTop: 36, paddingTop: 18, display: "flex", justifyContent: "space-between", fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: "0.1em", opacity: 0.7 }}>
          <span>© 2026 STREAKLY · MADE WITH ◆ AND COFFEE</span>
          <span>v 1.4.2</span>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
