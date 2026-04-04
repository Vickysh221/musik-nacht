import { useEffect, useMemo, useRef, useState } from 'react'
import { useMuseumSceneStore } from '../../store/useMuseumSceneStore'
import type { BotSceneConfig } from '../../data/botSceneMap'

// ── LRC utilities (mirrors FloatingLyricsOverlay) ────────────
type LyricLine = { time: number; text: string; translation?: string }
const LRC_PATTERN = /^\[(\d{2}):(\d{2})(?:\.(\d{1,3}))?\](.*)$/

function parseLrc(source?: string | null): LyricLine[] {
  if (!source) return []
  return source
    .split('\n')
    .map((line) => {
      const match = line.match(LRC_PATTERN)
      if (!match) return null
      const [, mm, ss, fraction = '0', text] = match
      const norm = fraction.padEnd(3, '0').slice(0, 3)
      return { time: Number(mm) * 60 + Number(ss) + Number(norm) / 1000, text: text.trim() }
    })
    .filter((l): l is LyricLine => Boolean(l && l.text))
}

function mergeLyrics(primary: LyricLine[], translated: LyricLine[]): LyricLine[] {
  if (translated.length === 0) return primary
  const byTime = new Map(translated.map((l) => [l.time.toFixed(2), l.text]))
  return primary.map((l) => ({ ...l, translation: byTime.get(l.time.toFixed(2)) }))
}

// ── Component ─────────────────────────────────────────────────
interface BotLyricsLayerProps {
  config: BotSceneConfig
}

const KEYFRAME_LYRIC_IN = `
  @keyframes botLyricIn {
    0%   { opacity: 0; transform: translateY(10px); filter: blur(5px); }
    100% { opacity: 1; transform: translateY(0);    filter: blur(0); }
  }
`
const KEYFRAME_LYRIC_GLYPH = `
  @keyframes botLyricGlyph {
    0%   { opacity: 0; letter-spacing: 0.18em; }
    100% { opacity: 1; letter-spacing: var(--ls); }
  }
`
const KEYFRAME_LYRIC_RAIN = `
  @keyframes botLyricRain {
    0%   { opacity: 0; transform: translateX(-4px) skewX(-2deg); filter: blur(3px); }
    100% { opacity: 1; transform: translateX(0)   skewX(0deg);   filter: blur(0); }
  }
`

