import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '../revamp/primitives'
import { useAuthStore } from '../store/useAuthStore'
import { usePlaylistStore } from '../store/usePlaylistStore'

const COLORS = ['var(--cobalt)', 'var(--red)', 'var(--mustard)', 'var(--moss)']

const ink = 'var(--ink)'
const cobalt = 'var(--cobalt)'
const red = 'var(--red)'
const cream50 = 'var(--cream-50)'
const cream100 = 'var(--cream-100)'

const TrashIcon = () => (
  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
)

export default function PlaylistsPage() {
  const { authUser, logout } = useAuthStore()
  const { playlists, isLoading, getAllPlaylists, deletePlaylist } = usePlaylistStore()

  useEffect(() => {
    getAllPlaylists()
  }, [])

  const avatar = authUser?.name?.[0]?.toUpperCase() ?? '?'

  const handleDelete = async (e, pl) => {
    e.preventDefault()
    if (!window.confirm(`Delete "${pl.name}"? This cannot be undone.`)) return
    await deletePlaylist(pl.id)
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

      {/* Hero */}
      <section style={{ padding: '40px 32px 28px', borderBottom: `1.5px solid ${ink}` }}>
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.18em', color: cobalt, marginBottom: 8 }}>◆ YOUR PLAYLISTS</div>
        <h1 style={{ fontFamily: 'var(--f-display)', fontSize: 64, lineHeight: 0.95, margin: 0, letterSpacing: '-0.02em' }}>
          Your <em style={{ color: cobalt }}>collections.</em>
        </h1>
      </section>

      {/* Body */}
      <main style={{ padding: '32px 32px' }}>
        {isLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh' }}>
            <div style={{ background: cream100, border: `2px solid ${ink}`, borderRadius: 14, padding: '32px 48px', fontFamily: 'var(--f-mono)', fontSize: 13, letterSpacing: '0.14em', color: 'rgba(15,26,61,0.55)', boxShadow: `4px 4px 0 ${ink}` }}>
              ◆ LOADING...
            </div>
          </div>
        ) : playlists.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', gap: 20, textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--f-mono)', fontSize: 13, letterSpacing: '0.18em', color: 'rgba(15,26,61,0.45)' }}>◇ NO PLAYLISTS YET</div>
            <p style={{ fontFamily: 'var(--f-body)', fontSize: 16, color: 'rgba(15,26,61,0.6)', margin: 0, maxWidth: 360, lineHeight: 1.6 }}>
              Save problems from the Problems page to build a collection.
            </p>
            <Link
              to="/problems"
              style={{ padding: '11px 24px', border: `2px solid ${ink}`, borderRadius: 8, background: cobalt, color: cream100, fontFamily: 'var(--f-sans)', fontWeight: 600, fontSize: 14, textDecoration: 'none', boxShadow: `3px 3px 0 ${ink}` }}
            >→ Browse Problems</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
            {playlists.map((pl, idx) => (
              <div key={pl.id} style={{ position: 'relative' }}>
                <Link
                  to={`/playlist/${pl.id}`}
                  style={{ background: cream50, border: `2px solid ${ink}`, borderRadius: 14, overflow: 'hidden', boxShadow: `4px 4px 0 ${ink}`, textDecoration: 'none', color: 'inherit', display: 'block' }}
                >
                  <div style={{ height: 110, background: COLORS[idx % COLORS.length], position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: 'var(--f-display)', fontSize: 52, color: cream100, opacity: 0.9 }}>{pl.problems?.length ?? 0}</span>
                    <div style={{ position: 'absolute', top: 10, left: 14, fontFamily: 'var(--f-mono)', color: cream100, fontSize: 10, letterSpacing: '0.16em', opacity: 0.85 }}>PLAYLIST</div>
                  </div>
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ fontFamily: 'var(--f-display)', fontSize: 22, lineHeight: 1.1, marginBottom: 6 }}>{pl.name}</div>
                    {pl.description && (
                      <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'rgba(15,26,61,0.55)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 6 }}>{pl.description}</div>
                    )}
                    <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'rgba(15,26,61,0.6)' }}>{pl.problems?.length ?? 0} problems</div>
                  </div>
                </Link>
                {/* Delete button — outside the Link to avoid nested interactive elements */}
                <button
                  onClick={(e) => handleDelete(e, pl)}
                  title="Delete playlist"
                  style={{ position: 'absolute', top: 10, right: 10, width: 28, height: 28, border: `1.5px solid rgba(255,255,255,0.6)`, borderRadius: 6, background: 'rgba(0,0,0,0.25)', color: cream100, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                ><TrashIcon /></button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
