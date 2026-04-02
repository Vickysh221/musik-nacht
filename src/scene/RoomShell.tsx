export function RoomShell() {
  return (
    <group name="RoomShell">
      {/* Warm parquet floor */}
      <mesh name="Floor" rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 12]} />
        <meshStandardMaterial color="#3d2b1a" roughness={0.75} />
      </mesh>

      {/* Dark teal back wall */}
      <mesh name="BackWall" position={[0, 3, -5.5]}>
        <boxGeometry args={[18, 6, 0.3]} />
        <meshStandardMaterial color="#1a2e2e" roughness={0.9} />
      </mesh>

      {/* Left wall */}
      <mesh name="LeftWallBlock" position={[-8.5, 1.5, -1]}>
        <boxGeometry args={[1, 3, 9]} />
        <meshStandardMaterial color="#162626" roughness={0.9} />
      </mesh>

      {/* Right wall */}
      <mesh name="RightWallBlock" position={[8.5, 1.5, -1]}>
        <boxGeometry args={[1, 3, 9]} />
        <meshStandardMaterial color="#162626" roughness={0.9} />
      </mesh>
    </group>
  )
}
