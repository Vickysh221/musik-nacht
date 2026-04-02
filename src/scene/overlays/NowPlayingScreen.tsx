import { Html } from '@react-three/drei'
import { useMemo } from 'react'
import { useMuseumSceneStore } from '../../store/useMuseumSceneStore'

const statusLabel: Record<string, string> = {
  playing: '播放中',
  paused: '已暂停',
  stopped: '已停止',
}

const formatDuration = (ms?: number) => {
  if (!ms) return '0:00'
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

export function NowPlayingScreen() {
  const songs = useMuseumSceneStore((state) => state.songs)
  const selectedSongId = useMuseumSceneStore((state) => state.selectedSongId)
  const playback = useMuseumSceneStore((state) => state.playback)
  const playerHint = useMuseumSceneStore((state) => state.playerHint)
  const playerBusy = useMuseumSceneStore((state) => state.playerBusy)
  const libraryBusy = useMuseumSceneStore((state) => state.libraryBusy)
  const selectNextSong = useMuseumSceneStore((state) => state.selectNextSong)
  const loadRandomPlayableFavorites = useMuseumSceneStore(
    (state) => state.loadRandomPlayableFavorites,
  )

  const selectedSong = useMemo(() => songs.find((song) => song.id === selectedSongId) ?? songs[0], [songs, selectedSongId])

  if (!selectedSong) return null

  return (
    <Html transform occlude distanceFactor={1.2} position={[0, 2.35, 1.05]}>
      <div
        style={{
          width: 280,
          borderRadius: 18,
          padding: '14px 16px',
          background: 'rgba(18, 18, 20, 0.92)',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
          fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
        }}
      >
        <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>Now Playing</div>
        <div style={{ marginTop: 8, fontSize: 20, fontWeight: 800, lineHeight: 1.2 }}>{selectedSong.name}</div>
        <div style={{ marginTop: 6, fontSize: 12, color: 'rgba(255,255,255,0.72)' }}>
          originalId {selectedSong.originalId} · {formatDuration(selectedSong.duration)}
        </div>
        <div style={{ marginTop: 10, display: 'inline-flex', borderRadius: 999, padding: '5px 10px', background: 'rgba(245,158,11,0.16)', color: '#fbbf24', fontSize: 11, fontWeight: 700 }}>
          {statusLabel[playback.status] ?? playback.status}
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={() => void selectNextSong()}
            disabled={playerBusy || songs.length <= 1}
            style={{
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 999,
              padding: '8px 12px',
              background: playerBusy || songs.length <= 1 ? 'rgba(255,255,255,0.06)' : '#f59e0b',
              color: playerBusy || songs.length <= 1 ? 'rgba(255,255,255,0.42)' : '#111827',
              fontSize: 12,
              fontWeight: 800,
              cursor: playerBusy || songs.length <= 1 ? 'default' : 'pointer',
            }}
          >
            切换歌曲
          </button>
          <button
            type="button"
            onClick={() => void loadRandomPlayableFavorites(12)}
            disabled={libraryBusy}
            style={{
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 999,
              padding: '8px 12px',
              background: libraryBusy ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.12)',
              color: libraryBusy ? 'rgba(255,255,255,0.42)' : '#f9fafb',
              fontSize: 12,
              fontWeight: 800,
              cursor: libraryBusy ? 'default' : 'pointer',
            }}
          >
            刷新列表
          </button>
        </div>
        <div style={{ marginTop: 10, fontSize: 11, lineHeight: 1.5, color: 'rgba(255,255,255,0.62)' }}>{playerHint}</div>
      </div>
    </Html>
  )
}
