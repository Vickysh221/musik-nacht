export interface Song {
  id: string
  title: string
  artist: string
  year: number
  zone: FocusZone
  coverArt?: string
}

export interface Agent {
  id: string
  name: string
  role: string
  focusSongId?: string
}

export interface PlaybackState {
  currentSongId: string | null
  isPlaying: boolean
  progress: number
}

export interface RelationEdge {
  id: string
  sourceId: string
  targetId: string
  label: string
}

export type FocusZone =
  | 'overview'
  | 'turntable'
  | 'shelf'
  | 'context-wall'
  | 'agent-corner'
