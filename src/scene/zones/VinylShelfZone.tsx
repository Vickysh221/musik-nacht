export function VinylShelfZone() {
  return (
    <group name="VinylShelfZone" position={[0, 0, -3.9]}>
      <mesh position={[0, 1.7, 0]}>
        <boxGeometry args={[4.5, 3.4, 0.5]} />
        <meshStandardMaterial color="#5f4757" />
      </mesh>
      <mesh position={[-1.2, 2.3, 0.35]}>
        <boxGeometry args={[0.8, 1.4, 0.08]} />
        <meshStandardMaterial color="#d9a441" />
      </mesh>
      <mesh position={[0, 2.3, 0.35]}>
        <boxGeometry args={[0.8, 1.4, 0.08]} />
        <meshStandardMaterial color="#6ab0b8" />
      </mesh>
      <mesh position={[1.2, 2.3, 0.35]}>
        <boxGeometry args={[0.8, 1.4, 0.08]} />
        <meshStandardMaterial color="#d66d75" />
      </mesh>
    </group>
  )
}
