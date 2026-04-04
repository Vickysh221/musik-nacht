import { useMemo } from 'react'

interface ClawtAnimationLayerProps {
  animationFile: string
}

export function ClawtAnimationLayer({ animationFile }: ClawtAnimationLayerProps) {
  const src = useMemo(() => {
    const sep = animationFile.includes('?') ? '&' : '?'
    return `${animationFile}${sep}v=${Date.now()}`
  }, [animationFile])

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
