import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Logo, Difficulty, Flame } from '../revamp/primitives'
import { useAuthStore } from '../store/useAuthStore'
import { useProblemStore } from '../store/useProblemStore'
import { useSubmissionStore } from '../store/useSubmissionStore'
import AddToPlaylistModal from '../components/AddToPlaylistModal'

const BTN = {
  fontFamily: 'var(--f-sans)', fontWeight: 600, fontSize: 13,
  padding: '9px 14px', border: '2px solid var(--ink)',
  background: 'var(--cream-50)', color: 'var(--ink)',
  cursor: 'pointer', boxShadow: '3px 3px 0 var(--ink)', borderRadius: 8,
}

const fmtDiff = d => d ? d[0] + d.slice(1).toLowerCase() : ''
const PAGE_SIZE = 20

function StatusIcon({ solved }) {
  if (solved) return <span style={{ color: 'var(--moss)', fontSize: 16, fontFamily: 'var(--f-mono)' }}>✓</span>
  return <span style={{ color: 'rgba(15,26,61,0.25)', fontSize: 14, fontFamily: 'var(--f-mono)' }}>○</span>
}

export default function ProblemsPage() {
  const { authUser, logout } = useAuthStore()
  const { problems, getAllProblems } = useProblemStore()
  const { submissions, getAllSubmissions } = useSubmissionStore()

  const [search, setSearch] = useState('')
  const [diffFilter, setDiffFilter] = useState([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [playlistProblemId, setPlaylistProblemId] = useState(null)

  useEffect(() => {
    getAllProblems()
    getAllSubmissions()
  }, [getAllProblems, getAllSubmissions])

  const solvedIds = useMemo(
    () => new Set(submissions.filter(s => s.status === 'Accepted').map(s => s.problemId)),
    [submissions]
  )

  const todayProblem = problems.find(p => !solvedIds.has(p.id)) ?? problems[0]

  const filtered = useMemo(() => problems.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase())
    const matchDiff = diffFilter.length === 0 || diffFilter.includes(p.difficulty)
    const matchStatus =
      statusFilter === 'solved' ? solvedIds.has(p.id) :
      statusFilter === 'todo' ? !solvedIds.has(p.id) : true
    return matchSearch && matchDiff && matchStatus
  }), [problems, search, diffFilter, statusFilter, solvedIds])

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)

  const toggleDiff = (d) => {
    setDiffFilter(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])
    setPage(1)
  }

  const easyCount = problems.filter(p => p.difficulty === 'EASY').length
  const medCount = problems.filter(p => p.difficulty === 'MEDIUM').length
  const hardCount = problems.filter(p => p.difficulty === 'HARD').length

  const avatar = authUser?.name?.[0]?.toUpperCase() ?? '?'

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: 'var(--cream-50)', color: 'var(--ink)', fontFamily: 'var(--f-body)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', borderBottom: '1.5px solid var(--ink)', background: 'var(--cream-100)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          <Link to="/dashboard"><Logo size={24} /></Link>
          <nav style={{ display: 'flex', gap: 24, fontFamily: 'var(--f-sans)', fontSize: 14, fontWeight: 500 }}>
            <Link to="/dashboard" style={{ color: 'var(--ink)', textDecoration: 'none' }}>Dashboard</Link>
            <Link to="/problems" style={{ color: 'var(--cobalt)', borderBottom: '2px solid var(--cobalt)', paddingBottom: 4, textDecoration: 'none' }}>Problems</Link>
          </nav>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {(authUser?.currentStreak ?? 0) > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', border: '1.5px solid var(--ink)', borderRadius: 999, background: 'var(--cream-50)' }}>
              <Flame size={16} />
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: 13, fontWeight: 700 }}>{authUser.currentStreak}</span>
            </div>
          )}
          <div onClick={logout} title="Sign out" style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--cobalt)', color: 'var(--cream-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--f-display)', fontSize: 16, border: '1.5px solid var(--ink)', cursor: 'pointer' }}>{avatar}</div>
        </div>
      </header>

      {/* Page header */}
      <section style={{ padding: '32px 32px 20px', borderBottom: '1.5px solid var(--ink)', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, alignItems: 'end' }}>
        <div>
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.18em', color: 'var(--cobalt)' }}>{problems.length} PROBLEMS · CURATED MONTHLY</div>
          <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 76, lineHeight: 0.95, margin: '8px 0 0', color: 'var(--ink)', letterSpacing: '-0.02em' }}>
            The <em style={{ color: 'var(--cobalt)' }}>problem</em> library.
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 18, justifyContent: 'end' }}>
          {[
            { v: easyCount, l: 'EASY', c: 'var(--easy)' },
            { v: medCount, l: 'MEDIUM', c: 'var(--med)' },
            { v: hardCount, l: 'HARD', c: 'var(--hard)' },
            { v: solvedIds.size, l: 'SOLVED', c: 'var(--cobalt)' },
          ].map((s) => (
            <div key={s.l} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--f-display)', fontSize: 38, lineHeight: 1, color: s.c }}>{s.v}</div>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.15em', color: 'rgba(15,26,61,0.6)', marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <main style={{ padding: '24px 32px', display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24 }}>
        {/* Sidebar */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Today's problem mini-card */}
          {todayProblem && (
            <div style={{ background: 'var(--cobalt)', color: 'var(--cream-100)', border: '2px solid var(--ink)', borderRadius: 12, padding: 16, boxShadow: '4px 4px 0 var(--ink)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.18em', opacity: 0.85 }}>★ TODAY'S PICK</div>
              <div style={{ fontFamily: 'var(--f-display)', fontSize: 22, lineHeight: 1.05, margin: '6px 0 10px' }}>{todayProblem.title}</div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                <span className={`pill ${fmtDiff(todayProblem.difficulty).toLowerCase()}`} style={{ fontSize: 9.5 }}>{fmtDiff(todayProblem.difficulty).toUpperCase()}</span>
              </div>
              <Link to={`/problem/${todayProblem.id}`} style={{ display: 'block', textAlign: 'center', padding: '8px 12px', fontSize: 12, background: 'var(--cream-50)', color: 'var(--ink)', border: '2px solid var(--ink)', borderRadius: 8, fontFamily: 'var(--f-sans)', fontWeight: 600, textDecoration: 'none', boxShadow: '2px 2px 0 var(--ink)' }}>Solve now →</Link>
            </div>
          )}

          {/* Filters */}
          <div style={{ background: 'var(--cream-100)', border: '2px solid var(--ink)', borderRadius: 12, padding: 18, boxShadow: '4px 4px 0 var(--ink)' }}>
            <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.16em', color: 'var(--cobalt)', marginBottom: 12 }}>STATUS</div>
            {[
              { l: 'All problems', val: 'all', n: problems.length },
              { l: '✓ Solved', val: 'solved', n: solvedIds.size },
              { l: '○ To do', val: 'todo', n: problems.length - solvedIds.size },
            ].map((f) => (
              <label key={f.val} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', cursor: 'pointer', fontSize: 13, fontWeight: statusFilter === f.val ? 700 : 400, color: statusFilter === f.val ? 'var(--cobalt)' : 'var(--ink)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="radio" name="status" checked={statusFilter === f.val} onChange={() => { setStatusFilter(f.val); setPage(1) }} style={{ accentColor: '#1E3FA8' }}/>
                  {f.l}
                </span>
                <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'rgba(15,26,61,0.55)' }}>{f.n}</span>
              </label>
            ))}

            <div style={{ height: 1, background: 'rgba(15,26,61,0.15)', margin: '14px 0' }}/>

            <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.16em', color: 'var(--cobalt)', marginBottom: 12 }}>DIFFICULTY</div>
            {[
              { l: 'Easy', val: 'EASY', n: easyCount, c: 'var(--easy)' },
              { l: 'Medium', val: 'MEDIUM', n: medCount, c: 'var(--med)' },
              { l: 'Hard', val: 'HARD', n: hardCount, c: 'var(--hard)' },
            ].map((f) => (
              <label key={f.val} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', cursor: 'pointer', fontSize: 13 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" checked={diffFilter.includes(f.val)} onChange={() => toggleDiff(f.val)} style={{ accentColor: '#1E3FA8' }}/>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: f.c, flexShrink: 0 }}/>
                  {f.l}
                </span>
                <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'rgba(15,26,61,0.55)' }}>{f.n}</span>
              </label>
            ))}
          </div>
        </aside>

        {/* Main area */}
        <section>
          {/* Search row */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                placeholder={`Search ${problems.length} problems by title or topic…`}
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                style={{ width: '100%', padding: '13px 16px 13px 42px', border: '2px solid var(--ink)', borderRadius: 8, background: 'var(--cream-50)', fontSize: 14, fontFamily: 'var(--f-body)', boxShadow: '3px 3px 0 var(--ink)', boxSizing: 'border-box' }}
              />
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--f-mono)', fontSize: 14, pointerEvents: 'none' }}>⌕</span>
            </div>
          </div>

          {/* Table */}
          <div style={{ background: 'var(--cream-50)', border: '2px solid var(--ink)', borderRadius: 12, overflow: 'hidden', boxShadow: '4px 4px 0 var(--ink)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 130px 140px', gap: 12, padding: '12px 18px', background: 'var(--cobalt)', color: 'var(--cream-100)', fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.16em' }}>
              <span/>
              <span>TITLE & TAGS</span>
              <span>DIFFICULTY</span>
              <span/>
            </div>

            {paginated.length === 0 && (
              <div style={{ padding: '32px 18px', textAlign: 'center', fontFamily: 'var(--f-mono)', fontSize: 13, color: 'rgba(15,26,61,0.55)' }}>
                No problems match your filters.
              </div>
            )}

            {paginated.map((p, i) => (
              <div
                key={p.id}
                style={{ display: 'grid', gridTemplateColumns: '40px 1fr 130px 140px', gap: 12, padding: '13px 18px', alignItems: 'center', borderTop: i ? '1px dashed rgba(15,26,61,0.18)' : 'none', background: i % 2 === 0 ? 'var(--cream-50)' : 'var(--cream-100)' }}
              >
                <StatusIcon solved={solvedIds.has(p.id)} />
                <Link to={`/problem/${p.id}`} style={{ textDecoration: 'none', color: 'inherit', minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--f-sans)', fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                    {(p.tags ?? []).slice(0, 4).map(t => (
                      <span key={t} style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.06em', color: 'var(--cobalt)', background: 'rgba(30,63,168,0.08)', padding: '2px 7px', borderRadius: 4 }}>{t}</span>
                    ))}
                  </div>
                </Link>
                <Link to={`/problem/${p.id}`} style={{ textDecoration: 'none' }}>
                  <Difficulty level={fmtDiff(p.difficulty)} />
                </Link>
                <button
                  onClick={() => setPlaylistProblemId(p.id)}
                  style={{ padding: '6px 12px', border: '1.5px solid var(--ink)', borderRadius: 6, background: 'var(--cobalt)', color: 'var(--cream-100)', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: 12, fontFamily: 'var(--f-mono)', boxShadow: '2px 2px 0 var(--ink)', whiteSpace: 'nowrap' }}
                >Add to Playlist</button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, fontFamily: 'var(--f-mono)', fontSize: 12 }}>
              <span style={{ color: 'rgba(15,26,61,0.6)', letterSpacing: '0.06em' }}>
                SHOWING {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} OF {filtered.length}
                {filtered.length !== problems.length ? ` FILTERED · ${problems.length} TOTAL` : ' TOTAL'}
              </span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ ...BTN, padding: '6px 12px', fontSize: 12, opacity: page === 1 ? 0.5 : 1 }}>← PREV</button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const n = Math.max(1, Math.min(page - 2, totalPages - 4)) + i
                  return n <= totalPages ? (
                    <button key={n} onClick={() => setPage(n)} style={{ ...BTN, padding: '6px 12px', fontSize: 12, background: n === page ? 'var(--cobalt)' : 'var(--cream-50)', color: n === page ? 'var(--cream-100)' : 'var(--ink)' }}>{n}</button>
                  ) : null
                })}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ ...BTN, padding: '6px 12px', fontSize: 12, opacity: page === totalPages ? 0.5 : 1 }}>NEXT →</button>
              </div>
            </div>
          )}
        </section>
      </main>

      <AddToPlaylistModal
        problemId={playlistProblemId}
        isOpen={Boolean(playlistProblemId)}
        onClose={() => setPlaylistProblemId(null)}
      />
    </div>
  )
}
