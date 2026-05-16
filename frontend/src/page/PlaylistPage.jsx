import React, { useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Logo, Difficulty } from '../revamp/primitives'
import { useAuthStore } from '../store/useAuthStore'
import { usePlaylistStore } from '../store/usePlaylistStore'

const fmtDiff = d => d ? d[0] + d.slice(1).toLowerCase() : ''

const ink = 'var(--ink)'
const cobalt = 'var(--cobalt)'
const red = 'var(--red)'
const cream50 = 'var(--cream-50)'
const cream100 = 'var(--cream-100)'

const TrashIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
)

export default function PlaylistPage() {
  const { playlistId } = useParams()
  const navigate = useNavigate()
  const { authUser, logout } = useAuthStore()
  const { currentPlaylist, isLoading, getPlaylistDetails, removeProblemFromPlaylist, deletePlaylist } = usePlaylistStore()

  useEffect(() => {
    getPlaylistDetails(playlistId)
  }, [playlistId])

  const avatar = authUser?.name?.[0]?.toUpperCase() ?? '?'
  const problems = currentPlaylist?.problems ?? []

  const handleRemoveProblem = async (problemId) => {
    await removeProblemFromPlaylist(playlistId, [problemId])
  }

  const handleDeletePlaylist = async () => {
    if (!window.confirm(`Delete "${currentPlaylist.name}"? This cannot be undone.`)) return
    await deletePlaylist(playlistId)
    navigate('/playlists')
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: cream50, color: ink, fontFamily: 'var(--f-body)' }}>
      {/* Nav */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', borderBottom: `1.5px solid ${ink}`, background: cream100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          <Link to="/dashboard"><Logo size={24} /></Link>
          <nav style={{ display: 'flex', gap: 24, fontFamily: 'var(--f-sans)', fontSize: 14, fontWeight: 500 }}>
            <Link to="/dashboard" style={{ color: ink, textDecoration: 'none' }}>Dashboard</Link>
            <Link to="/problems" style={{ color: ink, textDecoration: 'none' }}>Problems</Link>
            <Link to="/playlists" style={{ color: cobalt, borderBottom: `2px solid ${cobalt}`, paddingBottom: 4, textDecoration: 'none' }}>Playlists</Link>
          </nav>
        </div>
        <div onClick={logout} title="Sign out" style={{ width: 36, height: 36, borderRadius: '50%', background: cobalt, color: cream100, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--f-display)', fontSize: 16, border: `1.5px solid ${ink}`, cursor: 'pointer' }}>{avatar}</div>
      </header>

      {isLoading || !currentPlaylist ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ background: cream100, border: `2px solid ${ink}`, borderRadius: 14, padding: '32px 48px', fontFamily: 'var(--f-mono)', fontSize: 13, letterSpacing: '0.14em', color: 'rgba(15,26,61,0.55)', boxShadow: `4px 4px 0 ${ink}` }}>
            ◆ LOADING...
          </div>
        </div>
      ) : (
        <>
          {/* Hero */}
          <section style={{ padding: '40px 32px 28px', borderBottom: `1.5px solid ${ink}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.18em', color: cobalt, marginBottom: 8 }}>◆ PLAYLIST</div>
              <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 64, lineHeight: 0.95, margin: '0 0 12px', letterSpacing: '-0.02em' }}>{currentPlaylist.name}</h1>
              {currentPlaylist.description && (
                <p style={{ fontFamily: 'var(--f-body)', fontSize: 15, color: 'rgba(15,26,61,0.7)', margin: '0 0 16px', maxWidth: 520 }}>{currentPlaylist.description}</p>
              )}
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'rgba(15,26,61,0.55)', letterSpacing: '0.1em' }}>
                {problems.length} {problems.length === 1 ? 'PROBLEM' : 'PROBLEMS'}
              </div>
            </div>
            <button
              onClick={handleDeletePlaylist}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px', border: `2px solid ${red}`, borderRadius: 8, background: 'rgba(217,74,61,0.08)', color: red, cursor: 'pointer', fontFamily: 'var(--f-sans)', fontWeight: 600, fontSize: 13, boxShadow: `2px 2px 0 ${red}` }}
            >
              <TrashIcon /> Delete playlist
            </button>
          </section>

          {/* Problems table */}
          <main style={{ padding: '28px 32px' }}>
            {problems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', fontFamily: 'var(--f-mono)', fontSize: 13, color: 'rgba(15,26,61,0.55)', letterSpacing: '0.14em' }}>
                ◇ NO PROBLEMS IN THIS PLAYLIST YET
              </div>
            ) : (
              <div style={{ background: cream50, border: `2px solid ${ink}`, borderRadius: 12, overflow: 'hidden', boxShadow: `4px 4px 0 ${ink}` }}>
                {/* Table header */}
                <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr 140px 100px 44px', gap: 12, padding: '12px 18px', background: cobalt, color: cream50, fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.16em' }}>
                  <span>#</span>
                  <span>TITLE & TAGS</span>
                  <span>DIFFICULTY</span>
                  <span>SOLVE</span>
                  <span/>
                </div>

                {problems.map((entry, i) => {
                  const p = entry.problem
                  return (
                    <div
                      key={entry.problemId}
                      style={{ display: 'grid', gridTemplateColumns: '48px 1fr 140px 100px 44px', gap: 12, padding: '14px 18px', alignItems: 'center', borderTop: i ? '1px dashed rgba(15,26,61,0.18)' : 'none', background: i % 2 === 0 ? cream50 : cream100 }}
                    >
                      <span style={{ fontFamily: 'var(--f-mono)', fontSize: 13, color: 'rgba(15,26,61,0.45)' }}>{i + 1}</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontFamily: 'var(--f-sans)', fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                        <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                          {(p.tags ?? []).slice(0, 4).map(t => (
                            <span key={t} style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.06em', color: cobalt, background: 'rgba(30,63,168,0.08)', padding: '2px 7px', borderRadius: 4 }}>{t}</span>
                          ))}
                        </div>
                      </div>
                      <Difficulty level={fmtDiff(p.difficulty)} />
                      <Link
                        to={`/problem/${p.id}`}
                        style={{ padding: '7px 14px', border: `1.5px solid ${ink}`, borderRadius: 7, background: cream50, color: ink, fontFamily: 'var(--f-sans)', fontWeight: 600, fontSize: 12, textDecoration: 'none', boxShadow: `2px 2px 0 ${ink}`, display: 'inline-block', textAlign: 'center' }}
                      >Solve →</Link>
                      <button
                        onClick={() => handleRemoveProblem(entry.problemId)}
                        title="Remove from playlist"
                        style={{ width: 32, height: 32, border: `1.5px solid ${red}`, borderRadius: 6, background: 'rgba(217,74,61,0.08)', color: red, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      ><TrashIcon /></button>
                    </div>
                  )
                })}
              </div>
            )}
          </main>
        </>
      )}
    </div>
  )
}
