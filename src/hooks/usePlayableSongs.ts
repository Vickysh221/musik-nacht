import { useMuseumSceneStore } from '../store/useMuseumSceneStore'

export function usePlayableSongs() {
  return useMuseumSceneStore((state) => state.songs)
}
