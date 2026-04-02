import { OrbitControls } from '@react-three/drei'

export function CameraRig() {
  return (
    <OrbitControls
      enablePan={false}
      enableRotate={false}
      enableZoom={false}
      makeDefault
      target={[0, 0, -1.0]}
    />
  )
}
