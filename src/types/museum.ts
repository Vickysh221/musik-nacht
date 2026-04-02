export type PlaybackStatus = 'playing' | 'paused' | 'stopped'

export type FocusZone =
  | 'overview'
  | 'turntable'
  | 'shelf'
  | 'context-wall'
  | 'agent-corner'

export type RelationEdgeType =
  | 'performed_by'
  | 'belongs_to_album'
  | 'album_by_artist'
  | 'same_artist'
  | 'same_album'
  | 'requested'
  | 'featured'
  | 'attended'

export interface Song {
  id: string
  originalId: number
  name: string
  duration: number
  artistIds: string[]
  artistNames?: string[]
  albumId: string | null
  coverImgUrl: string | null
  liked: boolean
  visible: boolean
  maxBrLevel: string | null
  plLevel: string | null
  dlLevel: string | null
  genreTags?: string[]
  moodTags?: string[]
  playable?: boolean
}

export interface Agent {
  id: string
  name: string
  persona: string
  tasteTags: string[]
  favoriteSongIds: string[]
  favoriteArtistIds: string[]
  color: string
  activityPattern?: string | null
  selectionBrief?: string
  preferenceNotes?: string[]
}

export interface AgentSelection {
  agentId: string
  songId: string
  score: number
  reason: string
}

export interface PlaybackState {
  status: PlaybackStatus
  currentSongId: string | null
  progress?: number
  duration?: number
  volume?: number | null
  source?: 'local-bridge' | 'mock'
}

export interface RelationEdge {
  source: string
  target: string
  type: RelationEdgeType
  weight: number
}
