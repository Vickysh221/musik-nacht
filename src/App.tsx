import { Canvas } from '@react-three/fiber'
import { MuseumScene } from './scene/MuseumScene'
import { SceneOverlay } from './overlay/SceneOverlay'

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#0d1a1a', overflow: 'hidden' }}>
      {/* Background — place the pixel art at public/ref-studio.png */}
      <img
        id="ref-img"
        src="/ref-studio.png"
        alt="studio"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100vw',
          height: 'auto',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      />

      {/* Three.js canvas — NowPlaying panel + spinning disc (pointer-events: none) */}
      <Canvas
        orthographic
        camera={{ zoom: 62, position: [0, 8, 8], near: 0.1, far: 1000 }}
        gl={{ antialias: true, alpha: true }}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        <MuseumScene />
      </Canvas>

      {/* HTML overlay — vinyl tiles, DJ desk button, album card popups */}
      <SceneOverlay />
    </div>
  )
}

export default App
