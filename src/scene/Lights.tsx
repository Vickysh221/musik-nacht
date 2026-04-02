// Minimal lighting — the background image provides the visual atmosphere.
// These lights just make the 3D hotspot materials readable.
export function Lights() {
  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight intensity={0.6} position={[0, 10, 8]} />
    </>
  )
}
