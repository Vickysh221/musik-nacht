import type { PlaybackState } from '../types/museum'

export const mockPlayback: PlaybackState = {
  status: 'stopped',
  currentSongId: null,
  progress: 0,
  duration: 0,
  volume: null,
  source: 'mock',
}
