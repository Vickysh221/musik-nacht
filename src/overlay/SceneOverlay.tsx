/**
 * HTML overlay — positioned with viewport-pixel coords from user calibration.
 *
 * To re-calibrate, click on a target spot in the browser and note clientX/clientY.
 * Then update the constants below.
 */

import { useState } from 'react'
import { useMuseumSceneStore } from '../store/useMuseumSceneStore'
import { AlbumCard } from './AlbumCard'

// ─────────────────────────────────────────────────────────────
//  CALIBRATION — all values are viewport client-pixel coords
// ─────────────────────────────────────────────────────────────

/** Play/pause hotspot center, on the DJ turntable */
const DJ_DESK = { x: 411, y: 349 }

/**
 * Left upper bookcase — 3 rows × 4 cols = 12 slots.
 * tl/br are the top-left / bottom-right corners of the whole shelf area.
 */
const UPPER_SHELF = {
  tl: { x: 269, y: 202 },
  br: { x: 363, y: 311 },
  rows: 3,
  cols: 4,
}

// ─────────────────────────────────────────────────────────────

/** Build evenly-spaced grid of cell-center positions */
function buildGrid(
  tl: { x: number; y: number },
  br: { x: number; y: number },
  rows: number,
  cols: number,
): Array<{ x: number; y: number }> {
  const cw = (br.x - tl.x) / cols
  const ch = (br.y - tl.y) / rows
  return Array.from({ length: rows * cols }, (_, i) => ({
    x: tl.x + ((i % cols) + 0.5) * cw,
    y: tl.y + (Math.floor(i / cols) + 0.5) * ch,
  }))
}

const SHELF_POSITIONS = buildGrid(UPPER_SHELF.tl, UPPER_SHELF.br, UPPER_SHELF.rows, UPPER_SHELF.cols)

// Derived thumbnail size (fits inside one cell with 2px margin)
const THUMB = Math.floor((UPPER_SHELF.br.x - UPPER_SHELF.tl.x) / UPPER_SHELF.cols) - 4  // ≈ 19px

// ─────────────────────────────────────────────────────────────

export function SceneOverlay() {
  const songs = useMuseumSceneStore((s) => s.songs)
  const selectedSongId = useMuseumSceneStore((s) => s.selectedSongId)
  const selectSong = useMuseumSceneStore((s) => s.selectSong)
  const playback = useMuseumSceneStore((s) => s.playback)
  const playSelectedSong = useMuseumSceneStore((s) => s.playSelectedSong)
  const pausePlayback = useMuseumSceneStore((s) => s.pausePlayback)
  const playerBusy = useMuseumSceneStore((s) => s.playerBusy)

  const [openCardId, setOpenCardId] = useState<string | null>(null)

  const visibleSongs = songs.filter((s) => s.visible).slice(0, SHELF_POSITIONS.length)
  const isPlaying = playback.status === 'playing'

  const handleDeskClick = async () => {
    if (playerBusy) return
    if (isPlaying) await pausePlayback()
    else await playSelectedSong()
  }

  const handleVinylClick = (songId: string) => {
    selectSong(songId)
    setOpenCardId(openCardId === songId ? null : songId)
  }

  return (
    // position: fixed so left/top are direct viewport-pixel coords
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 10 }}>

      {/* ── DJ Desk play/pause hotspot ── */}
      <button
        type="button"
        onClick={() => void handleDeskClick()}
        style={{
          position: 'fixed',
          left: DJ_DESK.x,
          top: DJ_DESK.y,
          transform: 'translate(-50%, -50%)',
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: 'transparent',
          border: `2px solid ${isPlaying ? 'rgba(139,92,246,0.75)' : 'rgba(139,92,246,0.22)'}`,
          cursor: 'pointer',
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'border-color 0.3s, box-shadow 0.3s',
          boxShadow: isPlaying ? '0 0 14px 4px rgba(139,92,246,0.35)' : 'none',
        }}
        title={isPlaying ? '暂停' : '播放'}
      >
        <span style={{ fontSize: 18, color: isPlaying ? '#a78bfa' : 'rgba(167,139,250,0.4)', lineHeight: 1 }}>
          {isPlaying ? '⏸' : '▶'}
        </span>
      </button>

      {/* ── Left upper bookcase: vinyl tiles ── */}
      {visibleSongs.map((song, i) => {
        const pos = SHELF_POSITIONS[i]
        if (!pos) return null
        const isSelected = song.id === selectedSongId
        const isOpen = openCardId === song.id

        return (
          <div
            key={song.id}
            style={{
              position: 'fixed',
              left: pos.x,
              top: pos.y,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'auto',
            }}
          >
            {/* Album art thumbnail tile */}
            <button
              type="button"
              onClick={() => handleVinylClick(song.id)}
              title={song.name}
              style={{
                width: THUMB,
                height: THUMB,
                padding: 0,
                borderRadius: 2,
                border: `1.5px solid ${isSelected ? '#a78bfa' : 'rgba(255,255,255,0.15)'}`,
                boxShadow: isSelected
                  ? '0 0 8px 2px rgba(139,92,246,0.6)'
                  : '0 1px 3px rgba(0,0,0,0.5)',
                overflow: 'hidden',
                cursor: 'pointer',
                background: '#111',
                position: 'relative',
                transition: 'border-color 0.15s, box-shadow 0.15s',
                display: 'block',
              }}
            >
              {song.coverImgUrl && (
                <img
                  src={song.coverImgUrl}
                  alt={song.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  loading="lazy"
                />
              )}
              {/* Dot indicator — green when playable, purple when selected */}
              <span
                style={{
                  position: 'absolute',
                  bottom: 1,
                  right: 1,
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: isSelected ? '#a78bfa' : '#4ade80',
                  boxShadow: `0 0 3px 1px ${isSelected ? '#7c3aed' : '#16a34a'}`,
                  display: 'block',
                }}
              />
            </button>

            {/* Album card popup */}
            {isOpen && (
              <AlbumCard
                song={song}
                onClose={() => setOpenCardId(null)}
                onPlay={() => void playSelectedSong()}
                isPlaying={isPlaying && song.id === playback.currentSongId}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
