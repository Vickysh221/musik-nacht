export function RoomShell() {
  return (
    <group name="RoomShell">
      <mesh name="Floor" rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 12]} />
        <meshStandardMaterial color="#1f1b24" />
      </mesh>

      <mesh name="BackWall" position={[0, 3, -5.5]}>
        <boxGeometry args={[18, 6, 0.3]} />
        <meshStandardMaterial color="#302734" />
      </mesh>

      <mesh name="LeftWallBlock" position={[-8.5, 1.5, -1]}>
        <boxGeometry args={[1, 3, 9]} />
        <meshStandardMaterial color="#231d28" />
      </mesh>

      <mesh name="RightWallBlock" position={[8.5, 1.5, -1]}>
        <boxGeometry args={[1, 3, 9]} />
        <meshStandardMaterial color="#231d28" />
      </mesh>
    </group>
  )
}
