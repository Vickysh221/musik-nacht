import { Html } from '@react-three/drei'
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import { useMuseumSceneStore } from '../../store/useMuseumSceneStore'

const LABEL_COLORS = [
  '#c2410c', '#0369a1', '#047857', '#7c3aed',
  '#b45309', '#be123c', '#0f766e', '#4338ca',
  '#a21caf', '#0e7490', '#65a30d', '#dc2626',
]

// Single vinyl hotspot — no shelf geometry, just a glowing interactive disc
function VinylHotspot({
  song,
  isSelected,
  onSelect,
  colorIndex,
}: {
  song: { id: string; name: string }
  isSelected: boolean
  onSelect: () => void
  colorIndex: number
}) {
  const [hovered, setHovered] = useState(false)
  const discRef = useRef<Mesh>(null)
  const accentColor = LABEL_COLORS[colorIndex % LABEL_COLORS.length]

  useFrame((_, delta) => {
    if (discRef.current && isSelected) {
      discRef.current.rotation.z -= delta * 1.2
    }
  })

  const active = hovered || isSelected

  return (
    <group
      onClick={onSelect}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Glowing disc */}
      <mesh ref={discRef} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.28, 40]} />
        <meshStandardMaterial
          color={isSelected ? '#1a0a2e' : '#0d0d0d'}
          emissive={isSelected ? accentColor : active ? '#2a2a2a' : '#111111'}
          emissiveIntensity={isSelected ? 0.9 : active ? 0.35 : 0.05}
          transparent
          opacity={active ? 0.92 : 0.65}
        />
      </mesh>

      {/* Center dot */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.07, 24]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={isSelected ? 1.5 : active ? 0.6 : 0.15}
        />
      </mesh>

      {/* Song name — show on hover or selection */}
      {active && (
        <Html
          transform
          distanceFactor={2.5}
          position={[0.45, 0.15, 0]}
          center={false}
        >
          <div
            style={{
              fontSize: 10,
              fontFamily: 'Inter, ui-sans-serif, sans-serif',
              color: isSelected ? '#c4b5fd' : '#e7e5e4',
              background: isSelected
                ? 'rgba(76,29,149,0.9)'
                : 'rgba(15,15,15,0.85)',
              padding: '3px 8px',
              borderRadius: 6,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              border: `1px solid ${isSelected ? '#7c3aed55' : 'rgba(255,255,255,0.1)'}`,
            }}
          >
            {song.name.length > 14 ? `${song.name.slice(0, 14)}…` : song.name}
          </div>
        </Html>
      )}
    </group>
  )
}

// Grid layout: 4 cols × 3 rows spread across the left-shelf area of the reference image
// Positions are in local space of the VinylShelfZone group
const COLS = 4
const ROWS = 3
const SPACING_X = 0.72  // spread along Z axis (depth = left-right on screen for isometric)
const SPACING_Y = 0.78  // spread along Y axis (height)

export function VinylShelfZone() {
  const songs = useMuseumSceneStore((state) => state.songs)
  const selectedSongId = useMuseumSceneStore((state) => state.selectedSongId)
  const selectSong = useMuseumSceneStore((state) => state.selectSong)

  const visibleSongs = songs.filter((song) => song.visible).slice(0, COLS * ROWS)

  return (
    // Positioned on the left side to align with the bookcase in the reference image.
    // x=-5.5: left side  z=-1: roughly mid-depth  y=0: floor level (offset by parent group)
    // Tune x/z/y until discs land on the shelf in your background image.
    <group name="VinylShelfZone" position={[-5.5, 0, -1.0]}>
      {visibleSongs.map((song, index) => {
        const col = index % COLS
        const row = Math.floor(index / COLS)
        // Spread cols along Z (depth axis → shows as left-right spread in isometric view)
        const z = (col - (COLS - 1) / 2) * SPACING_X
        const y = 0.4 + row * SPACING_Y

        return (
          <group key={song.id} position={[0, y, z]}>
            <VinylHotspot
              song={song}
              isSelected={song.id === selectedSongId}
              onSelect={() => selectSong(song.id)}
              colorIndex={index}
            />
          </group>
        )
      })}
    </group>
  )
}