export function BotLyricsLayer({ config }: BotLyricsLayerProps) {
  const songs             = useMuseumSceneStore((s) => s.songs)
  const selectedSongId    = useMuseumSceneStore((s) => s.selectedSongId)
  const playback          = useMuseumSceneStore((s) => s.playback)
  const refreshPlayerState= useMuseumSceneStore((s) => s.refreshPlayerState)

  const [lyrics,      setLyrics]      = useState<LyricLine[]>([])
  const [lyricHint,   setLyricHint]   = useState('歌词待载入')
  const [displayProg, setDisplayProg] = useState(playback.progress ?? 0)
  const syncRef = useRef<number | null>(null)

  const selectedSong = useMemo(
    () => songs.find((s) => s.id === selectedSongId) ?? null,
    [songs, selectedSongId],
  )

  // ── Progress interpolation ──
  useEffect(() => {
    setDisplayProg(playback.progress ?? 0)
    syncRef.current = playback.status === 'playing' ? Date.now() : null
  }, [playback.progress, playback.status, selectedSongId])

  useEffect(() => {
    if (playback.status !== 'playing') return
    const id = window.setInterval(() => {
      const base = playback.progress ?? 0
      const start = syncRef.current
      if (!start) return
      setDisplayProg(base + (Date.now() - start) / 1000)
    }, 180)
    return () => window.clearInterval(id)
  }, [playback.progress, playback.status])

  useEffect(() => {
    if (playback.status !== 'playing') return
    const id = window.setInterval(() => { void refreshPlayerState() }, 2500)
    return () => window.clearInterval(id)
  }, [playback.status, refreshPlayerState])

  // ── Fetch lyrics ──
  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!selectedSong?.id) return
      setLyricHint('歌词载入中…')
      try {
        const res  = await fetch(`/api/library/lyrics?songId=${selectedSong.id}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data?.message ?? '歌词加载失败')
        if (cancelled) return
        const merged = mergeLyrics(parseLrc(data?.lyric), parseLrc(data?.transLyric))
        const bridgeUnavailable = !data?.lyric && !data?.transLyric && !data?.noLyric && !data?.pureMusic
        setLyrics(merged)
        setLyricHint(
          bridgeUnavailable ? '歌词桥接暂不可用'
          : data?.noLyric ? '这首歌没有歌词'
          : data?.pureMusic ? '纯音乐'
          : merged.length > 0 ? ''
          : '未解析到可同步歌词',
        )
      } catch (e) {
        if (cancelled) return
        setLyrics([])
        setLyricHint(e instanceof Error ? e.message : '歌词加载失败')
      }
    }
    void load()
    return () => { cancelled = true }
  }, [selectedSong?.id])

  // ── Active line ──
  const activeIdx = useMemo(() => {
    if (!lyrics.length) return -1
    for (let i = lyrics.length - 1; i >= 0; i--)
      if (displayProg >= lyrics[i].time) return i
    return -1
  }, [lyrics, displayProg])

  const activeLine = activeIdx >= 0 ? lyrics[activeIdx] : null
  const nextLine   = activeIdx >= 0 ? (lyrics[activeIdx + 1] ?? null) : (lyrics[0] ?? null)

  if (!selectedSong) return null

  // ── Variant-specific animation name ──
  const animName =
    config.lyricSurfaceType === 'moonlight-glyph' ? 'botLyricGlyph'
    : config.lyricSurfaceType === 'rain-glass-projection' ? 'botLyricRain'
    : 'botLyricIn'

  return (
    <div
      style={{
        position: 'fixed',
        zIndex: 40,
        pointerEvents: 'none',
        width: 400,
        ...config.lyricPosition,
      }}
    >
      <style>{KEYFRAME_LYRIC_IN + KEYFRAME_LYRIC_GLYPH + KEYFRAME_LYRIC_RAIN}</style>

      {activeLine ? (
        <div key={`${selectedSong.id}-${activeIdx}`} style={{ display: 'grid', gap: 7 }}>
          <div
            style={{
              fontSize: config.lyricStyle.fontSize,
              fontWeight: config.lyricStyle.fontWeight,
              color: config.lyricStyle.color,
              textShadow: config.lyricStyle.textShadow,
              letterSpacing: config.lyricStyle.letterSpacing,
              lineHeight: 1.32,
              animation: `${animName} 380ms ease-out`,
              // moonlight glyph: pass letter-spacing as CSS var
              ['--ls' as string]: config.lyricStyle.letterSpacing ?? '0em',
            }}
          >
            {activeLine.text}
          </div>

          {activeLine.translation ? (
            <div
              style={{
                fontSize: Math.round(config.lyricStyle.fontSize * 0.56),
                lineHeight: 1.45,
                color: config.lyricStyle.color,
                textShadow: config.lyricStyle.textShadow,
                opacity: 0.72,
                animation: `${animName} 500ms ease-out`,
              }}
            >
              {activeLine.translation}
            </div>
          ) : null}

          {nextLine ? (
            <div
              style={{
                marginTop: 2,
                fontSize: Math.round(config.lyricStyle.fontSize * 0.6),
                lineHeight: 1.4,
                color: config.lyricStyle.color,
                opacity: 0.35,
                textShadow: config.lyricStyle.textShadow,
              }}
            >
              {nextLine.text}
            </div>
          ) : null}
        </div>
      ) : (
        <div
          style={{
            fontSize: 13,
            lineHeight: 1.5,
            color: config.lyricStyle.color,
            opacity: 0.45,
            textShadow: config.lyricStyle.textShadow,
          }}
        >
          {lyricHint}
        </div>
      )}
    </div>
  )
}
