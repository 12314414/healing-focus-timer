import { useEffect, useRef, useState } from 'react'
import EncouragementModal from './components/EncouragementModal'
import SoundscapePicker from './components/SoundscapePicker'
import TimerPanel from './components/TimerPanel'
import { BREAK_MESSAGES, ENCOURAGEMENTS } from './lib/encouragements'
import { MODES, type ModeId } from './lib/modes'
import { soundEngine, type SoundId } from './lib/sounds'
import { formatTime } from './lib/time'

interface EncourageCard {
  eyebrow: string
  message: string
}

export default function App() {
  const [modeId, setModeId] = useState<ModeId>('focus')
  const mode = MODES.find((item) => item.id === modeId) ?? MODES[0]
  const totalMs = mode.minutes * 60_000

  const [remainingMs, setRemainingMs] = useState(totalMs)
  const [isRunning, setIsRunning] = useState(false)
  const [activeSound, setActiveSound] = useState<SoundId | null>(null)
  const [volume, setVolume] = useState(55)
  const [card, setCard] = useState<EncourageCard | null>(null)

  const remainingRef = useRef(remainingMs)
  const deadlineRef = useRef(0)

  const applyRemaining = (ms: number) => {
    remainingRef.current = ms
    setRemainingMs(ms)
  }

  // 切换模式时，停止计时并回到该模式的完整时长
  useEffect(() => {
    const duration = (MODES.find((item) => item.id === modeId) ?? MODES[0]).minutes * 60_000
    remainingRef.current = duration
    setRemainingMs(duration)
    setIsRunning(false)
  }, [modeId])

  // 基于截止时间计时，避免 setInterval 漂移
  useEffect(() => {
    if (!isRunning) return

    const deadline = Date.now() + remainingRef.current
    deadlineRef.current = deadline

    const timer = window.setInterval(() => {
      const left = deadline - Date.now()

      if (left <= 0) {
        window.clearInterval(timer)
        remainingRef.current = 0
        setRemainingMs(0)
        setIsRunning(false)

        const pool = modeId === 'focus' ? ENCOURAGEMENTS : BREAK_MESSAGES
        setCard({
          eyebrow: modeId === 'focus' ? '番茄钟完成' : '休息结束',
          message: pool[Math.floor(Math.random() * pool.length)],
        })
        return
      }

      remainingRef.current = left
      setRemainingMs(left)
    }, 200)

    return () => window.clearInterval(timer)
  }, [isRunning, modeId])

  // 让标签页标题同步剩余时间
  useEffect(() => {
    document.title = isRunning
      ? `${formatTime(remainingMs)} · ${mode.label}中`
      : '静一静 · 治愈系白噪音专注计时器'
  }, [isRunning, remainingMs, mode.label])

  useEffect(() => () => soundEngine.stop(), [])

  const handleStart = () => {
    if (remainingRef.current <= 0) applyRemaining(totalMs)
    setIsRunning(true)
  }

  const handlePause = () => {
    if (deadlineRef.current > 0) {
      applyRemaining(Math.max(0, deadlineRef.current - Date.now()))
    }
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    applyRemaining(totalMs)
  }

  const handleToggleSound = async (id: SoundId) => {
    if (activeSound === id) {
      soundEngine.stop()
      setActiveSound(null)
      return
    }

    try {
      await soundEngine.play(id)
      setActiveSound(id)
    } catch {
      setActiveSound(null)
    }
  }

  const handleVolumeChange = (value: number) => {
    setVolume(value)
    soundEngine.setVolume(value / 100)
  }

  const closeCard = () => {
    setCard(null)
    setIsRunning(false)
    applyRemaining(totalMs)
  }

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[linear-gradient(165deg,#edf4ff_0%,#f2ecff_42%,#fdeef5_100%)] px-4 py-10 text-slate-800 sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 -left-24 h-80 w-80 animate-float rounded-full bg-[#c7dcff]/50 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -right-28 h-96 w-96 animate-float rounded-full bg-[#e3d4ff]/50 blur-3xl [animation-delay:-4s]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 animate-float rounded-full bg-[#ffd9e4]/40 blur-3xl [animation-delay:-8s]"
      />

      <main className="relative z-10 flex w-full max-w-[480px] flex-col items-center gap-4">
        <header className="mb-1 flex items-center gap-2 rounded-full border border-white/60 bg-white/40 px-3.5 py-1.5 backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-indigo-300 to-sky-300" />
          <span className="text-[10px] tracking-[0.3em] text-slate-500">静一静 · 专注</span>
        </header>

        <TimerPanel
          modes={MODES}
          modeId={modeId}
          tagline={mode.tagline}
          remainingMs={remainingMs}
          totalMs={totalMs}
          isRunning={isRunning}
          onModeChange={setModeId}
          onStart={handleStart}
          onPause={handlePause}
          onReset={handleReset}
        />

        <SoundscapePicker
          active={activeSound}
          volume={volume}
          onToggle={handleToggleSound}
          onVolumeChange={handleVolumeChange}
        />

        <footer className="mt-1 text-center text-[10px] tracking-[0.16em] text-slate-400">
          声音由浏览器实时合成 · 不需要任何外部音频文件
        </footer>
      </main>

      <EncouragementModal
        open={card !== null}
        eyebrow={card?.eyebrow ?? ''}
        message={card?.message ?? ''}
        onClose={closeCard}
      />
    </div>
  )
}
