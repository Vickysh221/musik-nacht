import { useMuseumSceneStore } from '../../store/useMuseumSceneStore'
import type { BotSceneConfig } from '../../data/botSceneMap'

interface AnimationDebugState {
  title?: string
  detail?: string
}

interface BotDebugPanelProps {
  config: BotSceneConfig
  animationDebug?: AnimationDebugState | null
}

export function BotDebugPanel({ config, animationDebug }: BotDebugPanelProps) {
  const songs = useMuseumSceneStore((s) => s.songs)
  const playback = useMuseumSceneStore((s) => s.playback)
  const playerHint = useMuseumSceneStore((s) => s.playerHint)

  const actualSong = songs.find((s) => s.id === playback.currentSongId) ?? null
  const actualArtist = actualSong?.artistNames?.join(', ')
  const statusText =
    actualSong && playback.status !== 'stopped'
      ? `${playback.status === 'paused' ? '已暂停' : '实际播放'}：${actualSong.name}${actualArtist ? ` · ${actualArtist}` : ''}`
      : playerHint

  const summaryText = animationDebug?.title || 'debug'

  return (
    <details
      style={{
        position: 'fixed',
        right: 20,
        bottom: 12,
        zIndex: 85,
        fontFamily: 'Courier New, monospace',
        pointerEvents: 'auto',
      }}
    >
      <summary
        style={{
          listStyle: 'none',
          cursor: 'pointer',
          userSelect: 'none',
          padding: '4px 8px',
          borderRadius: 999,
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(0,0,0,0.22)',
          color: 'rgba(255,255,255,0.22)',
          fontSize: 10,
          letterSpacing: '0.06em',
          textAlign: 'right',
          backdropFilter: 'blur(8px)',
        }}
      >
        {summaryText}
      </summary>

      <div
        style={{
          marginTop: 8,
          width: 260,
          padding: '8px 10px',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(0,0,0,0.38)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.22)',
          backdropFilter: 'blur(10px)',
          fontSize: 10,
          lineHeight: 1.5,
          textAlign: 'right',
          color: 'rgba(255,255,255,0.34)',
        }}
      >
        <div style={{ color: 'rgba(255,255,255,0.24)' }}>{config.botId}</div>
        {animationDebug?.title ? (
          <div style={{ marginTop: 4 }}>{animationDebug.title}</div>
        ) : null}
        {animationDebug?.detail ? (
          <div style={{ color: 'rgba(255,255,255,0.28)' }}>{animationDebug.detail}</div>
        ) : null}
        {statusText ? (
          <div style={{ marginTop: 4 }}>{statusText}</div>
        ) : null}
      </div>
    </details>
  )
}
