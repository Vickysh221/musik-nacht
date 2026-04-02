import { Html } from '@react-three/drei'
import { useMemo } from 'react'
import { useMuseumSceneStore } from '../../store/useMuseumSceneStore'

export function AgentCorner() {
  const agents = useMuseumSceneStore((state) => state.agents)
  const agentDecisions = useMuseumSceneStore((state) => state.agentDecisions)
  const activeVisitorIds = useMuseumSceneStore((state) => state.activeVisitorIds)
  const activeAgentId = useMuseumSceneStore((state) => state.activeAgentId)
  const setActiveAgent = useMuseumSceneStore((state) => state.setActiveAgent)
  const selectSong = useMuseumSceneStore((state) => state.selectSong)
  const runNightVisitorSelection = useMuseumSceneStore((state) => state.runNightVisitorSelection)

  const visibleVisitors = useMemo(
    () =>
      agentDecisions
        .filter((decision) => activeVisitorIds.includes(decision.agentId))
        .map((decision) => ({
          decision,
          agent: agents.find((agent) => agent.id === decision.agentId) ?? null,
        })),
    [activeVisitorIds, agentDecisions, agents],
  )

  return (
    <group name="AgentCorner" position={[4.8, 0.25, -1.3]}>
      <mesh position={[0, 1.35, 0]}>
        <boxGeometry args={[2.6, 2.2, 0.24]} />
        <meshStandardMaterial color="#3a3137" metalness={0.08} roughness={0.84} />
      </mesh>

      <Html transform distanceFactor={1.45} position={[0, 1.35, 0.16]}>
        <div
          style={{
            width: 292,
            borderRadius: 18,
            padding: 14,
            background: 'rgba(19, 17, 23, 0.92)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.28)',
            fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
            transform: 'scale(3)',
            transformOrigin: 'top left',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.48)' }}>
                Tonight&apos;s Visitors
              </div>
              <div style={{ marginTop: 6, fontSize: 12, lineHeight: 1.45, color: 'rgba(255,255,255,0.62)' }}>
                今晚从 12 首放送里挑出最想听的歌。
              </div>
            </div>
            <button
              type="button"
              onClick={() => runNightVisitorSelection()}
              style={{
                borderRadius: 999,
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.08)',
                color: '#f8fafc',
                padding: '6px 10px',
                fontSize: 11,
                fontWeight: 800,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              刷新访客
            </button>
          </div>

          <div style={{ marginTop: 12, display: 'grid', gap: 10 }}>
            {visibleVisitors.length > 0 ? (
              visibleVisitors.map(({ decision, agent }) => {
                const active = decision.agentId === activeAgentId
                return (
                  <button
                    key={`${decision.agentId}-${decision.songId}`}
                    type="button"
                    onClick={() => {
                      setActiveAgent(decision.agentId)
                      selectSong(decision.songId)
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      borderRadius: 14,
                      border: `1px solid ${active ? agent?.color ?? '#f59e0b' : 'rgba(255,255,255,0.08)'}`,
                      background: active ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
                      color: '#fff',
                      padding: '10px 12px',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                      <div style={{ fontSize: 13, fontWeight: 800 }}>{agent?.name ?? decision.agentId}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: agent?.color ?? '#fbbf24' }}>
                        score {decision.score.toFixed(3)}
                      </div>
                    </div>
                    <div style={{ marginTop: 5, fontSize: 11, lineHeight: 1.5, color: 'rgba(255,255,255,0.68)' }}>
                      {agent?.selectionBrief ?? agent?.persona ?? '深夜访客'}
                    </div>
                    <div style={{ marginTop: 7, display: 'grid', gap: 4 }}>
                      {decision.reasons.slice(0, 3).map((reason) => (
                        <div key={reason} style={{ fontSize: 11, lineHeight: 1.45, color: 'rgba(255,255,255,0.76)' }}>
                          {reason}
                        </div>
                      ))}
                    </div>
                  </button>
                )
              })
            ) : (
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.56)' }}>今晚还没有足够明确的访客选择。</div>
            )}
          </div>
        </div>
      </Html>
    </group>
  )
}
