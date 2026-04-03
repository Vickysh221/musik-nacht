import { useCallback, useEffect, useState } from 'react'
import { BOT_SCENE_MAP } from '../data/botSceneMap'
import { BotScenePrototype } from './BotScenePrototype'

export function BotPrototypesPage() {
  const [idx, setIdx] = useState(0)
  const total = BOT_SCENE_MAP.length
  const config = BOT_SCENE_MAP[idx]!

  const prev = useCallback(() => setIdx((i) => (i - 1 + total) % total), [total])
  const next = useCallback(() => setIdx((i) => (i + 1) % total), [total])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [prev, next])

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Scene */}
      <BotScenePrototype key={config.botId} config={config} />

      {/* ── Navigation: scene dots ── */}
      <div
        style={{
          position: 'fixed',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 80,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          pointerEvents: 'auto',
        }}
      >
        {BOT_SCENE_MAP.map((scene, i) => (
          <button
            key={scene.botId}
            type="button"
            onClick={() => setIdx(i)}
            title={scene.botRole}
            style={{
              width: i === idx ? 22 : 8,
              height: 8,
              borderRadius: 4,
              border: 'none',
              background:
                i === idx
                  ? config.colorAccent
                  : 'rgba(255,255,255,0.22)',
              cursor: 'pointer',
              padding: 0,
              transition: 'width 0.3s, background 0.3s',
              boxShadow: i === idx ? `0 0 8px ${config.colorAccent}88` : 'none',
            }}
          />
        ))}
      </div>

      {/* ── Navigation: prev / next arrows ── */}
      <button
        type="button"
        onClick={prev}
        style={arrowStyle('left')}
        title="上一个 bot（←）"
        aria-label="上一个 scene"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={next}
        style={arrowStyle('right')}
        title="下一个 bot（→）"
        aria-label="下一个 scene"
      >
        ›
      </button>

      {/* ── Back to museum link ── */}
      <a
        href="/"
        style={{
          position: 'fixed',
          top: 24,
          right: 28,
          zIndex: 80,
          padding: '5px 12px',
          borderRadius: 999,
          background: 'rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,255,255,0.12)',
          color: 'rgba(255,255,255,0.45)',
          fontSize: 11,
          fontFamily: 'Courier New, monospace',
          textDecoration: 'none',
          backdropFilter: 'blur(8px)',
          letterSpacing: '0.05em',
          transition: 'color 0.2s',
        }}
      >
        ← museum
      </a>
    </div>
  )
}

function arrowStyle(side: 'left' | 'right'): React.CSSProperties {
  return {
    position: 'fixed',
    top: '50%',
    [side]: 20,
    transform: 'translateY(-50%)',
    zIndex: 80,
    width: 40,
    height: 56,
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(0,0,0,0.32)',
    color: 'rgba(255,255,255,0.45)',
    fontSize: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backdropFilter: 'blur(8px)',
    transition: 'color 0.2s, background 0.2s',
    lineHeight: 1,
    paddingBottom: 3,
  }
}
