import { useEffect } from 'react'
import { useMuseumSceneStore } from '../store/useMuseumSceneStore'
import type { BotSceneConfig } from '../data/botSceneMap'
import { ClawtAnimationLayer } from './components/ClawtAnimationLayer'
import { BotLyricsLayer } from './components/BotLyricsLayer'
import { BotPlayerPanel } from './components/BotPlayerPanel'

interface BotScenePrototypeProps {
  config: BotSceneConfig
}

export function BotScenePrototype({ config }: BotScenePrototypeProps) {
  const songs      = useMuseumSceneStore((s) => s.songs)
  const selectSong = useMuseumSceneStore((s) => s.selectSong)

  // On mount (or when config changes), select the matching song in the store
  useEffect(() => {
    const match = songs.find((s) => s.originalId === config.originalSongId)
    if (match) selectSong(match.id)
  }, [config.originalSongId, songs, selectSong])

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: config.colorBg,
        overflow: 'hidden',
      }}
    >
      {/* Layer 1 — Clawd animation (iframe, full bleed) */}
      <ClawtAnimationLayer animationFile={config.animationFile} />

      {/* Layer 2 — Floating lyrics (transparent, no card) */}
      <BotLyricsLayer config={config} />

      {/* Layer 3 — Mini player panel */}
      <BotPlayerPanel config={config} />

      {/* Bot role badge (top-left) */}
      <div
        style={{
          position: 'fixed',
          top: 24,
          left: 28,
          zIndex: 70,
          padding: '5px 12px',
          borderRadius: 999,
          background: 'rgba(0,0,0,0.45)',
          border: `1px solid ${config.colorAccent}44`,
          color: config.colorAccent,
          fontSize: 11,
          fontFamily: 'Courier New, monospace',
          letterSpacing: '0.06em',
          backdropFilter: 'blur(8px)',
          pointerEvents: 'none',
        }}
      >
        {config.botRole}
      </div>
    </div>
  )
}
