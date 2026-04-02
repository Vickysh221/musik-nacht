import { useEffect, useMemo, useRef, useState } from 'react'
import { useMuseumSceneStore } from '../store/useMuseumSceneStore'

type LyricLine = {
  time: number
  text: string
  translation?: string
}

const LRC_PATTERN = /^\[(\d{2}):(\d{2})(?:\.(\d{1,3}))?\](.*)$/

function parseLrc(source?: string | null) {
  if (!source) return []

  return source
    .split('\n')
    .map((line) => {
      const match = line.match(LRC_PATTERN)
      if (!match) return null

      const [, mm, ss, fraction = '0', text] = match
      const normalizedFraction = fraction.padEnd(3, '0').slice(0, 3)
      return {
        time: Number(mm) * 60 + Number(ss) + Number(normalizedFraction) / 1000,
        text: text.trim(),
      }
    })
    .filter((line): line is LyricLine => Boolean(line && line.text))
}

function mergeLyrics(primary: LyricLine[], translated: LyricLine[]) {
  if (translated.length === 0) return primary

  const translatedByTime = new Map(translated.map((line) => [line.time.toFixed(2), line.text]))
  return primary.map((line) => ({
    ...line,
    translation: translatedByTime.get(line.time.toFixed(2)),
  }))
}

export function FloatingLyricsOverlay() {
  const songs = useMuseumSceneStore((state) => state.songs)
  const selectedSongId = useMuseumSceneStore((state) => state.selectedSongId)
  const playback = useMuseumSceneStore((state) => state.playback)
  const refreshPlayerState = useMuseumSceneStore((state) => state.refreshPlayerState)
  const [lyrics, setLyrics] = useState<LyricLine[]>([])
  const [lyricHint, setLyricHint] = useState('歌词待载入')
  const [displayProgress, setDisplayProgress] = useState(playback.progress ?? 0)
  const syncStartedAtRef = useRef<number | null>(null)

  const selectedSong = useMemo(
    () => songs.find((song) => song.id === selectedSongId) ?? songs[0],
    [songs, selectedSongId],
  )

  const activeLyricIndex = useMemo(() => {
    if (lyrics.length === 0) return -1

    for (let i = lyrics.length - 1; i >= 0; i -= 1) {
      if (displayProgress >= lyrics[i].time) return i
    }

    return -1
  }, [lyrics, displayProgress])

  const activeLine = activeLyricIndex >= 0 ? lyrics[activeLyricIndex] : null
  const nextLine = activeLyricIndex >= 0 ? lyrics[activeLyricIndex + 1] ?? null : lyrics[0] ?? null

  useEffect(() => {
    setDisplayProgress(playback.progress ?? 0)
    syncStartedAtRef.current = playback.status === 'playing' ? Date.now() : null
  }, [playback.progress, playback.status, selectedSongId])

  useEffect(() => {
    if (playback.status !== 'playing') return

    const timer = window.setInterval(() => {
      const startedAt = syncStartedAtRef.current
      const base = playback.progress ?? 0
      if (!startedAt) return
      setDisplayProgress(base + (Date.now() - startedAt) / 1000)
    }, 180)

    return () => window.clearInterval(timer)
  }, [playback.progress, playback.status])

  useEffect(() => {
    if (playback.status !== 'playing') return

    const timer = window.setInterval(() => {
      void refreshPlayerState()
    }, 2500)

    return () => window.clearInterval(timer)
  }, [playback.status, refreshPlayerState])

  useEffect(() => {
    let cancelled = false

    async function loadLyrics() {
      if (!selectedSong?.id) return

      setLyricHint('歌词载入中…')

      try {
        const response = await fetch(`/api/library/lyrics?songId=${selectedSong.id}`)
        const result = await response.json()
        if (!response.ok) {
          throw new Error(result?.message ?? '歌词加载失败')
        }

        const merged = mergeLyrics(parseLrc(result?.lyric), parseLrc(result?.transLyric))
        if (cancelled) return

        setLyrics(merged)
        setLyricHint(
          result?.noLyric
            ? '这首歌没有歌词'
            : result?.pureMusic
              ? '纯音乐，无滚动歌词'
              : merged.length > 0
                ? ''
                : '未解析到可同步歌词',
        )
      } catch (error) {
        if (cancelled) return
        setLyrics([])
        setLyricHint(error instanceof Error ? error.message : '歌词加载失败')
      }
    }

    void loadLyrics()

    return () => {
      cancelled = true
    }
  }, [selectedSong?.id])

  if (!selectedSong) return null

  return (
    <div
      style={{
        position: 'fixed',
        left: '58%',
        top: '18%',
        transform: 'translateX(-10%) rotate(-1deg)',
        zIndex: 60,
        width: 360,
        minHeight: 100,
        color: '#f8f7ff',
        fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
        textAlign: 'center',
        pointerEvents: 'none',
      }}
    >
      {activeLine ? (
        <div key={`${selectedSong.id}-${activeLyricIndex}`} style={{ display: 'grid', gap: 8 }}>
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.28,
              fontWeight: 800,
              color: '#ffffff',
              textShadow:
                '0 2px 8px rgba(0,0,0,0.72), 0 8px 28px rgba(0,0,0,0.34), 0 0 18px rgba(167,139,250,0.18)',
              animation: 'lyricFloatIn 420ms ease-out',
            }}
          >
            {activeLine.text}
          </div>
          {activeLine.translation ? (
            <div
              style={{
                fontSize: 14,
                lineHeight: 1.45,
                color: 'rgba(235,233,254,0.88)',
                textShadow: '0 2px 10px rgba(0,0,0,0.65), 0 0 16px rgba(167,139,250,0.16)',
                animation: 'lyricFloatIn 520ms ease-out',
              }}
            >
              {activeLine.translation}
            </div>
          ) : null}
          {nextLine ? (
            <div
              style={{
                marginTop: 2,
                fontSize: 15,
                lineHeight: 1.4,
                color: 'rgba(255,255,255,0.44)',
                textShadow: '0 2px 8px rgba(0,0,0,0.55)',
              }}
            >
              {nextLine.text}
            </div>
          ) : null}
        </div>
      ) : (
        <div
          style={{
            fontSize: 14,
            lineHeight: 1.5,
            color: 'rgba(255,255,255,0.58)',
            textShadow: '0 2px 8px rgba(0,0,0,0.65)',
          }}
        >
          {lyricHint}
        </div>
      )}

      <style>
        {`
          @keyframes lyricFloatIn {
            0% {
              opacity: 0;
              transform: translateY(12px);
              filter: blur(6px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
              filter: blur(0);
            }
          }
        `}
      </style>
    </div>
  )
}
