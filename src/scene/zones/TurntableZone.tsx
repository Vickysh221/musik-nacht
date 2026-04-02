import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import type { Mesh } from 'three'
import { useMuseumSceneStore } from '../../store/useMuseumSceneStore'
import { NowPlayingScreen } from '../overlays/NowPlayingScreen'

/**
 * Visual only — no click handlers.
 * Play/pause is handled by SceneOverlay (HTML layer).
 * Positioned at the DJ desk area of the reference image.
 * Adjust z to move higher/lower in the scene.
 */
export function TurntableZone() {
  const recordRef = useRef<Mesh>(null)
  const playback = useMuseumSceneStore((state) => state.playback)
  const refreshPlayerState = useMuseumSceneStore((state) => state.refreshPlayerState)

  const isPlaying = playback.status === 'playing'

  useEffect(() => {
    void refreshPlayerState()
  }, [refreshPlayerState])

  useFrame((_, delta) => {
    if (recordRef.current && isPlaying) {
      recordRef.current.rotation.y += delta * 1.8
    }
  })

  return (
    // z=-3.5 puts this in the back-center area (DJ desk position).
    // Adjust z here if the NowPlaying panel drifts off the desk.
    <group name="TurntableZone" position={[0, 0, -3.5]}>
      {/* Spinning vinyl disc — purely decorative */}
      <mesh ref={recordRef} position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 0.04, 48]} />
        <meshStandardMaterial
          color="#0a0a14"
          emissive={isPlaying ? '#4c1d95' : '#1a0a2e'}
          emissiveIntensity={isPlaying ? 0.6 : 0.1}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Center label */}
      <mesh position={[0, 0.64, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.02, 32]} />
        <meshStandardMaterial
          color={isPlaying ? '#7c3aed' : '#3b1f6a'}
          emissive={isPlaying ? '#a78bfa' : '#4c1d95'}
          emissiveIntensity={isPlaying ? 1.2 : 0.3}
        />
      </mesh>

      <NowPlayingScreen />
    </group>
  )
}
