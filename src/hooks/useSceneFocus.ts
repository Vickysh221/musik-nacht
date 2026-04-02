import { useMuseumSceneStore } from '../store/useMuseumSceneStore'

export function useSceneFocus() {
  const focusZone = useMuseumSceneStore((state) => state.focusZone)
  const setFocusZone = useMuseumSceneStore((state) => state.setFocusZone)

  return { focusZone, setFocusZone }
}
