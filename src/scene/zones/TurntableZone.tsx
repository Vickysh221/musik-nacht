export function TurntableZone() {
  return (
    <group name="TurntableZone" position={[-4.2, 0, 0.6]}>
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[2.6, 1.2, 2]} />
        <meshStandardMaterial color="#775f4a" />
      </mesh>
      <mesh position={[0, 1.35, 0]}>
        <cylinderGeometry args={[0.75, 0.75, 0.12, 48]} />
        <meshStandardMaterial color="#141414" />
      </mesh>
    </group>
  )
}
