interface ClawtAnimationLayerProps {
  animationFile: string
}

export function ClawtAnimationLayer({ animationFile }: ClawtAnimationLayerProps) {
  return (
    <iframe
      src={animationFile}
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
