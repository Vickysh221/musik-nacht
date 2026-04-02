export type Song = {
  id: string
  originalId: number
  name: string
  duration: number
  artistIds: string[]
  albumId: string | null
  coverImgUrl: string | null
  liked: boolean
  visible: boolean
  maxBrLevel: string | null
  plLevel: string | null
  dlLevel: string | null
  genreTags?: string[]
  moodTags?: string[]
}

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

export type Agent = {
  id: string
  name: string
  persona: string
  tasteTags: string[]
  favoriteSongIds: string[]
  favoriteArtistIds: string[]
  color: string
  activityPattern?: string | null
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

export type Edge = {
  source: string
  target: string
  type:
    | 'performed_by'
    | 'belongs_to_album'
    | 'album_by_artist'
    | 'same_artist'
    | 'same_album'
    | 'requested'
    | 'featured'
    | 'attended'
  weight: number
}
