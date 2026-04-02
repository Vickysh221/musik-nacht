import type { AgentPreferenceProfile } from '../types/museum'

export const agentProfiles: Record<string, AgentPreferenceProfile> = {
  'agent-midnight-fm': {
    moods: ['night', 'immersive', 'melancholic', 'dreamlike'],
    lyricMoods: ['introspective', 'lonely', 'dreamlike'],
    genres: ['psychedelic', 'ambient', 'dream-pop', 'post-rock'],
    eras: ['2010s', '2020s', 'classic'],
    nightAffinity: 1,
    energyRange: [0.18, 0.56],
  },
  'agent-crystal-radio': {
    moods: ['bright', 'dramatic', 'melodic', 'hopeful'],
    lyricMoods: ['romantic', 'yearning', 'hopeful'],
    genres: ['j-rock', 'pop', 'indie-pop', 'alt-pop'],
    eras: ['2000s', '2010s', '2020s'],
    nightAffinity: 0.52,
    energyRange: [0.38, 0.82],
  },
  'agent-amber-tape': {
    moods: ['warm', 'retro', 'expansive', 'nostalgic'],
    lyricMoods: ['nostalgic', 'tender', 'reflective'],
    genres: ['retro', 'folk', 'psychedelic', 'classic-rock'],
    eras: ['classic', '1990s', '2000s'],
    nightAffinity: 0.72,
    energyRange: [0.24, 0.64],
  },
  'agent-glass-room': {
    moods: ['airy', 'minimal', 'quiet', 'calm'],
    lyricMoods: ['distant', 'introspective', 'calm'],
    genres: ['ambient', 'minimal', 'indie', 'post-rock'],
    eras: ['2010s', '2020s'],
    nightAffinity: 0.84,
    energyRange: [0.1, 0.42],
  },
  'agent-neon-harbor': {
    moods: ['night', 'neon', 'city', 'restless'],
    lyricMoods: ['restless', 'yearning', 'romantic'],
    genres: ['city-pop', 'indie-pop', 'alt-pop', 'synth-pop'],
    eras: ['classic', '1990s', '2010s'],
    nightAffinity: 0.9,
    energyRange: [0.3, 0.74],
  },
  'agent-archive-bird': {
    moods: ['archive', 'collector', 'warm', 'nostalgic'],
    lyricMoods: ['nostalgic', 'reflective', 'dreamlike'],
    genres: ['old-pop', 'retro', 'classic-rock', 'folk'],
    eras: ['classic', '1990s', '2000s'],
    nightAffinity: 0.66,
    energyRange: [0.18, 0.62],
  },
}
