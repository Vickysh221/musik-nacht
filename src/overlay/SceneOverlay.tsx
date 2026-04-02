/**
 * HTML overlay — positioned with viewport-pixel coords from user calibration.
 *
 * To re-calibrate, click on a target spot in the browser and note clientX/clientY.
 * Then update the constants below.
 */

import { useState } from 'react'
import { useMuseumSceneStore } from '../store/useMuseumSceneStore'
import { AlbumCard } from './AlbumCard'
import { FloatingLyricsOverlay } from './FloatingLyricsOverlay'

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
  tl: { x: 140, y: 90 },
  br: { x: 580, y: 470 },
  rows: 3,
  cols: 4,
}

// ─────────────────────────────────────────────────────────────

/** Build evenly-spaced grid of cell-center positions */
function buildSlantedGrid(
  tl: { x: number; y: number },
  br: { x: number; y: number },
  rows: number,
  cols: number,
): Array<{ x: number; y: number; rotate: number }> {
  const cw = (br.x - tl.x) / cols
  const ch = (br.y - tl.y) / rows
  return Array.from({ length: rows * cols }, (_, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    const baseX = tl.x + (col + 0.5) * cw
    const baseY = tl.y + (row + 0.5) * ch

    return {
      x: baseX + row * 16 - col * 14,
      y: baseY + col * 14 - row * 10,
      rotate: -7 + col * 1.6 - row * 0.9,
    }
  })
}

const SHELF_POSITIONS = buildSlantedGrid(
  UPPER_SHELF.tl,
  UPPER_SHELF.br,
  UPPER_SHELF.rows,
  UPPER_SHELF.cols,
)

