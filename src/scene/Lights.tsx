export function Lights() {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight
        castShadow={false}
        intensity={1.3}
        position={[4, 8, 6]}
      />
      <pointLight intensity={0.4} position={[-5, 3, 4]} />
    </>
  )
}
