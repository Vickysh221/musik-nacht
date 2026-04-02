import type { Agent, AgentPickDecision, Song, SongEraTag, SongFeatures } from '../types/museum'

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const lower = (value: string | undefined | null) => value?.toLowerCase() ?? ''

const includesAny = (candidates: string[], targets: string[]) =>
  candidates.filter((candidate) => targets.some((target) => lower(candidate) === lower(target)))

export const inferEraTag = (song: Song): SongEraTag => {
  const title = lower(song.name)

  if (title.includes('remaster') || title.includes('lacquer') || title.includes('vinyl')) return 'classic'
  if (song.originalId >= 2000000000) return '2020s'
  if (song.originalId >= 1000000000) return '2010s'
  if (song.originalId >= 100000000) return '2000s'
  if (song.originalId >= 30000000) return '1990s'
  return 'classic'
}

const inferLanguage = (song: Song) => {
  const title = song.name
  if (/[\u3040-\u30ff]/.test(title)) return 'japanese'
  if (/[\u4e00-\u9fff]/.test(title)) return 'chinese'
  if (/[a-z]/i.test(title)) return 'english'
  return null
}

const inferNightScore = (moodTags: string[], genreTags: string[], name: string) => {
  let score = 0.42
  const lcName = lower(name)

  if (moodTags.some((tag) => ['night', 'immersive', 'dreamlike', 'melancholic', 'quiet', 'restless'].includes(lower(tag)))) score += 0.28
  if (genreTags.some((tag) => ['ambient', 'dream-pop', 'psychedelic', 'city-pop', 'post-rock'].includes(lower(tag)))) score += 0.16
  if (lcName.includes('night') || lcName.includes('moon') || lcName.includes('dream')) score += 0.12

  return clamp(Number(score.toFixed(2)), 0.12, 1)
}

export const buildSongFeatures = (song: Song): SongFeatures => {
  const moodTags = Array.isArray(song.moodTags) ? song.moodTags : []
  const genreTags = Array.isArray(song.genreTags) ? song.genreTags : []
  const eraTag = song.eraTag ?? inferEraTag(song)
  const language = song.language ?? inferLanguage(song)
  const lyricMoodTags = Array.isArray(song.lyricMoodTags) ? song.lyricMoodTags : []
  const lyricThemeTags = Array.isArray(song.lyricThemeTags) ? song.lyricThemeTags : []
  const nightScore = song.nightScore ?? inferNightScore(moodTags, genreTags, song.name)

  return {
    moodTags,
    genreTags,
    eraTag,
    language,
    lyricMoodTags,
    lyricThemeTags,
    nightScore,
  }
}

export const enrichSong = (song: Song): Song => {
  const features = buildSongFeatures(song)

  return {
    ...song,
    playable: song.playable ?? song.visible,
    eraTag: features.eraTag,
    language: features.language,
    lyricMoodTags: features.lyricMoodTags,
    lyricThemeTags: features.lyricThemeTags,
    nightScore: features.nightScore,
    features,
  }
}

const inferEnergy = (song: Song, features: SongFeatures) => {
  let score = 0.46
  const title = lower(song.name)

  if (features.moodTags.some((tag) => ['quiet', 'minimal', 'calm', 'dreamlike'].includes(lower(tag)))) score -= 0.16
  if (features.moodTags.some((tag) => ['bright', 'dramatic', 'restless', 'expansive'].includes(lower(tag)))) score += 0.14
  if (features.genreTags.some((tag) => ['ambient', 'folk'].includes(lower(tag)))) score -= 0.1
  if (features.genreTags.some((tag) => ['j-rock', 'alt-pop', 'synth-pop'].includes(lower(tag)))) score += 0.12
  if (title.includes('remaster') || title.includes('acoustic')) score -= 0.04

  return clamp(Number(score.toFixed(2)), 0, 1)
}

export const scoreSongForAgent = (song: Song, agent: Agent): AgentPickDecision => {
  const features = song.features ?? buildSongFeatures(song)
  const profile = agent.preferenceProfile

  if (!profile) {
    return {
      agentId: agent.id,
      songId: song.id,
      score: song.liked ? 0.25 : 0.1,
      reasons: [song.liked ? '已在收藏里，先给基础加分' : '暂无画像，先按基础权重处理'],
    }
  }

  let score = 0
  const reasons: string[] = []

  const moodMatches = includesAny(features.moodTags, profile.moods)
  if (moodMatches.length > 0) {
    score += moodMatches.length * 0.24
    reasons.push(`情绪命中：${moodMatches.join(' / ')}`)
  }

  const lyricMoodMatches = includesAny(features.lyricMoodTags, profile.lyricMoods)
  if (lyricMoodMatches.length > 0) {
    score += lyricMoodMatches.length * 0.16
    reasons.push(`歌词情绪命中：${lyricMoodMatches.join(' / ')}`)
  } else if (profile.lyricMoods.length > 0 && features.lyricMoodTags.length === 0) {
    reasons.push('歌词情绪画像暂缺，先按器乐/氛围特征判断')
  }

  const genreMatches = includesAny(features.genreTags, profile.genres)
  if (genreMatches.length > 0) {
    score += genreMatches.length * 0.18
    reasons.push(`风格命中：${genreMatches.join(' / ')}`)
  }

  if (profile.eras.includes(features.eraTag)) {
    score += 0.14
    reasons.push(`年代命中：${features.eraTag}`)
  }

  if (song.liked) {
    score += 0.1
    reasons.push('已在红心收藏中')
  }

  const nightBoost = features.nightScore * profile.nightAffinity * 0.2
  score += nightBoost
  if (nightBoost >= 0.12) {
    reasons.push(`深夜适配高：nightScore ${features.nightScore.toFixed(2)}`)
  }

  const energy = inferEnergy(song, features)
  if (profile.energyRange) {
    const [min, max] = profile.energyRange
    if (energy >= min && energy <= max) {
      score += 0.08
      reasons.push(`能量区间合适：${energy.toFixed(2)}`)
    }
  }

  return {
    agentId: agent.id,
    songId: song.id,
    score: Number(score.toFixed(3)),
    reasons: reasons.length > 0 ? reasons : ['基础画像命中较弱，作为备选'],
  }
}

export const buildNightlySelections = (songs: Song[], agents: Agent[], refreshSeed = 0) => {
  const nightlyPool = songs.slice(0, 12)
  const decisions = agents
    .map((agent, index) => {
      const ranked = nightlyPool.map((song) => scoreSongForAgent(song, agent)).sort((a, b) => b.score - a.score)
      const topScore = ranked[0]?.score ?? 0
      const nearTop = ranked.filter((decision) => topScore - decision.score <= 0.12)
      const selectedIndex = nearTop.length > 0 ? (refreshSeed + index) % nearTop.length : 0
      return nearTop[selectedIndex] ?? ranked[0]
    })
    .filter((decision): decision is AgentPickDecision => Boolean(decision))

  const agentDecisions = decisions.sort((a, b) => b.score - a.score)
  const activeVisitorIds = agentDecisions.filter((decision) => decision.score >= 0.42).map((decision) => decision.agentId)
  const recommendedSongId = agentDecisions[0]?.songId ?? nightlyPool[0]?.id ?? null

  return {
    nightlyPool,
    agentDecisions,
    activeVisitorIds,
    recommendedSongId,
  }
}
