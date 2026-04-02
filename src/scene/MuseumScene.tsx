import { CameraRig } from './CameraRig'
import { Lights } from './Lights'
import { TurntableZone } from './zones/TurntableZone'
import { AgentCorner } from './zones/AgentCorner'

export function MuseumScene() {
  return (
    <>
      <CameraRig />
      <Lights />
      {/*
        Canvas is purely visual (pointer-events: none).
        - TurntableZone: spinning disc + NowPlaying panel
        - VinylShelfZone + ContextWallZone moved to HTML overlay (SceneOverlay)
      */}
      <group name="MuseumScene" position={[0, -1.5, 0]}>
        <TurntableZone />
        <AgentCorner />
      </group>
    </>
  )
}
