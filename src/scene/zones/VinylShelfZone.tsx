import { Html } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import { useMuseumSceneStore } from '../../store/useMuseumSceneStore'

const CARD_COLUMNS = 4
const CARD_COUNT = 12

function artistLabel(song: { artistIds: string[]; artistNames?: string[] }) {
  if (song.artistNames && song.artistNames.length > 0) {
    return song.artistNames.slice(0, 2).join(', ')
  }
  return song.artistIds.length > 0 ? `${song.artistIds.length} artists` : 'NetEase favorite'
}

export function VinylShelfZone() {
  const songs = useMuseumSceneStore((state) => state.songs)
  const selectedSongId = useMuseumSceneStore((state) => state.selectedSongId)
  const selectSong = useMuseumSceneStore((state) => state.selectSong)
  const loadRandomPlayableFavorites = useMuseumSceneStore(
    (state) => state.loadRandomPlayableFavorites,
  )
  const libraryHint = useMuseumSceneStore((state) => state.libraryHint)
  const libraryBusy = useMuseumSceneStore((state) => state.libraryBusy)
  const didLoadRef = useRef(false)

  useEffect(() => {
    if (didLoadRef.current) return
    didLoadRef.current = true
    void loadRandomPlayableFavorites(CARD_COUNT)
  }, [loadRandomPlayableFavorites])

  const visibleSongs = useMemo(() => songs.slice(0, CARD_COUNT), [songs])

  return (
    <group name="VinylShelfZone" position={[-5.3, 1.2, -1.1]}>
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[0.6, 4.9, 5.8]} />
        <meshStandardMaterial color="#1d2322" />
      </mesh>

      <Html transform distanceFactor={1.05} position={[0.38, 1.05, 0]}>
        <div
          style={{
            width: 420,
            padding: 18,
            borderRadius: 24,
            background: 'rgba(10, 20, 19, 0.94)',
            border: '1px solid rgba(142, 246, 212, 0.14)',
            boxShadow: '0 18px 48px rgba(0,0,0,0.28)',
            color: '#f2f5f4',
            fontFamily: '"Avenir Next", "Segoe UI", sans-serif',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(191, 233, 223, 0.62)',
                }}
              >
                NetEase Favorites
              </div>
              <div style={{ marginTop: 4, fontSize: 26, fontWeight: 800 }}>
                红心可播随机 12 首
              </div>
            </div>

            <button
              type="button"
              onClick={() => void loadRandomPlayableFavorites(CARD_COUNT)}
              disabled={libraryBusy}
              style={{
                border: '1px solid rgba(142, 246, 212, 0.22)',
                borderRadius: 999,
                padding: '10px 16px',
                background: libraryBusy ? 'rgba(255,255,255,0.08)' : '#6ee7b7',
                color: libraryBusy ? 'rgba(255,255,255,0.52)' : '#052e2b',
                fontSize: 13,
                fontWeight: 800,
                cursor: libraryBusy ? 'default' : 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {libraryBusy ? '载入中…' : '随机换一批'}
            </button>
          </div>

          <div
            style={{
              marginTop: 8,
              fontSize: 12,
              lineHeight: 1.5,
              color: 'rgba(209, 250, 229, 0.7)',
            }}
          >
            {libraryHint}
          </div>

          <div
            style={{
              marginTop: 16,
              display: 'grid',
              gridTemplateColumns: `repeat(${CARD_COLUMNS}, minmax(0, 1fr))`,
              gap: 12,
            }}
          >
            {visibleSongs.map((song) => {
              const active = song.id === selectedSongId
              return (
                <button
                  key={song.id}
                  type="button"
                  onClick={() => selectSong(song.id)}
                  style={{
                    display: 'block',
                    width: '100%',
                    borderRadius: 14,
                    border: active
                      ? '2px solid rgba(110, 231, 183, 0.95)'
                      : '1px solid rgba(255,255,255,0.1)',
                    background: active ? 'rgba(17, 24, 39, 0.96)' : 'rgba(23, 34, 33, 0.92)',
                    padding: 6,
                    cursor: 'pointer',
                    boxShadow: active
                      ? '0 0 0 1px rgba(110,231,183,0.18), 0 10px 20px rgba(0,0,0,0.25)'
                      : 'none',
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      aspectRatio: '1 / 1',
                      overflow: 'hidden',
                      borderRadius: 10,
                      background:
                        'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03))',
                    }}
                  >
                    {song.coverImgUrl ? (
                      <img
                        src={song.coverImgUrl}
                        alt={song.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    ) : null}
                    <div
                      style={{
                        position: 'absolute',
                        right: 6,
                        bottom: 6,
                        width: 12,
                        height: 12,
                        borderRadius: 999,
                        background: '#4ade80',
                        boxShadow: '0 0 10px rgba(74,222,128,0.7)',
                        border: '1px solid rgba(0,0,0,0.35)',
                      }}
                    />
                  </div>

                  <div
                    style={{
                      marginTop: 7,
                      fontSize: 12,
                      fontWeight: 700,
                      lineHeight: 1.25,
                      color: '#f8fafc',
                      textAlign: 'left',
                      minHeight: 30,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {song.name}
                  </div>
                  <div
                    style={{
                      marginTop: 2,
                      fontSize: 10,
                      textAlign: 'left',
                      color: 'rgba(209, 250, 229, 0.62)',
                    }}
                  >
                    {artistLabel(song)}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </Html>
    </group>
  )
}
