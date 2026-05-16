import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Logo, Difficulty } from '../revamp/primitives'
import { useAuthStore } from '../store/useAuthStore'
import { useProblemStore } from '../store/useProblemStore'
import { useSubmissionStore } from '../store/useSubmissionStore'
import { usePlaylistStore } from '../store/usePlaylistStore'
import { axiosInstance } from '../libs/axios'
import toast from 'react-hot-toast'

const BTN = {
  fontFamily: 'var(--f-sans)', fontWeight: 600, fontSize: 13,
  padding: '9px 14px', border: '2px solid var(--ink)',
  background: 'var(--cream-50)', color: 'var(--ink)',
  cursor: 'pointer', boxShadow: '3px 3px 0 var(--ink)', borderRadius: 8,
  textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
}
const BTN_PRIMARY = { ...BTN, background: 'var(--cobalt)', color: 'var(--cream-100)' }

const COLORS = ['var(--mustard)', 'var(--cobalt)', 'var(--red)', 'var(--moss)']
const fmtDiff = d => d ? d[0] + d.slice(1).toLowerCase() : ''

export default function AdminDashboardPage() {
  const { authUser, logout } = useAuthStore()
  const { problems, getAllProblems } = useProblemStore()
  const { submissions, getAllSubmissions } = useSubmissionStore()
  const { playlists, getAllPlaylists } = usePlaylistStore()

  useEffect(() => {
    getAllProblems()
    getAllSubmissions()
    getAllPlaylists()
  }, [getAllProblems, getAllSubmissions, getAllPlaylists])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this problem? This cannot be undone.')) return
    try {
      await axiosInstance.delete(`/problem/delete-problem/${id}`)
      toast.success('Problem deleted')
      getAllProblems()
    } catch {
      toast.error('Failed to delete problem')
    }
  }

  const avatar = authUser?.name?.[0]?.toUpperCase() ?? '?'

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: 'var(--cream-50)', color: 'var(--ink)', fontFamily: 'var(--f-body)' }}>
      {/* Admin stripe */}
      <div style={{ background: 'var(--ink)', color: 'var(--cream-100)', padding: '8px 32px', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.18em' }}>
        <span>◆ ADMIN CONSOLE — RESTRICTED ACCESS</span>
        <span>{authUser?.email} · {authUser?.name?.toUpperCase() ?? 'ADMIN'}</span>
      </div>

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', borderBottom: '1.5px solid var(--ink)', background: 'var(--cream-100)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link to="/dashboard"><Logo size={24} /></Link>
            <span style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.16em', padding: '3px 8px', background: 'var(--red)', color: 'var(--cream-100)', border: '1.5px solid var(--ink)', borderRadius: 4 }}>ADMIN</span>
          </div>
          <nav style={{ display: 'flex', gap: 24, fontFamily: 'var(--f-sans)', fontSize: 14, fontWeight: 500 }}>
            <Link to="/dashboard" style={{ color: 'var(--cobalt)', borderBottom: '2px solid var(--cobalt)', paddingBottom: 4, textDecoration: 'none' }}>Overview</Link>
            <Link to="/problems" style={{ color: 'var(--ink)', textDecoration: 'none' }}>Problems</Link>
            <Link to="/playlists" style={{ color: 'var(--ink)', textDecoration: 'none' }}>Playlists</Link>
          </nav>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link to="/add-problem" style={BTN_PRIMARY}>＋ New problem</Link>
          <div onClick={logout} title="Sign out" style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--cobalt)', color: 'var(--cream-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--f-display)', fontSize: 16, border: '1.5px solid var(--ink)', cursor: 'pointer' }}>{avatar}</div>
        </div>
      </header>

      <main style={{ padding: '28px 32px', maxWidth: 1280, margin: '0 auto' }}>
        {/* Hero */}
        <section style={{ marginBottom: 28 }}>
          <div style={{ background: 'var(--cobalt)', color: 'var(--cream-100)', borderRadius: 14, border: '2px solid var(--ink)', padding: 28, position: 'relative', overflow: 'hidden', boxShadow: '5px 5px 0 var(--ink)' }}>
            <div style={{ position: 'absolute', top: -40, right: -40, width: 260, height: 260, borderRadius: '50%', border: '1.5px dashed rgba(255,255,255,0.3)' }}/>
            <div style={{ position: 'absolute', top: 20, right: 30, width: 170, height: 170, borderRadius: '50%', border: '1.5px dashed rgba(255,255,255,0.3)' }}/>
            <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.18em', opacity: 0.85 }}>WELCOME BACK, {authUser?.name?.toUpperCase() ?? 'ADMIN'}</div>
            <div style={{ fontFamily: 'var(--f-display)', fontSize: 60, lineHeight: 1, margin: '10px 0 18px' }}>
              {problems?.length ?? 0} problems<br/><em>in the library.</em>
            </div>
            <div style={{ display: 'flex', gap: 10, position: 'relative', zIndex: 2 }}>
              <Link to="/add-problem" style={{ ...BTN, background: 'var(--cream-50)', color: 'var(--ink)' }}>＋ New problem</Link>
            </div>
          </div>
        </section>

        {/* Stats row */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { v: (problems?.length ?? 0).toString(), l: 'PROBLEMS IN LIBRARY', c: 'var(--cobalt)' },
            { v: (playlists?.length ?? 0).toString(), l: 'PLAYLISTS CREATED', c: 'var(--red)' },
            { v: (submissions?.length ?? 0).toLocaleString(), l: 'TOTAL SUBMISSIONS', c: 'var(--ink)' },
          ].map((s) => (
            <div key={s.l} style={{ background: 'var(--cream-50)', border: '2px solid var(--ink)', borderRadius: 12, padding: 20, boxShadow: '3px 3px 0 var(--ink)' }}>
              <div style={{ fontFamily: 'var(--f-display)', fontSize: 44, lineHeight: 1, color: s.c }}>{s.v}</div>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.16em', color: 'rgba(15,26,61,0.6)', marginTop: 8 }}>{s.l}</div>
            </div>
          ))}
        </section>

        {/* Problems table */}
        <section style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.18em', color: 'var(--cobalt)' }}>PROBLEM LIBRARY</div>
              <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 48, margin: '4px 0 0', lineHeight: 1 }}>
                All <em style={{ color: 'var(--cobalt)' }}>problems</em>
              </h2>
            </div>
            <Link to="/add-problem" style={BTN_PRIMARY}>＋ Create problem</Link>
          </div>

          <div style={{ background: 'var(--cream-50)', border: '2px solid var(--ink)', borderRadius: 12, overflow: 'hidden', boxShadow: '4px 4px 0 var(--ink)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px 110px 120px', gap: 12, padding: '12px 18px', background: 'var(--cobalt)', color: 'var(--cream-100)', fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.16em' }}>
              <span>TITLE & TAGS</span>
              <span>DIFFICULTY</span>
              <span>CREATED</span>
              <span style={{ textAlign: 'right' }}>ACTIONS</span>
            </div>

            {(problems ?? []).slice(0, 20).map((p, i) => (
              <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '1fr 130px 110px 120px', gap: 12, padding: '13px 18px', alignItems: 'center', borderTop: i ? '1px dashed rgba(15,26,61,0.18)' : 'none', background: i % 2 === 0 ? 'var(--cream-50)' : 'var(--cream-100)' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--f-sans)', fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                    {(p.tags ?? []).slice(0, 3).map(t => (
                      <span key={t} style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.06em', color: 'var(--cobalt)', background: 'rgba(30,63,168,0.08)', padding: '2px 7px', borderRadius: 4 }}>{t}</span>
                    ))}
                  </div>
                </div>
                <Difficulty level={fmtDiff(p.difficulty)} />
                <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'rgba(15,26,61,0.65)' }}>
                  {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <div style={{ display: 'flex', gap: 6, justifyContent: 'end' }}>
                  <Link to={`/add-problem?edit=${p.id}`} title="Edit" style={{ width: 30, height: 30, border: '1.5px solid var(--ink)', borderRadius: 6, background: 'var(--cream-50)', cursor: 'pointer', fontSize: 12, fontFamily: 'var(--f-mono)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: 'var(--ink)' }}>✎</Link>
                  <Link to={`/problem/${p.id}`} title="View" style={{ width: 30, height: 30, border: '1.5px solid var(--ink)', borderRadius: 6, background: 'var(--cream-50)', cursor: 'pointer', fontSize: 12, fontFamily: 'var(--f-mono)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: 'var(--ink)' }}>↗</Link>
                  <button onClick={() => handleDelete(p.id)} title="Delete" style={{ width: 30, height: 30, border: '1.5px solid var(--red)', borderRadius: 6, background: 'rgba(217,74,61,0.1)', color: 'var(--red)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--f-mono)' }}>✕</button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, fontFamily: 'var(--f-mono)', fontSize: 12 }}>
            <span style={{ color: 'rgba(15,26,61,0.6)', letterSpacing: '0.06em' }}>SHOWING 1–{Math.min(20, problems?.length ?? 0)} OF {problems?.length ?? 0}</span>
            <Link to="/problems" style={{ color: 'var(--cobalt)', textDecoration: 'underline' }}>View all problems →</Link>
          </div>
        </section>

        {/* Playlists */}
        <section style={{ marginBottom: 28 }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.18em', color: 'var(--cobalt)' }}>PLAYLISTS</div>
            <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 48, margin: '4px 0 0', lineHeight: 1 }}>
              Curated <em style={{ color: 'var(--cobalt)' }}>collections.</em>
            </h2>
          </div>

          {(playlists?.length ?? 0) === 0 ? (
            <p style={{ fontFamily: 'var(--f-mono)', fontSize: 13, color: 'rgba(15,26,61,0.55)' }}>No playlists yet.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {(playlists ?? []).slice(0, 4).map((pl, idx) => (
                <Link key={pl.id} to={`/playlist/${pl.id}`} style={{ background: 'var(--cream-50)', border: '2px solid var(--ink)', borderRadius: 12, overflow: 'hidden', boxShadow: '4px 4px 0 var(--ink)', textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <div style={{ height: 110, background: COLORS[idx % COLORS.length], position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: 'var(--f-display)', fontSize: 48, color: 'var(--cream-100)' }}>{pl.problems?.length ?? 0}</span>
                    <div style={{ position: 'absolute', top: 10, left: 12, fontFamily: 'var(--f-mono)', color: 'var(--cream-100)', fontSize: 10, letterSpacing: '0.14em' }}>PLAYLIST</div>
                  </div>
                  <div style={{ padding: 14 }}>
                    <div style={{ fontFamily: 'var(--f-display)', fontSize: 22, lineHeight: 1.1 }}>{pl.name}</div>
                    <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'rgba(15,26,61,0.6)', marginTop: 6 }}>{pl.problems?.length ?? 0} problems</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
