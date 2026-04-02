import { create } from 'zustand'
import { agentProfiles } from '../data/agentProfiles'
import { agents, edges, songs } from '../data/neteaseData'
import type { Agent, AgentPickDecision, FocusZone, PlaybackState, RelationEdge, Song } from '../types/museum'
import { buildNightlySelections, enrichSong } from './agentSelection'

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
  libraryHint: string
  libraryBusy: boolean
  nightlyPool: Song[]
  agentDecisions: AgentPickDecision[]
  activeVisitorIds: string[]
  visitorRefreshCount: number
  setSongs: (nextSongs: Song[]) => void
  setAgents: (nextAgents: Agent[]) => void
  setEdges: (nextEdges: RelationEdge[]) => void
  selectSong: (songId: string | null) => void
  setPlayback: (patch: Partial<PlaybackState>) => void
  setFocusZone: (zone: FocusZone) => void
  setHoveredRecord: (recordId: string | null) => void
  setActiveAgent: (agentId: string | null) => void
  selectNextSong: () => Promise<void>
  refreshPlayerState: () => Promise<void>
  loadRandomPlayableFavorites: (count?: number) => Promise<void>
  runNightVisitorSelection: () => void
  playSelectedSong: () => Promise<void>
  pausePlayback: () => Promise<void>
  stopPlayback: () => Promise<void>
}

const hydrateAgents = (sourceAgents: Agent[]) =>
  sourceAgents.map((agent) => ({
    ...agent,
    preferenceProfile: agent.preferenceProfile ?? agentProfiles[agent.id],
  }))

const hydrateSongs = (sourceSongs: Song[]) => sourceSongs.map((song) => enrichSong(song))

const hydratedAgents = hydrateAgents(agents)
const hydratedSongs = hydrateSongs(songs)

const initialSelection = buildNightlySelections(hydratedSongs, hydratedAgents)

const initialPlayback: PlaybackState = {
  status: 'stopped',
  currentSongId: initialSelection.recommendedSongId ?? hydratedSongs[0]?.id ?? null,
  progress: 0,
  duration: hydratedSongs[0]?.duration ? hydratedSongs[0].duration / 1000 : 0,
  volume: null,
  source: 'mock',
}

export const useMuseumSceneStore = create<MuseumSceneStore>((set, get) => ({
  songs: hydratedSongs,
  agents: hydratedAgents,
  edges,
  selectedSongId: initialSelection.recommendedSongId ?? hydratedSongs[0]?.id ?? null,
  playback: initialPlayback,
  focusZone: 'turntable',
  hoveredRecordId: null,
  activeAgentId: initialSelection.agentDecisions[0]?.agentId ?? null,
  playerHint: '本地播放器待命中',
  playerBusy: false,
  libraryHint: '当前展示静态样本，可切换到网易云红心随机 12 首',
  libraryBusy: false,
  nightlyPool: initialSelection.nightlyPool,
  agentDecisions: initialSelection.agentDecisions,
  activeVisitorIds: initialSelection.activeVisitorIds,
  visitorRefreshCount: 0,
  setSongs: (nextSongs) => set({ songs: hydrateSongs(nextSongs) }),
  setAgents: (nextAgents) => set({ agents: hydrateAgents(nextAgents) }),
  setEdges: (nextEdges) => set({ edges: nextEdges }),
  selectSong: (songId) =>
    set((state) => {
      const nextSong = state.songs.find((song) => song.id === songId) ?? null
      const matchingDecision = state.agentDecisions.find((decision) => decision.songId === songId) ?? null
      return {
        selectedSongId: songId,
        activeAgentId: matchingDecision?.agentId ?? state.activeAgentId,
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
  selectNextSong: async () => {
    const state = get()
    const totalSongs = state.songs.length

    if (totalSongs === 0) return

    const currentIndex = state.songs.findIndex((song) => song.id === state.selectedSongId)
    const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % totalSongs : 0
    const nextSong = state.songs[nextIndex]

    if (!nextSong) return

    state.selectSong(nextSong.id)

    if (state.playback.status === 'playing') {
      await get().playSelectedSong()
      return
    }

    set({
      playerHint: `已切换到：${nextSong.name}`,
    })
  },
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
  loadRandomPlayableFavorites: async (count = 12) => {
    set({ libraryBusy: true, libraryHint: '正在从网易云红心歌单随机取样…' })
    try {
      const response = await fetch(`/api/library/random-liked-playable?count=${count}`)
      const result = await response.json()

      if (!response.ok || !Array.isArray(result?.songs)) {
        throw new Error(result?.message ?? '加载网易云红心歌曲失败')
      }

      const nextSongs = hydrateSongs(result.songs as Song[])
      const nightlySelection = buildNightlySelections(nextSongs, get().agents)
      const firstSong = nextSongs[0] ?? null

      set((state) => ({
        songs: nextSongs,
        nightlyPool: nightlySelection.nightlyPool,
        agentDecisions: nightlySelection.agentDecisions,
        activeVisitorIds: nightlySelection.activeVisitorIds,
        visitorRefreshCount: 0,
        activeAgentId: nightlySelection.agentDecisions[0]?.agentId ?? state.activeAgentId,
        selectedSongId: nightlySelection.recommendedSongId ?? firstSong?.id ?? state.selectedSongId,
        playback: {
          ...state.playback,
          currentSongId: nightlySelection.recommendedSongId ?? firstSong?.id ?? state.playback.currentSongId,
          duration:
            (nextSongs.find((song) => song.id === nightlySelection.recommendedSongId) ?? firstSong)?.duration
              ? ((nextSongs.find((song) => song.id === nightlySelection.recommendedSongId) ?? firstSong)?.duration ?? 0) / 1000
              : state.playback.duration,
        },
        libraryHint: `已载入网易云红心可播歌曲 ${nextSongs.length} 首，可播总数 ${result.totalPlayableFavorites ?? nextSongs.length}；今晚来访 ${nightlySelection.activeVisitorIds.length} 位`,
      }))
    } catch (error) {
      set({
        libraryHint: error instanceof Error ? error.message : '加载网易云红心歌曲失败',
      })
    } finally {
      set({ libraryBusy: false })
    }
  },
  runNightVisitorSelection: () => {
    const state = get()
    const nextRefreshCount = state.visitorRefreshCount + 1
    const nightlySelection = buildNightlySelections(state.songs, state.agents, nextRefreshCount)
    set((current) => ({
      nightlyPool: nightlySelection.nightlyPool,
      agentDecisions: nightlySelection.agentDecisions,
      activeVisitorIds: nightlySelection.activeVisitorIds,
      visitorRefreshCount: nextRefreshCount,
      activeAgentId: nightlySelection.agentDecisions[0]?.agentId ?? current.activeAgentId,
      selectedSongId: nightlySelection.recommendedSongId ?? current.selectedSongId,
      playback: {
        ...current.playback,
        currentSongId: nightlySelection.recommendedSongId ?? current.playback.currentSongId,
      },
      libraryHint: `访客偏好已刷新第 ${nextRefreshCount} 轮，今晚来访 ${nightlySelection.activeVisitorIds.length} 位`,
    }))
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
