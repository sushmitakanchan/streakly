import React, { useEffect, useState } from 'react'
import { usePlaylistStore } from '../store/usePlaylistStore'

const ink = "var(--ink)"
const cobalt = "var(--cobalt)"
const cream50 = "var(--cream-50)"
const cream100 = "var(--cream-100)"

const inputStyle = {
  width: '100%', padding: '10px 12px', border: `2px solid ${ink}`, borderRadius: 8,
  background: cream50, fontSize: 13, fontFamily: 'var(--f-body)',
  boxShadow: `3px 3px 0 ${ink}`, boxSizing: 'border-box', outline: 'none',
}

const AddToPlaylistModal = ({ problemId, isOpen, onClose }) => {
  const { playlists, isLoading, getAllPlaylists, addProblemToPlaylist, createPlaylist } = usePlaylistStore()

  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      getAllPlaylists()
      setShowCreate(false)
      setNewName('')
      setNewDesc('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleAdd = async (playlistId) => {
    await addProblemToPlaylist(playlistId, [problemId])
    onClose()
  }

  const handleCreate = async () => {
    if (!newName.trim()) return
    setCreating(true)
    try {
      const pl = await createPlaylist({ name: newName.trim(), description: newDesc.trim() })
      if (pl?.id) {
        await addProblemToPlaylist(pl.id, [problemId])
        onClose()
      }
    } finally {
      setCreating(false)
    }
  }

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(15,26,61,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: cream50, border: `2px solid ${ink}`, borderRadius: 14, boxShadow: `6px 6px 0 ${ink}`, width: '100%', maxWidth: 420, overflow: 'hidden' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: `1.5px solid ${ink}`, background: cream100 }}>
          <div>
            <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.16em', color: cobalt }}>◆ SAVE TO</div>
            <div style={{ fontFamily: 'var(--f-display)', fontSize: 22, marginTop: 2 }}>
              {showCreate ? 'New playlist' : 'Choose a playlist'}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ width: 32, height: 32, border: `1.5px solid ${ink}`, borderRadius: 6, background: cream50, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontFamily: 'var(--f-mono)' }}
          >✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: 20, maxHeight: 420, overflowY: 'auto' }}>
          {showCreate ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.14em', color: 'rgba(15,26,61,0.6)', display: 'block', marginBottom: 6 }}>NAME *</label>
                <input
                  autoFocus
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="My playlist"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.14em', color: 'rgba(15,26,61,0.6)', display: 'block', marginBottom: 6 }}>DESCRIPTION (optional)</label>
                <input
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="What's this collection for?"
                  style={inputStyle}
                />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button
                  onClick={() => setShowCreate(false)}
                  style={{ flex: 1, padding: '10px 0', border: `1.5px solid ${ink}`, borderRadius: 8, background: cream100, cursor: 'pointer', fontFamily: 'var(--f-mono)', fontSize: 12 }}
                >← Back</button>
                <button
                  onClick={handleCreate}
                  disabled={!newName.trim() || creating}
                  style={{ flex: 2, padding: '10px 0', border: `2px solid ${ink}`, borderRadius: 8, background: cobalt, color: cream50, cursor: newName.trim() ? 'pointer' : 'not-allowed', fontFamily: 'var(--f-sans)', fontWeight: 600, fontSize: 13, boxShadow: `3px 3px 0 ${ink}`, opacity: !newName.trim() || creating ? 0.65 : 1 }}
                >{creating ? 'Creating…' : 'Create & add problem'}</button>
              </div>
            </div>
          ) : (
            <>
              {isLoading ? (
                <div style={{ textAlign: 'center', padding: '28px 0', fontFamily: 'var(--f-mono)', fontSize: 12, letterSpacing: '0.14em', color: 'rgba(15,26,61,0.55)' }}>
                  ◆ LOADING PLAYLISTS...
                </div>
              ) : playlists.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '28px 0', fontFamily: 'var(--f-mono)', fontSize: 12, letterSpacing: '0.14em', color: 'rgba(15,26,61,0.55)', lineHeight: 1.8 }}>
                  ◇ NO PLAYLISTS YET<br/>
                  <span style={{ fontSize: 11 }}>Create one below to get started.</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {playlists.map(pl => (
                    <button
                      key={pl.id}
                      onClick={() => handleAdd(pl.id)}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', border: `2px solid ${ink}`, borderRadius: 10, background: cream100, cursor: 'pointer', boxShadow: `3px 3px 0 ${ink}`, textAlign: 'left', width: '100%' }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontFamily: 'var(--f-sans)', fontWeight: 600, fontSize: 14, color: ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pl.name}</div>
                        {pl.description && (
                          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'rgba(15,26,61,0.55)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pl.description}</div>
                        )}
                      </div>
                      <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'rgba(15,26,61,0.55)', letterSpacing: '0.1em', whiteSpace: 'nowrap', marginLeft: 16, flexShrink: 0 }}>
                        {pl.problems?.length ?? 0} probs
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Create new playlist button */}
              <button
                onClick={() => setShowCreate(true)}
                style={{ marginTop: 14, width: '100%', padding: '11px 0', border: `1.5px dashed ${ink}`, borderRadius: 10, background: 'transparent', cursor: 'pointer', fontFamily: 'var(--f-mono)', fontSize: 12, letterSpacing: '0.1em', color: cobalt }}
              >＋ Create new playlist</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AddToPlaylistModal
