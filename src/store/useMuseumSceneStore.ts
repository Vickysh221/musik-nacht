import { create } from 'zustand'
import { agents } from '../data/agents'
import { edges } from '../data/edges'
import { mockPlayback } from '../data/mockPlayback'
import { songs } from '../data/songs'
import type {
  Agent,
  FocusZone,
  PlaybackState,
  RelationEdge,
  Song,
} from '../types/museum'

type MuseumSceneStore = {
  songs: Song[]
  agents: Agent[]
  edges: RelationEdge[]
  selectedSongId: string | null
  playback: PlaybackState
  focusZone: FocusZone
  hoveredRecordId: string | null
  activeAgentId: string | null
  setSongs: (nextSongs: Song[]) => void
  setAgents: (nextAgents: Agent[]) => void
  setEdges: (nextEdges: RelationEdge[]) => void
  selectSong: (songId: string | null) => void
  setPlayback: (playback: PlaybackState) => void
  setFocusZone: (zone: FocusZone) => void
  setHoveredRecord: (recordId: string | null) => void
  setActiveAgent: (agentId: string | null) => void
}

export const useMuseumSceneStore = create<MuseumSceneStore>((set) => ({
  songs,
  agents,
  edges,
  selectedSongId: songs[0]?.id ?? null,
  playback: mockPlayback,
  focusZone: 'overview',
  hoveredRecordId: null,
  activeAgentId: agents[0]?.id ?? null,
  setSongs: (nextSongs) => set({ songs: nextSongs }),
  setAgents: (nextAgents) => set({ agents: nextAgents }),
  setEdges: (nextEdges) => set({ edges: nextEdges }),
  selectSong: (songId) => set({ selectedSongId: songId }),
  setPlayback: (playback) => set({ playback }),
  setFocusZone: (zone) => set({ focusZone: zone }),
  setHoveredRecord: (recordId) => set({ hoveredRecordId: recordId }),
  setActiveAgent: (agentId) => set({ activeAgentId: agentId }),
}))
