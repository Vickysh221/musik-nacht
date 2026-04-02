import { Html } from '@react-three/drei'
import { useMemo } from 'react'
import { useMuseumSceneStore } from '../../store/useMuseumSceneStore'

export function ContextWallZone() {
  const songs = useMuseumSceneStore((state) => state.songs)
  const edges = useMuseumSceneStore((state) => state.edges)
  const agents = useMuseumSceneStore((state) => state.agents)
  const selectedSongId = useMuseumSceneStore((state) => state.selectedSongId)

  const selectedSong = useMemo(() => songs.find((song) => song.id === selectedSongId) ?? songs[0], [songs, selectedSongId])
  const relatedEdges = useMemo(
    () => edges.filter((edge) => edge.source.includes(selectedSong?.id ?? '') || edge.target.includes(selectedSong?.id ?? '')).slice(0, 8),
    [edges, selectedSong],
  )
  const relatedAgents = useMemo(
    () => agents.filter((agent) => agent.favoriteSongIds.includes(selectedSong?.id ?? '')).slice(0, 4),
    [agents, selectedSong],
  )

  return (
    <group name="ContextWallZone" position={[4.5, 0, -2.6]}>
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[3.2, 2.1, 0.2]} />
        <meshStandardMaterial color="#d4c6a5" />
      </mesh>
      <mesh position={[0, 0.8, 1.2]}>
        <boxGeometry args={[2.3, 1.6, 0.7]} />
        <meshStandardMaterial color="#38414c" />
      </mesh>

      <Html transform distanceFactor={1.5} position={[0, 1.9, 0.18]}>
        <div
          style={{
            width: 280,
            borderRadius: 18,
            padding: 14,
            background: 'rgba(27, 29, 33, 0.92)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
            fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
          }}
        >
          <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.48)' }}>Context Wall</div>
          <div style={{ marginTop: 10, fontSize: 13, fontWeight: 700 }}>{selectedSong?.name ?? '—'}</div>

          <div style={{ marginTop: 12, fontSize: 11, color: 'rgba(255,255,255,0.58)', textTransform: 'uppercase' }}>Agents</div>
          <div style={{ marginTop: 6, display: 'grid', gap: 6 }}>
            {relatedAgents.length > 0 ? relatedAgents.map((agent) => (
              <div key={agent.id} style={{ fontSize: 12, color: 'rgba(255,255,255,0.82)' }}>{agent.name}</div>
            )) : <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.52)' }}>暂无</div>}
          </div>

          <div style={{ marginTop: 12, fontSize: 11, color: 'rgba(255,255,255,0.58)', textTransform: 'uppercase' }}>Edges</div>
          <div style={{ marginTop: 6, display: 'grid', gap: 6 }}>
            {relatedEdges.length > 0 ? relatedEdges.map((edge, index) => (
              <div key={`${edge.source}-${edge.target}-${index}`} style={{ fontSize: 11, color: 'rgba(255,255,255,0.74)', wordBreak: 'break-all' }}>
                {edge.type}: {edge.source} → {edge.target}
              </div>
            )) : <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.52)' }}>暂无</div>}
          </div>
        </div>
      </Html>
    </group>
  )
}
