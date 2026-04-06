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

function createResolvedSong(song: Song): Song {
  return song
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
    playerPosition: { bottom: '64px', left: '50%', transform: 'translateX(-50%)' },
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
    playerPosition: { bottom: '64px', left: '50%', transform: 'translateX(-50%)' },
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
    playerPosition: { bottom: '64px', left: '50%', transform: 'translateX(-50%)' },
  },
  'clawd-submarine-drifter': {
    animationFile: '/clawd-animations/clawd-submarine-drifter.html',
    colorAccent: '#67C7C9',
    colorBg: '#07141A',
    lyricStyle: {
      color: '#B9F0EC',
      textShadow: '0 2px 14px rgba(103,199,201,0.38), 0 4px 28px rgba(0,0,0,0.78)',
      fontSize: 24,
      fontWeight: 400,
      letterSpacing: '0.05em',
    },
    lyricPosition: {
      top: '34%',
      left: '50%',
      transform: 'translateX(-50%)',
      textAlign: 'center',
      maxWidth: 420,
    },
    playerPosition: { bottom: '64px', left: '50%', transform: 'translateX(-50%)' },
  },
  'clawd-night-train-watcher': {
    animationFile: '/clawd-animations/clawd-night-train-watcher.html',
    colorAccent: '#D3A86B',
    colorBg: '#060A10',
    lyricStyle: {
      color: '#E2C69A',
      textShadow: '0 2px 10px rgba(211,168,107,0.32), 0 4px 24px rgba(0,0,0,0.86)',
      fontSize: 23,
      fontWeight: 400,
      letterSpacing: '0.06em',
    },
    lyricPosition: {
      top: '30%',
      left: '54%',
      transform: 'translateX(-50%)',
      textAlign: 'center',
      maxWidth: 380,
    },
    playerPosition: { bottom: '64px', left: '50%', transform: 'translateX(-50%)' },
  },
  'clawd-dusk-dancer': {
    animationFile: '/clawd-animations/clawd-dusk-dancer.html',
    colorAccent: '#F0B27A',
    colorBg: '#140C0B',
    lyricStyle: {
      color: '#FFD9B8',
      textShadow: '0 2px 12px rgba(240,178,122,0.34), 0 4px 24px rgba(0,0,0,0.72)',
      fontSize: 24,
      fontWeight: 500,
      letterSpacing: '0.04em',
    },
    lyricPosition: {
      top: '32%',
      left: '50%',
      transform: 'translateX(-50%)',
      textAlign: 'center',
      maxWidth: 400,
    },
    playerPosition: { bottom: '64px', left: '50%', transform: 'translateX(-50%)' },
  },
  'ghost-witch-night-train-companion': {
    animationFile: '/clawd-animations/ghost-witch-night-train-companion.html',
    colorAccent: '#A7BEE8',
    colorBg: '#060A10',
    lyricStyle: {
      color: '#D9E4F7',
      textShadow: '0 2px 12px rgba(167,190,232,0.26), 0 4px 24px rgba(0,0,0,0.84)',
      fontSize: 22,
      fontWeight: 400,
      letterSpacing: '0.05em',
    },
    lyricPosition: {
      top: '30%',
      left: '53%',
      transform: 'translateX(-50%)',
      textAlign: 'center',
      maxWidth: 390,
    },
    playerPosition: { bottom: '64px', left: '50%', transform: 'translateX(-50%)' },
  },
  'glow-panel-drifter': {
    animationFile: '/clawd-animations/glow-panel-drifter.html',
    colorAccent: '#67C7C9',
    colorBg: '#08131A',
    lyricStyle: {
      color: '#B9F0EC',
      textShadow: '0 2px 14px rgba(103,199,201,0.38), 0 4px 28px rgba(0,0,0,0.78)',
      fontSize: 24,
      fontWeight: 400,
      letterSpacing: '0.05em',
    },
    lyricPosition: {
      top: '34%',
      left: '50%',
      transform: 'translateX(-50%)',
      textAlign: 'center',
      maxWidth: 420,
    },
    playerPosition: { bottom: '64px', left: '50%', transform: 'translateX(-50%)' },
  },
  'acid-neon-shard': {
    animationFile: '/clawd-animations/acid-neon-shard.html',
    colorAccent: '#B4FF3B',
    colorBg: '#090912',
    lyricStyle: {
      color: '#E5F8FF',
      textShadow: '0 2px 10px rgba(180,255,59,0.22), 0 0 22px rgba(159,108,255,0.28)',
      fontSize: 23,
      fontWeight: 500,
      letterSpacing: '0.06em',
    },
    lyricPosition: {
      top: '30%',
      left: '54%',
      transform: 'translateX(-50%)',
      textAlign: 'center',
      maxWidth: 380,
    },
    playerPosition: { bottom: '64px', left: '50%', transform: 'translateX(-50%)' },
  },
  'brass-whistle-engine': {
    animationFile: '/clawd-animations/brass-whistle-engine.html',
    colorAccent: '#D8B176',
    colorBg: '#0B0D11',
    lyricStyle: {
      color: '#F3D8A3',
      textShadow: '0 2px 10px rgba(216,177,118,0.28), 0 4px 24px rgba(0,0,0,0.82)',
      fontSize: 23,
      fontWeight: 500,
      letterSpacing: '0.05em',
    },
    lyricPosition: {
      top: '31%',
      left: '50%',
      transform: 'translateX(-50%)',
      textAlign: 'center',
      maxWidth: 380,
    },
    playerPosition: { bottom: '64px', left: '50%', transform: 'translateX(-50%)' },
  },
  'biolume-pulse-totem': {
    animationFile: '/clawd-animations/biolume-pulse-totem.html',
    colorAccent: '#75F7C7',
    colorBg: '#08120D',
    lyricStyle: {
      color: '#B9FFF1',
      textShadow: '0 2px 12px rgba(117,247,199,0.26), 0 0 24px rgba(117,247,199,0.18)',
      fontSize: 24,
      fontWeight: 500,
      letterSpacing: '0.05em',
    },
    lyricPosition: {
      top: '30%',
      left: '50%',
      transform: 'translateX(-50%)',
      textAlign: 'center',
      maxWidth: 400,
    },
    playerPosition: { bottom: '36px', left: '50%', transform: 'translateX(-50%)' },
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
    resolvedSong: createResolvedSong({
      id: '2C58DF72E4FB660EDC6DDFD1C57F79D6',
      originalId: 1364351242,
      name: '春を待って',
      duration: 140366,
      artistIds: ['C9F7AE11CB1C9BB60ADCC88DE828CEB2'],
      artistNames: ['never young beach'],
      albumId: 'F0054093493D290388A6E380A0D0247A',
      coverImgUrl: 'http://p1.music.126.net/AwoeiEQ0z0KBu2yzOdplhA==/109951167355547592.jpg',
      liked: true,
      visible: true,
      maxBrLevel: 'lossless',
      plLevel: 'lossless',
      dlLevel: 'lossless',
      playable: true,
    }),
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
    resolvedSong: createResolvedSong({
      id: '85BDD6FDFE4607E4A96F9C78AE3DC9EA',
      originalId: 1364351247,
      name: 'いつも雨',
      duration: 252900,
      artistIds: ['C9F7AE11CB1C9BB60ADCC88DE828CEB2'],
      artistNames: ['never young beach'],
      albumId: 'F0054093493D290388A6E380A0D0247A',
      coverImgUrl: 'http://p1.music.126.net/AwoeiEQ0z0KBu2yzOdplhA==/109951167355547592.jpg',
      liked: true,
      visible: true,
      maxBrLevel: 'lossless',
      plLevel: 'lossless',
      dlLevel: 'lossless',
      playable: true,
    }),
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
    resolvedSong: createResolvedSong({
      id: '00C93487CD7E59DCF37ED125E81C5ACB',
      originalId: 1435628297,
      name: 'La lune',
      duration: 193629,
      artistIds: ['ECA86A3B6CBBBA9CB47ECA3750F51320'],
      artistNames: ["L'Impératrice"],
      albumId: '595F338E3E68F4AC8221384B8E882E21',
      coverImgUrl: 'http://p1.music.126.net/Dk18HibI009__AsOOuDwag==/109951164854352690.jpg',
      liked: true,
      visible: true,
      maxBrLevel: 'hires',
      plLevel: 'hires',
      dlLevel: 'hires',
      playable: true,
    }),
  },
  {
    songId: '1808923954',
    songTitle: 'Submarine',
    artist: "L'Impératrice",
    botId: 'clawd-submarine-drifter',
    botRole: '潜航漂流 bot',
    lyricSurface: {
      type: 'fog-window',
      placement: 'mid-water-center',
      style: 'soft aqua glow captions',
    },
    resolvedSong: null,
  },
  {
    songId: '340376',
    songTitle: '夜车',
    artist: '曾轶可',
    botId: 'clawd-night-train-watcher',
    botRole: '夜车凝望 bot',
    lyricSurface: {
      type: 'rain-glass-projection',
      placement: 'train-window-reflection',
      style: 'passing light text bands',
    },
    resolvedSong: createResolvedSong({
      id: '444B2D360B3AEF5AC4860C8D163BDB2F',
      originalId: 340376,
      name: '夜车',
      duration: 191889,
      artistIds: ['B77FB9654AA9D9A1EF41412A7B5CD4D3'],
      artistNames: ['曾轶可'],
      albumId: 'D135371328305778017ED713C75384CA',
      coverImgUrl: 'http://p1.music.126.net/s7Cn8bl21KY7kGiBWMdaFg==/109951163105666561.jpg',
      liked: false,
      visible: true,
      maxBrLevel: 'lossless',
      plLevel: 'lossless',
      dlLevel: 'lossless',
      playable: true,
    }),
  },
  {
    songId: '340376',
    songTitle: '夜车',
    artist: '曾轶可',
    botId: 'ghost-witch-night-train-companion',
    botRole: '夜车陪伴幽灵 bot',
    lyricSurface: {
      type: 'rain-glass-projection',
      placement: 'train-window-and-seat-reflection',
      style: 'soft drifting night text bands',
    },
    resolvedSong: createResolvedSong({
      id: '444B2D360B3AEF5AC4860C8D163BDB2F',
      originalId: 340376,
      name: '夜车',
      duration: 191889,
      artistIds: ['B77FB9654AA9D9A1EF41412A7B5CD4D3'],
      artistNames: ['曾轶可'],
      albumId: 'D135371328305778017ED713C75384CA',
      coverImgUrl: 'http://p1.music.126.net/s7Cn8bl21KY7kGiBWMdaFg==/109951163105666561.jpg',
      liked: false,
      visible: true,
      maxBrLevel: 'lossless',
      plLevel: 'lossless',
      dlLevel: 'lossless',
      playable: true,
    }),
  },
  {
    songId: '1888864514',
    songTitle: '踊り子',
    artist: 'Vaundy',
    botId: 'clawd-dusk-dancer',
    botRole: '黄昏舞者 bot',
    lyricSurface: {
      type: 'fog-window',
      placement: 'soft-backdrop-center',
      style: 'warm blurred lyric glow',
    },
    resolvedSong: createResolvedSong({
      id: '258923EE35E225CEC99D953668AABF60',
      originalId: 1888864514,
      name: '踊り子',
      duration: 230109,
      artistIds: ['51318F8CBBEC1F7F03DE50196A593988'],
      artistNames: ['Vaundy'],
      albumId: '388C06C79442B156E253A1145C7BD55B',
      coverImgUrl: 'http://p1.music.126.net/7yU2Xciaznad51QXfSf7-g==/109951168916977293.jpg',
      liked: true,
      visible: true,
      maxBrLevel: 'hires',
      plLevel: 'hires',
      dlLevel: 'hires',
      playable: true,
    }),
  },
  {
    songId: '34078194',
    songTitle: 'Milestones',
    artist: 'Shook',
    botId: 'glow-panel-drifter',
    botRole: '漂移面板体',
    lyricSurface: {
      type: 'fog-window',
      placement: 'mid-space-center',
      style: 'soft spectral captions',
    },
    resolvedSong: null,
  },
  {
    songId: '1294604159',
    songTitle: 'Sentiment Acide (Jennifer Cardini Remix)',
    artist: 'Jennifer Cardini, David Shaw and The Beat',
    botId: 'acid-neon-shard',
    botRole: '酸性霓虹切片',
    lyricSurface: {
      type: 'rain-glass-projection',
      placement: 'right-side-neon-wall',
      style: 'sharp cold captions',
    },
    resolvedSong: createResolvedSong({
      id: '6F8A5C57E94A704B526EF99176EE0697',
      originalId: 1294604159,
      name: 'Sentiment Acide (Jennifer Cardini Remix)',
      duration: 340880,
      artistIds: ['2B9F92F514D01F0C51E83C6B04E60A07', '4B6FC477B38A35B15C69CE916D952A74'],
      artistNames: ['Jennifer Cardini', 'David Shaw and The Beat'],
      albumId: 'C6058EEBDDC3AB7471D15DE82A3920C4',
      coverImgUrl: 'http://p1.music.126.net/BjHm0V0WuSURemwMQE21jQ==/109951163509339811.jpg',
      liked: true,
      visible: true,
      maxBrLevel: 'lossless',
      plLevel: 'lossless',
      dlLevel: 'lossless',
      playable: true,
    }),
  },
  {
    songId: '17089071',
    songTitle: 'The Whistler',
    artist: 'Claude VonStroke',
    botId: 'brass-whistle-engine',
    botRole: '黄铜哨引擎',
    lyricSurface: {
      type: 'rain-glass-projection',
      placement: 'left-industrial-wall',
      style: 'mechanical cue text',
    },
    resolvedSong: null,
  },
  {
    songId: '5069277',
    songTitle: 'Jungle HeartBeat',
    artist: 'Suduaya',
    botId: 'biolume-pulse-totem',
    botRole: '生物荧光脉冲图腾',
    lyricSurface: {
      type: 'moonlight-glyph',
      placement: 'totem-air-ring',
      style: 'organic pulse glyphs',
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
