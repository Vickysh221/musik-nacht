import { useEffect, useRef, useState } from 'react'
import { useMuseumSceneStore } from '../store/useMuseumSceneStore'
import type { BotSceneConfig } from '../data/botSceneMap'
import { ClawtAnimationLayer } from './components/ClawtAnimationLayer'
import { BotLyricsLayer } from './components/BotLyricsLayer'
import { BotPlayerPanel } from './components/BotPlayerPanel'
import { BotDebugPanel } from './components/BotDebugPanel'

interface BotScenePrototypeProps {
  config: BotSceneConfig
}

export function BotScenePrototype({ config }: BotScenePrototypeProps) {
  const selectSong = useMuseumSceneStore((s) => s.selectSong)
  const upsertSongs = useMuseumSceneStore((s) => s.upsertSongs)
  const playSelectedSong = useMuseumSceneStore((s) => s.playSelectedSong)
  const autoplayRef = useRef<string | null>(null)
  const [animationDebug, setAnimationDebug] = useState<{ title?: string; detail?: string } | null>(null)

  useEffect(() => {
    const song = config.resolvedSong
    if (!song) return

    upsertSongs([song])
    selectSong(song.id)

    if (autoplayRef.current === config.botId) return
    autoplayRef.current = config.botId
    void playSelectedSong(song.id)
  }, [config.botId, config.resolvedSong, playSelectedSong, selectSong, upsertSongs])

  useEffect(() => {
    setAnimationDebug(null)
  }, [config.botId])

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
      <ClawtAnimationLayer animationFile={config.animationFile} onDebugChange={setAnimationDebug} />

      {/* Layer 2 — Floating lyrics (transparent, no card) */}
      <BotLyricsLayer config={config} />

      {/* Layer 3 — Mini player panel */}
      <BotPlayerPanel config={config} />

      <BotDebugPanel config={config} animationDebug={animationDebug} />

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
