import { create } from 'zustand'
import { agents, edges, songs } from '../data/neteaseData'
import type { Agent, FocusZone, PlaybackState, RelationEdge, Song } from '../types/museum'

type MuseumSceneStore = {
  songs: Song[]
  agents: Agent[]
  edges: RelationEdge[]
  selectedSongId: string | null
  playback: PlaybackState
  focusZone: FocusZone
  hoveredRecordId: string | null
  activeAgentId: string | null
  playerHint: string
  playerBusy: boolean
  setSongs: (nextSongs: Song[]) => void
  setAgents: (nextAgents: Agent[]) => void
  setEdges: (nextEdges: RelationEdge[]) => void
  selectSong: (songId: string | null) => void
  setPlayback: (patch: Partial<PlaybackState>) => void
  setFocusZone: (zone: FocusZone) => void
  setHoveredRecord: (recordId: string | null) => void
  setActiveAgent: (agentId: string | null) => void
  refreshPlayerState: () => Promise<void>
  playSelectedSong: () => Promise<void>
  pausePlayback: () => Promise<void>
  stopPlayback: () => Promise<void>
}

const initialPlayback: PlaybackState = {
  status: 'stopped',
  currentSongId: songs[0]?.id ?? null,
  progress: 0,
  duration: songs[0]?.duration ? songs[0].duration / 1000 : 0,
  volume: null,
  source: 'mock',
}

export const useMuseumSceneStore = create<MuseumSceneStore>((set, get) => ({
  songs,
  agents,
  edges,
  selectedSongId: songs[0]?.id ?? null,
  playback: initialPlayback,
  focusZone: 'turntable',
  hoveredRecordId: null,
  activeAgentId: null,
  playerHint: '本地播放器待命中',
  playerBusy: false,
  setSongs: (nextSongs) => set({ songs: nextSongs }),
  setAgents: (nextAgents) => set({ agents: nextAgents }),
  setEdges: (nextEdges) => set({ edges: nextEdges }),
  selectSong: (songId) =>
    set((state) => {
      const nextSong = state.songs.find((song) => song.id === songId) ?? null
      return {
        selectedSongId: songId,
        playback: {
          ...state.playback,
          currentSongId: songId,
          duration: nextSong?.duration ? nextSong.duration / 1000 : state.playback.duration,
        },
      }
    }),
  setPlayback: (patch) => set((state) => ({ playback: { ...state.playback, ...patch } })),
  setFocusZone: (zone) => set({ focusZone: zone }),
  setHoveredRecord: (recordId) => set({ hoveredRecordId: recordId }),
  setActiveAgent: (agentId) => set({ activeAgentId: agentId }),
  refreshPlayerState: async () => {
    try {
      const response = await fetch('/api/player/state')
      const result = await response.json()
      if (result?.state) {
        set((state) => ({
          playback: {
            ...state.playback,
            status: result.state.status ?? state.playback.status,
            progress: result.state.position ?? state.playback.progress,
            volume: result.state.volume ?? state.playback.volume,
            source: 'local-bridge',
          },
          playerHint: result.state.title ? `本地播放中：${result.state.title}` : `本地播放器状态：${result.state.status ?? 'unknown'}`,
        }))
      }
    } catch {
      set({ playerHint: '未连上本地 player bridge' })
    }
  },
  playSelectedSong: async () => {
    const state = get()
    const selectedSong = state.songs.find((song) => song.id === state.selectedSongId)
    if (!selectedSong) return

    set({ playerBusy: true, playerHint: `尝试播放：${selectedSong.name}` })

    try {
      const response = await fetch('/api/player/play', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ encryptedId: selectedSong.id, originalId: selectedSong.originalId }),
      })
      const result = await response.json()

      set((current) => ({
        playback: {
          ...current.playback,
          status: response.ok ? 'playing' : current.playback.status,
          currentSongId: selectedSong.id,
          duration: selectedSong.duration / 1000,
          source: 'local-bridge',
        },
        playerHint: result?.message ?? result?.raw ?? `已发送播放请求：${selectedSong.name}`,
      }))

      window.setTimeout(() => {
        void get().refreshPlayerState()
      }, 1500)
    } catch {
      set({ playerHint: '播放请求失败：未连上本地 bridge' })
    } finally {
      set({ playerBusy: false })
    }
  },
  pausePlayback: async () => {
    set({ playerBusy: true })
    try {
      await fetch('/api/player/pause', { method: 'POST' })
      set((state) => ({
        playback: { ...state.playback, status: 'paused', source: 'local-bridge' },
        playerHint: '已发送暂停命令',
      }))
      window.setTimeout(() => {
        void get().refreshPlayerState()
      }, 800)
    } catch {
      set({ playerHint: '暂停失败：未连上本地 bridge' })
    } finally {
      set({ playerBusy: false })
    }
  },
  stopPlayback: async () => {
    set({ playerBusy: true })
    try {
      await fetch('/api/player/stop', { method: 'POST' })
      set((state) => ({
        playback: { ...state.playback, status: 'stopped', progress: 0, source: 'local-bridge' },
        playerHint: '已发送停止命令',
      }))
      window.setTimeout(() => {
        void get().refreshPlayerState()
      }, 800)
    } catch {
      set({ playerHint: '停止失败：未连上本地 bridge' })
    } finally {
      set({ playerBusy: false })
    }
  },
}))
