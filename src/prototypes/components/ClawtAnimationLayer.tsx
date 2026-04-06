import { useEffect, useMemo } from 'react'

interface AnimationDebugState {
  title?: string
  detail?: string
}

interface ClawtAnimationLayerProps {
  animationFile: string
  onDebugChange?: (debug: AnimationDebugState | null) => void
}

export function ClawtAnimationLayer({ animationFile, onDebugChange }: ClawtAnimationLayerProps) {
  const src = useMemo(() => {
    const sep = animationFile.includes('?') ? '&' : '?'
    return `${animationFile}${sep}v=${Date.now()}`
  }, [animationFile])

  useEffect(() => {
    if (!onDebugChange) return

    const handleMessage = (event: MessageEvent) => {
      const data = event.data
      if (!data || typeof data !== 'object') return
      if (data.type !== 'musik-nacht:animation-debug') return
      onDebugChange({
        title: typeof data.title === 'string' ? data.title : undefined,
        detail: typeof data.detail === 'string' ? data.detail : undefined,
      })
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onDebugChange])

  return (
    <iframe
      src={src}
      title="clawd animation"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        border: 'none',
        pointerEvents: 'none',
      }}
      sandbox="allow-scripts"
    />
  )
}