// Derived thumbnail size (fits inside one cell with 2px margin)
const THUMB = 90
const ENVELOPE_DURATION_MS = 2200
const PERSONALITY_PRESETS = [
  { lift: 0.96, scale: 0.98, drift: 0.92, phase: 0 },
  { lift: 1.08, scale: 1.02, drift: 1.04, phase: 90 },
  { lift: 0.9, scale: 0.96, drift: 1.08, phase: 170 },
  { lift: 1.14, scale: 1.05, drift: 0.94, phase: 260 },
  { lift: 0.88, scale: 0.95, drift: 1.12, phase: 320 },
  { lift: 1.04, scale: 1.01, drift: 0.9, phase: 410 },
]

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
  const openSong = songs.find((song) => song.id === openCardId) ?? null
  const progressSeconds = playback.progress ?? 0

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
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 10,
        perspective: '1400px',
        perspectiveOrigin: '50% 50%',
        transformStyle: 'preserve-3d',
      }}
    >
      <style>
        {`
          @keyframes shelfEnvelope {
            0% {
              transform:
                translate3d(calc(var(--drift-x) * -0.15), 0, 0)
                scale(calc(1 + (var(--pulse-scale) * 0.08)));
            }
            12% {
              transform:
                translate3d(calc(var(--drift-x) * 0.12), calc(var(--lift-y) * -0.32), 0)
                scale(calc(1.01 + (var(--pulse-scale) * 0.12)));
            }
            26% {
              transform:
                translate3d(calc(var(--drift-x) * -0.08), calc(var(--lift-y) * -0.78), 0)
                scale(calc(1.018 + (var(--pulse-scale) * 0.2)));
            }
            42% {
              transform:
                translate3d(calc(var(--drift-x) * 0.18), calc(var(--lift-y) * -0.5), 0)
                scale(calc(1.008 + (var(--pulse-scale) * 0.11)));
            }
            58% {
              transform:
                translate3d(calc(var(--drift-x) * -0.12), calc(var(--lift-y) * -1), 0)
                scale(calc(1.02 + (var(--pulse-scale) * 0.24)));
            }
            74% {
              transform:
                translate3d(calc(var(--drift-x) * 0.1), calc(var(--lift-y) * -0.24), 0)
                scale(calc(1.006 + (var(--pulse-scale) * 0.09)));
            }
            100% {
              transform:
                translate3d(calc(var(--drift-x) * -0.15), 0, 0)
                scale(calc(1 + (var(--pulse-scale) * 0.08)));
            }
          }

          @keyframes selectedShelfEnvelope {
            0% {
              transform:
                translate3d(calc(var(--drift-x) * -0.15), -2px, 0)
                scale(calc(1.03 + (var(--pulse-scale) * 0.08)));
            }
            12% {
              transform:
                translate3d(calc(var(--drift-x) * 0.12), calc(-2px + (var(--lift-y) * -0.32)), 0)
                scale(calc(1.04 + (var(--pulse-scale) * 0.12)));
            }
            26% {
              transform:
                translate3d(calc(var(--drift-x) * -0.08), calc(-2px + (var(--lift-y) * -0.78)), 0)
                scale(calc(1.05 + (var(--pulse-scale) * 0.18)));
            }
            42% {
              transform:
                translate3d(calc(var(--drift-x) * 0.18), calc(-2px + (var(--lift-y) * -0.5)), 0)
                scale(calc(1.042 + (var(--pulse-scale) * 0.1)));
            }
            58% {
              transform:
                translate3d(calc(var(--drift-x) * -0.12), calc(-2px + (var(--lift-y) * -1.08)), 0)
                scale(calc(1.055 + (var(--pulse-scale) * 0.22)));
            }
            74% {
              transform:
                translate3d(calc(var(--drift-x) * 0.1), calc(-2px + (var(--lift-y) * -0.26)), 0)
                scale(calc(1.038 + (var(--pulse-scale) * 0.08)));
            }
            100% {
              transform:
                translate3d(calc(var(--drift-x) * -0.15), -2px, 0)
                scale(calc(1.03 + (var(--pulse-scale) * 0.08)));
            }
          }
        `}
      </style>

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
        const personality = PERSONALITY_PRESETS[i % PERSONALITY_PRESETS.length]

        return (
          <div
            key={song.id}
            style={{
              position: 'fixed',
              left: pos.x,
              top: pos.y,
              transform: `translate(-50%, -50%) rotateY(-18deg) rotateX(4deg) rotateZ(${pos.rotate}deg)`,
              transformStyle: 'preserve-3d',
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
                borderRadius: 8,
                border: `3px solid ${isSelected ? '#a78bfa' : 'rgba(255,255,255,0.16)'}`,
                boxShadow: isSelected
                  ? '0 0 18px 4px rgba(139,92,246,0.6)'
                  : '0 8px 18px rgba(0,0,0,0.45)',
                overflow: 'hidden',
                cursor: 'pointer',
                background: '#111',
                position: 'relative',
                transition: 'border-color 0.15s, box-shadow 0.15s',
                display: 'block',
                transform: isSelected ? 'translateY(-2px) scale(1.03)' : 'translateY(0) scale(1)',
                ['--lift-y' as string]: `${8 * personality.lift}px`,
                ['--pulse-scale' as string]: `${0.8 * personality.scale}`,
                ['--drift-x' as string]: `${3.2 * personality.drift}px`,
                animation: isPlaying
                  ? `${isSelected ? 'selectedShelfEnvelope' : 'shelfEnvelope'} ${ENVELOPE_DURATION_MS}ms cubic-bezier(0.22, 0.61, 0.36, 1) infinite`
                  : 'none',
                animationDelay: `${-((progressSeconds * 1000) % ENVELOPE_DURATION_MS) - personality.phase - i * 35}ms`,
                willChange: isPlaying ? 'transform' : 'auto',
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
                  bottom: 5,
                  right: 5,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: isSelected ? '#a78bfa' : '#4ade80',
                  boxShadow: `0 0 8px 2px ${isSelected ? '#7c3aed' : '#16a34a'}`,
                  display: 'block',
                }}
              />
            </button>
          </div>
        )
      })}

      {openSong && (
        <AlbumCard
          song={openSong}
          onClose={() => setOpenCardId(null)}
          onPlay={() => void playSelectedSong()}
          isPlaying={isPlaying && openSong.id === playback.currentSongId}
        />
      )}

      <FloatingLyricsOverlay />
    </div>
  )
}
