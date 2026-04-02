export function ContextWallZone() {
  return (
    <group name="ContextWallZone" position={[4.5, 0, -2.6]}>
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[3.2, 2.1, 0.2]} />
        <meshStandardMaterial color="#d4c6a5" />
      </mesh>
      <mesh position={[0, 0.8, 1.2]}>
        <boxGeometry args={[2.3, 1.6, 0.7]} />
        <meshStandardMaterial color="#38414c" />
      </mesh>
    </group>
  )
}
