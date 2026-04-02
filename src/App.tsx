import { Canvas } from '@react-three/fiber'
import { MuseumScene } from './scene/MuseumScene'

function App() {
  return (
    <Canvas
      camera={{ fov: 42, position: [0, 4.5, 12] }}
      gl={{ antialias: true }}
      style={{ width: '100vw', height: '100vh' }}
    >
      <color attach="background" args={['#120f12']} />
      <MuseumScene />
    </Canvas>
  )
}

export default App
