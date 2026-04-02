import { useEffect, useState } from 'react'
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
  const [metaTags, setMetaTags] = useState<string[]>([])
  const [metaSummary, setMetaSummary] = useState<string>('')

  useEffect(() => {
    let cancelled = false

    async function loadMeta() {
      if (!song.albumId) {
        setMetaTags([])
        setMetaSummary('')
        return
      }

      try {
        const response = await fetch(`/api/library/album-meta?albumId=${song.albumId}`)
        const result = await response.json()
        if (!response.ok) {
          throw new Error(result?.message ?? '专辑信息加载失败')
        }

        if (cancelled) return

        setMetaTags(Array.isArray(result?.tags) ? result.tags : [])

        const summaryParts = [
          result?.language ? `语言 ${result.language}` : null,
          result?.year ? `${result.year}` : null,
          result?.company ? result.company : null,
        ].filter(Boolean)

        setMetaSummary(summaryParts.join(' · '))
      } catch {
        if (cancelled) return
        setMetaTags([])
        setMetaSummary('')
      }
    }

    void loadMeta()

    return () => {
      cancelled = true
    }
  }, [song.albumId])

  return (
    <div
      style={{
        position: 'fixed',
        right: 64,
        bottom: 56,
        zIndex: 120,
        width: 280,
        borderRadius: 18,
        overflow: 'hidden',
        background: 'rgba(14, 10, 22, 0.96)',
        border: '1px solid rgba(139,92,246,0.35)',
        boxShadow: '0 18px 48px rgba(0,0,0,0.6), 0 0 24px rgba(139,92,246,0.2)',
        fontFamily: 'Inter, ui-sans-serif, sans-serif',
        backdropFilter: 'blur(12px)',
        pointerEvents: 'auto',
        transform: 'rotateY(-14deg) rotateX(2deg) rotateZ(-1deg)',
        transformOrigin: '50% 50%',
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
            top: 10,
            right: 10,
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.6)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.7)',
            fontSize: 13,
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
      <div style={{ padding: '14px 16px 16px' }}>
        <div style={{
          fontSize: 17,
          fontWeight: 700,
          color: '#f0eeff',
          lineHeight: 1.3,
          marginBottom: 6,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {song.name}
        </div>
        <div style={{
          fontSize: 13,
          color: 'rgba(167,139,250,0.7)',
          marginBottom: 14,
        }}>
          {minutes}:{seconds}
          {song.maxBrLevel && <span style={{ marginLeft: 8, color: 'rgba(255,255,255,0.3)' }}>{song.maxBrLevel}</span>}
        </div>
        {metaTags.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {metaTags.map((tag) => (
              <span
                key={tag}
                style={{
                  padding: '4px 8px',
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#ddd6fe',
                  background: 'rgba(91,33,182,0.28)',
                  border: '1px solid rgba(167,139,250,0.24)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
        {metaSummary ? (
          <div style={{ fontSize: 11, lineHeight: 1.45, color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>
            {metaSummary}
          </div>
        ) : null}

        {/* Play button */}
        <button
          type="button"
          onClick={onPlay}
          style={{
            width: '100%',
            padding: '10px 0',
            borderRadius: 10,
            background: isPlaying
              ? 'rgba(139,92,246,0.2)'
              : 'rgba(139,92,246,0.85)',
            border: `1px solid ${isPlaying ? 'rgba(139,92,246,0.5)' : 'transparent'}`,
            color: '#fff',
            fontSize: 14,
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
