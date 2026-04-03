import type { CSSProperties } from 'react'

export type LyricSurfaceType = 'fog-window' | 'rain-glass-projection' | 'moonlight-glyph'

export type BotSceneConfig = {
  botId: string
  botRole: string
  /** Matches song.originalId in the store */
  originalSongId: number
  songTitle: string
  artist: string
  lyricSurfaceType: LyricSurfaceType
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

export const BOT_SCENE_MAP: BotSceneConfig[] = [
  {
    botId: 'clawd-spring-traveler',
    botRole: '初春旅人 bot',
    originalSongId: 1364351242,
    songTitle: '春を待って',
    artist: 'never young beach',
    lyricSurfaceType: 'fog-window',
    animationFile: '/clawd-animations/clawd-spring-traveler.html',
    colorAccent: '#E8CC80',
    colorBg: '#0D1118',
    lyricStyle: {
      color: '#F5EDD8',
      textShadow:
        '0 2px 14px rgba(232,200,128,0.45), 0 4px 28px rgba(0,0,0,0.75)',
      fontSize: 26,
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    lyricPosition: {
      bottom: '220px',
      left: '50%',
      transform: 'translateX(-50%)',
      textAlign: 'center',
    },
    playerPosition: { bottom: '40px', right: '48px' },
  },
  {
    botId: 'clawd-rain-waiter',
    botRole: '雨中等待 bot',
    originalSongId: 1364351247,
    songTitle: 'いつも雨',
    artist: 'never young beach',
    lyricSurfaceType: 'rain-glass-projection',
    animationFile: '/clawd-animations/clawd-rain-waiter.html',
    colorAccent: '#4A7090',
    colorBg: '#080D14',
    lyricStyle: {
      color: '#A8C0D8',
      textShadow:
        '0 2px 10px rgba(74,112,144,0.65), 0 4px 24px rgba(0,0,0,0.85)',
      fontSize: 24,
      fontWeight: 400,
      letterSpacing: '0.04em',
    },
    lyricPosition: {
      bottom: '220px',
      left: '50%',
      transform: 'translateX(-50%) skewX(-1deg)',
      textAlign: 'center',
    },
    playerPosition: { bottom: '40px', right: '48px' },
  },
  {
    botId: 'clawd-lunar-goddess',
    botRole: '月桂女神 bot',
    originalSongId: 1435628297,
    songTitle: 'La lune',
    artist: "L'Impératrice",
    lyricSurfaceType: 'moonlight-glyph',
    animationFile: '/clawd-animations/clawd-lunar-goddess.html',
    colorAccent: '#B8C8D8',
    colorBg: '#040810',
    lyricStyle: {
      color: '#C8D8E8',
      textShadow:
        '0 0 28px rgba(184,200,216,0.55), 0 2px 14px rgba(0,0,0,0.85)',
      fontSize: 22,
      fontWeight: 300,
      letterSpacing: '0.08em',
    },
    lyricPosition: {
      top: '22%',
      right: '8%',
      textAlign: 'right',
      maxWidth: 360,
    },
    playerPosition: { bottom: '40px', left: '48px' },
  },
]
