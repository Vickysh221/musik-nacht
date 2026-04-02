import type { Song } from '../types/museum'

interface AlbumCardProps {
  song: Song
  onClose: () => void
  onPlay: () => void
  isPlaying: boolean
}

export function AlbumCard({ song, onClose, onPlay, isPlaying }: AlbumCardProps) {
  const minutes = Math.floor((song.duration / 1000) / 60)
  const seconds = String(Math.floor((song.duration / 1000) % 60)).padStart(2, '0')

  return (
    <div
      style={{
        position: 'absolute',
        // Pop upward-right of the thumbnail so it doesn't go off left edge
        bottom: '100%',
        left: 0,
        marginBottom: 4,
        zIndex: 100,
        width: 200,
        borderRadius: 14,
        overflow: 'hidden',
        background: 'rgba(14, 10, 22, 0.96)',
        border: '1px solid rgba(139,92,246,0.35)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.6), 0 0 20px rgba(139,92,246,0.2)',
        fontFamily: 'Inter, ui-sans-serif, sans-serif',
        backdropFilter: 'blur(12px)',
        pointerEvents: 'auto',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Cover art */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', background: '#0d0a1a' }}>
        {song.coverImgUrl ? (
          <img
            src={song.coverImgUrl}
            alt={song.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 40,
            color: 'rgba(139,92,246,0.4)',
          }}>
            ♪
          </div>
        )}

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.6)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.7)',
            fontSize: 12,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
          }}
        >
          ✕
        </button>
      </div>

      {/* Info */}
      <div style={{ padding: '10px 12px 12px' }}>
        <div style={{
          fontSize: 13,
          fontWeight: 700,
          color: '#f0eeff',
          lineHeight: 1.3,
          marginBottom: 4,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {song.name}
        </div>
        <div style={{
          fontSize: 11,
          color: 'rgba(167,139,250,0.7)',
          marginBottom: 10,
        }}>
          {minutes}:{seconds}
          {song.maxBrLevel && <span style={{ marginLeft: 8, color: 'rgba(255,255,255,0.3)' }}>{song.maxBrLevel}</span>}
        </div>

        {/* Play button */}
        <button
          type="button"
          onClick={onPlay}
          style={{
            width: '100%',
            padding: '7px 0',
            borderRadius: 8,
            background: isPlaying
              ? 'rgba(139,92,246,0.2)'
              : 'rgba(139,92,246,0.85)',
            border: `1px solid ${isPlaying ? 'rgba(139,92,246,0.5)' : 'transparent'}`,
            color: '#fff',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            letterSpacing: '0.04em',
            transition: 'background 0.2s',
          }}
        >
          {isPlaying ? '⏸ 正在播放' : '▶ 播放'}
        </button>
      </div>
    </div>
  )
}
