import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Logo, Flame, DayChain, ScallopBadge, Difficulty, Heatmap, Ring } from '../revamp/primitives'
import { useAuthStore } from '../store/useAuthStore'
import { useProblemStore } from '../store/useProblemStore'
import { useSubmissionStore } from '../store/useSubmissionStore'
import { usePlaylistStore } from '../store/usePlaylistStore'

const BTN = {
  fontFamily: 'var(--f-sans)', fontWeight: 600, fontSize: 14,
  padding: '9px 14px', border: '2px solid var(--ink)',
  background: 'var(--cream-50)', color: 'var(--ink)',
  cursor: 'pointer', boxShadow: '3px 3px 0 var(--ink)', borderRadius: 8,
  textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
}
const BTN_PRIMARY = { ...BTN, background: 'var(--cobalt)', color: 'var(--cream-100)' }

const COLORS = ['var(--cobalt)', 'var(--red)', 'var(--mustard)', 'var(--moss)']
const fmtDiff = d => d ? d[0] + d.slice(1).toLowerCase() : ''

export default function DashboardPage() {
  const { authUser, logout } = useAuthStore()
  const { problems, getAllProblems } = useProblemStore()
  const { submissions, getAllSubmissions } = useSubmissionStore()
  const { playlists, getAllPlaylists } = usePlaylistStore()

  useEffect(() => {
    getAllProblems()
    getAllSubmissions()
    getAllPlaylists()
  }, [getAllProblems, getAllSubmissions, getAllPlaylists])

  const solvedIds = new Set(submissions.filter(s => s.status === 'Accepted').map(s => s.problemId))
  const problemMap = Object.fromEntries(problems.map(p => [p.id, p]))
  const todayProblem = problems.find(p => !solvedIds.has(p.id)) ?? problems[0]

  const easyAll = problems.filter(p => p.difficulty === 'EASY')
  const medAll = problems.filter(p => p.difficulty === 'MEDIUM')
  const hardAll = problems.filter(p => p.difficulty === 'HARD')
  const solvedEasy = easyAll.filter(p => solvedIds.has(p.id)).length
  const solvedMed = medAll.filter(p => solvedIds.has(p.id)).length
  const solvedHard = hardAll.filter(p => solvedIds.has(p.id)).length

  const recentSolves = submissions.filter(s => s.status === 'Accepted').slice(0, 5)

  const langBreakdown = submissions.reduce((acc, s) => {
    acc[s.language] = (acc[s.language] || 0) + 1
    return acc
  }, {})

  const badgeRules = [
    { t: 'Day 1', c: 'var(--cobalt)', earned: solvedIds.size >= 1 },
    { t: 'Week 1', c: 'var(--mustard)', earned: solvedIds.size >= 7 },
    { t: '30 Solved', c: 'var(--red)', earned: solvedIds.size >= 30 },
    { t: 'First Hard', c: 'var(--cobalt)', earned: solvedHard >= 1 },
    { t: '100 Solved', c: 'var(--moss)', earned: solvedIds.size >= 100 },
    { t: 'Polyglot', c: 'var(--mustard)', earned: new Set(submissions.map(s => s.language)).size >= 3 },
    { t: 'Night Owl', c: 'var(--ink)', earned: false },
    { t: 'Curator', c: 'var(--cobalt)', earned: (playlists?.length ?? 0) >= 1 },
    { t: '200 Solved', c: 'var(--cream-300)', earned: solvedIds.size >= 200 },
    { t: 'All Trees', c: 'var(--cream-300)', earned: false },
    { t: 'Gold List', c: 'var(--cream-300)', earned: false },
    { t: 'Top 10', c: 'var(--cream-300)', earned: false },
    { t: 'Year Run', c: 'var(--cream-300)', earned: false },
    { t: 'DP Wiz', c: 'var(--cream-300)', earned: false },
    { t: 'Speed', c: 'var(--cream-300)', earned: false },
    { t: 'Mentor', c: 'var(--cream-300)', earned: false },
  ]

  const avatar = authUser?.name?.[0]?.toUpperCase() ?? '?'
  const greeting = authUser?.name?.toUpperCase() ?? 'CODER'

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: 'var(--cream-50)', color: 'var(--ink)', fontFamily: 'var(--f-body)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', borderBottom: '1.5px solid var(--ink)', background: 'var(--cream-100)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          <Link to="/dashboard"><Logo size={24} /></Link>
          <nav style={{ display: 'flex', gap: 24, fontFamily: 'var(--f-sans)', fontSize: 14, fontWeight: 500 }}>
            <Link to="/dashboard" style={{ color: 'var(--cobalt)', borderBottom: '2px solid var(--cobalt)', paddingBottom: 4, textDecoration: 'none' }}>Dashboard</Link>
            <Link to="/problems" style={{ color: 'var(--ink)', textDecoration: 'none' }}>Problems</Link>
            <Link to="/dashboard" style={{ color: 'var(--ink)', textDecoration: 'none' }}>Playlists</Link>
          </nav>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', border: '1.5px solid var(--ink)', borderRadius: 999, background: 'var(--cream-50)' }}>
            <Flame size={16} />
            <span style={{ fontFamily: 'var(--f-mono)', fontSize: 13, fontWeight: 700 }}>{solvedIds.size}</span>
          </div>
          <div title="Sign out" onClick={logout} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--cobalt)', color: 'var(--cream-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--f-display)', fontSize: 16, border: '1.5px solid var(--ink)', cursor: 'pointer' }}>{avatar}</div>
        </div>
      </header>

      <main style={{ padding: '28px 32px', maxWidth: 1280, margin: '0 auto' }}>
        {/* Greeting + today's problem */}
        <section style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, marginBottom: 28 }}>
          <div style={{ background: 'var(--cobalt)', color: 'var(--cream-100)', borderRadius: 14, border: '2px solid var(--ink)', padding: 28, position: 'relative', overflow: 'hidden', boxShadow: '5px 5px 0 var(--ink)' }}>
            <div style={{ position: 'absolute', top: -30, right: -30, width: 220, height: 220, borderRadius: '50%', border: '1.5px dashed rgba(255,255,255,0.3)' }}/>
            <div style={{ position: 'absolute', top: 30, right: 30, width: 120, height: 120, borderRadius: '50%', border: '1.5px dashed rgba(255,255,255,0.3)' }}/>
            <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.18em', opacity: 0.85 }}>GOOD MORNING, {greeting}</div>
            <div style={{ fontFamily: 'var(--f-display)', fontSize: 56, lineHeight: 1, margin: '10px 0 18px' }}>
              Today's problem<br/><em>is ready.</em>
            </div>
            {todayProblem && (
              <div style={{ background: 'var(--cream-50)', color: 'var(--ink)', border: '2px solid var(--ink)', borderRadius: 10, padding: 18, position: 'relative', zIndex: 2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.1em', color: 'rgba(15,26,61,0.6)' }}>TODAY'S PICK</span>
                  <Difficulty level={fmtDiff(todayProblem.difficulty)} />
                </div>
                <div style={{ fontFamily: 'var(--f-display)', fontSize: 28, lineHeight: 1.1 }}>{todayProblem.title}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                  {(todayProblem.tags ?? []).slice(0, 3).map(t => (
                    <span key={t} className="pill">{t}</span>
                  ))}
                </div>
                <Link to={`/problem/${todayProblem.id}`} style={{ ...BTN_PRIMARY, marginTop: 16, width: '100%', boxSizing: 'border-box' }}>Open editor →</Link>
              </div>
            )}
          </div>

          {/* Solved summary */}
          <div style={{ background: 'var(--cream-100)', border: '2px solid var(--ink)', borderRadius: 14, padding: 24, boxShadow: '5px 5px 0 var(--cobalt)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.18em', color: 'var(--cobalt)' }}>PROBLEMS SOLVED</div>
                  <div style={{ fontFamily: 'var(--f-display)', fontSize: 96, color: 'var(--cobalt)', lineHeight: 0.9, marginTop: 6 }}>{solvedIds.size}</div>
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: 12, letterSpacing: '0.1em', color: 'rgba(15,26,61,0.7)', marginTop: 6 }}>OF {problems.length} TOTAL · KEEP GOING</div>
                </div>
                <ScallopBadge size={92} fill="var(--red)" rotate={8}>
                  <div>
                    <div style={{ fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.1em' }}>KEEP</div>
                    <div style={{ fontSize: 18, lineHeight: 0.9, marginTop: 2 }}>IT UP</div>
                  </div>
                </ScallopBadge>
              </div>
            </div>
            <div style={{ marginTop: 20 }}>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.1em', color: 'rgba(15,26,61,0.6)', textTransform: 'uppercase', marginBottom: 8 }}>Activity — last 14 days</div>
              <DayChain days={14} current={Math.min(solvedIds.size, 14)} />
            </div>
          </div>
        </section>

        {/* Heatmap */}
        <section style={{ background: 'var(--cream-100)', border: '2px solid var(--ink)', borderRadius: 14, padding: 28, marginBottom: 28, boxShadow: '4px 4px 0 var(--ink)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.18em', color: 'var(--cobalt)' }}>YOUR YEAR</div>
              <div style={{ fontFamily: 'var(--f-display)', fontSize: 32, lineHeight: 1, marginTop: 4 }}>{solvedIds.size} problems solved · keep the chain</div>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.06em' }}>
              <span>LESS</span>
              {['var(--cream-200)', 'rgba(30,63,168,0.25)', 'rgba(30,63,168,0.5)', 'rgba(30,63,168,0.75)', 'var(--cobalt)'].map((c, i) => (
                <span key={i} style={{ width: 14, height: 14, background: c, border: '1px solid rgba(15,26,61,0.15)', borderRadius: 3 }}/>
              ))}
              <span>MORE</span>
            </div>
          </div>
          <Heatmap weeks={52} scale={14} gap={3} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.1em', color: 'rgba(15,26,61,0.6)' }}>
            <span>MAY '25</span><span>AUG</span><span>NOV</span><span>FEB '26</span><span>MAY '26</span>
          </div>
        </section>

        {/* Stats grid */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginBottom: 28 }}>
          {[
            { v: easyAll.length ? solvedEasy / easyAll.length : 0, pct: easyAll.length ? Math.round(solvedEasy / easyAll.length * 100) : 0, sub: 'EASY', col: 'var(--easy)', count: `${solvedEasy} / ${easyAll.length}` },
            { v: medAll.length ? solvedMed / medAll.length : 0, pct: medAll.length ? Math.round(solvedMed / medAll.length * 100) : 0, sub: 'MEDIUM', col: 'var(--med)', count: `${solvedMed} / ${medAll.length}` },
            { v: hardAll.length ? solvedHard / hardAll.length : 0, pct: hardAll.length ? Math.round(solvedHard / hardAll.length * 100) : 0, sub: 'HARD', col: 'var(--hard)', count: `${solvedHard} / ${hardAll.length}` },
            { v: problems.length ? solvedIds.size / problems.length : 0, pct: problems.length ? Math.round(solvedIds.size / problems.length * 100) : 0, sub: 'OVERALL', col: 'var(--cobalt)', count: `${solvedIds.size} / ${problems.length}` },
          ].map((s) => (
            <div key={s.sub} style={{ background: 'var(--cream-50)', border: '2px solid var(--ink)', borderRadius: 12, padding: 20, boxShadow: '3px 3px 0 var(--ink)', display: 'flex', alignItems: 'center', gap: 16 }}>
              <Ring size={84} stroke={9} value={s.v} color={s.col} label={`${s.pct}%`} />
              <div>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.16em', color: s.col }}>{s.sub}</div>
                <div style={{ fontFamily: 'var(--f-display)', fontSize: 22, lineHeight: 1.1, marginTop: 4 }}>{s.count}</div>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'rgba(15,26,61,0.6)', marginTop: 4 }}>solved</div>
              </div>
            </div>
          ))}
        </section>

        {/* Recent solves + playlists */}
        <section style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, marginBottom: 28 }}>
          <div style={{ background: 'var(--cream-50)', border: '2px solid var(--ink)', borderRadius: 14, padding: 24, boxShadow: '4px 4px 0 var(--ink)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
              <div style={{ fontFamily: 'var(--f-display)', fontSize: 28 }}>Recent solves</div>
              <Link to="/problems" style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--cobalt)' }}>View all →</Link>
            </div>
            {recentSolves.length === 0 && (
              <p style={{ fontFamily: 'var(--f-mono)', fontSize: 13, color: 'rgba(15,26,61,0.55)', marginTop: 8 }}>No accepted submissions yet — go solve something!</p>
            )}
            {recentSolves.map((sub, i) => {
              const prob = problemMap[sub.problemId]
              return (
                <div key={sub.id ?? i} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: 14, alignItems: 'center', padding: '12px 0', borderTop: '1px dashed rgba(15,26,61,0.2)' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--f-sans)', fontSize: 14, fontWeight: 600 }}>{prob?.title ?? 'Unknown'}</div>
                    <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'rgba(15,26,61,0.6)', marginTop: 2 }}>{sub.language}</div>
                  </div>
                  {prob && <Difficulty level={fmtDiff(prob.difficulty)} />}
                  <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'rgba(15,26,61,0.6)', letterSpacing: '0.06em' }}>
                    {new Date(sub.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}
                  </span>
                  <span style={{ color: 'var(--moss)', fontFamily: 'var(--f-mono)', fontSize: 13 }}>✓</span>
                </div>
              )
            })}
          </div>

          <div style={{ background: 'var(--cream-200)', border: '2px solid var(--ink)', borderRadius: 14, padding: 24, boxShadow: '4px 4px 0 var(--cobalt)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
              <div style={{ fontFamily: 'var(--f-display)', fontSize: 26 }}>Your playlists</div>
            </div>
            {(playlists?.length ?? 0) === 0 && (
              <p style={{ fontFamily: 'var(--f-mono)', fontSize: 13, color: 'rgba(15,26,61,0.55)' }}>No playlists yet.</p>
            )}
            {(playlists ?? []).slice(0, 4).map((pl, idx) => (
              <div key={pl.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderTop: '1px dashed rgba(15,26,61,0.2)' }}>
                <div style={{ width: 44, height: 44, background: COLORS[idx % COLORS.length], border: '1.5px solid var(--ink)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cream-100)', fontFamily: 'var(--f-display)', fontSize: 18, flexShrink: 0 }}>♪</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--f-sans)', fontWeight: 600, fontSize: 14 }}>{pl.name}</div>
                  <div style={{ height: 4, background: 'rgba(15,26,61,0.12)', borderRadius: 999, marginTop: 6, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min((pl.problems?.length ?? 0) * 5, 100)}%`, background: COLORS[idx % COLORS.length] }}/>
                  </div>
                </div>
                <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'rgba(15,26,61,0.7)', flexShrink: 0 }}>{pl.problems?.length ?? 0} probs</span>
              </div>
            ))}
          </div>
        </section>

        {/* Language breakdown + badges */}
        <section style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
          <div style={{ background: 'var(--cream-100)', border: '2px solid var(--ink)', borderRadius: 14, padding: 24, boxShadow: '4px 4px 0 var(--ink)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--cobalt)', color: 'var(--cream-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--f-display)', fontSize: 22, border: '2px solid var(--ink)', flexShrink: 0 }}>{avatar}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--f-display)', fontSize: 20 }}>{authUser?.name ?? 'Coder'}</div>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'rgba(15,26,61,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{authUser?.email}</div>
              </div>
            </div>
            <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.16em', color: 'var(--cobalt)', marginBottom: 12 }}>LANGUAGE BREAKDOWN</div>
            {submissions.length === 0 && (
              <p style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'rgba(15,26,61,0.55)' }}>No submissions yet.</p>
            )}
            {Object.entries(langBreakdown).map(([lang, count], i) => (
              <div key={lang} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--f-mono)', fontSize: 12, marginBottom: 4 }}>
                  <span>{lang}</span>
                  <span style={{ color: 'rgba(15,26,61,0.6)' }}>{count}</span>
                </div>
                <div style={{ height: 6, background: 'rgba(15,26,61,0.1)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.round(count / submissions.length * 100)}%`, background: COLORS[i % COLORS.length] }}/>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--cream-100)', border: '2px solid var(--ink)', borderRadius: 14, padding: 24, boxShadow: '4px 4px 0 var(--ink)' }}>
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.18em', color: 'var(--cobalt)' }}>BADGES EARNED</div>
              <div style={{ fontFamily: 'var(--f-display)', fontSize: 28 }}>Sticker book — {badgeRules.filter(b => b.earned).length} of {badgeRules.length}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 16, justifyItems: 'center' }}>
              {badgeRules.map((b, i) => (
                <div key={i} style={{ textAlign: 'center', opacity: b.earned ? 1 : 0.45 }}>
                  <ScallopBadge size={70} fill={b.c} rotate={(i % 5 - 2) * 4} points={14}>
                    <div style={{ fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.05em' }}>{b.t.toUpperCase()}</div>
                  </ScallopBadge>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
