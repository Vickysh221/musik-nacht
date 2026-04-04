import { execFile } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const execFileAsync = promisify(execFile)

type PlayerCommand = 'play' | 'pause' | 'resume' | 'stop' | 'state'

type PlayPayload = {
  encryptedId?: string
  originalId?: number | string
}

async function runNcm(command: PlayerCommand, payload?: PlayPayload) {
  const args: string[] = [command]

  if (command === 'play') {
    if (!payload?.encryptedId || !payload?.originalId) {
      throw new Error('Missing encryptedId/originalId for play command')
    }

    args.push('--song', '--encrypted-id', String(payload.encryptedId), '--original-id', String(payload.originalId), '--output', 'json')
  } else {
    args.push('--output', 'json')
  }

  const { stdout, stderr } = await execFileAsync('ncm-cli', args, {
    timeout: command === 'play' ? 15000 : 8000,
    maxBuffer: 1024 * 1024,
  })

  const output = `${stdout ?? ''}${stderr ?? ''}`.trim()

  try {
    return output ? JSON.parse(output) : { success: true, raw: '' }
  } catch {
    return { success: true, raw: output }
  }
}

type FavoritePlaylistResponse = {
  data?: {
    id?: string
    trackCount?: number
  }
}

type FavoriteTrack = {
  originalId: number
  id: string
  name: string
  duration: number
  fullArtists?: Array<{
    originalId: number
    id: string
    name: string
    coverImgUrl?: string | null
  }>
  album?: {
    originalId?: number
    id?: string
    name?: string
  } | null
  playFlag?: boolean
  liked?: boolean
  coverImgUrl?: string | null
  maxBrLevel?: string | null
  plLevel?: string | null
  dlLevel?: string | null
  visible?: boolean
}

type PlaylistTracksResponse = {
  data?: FavoriteTrack[]
}

type SceneSong = {
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
  playable?: boolean
}

type AlbumDetailResponse = {
  data?: {
    id?: string
    genre?: string | null
    description?: string | null
    briefDesc?: string | null
    language?: string | null
    company?: string | null
    publishTime?: number | null
  }
}

type SongLyricResponse = {
  data?: {
    lyric?: string | null
    transLyric?: string | null
    noLyric?: boolean | null
    pureMusic?: boolean | null
  }
}

type SearchSongResponse = {
  data?: {
    records?: FavoriteTrack[]
  }
}

type BotSongMapEntry = {
  songId: string
  songTitle: string
  artist: string
  botId: string
  botRole: string
  lyricSurface: {
    type: string
    placement: string
    style: string
  }
}

type ResolvedBotSongMapEntry = BotSongMapEntry & {
  resolvedSong: SceneSong | null
}

const FAVORITE_CACHE_TTL_MS = 5 * 60 * 1000
const STYLE_TERMS = [
  'psychedelic',
  'folk',
  'prog-rock',
  'progressive rock',
  'ambient',
  'shoegaze',
  'dream pop',
  'post-rock',
  'krautrock',
  'jazz',
  'fusion',
  'electronic',
  'synth-pop',
  'indie rock',
  'garage rock',
  'acid folk',
  'experimental',
  'neo-psychedelia',
]

let favoriteSongsCache:
  | {
      expiresAt: number
      songs: SceneSong[]
    }
  | undefined

let botSongMapCache:
  | {
      expiresAt: number
      entries: ResolvedBotSongMapEntry[]
    }
  | undefined

const albumMetaCache = new Map<
  string,
  {
    expiresAt: number
    payload: {
      tags: string[]
      language: string | null
      company: string | null
      year: number | null
    }
  }
>()

function asJsonResponse(res: import('node:http').ServerResponse, payload: unknown, statusCode = 200) {
  res.statusCode = statusCode
  res.end(JSON.stringify(payload))
}

function parseJson<T>(value: unknown): T {
  return value as T
}

function shuffle<T>(items: T[]) {
  const next = [...items]
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}

function extractStyleTags(text: string) {
  const lowered = text.toLowerCase()
  return STYLE_TERMS.filter((term) => lowered.includes(term)).slice(0, 6)
}

function toSceneSong(track: FavoriteTrack): SceneSong {
  return {
    id: track.id,
    originalId: track.originalId,
    name: track.name,
    duration: track.duration,
    artistIds: (track.fullArtists ?? []).map((artist) => artist.id),
    artistNames: (track.fullArtists ?? []).map((artist) => artist.name),
    albumId: track.album?.id ?? null,
    coverImgUrl: track.coverImgUrl ?? null,
    liked: Boolean(track.liked),
    visible: track.visible ?? true,
    maxBrLevel: track.maxBrLevel ?? null,
    plLevel: track.plLevel ?? null,
    dlLevel: track.dlLevel ?? null,
    playable: Boolean(track.playFlag),
  }
}

