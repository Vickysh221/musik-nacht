import type { Agent, Edge } from '../types/musicMuseum'
import { songs } from './neteaseData'

export const expandedAgents: Agent[] = [
  {
    id: 'agent-midnight-fm',
    name: 'Midnight FM',
    persona: '偏爱深夜、慢热、会把人往更深一层音乐里带的来访者。',
    tasteTags: ['night', 'immersive', 'psychedelic'],
    favoriteSongIds: [],
    favoriteArtistIds: [],
    color: '#4338ca',
    activityPattern: 'late_night',
  },
  {
    id: 'agent-crystal-radio',
    name: 'Crystal Radio',
    persona: '更偏旋律感和清晰情绪，会把馆里的歌往分享会方向组织起来。',
    tasteTags: ['melodic', 'bright', 'j-rock'],
    favoriteSongIds: [],
    favoriteArtistIds: [],
    color: '#db2777',
    activityPattern: 'weekend',
  },
  {
    id: 'agent-amber-tape',
    name: 'Amber Tape',
    persona: '偏爱温暖、复古、颗粒感明显的声音，更像会在黄昏时段来的策展人。',
    tasteTags: ['warm', 'retro', 'vinyl'],
    favoriteSongIds: [],
    favoriteArtistIds: [],
    color: '#d97706',
    activityPattern: 'sunset',
  },
  {
    id: 'agent-glass-room',
    name: 'Glass Room',
    persona: '喜欢空气感、留白和更轻的编排，适合把馆里的歌整理成安静的试听会。',
    tasteTags: ['airy', 'minimal', 'ambient'],
    favoriteSongIds: [],
    favoriteArtistIds: [],
    color: '#0f766e',
    activityPattern: 'quiet_hours',
  },
  {
    id: 'agent-neon-harbor',
    name: 'Neon Harbor',
    persona: '偏爱城市夜色、霓虹和带一点潮湿感的流行边缘。',
    tasteTags: ['city', 'night', 'neon'],
    favoriteSongIds: [],
    favoriteArtistIds: [],
    color: '#2563eb',
    activityPattern: 'after_rain',
  },
  {
    id: 'agent-archive-bird',
    name: 'Archive Bird',
    persona: '喜欢旧流行、翻录、被时代留下颗粒感的歌，像馆里的档案管理员。',
    tasteTags: ['archive', 'old-pop', 'collector'],
    favoriteSongIds: [],
    favoriteArtistIds: [],
    color: '#7c3aed',
    activityPattern: 'all_day',
  },
]

const pickAgentId = (name: string, liked: boolean, maxBrLevel: string | null) => {
  const lower = name.toLowerCase()

  if (/[夜|moon|bleak|soul|diamond]/i.test(name) || lower.includes('night')) return 'agent-midnight-fm'
  if (/[恋|愛|love|orchestra]/i.test(name) || lower.includes('french') || lower.includes('hello')) return 'agent-crystal-radio'
  if (/[真夜中|jazz|diamond|vinyl]/i.test(name) || lower.includes('chain') || lower.includes('mary')) return 'agent-amber-tape'
  if (/[伤风|beautiful|extra|pool]/i.test(name) || lower.includes('beautiful') || lower.includes('pool')) return 'agent-glass-room'
  if (/[真夜中|龙虾|diamond]/i.test(name) || lower.includes('paisley') || lower.includes('orchestra')) return 'agent-neon-harbor'
  if (liked || maxBrLevel === 'lossless') return 'agent-archive-bird'
  return 'agent-crystal-radio'
}

const songAssignments = songs.slice(0, 36).map((song) => ({
  songId: song.id,
  agentId: pickAgentId(song.name, song.liked, song.maxBrLevel),
}))

export const assignedAgents: Agent[] = expandedAgents.map((agent) => {
  const assignedSongIds = songAssignments.filter((item) => item.agentId === agent.id).map((item) => item.songId)
  return {
    ...agent,
    favoriteSongIds: assignedSongIds.slice(0, 8),
  }
})

export const agentRequestEdges: Edge[] = songAssignments.map((item) => ({
  source: `agent:${item.agentId}`,
  target: `song:${item.songId}`,
  type: 'requested',
  weight: 0.72,
}))
