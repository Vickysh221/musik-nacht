import type { CSSProperties } from 'react'
import type { Song } from '../types/museum'

export type LyricSurfaceType = 'fog-window' | 'rain-glass-projection' | 'moonlight-glyph'

type BotSongMapEntry = {
  songId: string
  songTitle: string
  artist: string
  botId: string
  botRole: string
  lyricSurface: {
    type: LyricSurfaceType
    placement: string
    style: string
  }
  resolvedSong: Song | null
}

type BotSceneVisualConfig = {
  animationFile: string
  colorAccent: string
  colorBg: string
  lyricStyle: {
    color: string
    textShadow: string
    fontSize: number
    fontWeight: number | string
    letterSpacing?: string
  }
  lyricPosition: CSSProperties
  playerPosition: CSSProperties
}

export type BotSceneConfig = BotSongMapEntry &
  BotSceneVisualConfig & {
    lyricSurfaceType: LyricSurfaceType
    originalSongId: number
  }

const BOT_SCENE_VISUALS: Record<string, BotSceneVisualConfig> = {
  'clawd-spring-traveler': {
    animationFile: '/clawd-animations/clawd-spring-traveler.html',
    colorAccent: '#E8CC80',
    colorBg: '#0D1118',
    lyricStyle: {
      color: '#F5EDD8',
      textShadow: '0 2px 14px rgba(232,200,128,0.45), 0 4px 28px rgba(0,0,0,0.75)',
      fontSize: 26,
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    lyricPosition: {
      top: '34%',
      left: '50%',
      transform: 'translateX(-50%)',
      textAlign: 'center',
    },
    playerPosition: { bottom: '40px', left: '50%', transform: 'translateX(-50%)' },
  },
  'clawd-rain-waiter': {
    animationFile: '/clawd-animations/clawd-rain-waiter.html',
    colorAccent: '#4A7090',
    colorBg: '#080D14',
    lyricStyle: {
      color: '#A8C0D8',
      textShadow: '0 2px 10px rgba(74,112,144,0.65), 0 4px 24px rgba(0,0,0,0.85)',
      fontSize: 24,
      fontWeight: 400,
      letterSpacing: '0.04em',
    },
    lyricPosition: {
      top: '34%',
      left: '50%',
      transform: 'translateX(-50%) skewX(-1deg)',
      textAlign: 'center',
    },
    playerPosition: { bottom: '40px', left: '50%', transform: 'translateX(-50%)' },
  },
  'clawd-lunar-goddess': {
    animationFile: '/clawd-animations/clawd-lunar-goddess.html',
    colorAccent: '#B8C8D8',
    colorBg: '#040810',
    lyricStyle: {
      color: '#C8D8E8',
      textShadow: '0 0 28px rgba(184,200,216,0.55), 0 2px 14px rgba(0,0,0,0.85)',
      fontSize: 22,
      fontWeight: 300,
      letterSpacing: '0.08em',
    },
    lyricPosition: {
      top: '28%',
      left: '50%',
      transform: 'translateX(-50%)',
      textAlign: 'center',
      maxWidth: 360,
    },
    playerPosition: { bottom: '40px', left: '50%', transform: 'translateX(-50%)' },
  },
}

const FALLBACK_BOT_SCENE_ENTRIES: BotSongMapEntry[] = [
  {
    songId: '1364351242',
    songTitle: '春を待って',
    artist: 'never young beach',
    botId: 'clawd-spring-traveler',
    botRole: '初春旅人 bot',
    lyricSurface: {
      type: 'fog-window',
      placement: 'left-window-near-entry',
      style: 'soft fading handwritten',
    },
    resolvedSong: null,
  },
  {
    songId: '1364351247',
    songTitle: 'いつも雨',
    artist: 'never young beach',
    botId: 'clawd-rain-waiter',
    botRole: '雨中等待 bot',
    lyricSurface: {
      type: 'rain-glass-projection',
      placement: 'window-or-wet-wall-near-lamp',
      style: 'blurred reflective subtitles',
    },
    resolvedSong: null,
  },
  {
    songId: '1435628297',
    songTitle: 'La lune',
    artist: "L'Impératrice",
    botId: 'clawd-lunar-goddess',
    botRole: '月桂女神 bot',
    lyricSurface: {
      type: 'moonlight-glyph',
      placement: 'upper-wall-or-altar-air',
      style: 'thin silver text fading in and out',
    },
    resolvedSong: null,
  },
]

export function buildBotSceneConfigs(entries: BotSongMapEntry[]) {
  return entries
    .map((entry) => {
      const visual = BOT_SCENE_VISUALS[entry.botId]
      if (!visual) return null

      return {
        ...entry,
        ...visual,
        lyricSurfaceType: entry.lyricSurface.type,
        originalSongId: Number(entry.songId),
      }
    })
    .filter((entry): entry is BotSceneConfig => Boolean(entry))
}

export const FALLBACK_BOT_SCENE_MAP = buildBotSceneConfigs(FALLBACK_BOT_SCENE_ENTRIES)