async function loadAlbumMeta(albumId: string) {
  const cached = albumMetaCache.get(albumId)
  if (cached && cached.expiresAt > Date.now()) {
    return cached.payload
  }

  const result = parseJson<AlbumDetailResponse>(
    await execFileAsync(
      'ncm-cli',
      ['album', 'get', '--albumId', albumId, '--descFlag', 'true', '--output', 'json'],
      { timeout: 15000, maxBuffer: 2 * 1024 * 1024 },
    ).then(({ stdout }) => JSON.parse(stdout)),
  )

  const description = `${result.data?.genre ?? ''} ${result.data?.briefDesc ?? ''} ${result.data?.description ?? ''}`.trim()
  const payload = {
    tags: extractStyleTags(description),
    language: result.data?.language ?? null,
    company: result.data?.company ?? null,
    year: result.data?.publishTime ? new Date(result.data.publishTime).getFullYear() : null,
  }

  albumMetaCache.set(albumId, {
    expiresAt: Date.now() + FAVORITE_CACHE_TTL_MS,
    payload,
  })

  return payload
}

async function loadSongLyrics(songId: string) {
  try {
    const result = parseJson<SongLyricResponse>(
      await execFileAsync('ncm-cli', ['song', 'lyric', '--songId', songId, '--output', 'json'], {
        timeout: 15000,
        maxBuffer: 2 * 1024 * 1024,
      }).then(({ stdout }) => JSON.parse(stdout)),
    )

    return {
      lyric: result.data?.lyric ?? null,
      transLyric: result.data?.transLyric ?? null,
      noLyric: Boolean(result.data?.noLyric),
      pureMusic: Boolean(result.data?.pureMusic),
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    const lyricCommandMissing =
      message.includes("unknown command 'song'") ||
      message.includes('Unknown command: song') ||
      message.includes('song lyric')

    if (lyricCommandMissing) {
      return {
        lyric: null,
        transLyric: null,
        noLyric: false,
        pureMusic: false,
      }
    }

    throw error
  }
}

async function resolveBotSong(entry: BotSongMapEntry) {
  const keyword = `${entry.songTitle} ${entry.artist}`.trim()
  const result = parseJson<SearchSongResponse>(
    await execFileAsync('ncm-cli', ['search', 'song', '--keyword', keyword, '--limit', '10', '--output', 'json'], {
      timeout: 15000,
      maxBuffer: 2 * 1024 * 1024,
    }).then(({ stdout }) => JSON.parse(stdout)),
  )

  const targetOriginalId = Number(entry.songId)
  const records = result.data?.records ?? []
  const match =
    records.find((track) => track.originalId === targetOriginalId && track.playFlag && track.id) ??
    records.find((track) => track.originalId === targetOriginalId && track.id) ??
    null

  return match ? toSceneSong(match) : null
}

async function loadBotSongMap() {
  if (botSongMapCache && botSongMapCache.expiresAt > Date.now()) {
    return botSongMapCache.entries
  }

  const source = await readFile(path.resolve(process.cwd(), 'notes/clawd-bot-song-map.json'), 'utf8')
  const entries = parseJson<BotSongMapEntry[]>(JSON.parse(source))
  const resolvedEntries = await Promise.all(
    entries.map(async (entry) => {
      try {
        return {
          ...entry,
          resolvedSong: await resolveBotSong(entry),
        }
      } catch {
        return {
          ...entry,
          resolvedSong: null,
        }
      }
    }),
  )

  botSongMapCache = {
    expiresAt: Date.now() + FAVORITE_CACHE_TTL_MS,
    entries: resolvedEntries,
  }

  return resolvedEntries
}

async function loadFavoritePlayableSongs() {
  if (favoriteSongsCache && favoriteSongsCache.expiresAt > Date.now()) {
    return favoriteSongsCache.songs
  }

  const favorite = parseJson<FavoritePlaylistResponse>(await execFileAsync('ncm-cli', ['user', 'favorite', '--output', 'json'], {
    timeout: 15000,
    maxBuffer: 1024 * 1024,
  }).then(({ stdout }) => JSON.parse(stdout)))

  const playlistId = favorite.data?.id
  const trackCount = favorite.data?.trackCount ?? 0

  if (!playlistId) {
    throw new Error('Favorite playlist id missing from ncm-cli response')
  }

  const pageSize = 500
  const pages = Math.max(1, Math.ceil(trackCount / pageSize))
  const allTracks: FavoriteTrack[] = []

  for (let page = 0; page < pages; page += 1) {
    const offset = page * pageSize
    const tracks = parseJson<PlaylistTracksResponse>(
      await execFileAsync(
        'ncm-cli',
        [
          'playlist',
          'tracks',
          '--playlistId',
          playlistId,
          '--limit',
          String(pageSize),
          '--offset',
          String(offset),
          '--output',
          'json',
        ],
        {
          timeout: 30000,
          maxBuffer: 8 * 1024 * 1024,
        },
      ).then(({ stdout }) => JSON.parse(stdout)),
    )

    allTracks.push(...(tracks.data ?? []))
  }

  const favoriteSongs = allTracks
    .filter((track) => track.liked && track.playFlag && track.id && track.originalId)
    .map<SceneSong>((track) => ({
      ...toSceneSong(track),
      liked: true,
      playable: true,
    }))

  favoriteSongsCache = {
    expiresAt: Date.now() + FAVORITE_CACHE_TTL_MS,
    songs: favoriteSongs,
  }

  return favoriteSongs
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'ncm-local-bridge',
      configureServer(server) {
        server.middlewares.use('/api/player', async (req, res) => {
          res.setHeader('Content-Type', 'application/json; charset=utf-8')

          if (!req.url) {
            res.statusCode = 400
            res.end(JSON.stringify({ success: false, message: 'Missing URL' }))
            return
          }

          const method = req.method ?? 'GET'
          const url = new URL(req.url, 'http://localhost')
          const action = url.pathname.replace(/^\//, '') || 'state'

          try {
            if (method === 'GET' && action === 'state') {
              const result = await runNcm('state')
              res.end(JSON.stringify(result))
              return
            }

            if (method !== 'POST') {
              res.statusCode = 405
              res.end(JSON.stringify({ success: false, message: 'Method not allowed' }))
              return
            }

            let body = ''
            for await (const chunk of req) {
              body += chunk
            }
            const payload = body ? (JSON.parse(body) as PlayPayload) : undefined

            if (action === 'play') {
              const result = await runNcm('play', payload)
              if (result?.success === false) {
                res.statusCode = 502
              }
              res.end(JSON.stringify(result))
              return
            }

            if (action === 'pause' || action === 'resume' || action === 'stop') {
              const result = await runNcm(action)
              if (result?.success === false) {
                res.statusCode = 502
              }
              res.end(JSON.stringify(result))
              return
            }

            res.statusCode = 404
            res.end(JSON.stringify({ success: false, message: `Unknown action: ${action}` }))
          } catch (error) {
            res.statusCode = 500
            res.end(
              JSON.stringify({
                success: false,
                message: error instanceof Error ? error.message : 'Unknown bridge error',
              }),
            )
          }
        })
        server.middlewares.use('/api/library', async (req, res) => {
          res.setHeader('Content-Type', 'application/json; charset=utf-8')

          if (!req.url) {
            asJsonResponse(res, { success: false, message: 'Missing URL' }, 400)
            return
          }

          const method = req.method ?? 'GET'
          const url = new URL(req.url, 'http://localhost')
          const action = url.pathname.replace(/^\//, '')

          if (method !== 'GET') {
            asJsonResponse(res, { success: false, message: 'Method not allowed' }, 405)
            return
          }

          try {
            if (action === 'random-liked-playable') {
              const count = Math.max(1, Math.min(24, Number(url.searchParams.get('count') ?? '12')))
              const songs = await loadFavoritePlayableSongs()
              const sample = shuffle(songs).slice(0, Math.min(count, songs.length))

              asJsonResponse(res, {
                success: true,
                totalPlayableFavorites: songs.length,
                songs: sample,
              })
              return
            }

            if (action === 'album-meta') {
              const albumId = url.searchParams.get('albumId')
              if (!albumId) {
                asJsonResponse(res, { success: false, message: 'Missing albumId' }, 400)
                return
              }

              const meta = await loadAlbumMeta(albumId)
              asJsonResponse(res, { success: true, ...meta })
              return
            }

            if (action === 'lyrics') {
              const songId = url.searchParams.get('songId')
              if (!songId) {
                asJsonResponse(res, { success: false, message: 'Missing songId' }, 400)
                return
              }

              const lyrics = await loadSongLyrics(songId)
              asJsonResponse(res, { success: true, ...lyrics })
              return
            }

            if (action === 'bot-song-map') {
              const entries = await loadBotSongMap()
              asJsonResponse(res, { success: true, entries })
              return
            }

            asJsonResponse(res, { success: false, message: `Unknown action: ${action}` }, 404)
          } catch (error) {
            asJsonResponse(
              res,
              {
                success: false,
                message: error instanceof Error ? error.message : 'Unknown library bridge error',
              },
              500,
            )
          }
        })
      },
    },
  ],
})
