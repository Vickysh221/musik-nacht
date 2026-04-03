import { useMuseumSceneStore } from '../../store/useMuseumSceneStore'
import type { BotSceneConfig } from '../../data/botSceneMap'

interface BotPlayerPanelProps {
  config: BotSceneConfig
}

export function BotPlayerPanel({ config }: BotPlayerPanelProps) {
  const songs           = useMuseumSceneStore((s) => s.songs)
  const selectedSongId  = useMuseumSceneStore((s) => s.selectedSongId)
  const playback        = useMuseumSceneStore((s) => s.playback)
  const playSelectedSong= useMuseumSceneStore((s) => s.playSelectedSong)
  const pausePlayback   = useMuseumSceneStore((s) => s.pausePlayback)
  const playerBusy      = useMuseumSceneStore((s) => s.playerBusy)
  const playerHint      = useMuseumSceneStore((s) => s.playerHint)

  const selectedSong = songs.find((s) => s.id === selectedSongId) ?? null
  const isPlaying    = playback.status === 'playing'
  // Consider "this bot is active" only when the store's selected song matches
  const isCurrentBot =
    selectedSong !== null &&
    selectedSong.originalId === config.originalSongId

  const handleToggle = async () => {
    if (playerBusy) return
    if (isPlaying) await pausePlayback()
    else await playSelectedSong()
  }

  // Always show the bot's own song meta; cover only when store has the match
  const displayTitle  = config.songTitle
  const displayArtist = config.artist
  const coverUrl      = isCurrentBot ? (selectedSong?.coverImgUrl ?? null) : null

  const accent = config.colorAccent

  const dur = playback.duration ?? (selectedSong?.duration ? selectedSong.duration / 1000 : 0)
  const prog = playback.progress ?? 0
  const progressPct = dur > 0 ? Math.min(1, prog / dur) * 100 : 0

  return (
    <div
      style={{
        position: 'fixed',
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '12px 16px 12px 12px',
        borderRadius: 16,
        background: 'rgba(0,0,0,0.58)',
        border: `1px solid ${isCurrentBot ? accent : 'rgba(255,255,255,0.08)'}`,
        boxShadow: isCurrentBot
          ? `0 0 20px 2px ${accent}38, 0 8px 32px rgba(0,0,0,0.5)`
          : '0 4px 20px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(14px)',
        fontFamily: 'Inter, ui-sans-serif, sans-serif',
        transition: 'border-color 0.3s, box-shadow 0.3s',
        ...config.playerPosition,
      }}
    >
      {/* Album cover */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 10,
          overflow: 'hidden',
          flexShrink: 0,
          background: '#0a0a14',
          border: `1.5px solid ${accent}44`,
          position: 'relative',
        }}
      >
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={displayTitle}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            loading="lazy"
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              color: `${accent}88`,
            }}
          >
            ♪
          </div>
        )}
        {/* Spinning ring when playing */}
        {isPlaying && isCurrentBot && (
          <div
            style={{
              position: 'absolute',
              inset: -3,
              borderRadius: 13,
              border: `2px solid transparent`,
              borderTopColor: accent,
              animation: 'botCoverSpin 2.4s linear infinite',
            }}
          />
        )}
      </div>

      {/* Info + progress */}
      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: '#f0eeff',
            lineHeight: 1.25,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: 180,
          }}
        >
          {displayTitle}
        </div>
        <div
          style={{
            fontSize: 11,
            color: `${accent}cc`,
            marginTop: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: 180,
          }}
        >
          {config.botRole}  ·  {displayArtist}
        </div>

        {/* Progress bar */}
        <div
          style={{
            marginTop: 8,
            height: 2,
            borderRadius: 2,
            background: 'rgba(255,255,255,0.1)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progressPct}%`,
              background: accent,
              borderRadius: 2,
              transition: 'width 0.3s linear',
            }}
          />
        </div>
      </div>

      {/* Play / Pause button */}
      <button
        type="button"
        onClick={() => void handleToggle()}
        disabled={playerBusy}
        title={isPlaying ? '暂停' : '播放'}
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: `1.5px solid ${accent}66`,
          background: isPlaying ? `${accent}22` : `${accent}44`,
          color: accent,
          fontSize: 16,
          cursor: playerBusy ? 'wait' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'background 0.2s, box-shadow 0.2s',
          boxShadow: isPlaying ? `0 0 12px 2px ${accent}55` : 'none',
        }}
      >
        {isPlaying ? '⏸' : '▶'}
      </button>

      {/* Status hint */}
      {playerHint && (
        <div
          style={{
            position: 'absolute',
            bottom: -22,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontSize: 10,
            color: 'rgba(255,255,255,0.3)',
            fontFamily: 'Courier New, monospace',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {playerHint}
        </div>
      )}

      <style>{`
        @keyframes botCoverSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
