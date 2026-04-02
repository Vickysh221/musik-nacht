import type { Agent, Edge } from '../types/musicMuseum'
import songs from './neteaseSongs.json'

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
    selectionBrief: '会把今晚的歌往更深、更慢、更梦游的方向拽。',
    preferenceNotes: ['偏爱深夜感', '喜欢下潜型听感', '接受较长前奏'],
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
    selectionBrief: '会优先挑旋律明确、情绪清晰、容易一耳朵抓住人的歌。',
    preferenceNotes: ['偏好亮面旋律', '适合分享会', '接受直接抒情'],
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
    selectionBrief: '更看重温度、年代颗粒感和复古录音质地。',
    preferenceNotes: ['偏爱暖色音色', '喜欢复古感', '会关注年代气味'],
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
    selectionBrief: '喜欢安静、疏离、留白足够的夜间曲目。',
    preferenceNotes: ['偏好空气感', '喜欢轻编排', '更安静克制'],
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
    selectionBrief: '会把歌单往城市夜色、潮湿霓虹和轻微心动那边推。',
    preferenceNotes: ['偏好城市夜景', '喜欢流动感', '适合夜路场景'],
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
    selectionBrief: '会优先选择有收藏价值、年代指向或版本质感的歌。',
    preferenceNotes: ['偏爱旧流行', '关注版本感', '喜欢收藏线索'],
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
