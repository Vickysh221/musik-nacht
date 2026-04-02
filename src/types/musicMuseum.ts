import type { Agent, RelationEdge, Song } from './museum'

export type Artist = {
  id: string
  originalId: number
  name: string
  coverImgUrl: string | null
}

export type Album = {
  id: string
  originalId: number
  name: string
  coverImgUrl: string | null
  artistIds: string[]
}

export type Event = {
  id: string
  type: 'listening_session' | 'sharing_session'
  title: string
  description: string
  date: string
  agentIds: string[]
  songIds: string[]
  themeTags?: string[]
}

export type { Song, Agent }
export type Edge = RelationEdge
