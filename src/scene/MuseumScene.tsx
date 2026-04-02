import { CameraRig } from './CameraRig'
import { Lights } from './Lights'
import { RoomShell } from './RoomShell'
import { ContextWallZone } from './zones/ContextWallZone'
import { TurntableZone } from './zones/TurntableZone'
import { VinylShelfZone } from './zones/VinylShelfZone'

export function MuseumScene() {
  return (
    <>
      <CameraRig />
      <Lights />
      <group name="MuseumScene" position={[0, -1.5, 0]}>
        <RoomShell />
        <TurntableZone />
        <VinylShelfZone />
        <ContextWallZone />
      </group>
    </>
  )
}
