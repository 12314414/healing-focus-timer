import type { ModeId, TimerMode } from '../lib/modes'
import { formatTime } from '../lib/time'
import { PauseIcon, PlayIcon, ResetIcon } from './icons'

interface TimerPanelProps {
  modes: readonly TimerMode[]
  modeId: ModeId
  tagline: string
  remainingMs: number
  totalMs: number
  isRunning: boolean
  onModeChange: (id: ModeId) => void
  onStart: () => void
  onPause: () => void
  onReset: () => void
}

export default function TimerPanel({
  modes,
  modeId,
  tagline,
  remainingMs,
  totalMs,
  isRunning,
  onModeChange,
  onStart,
  onPause,
  onReset,
}: TimerPanelProps) {
  const progress = Math.min(1, Math.max(0, 1 - remainingMs / totalMs))

  return (
    <section className="relative w-full overflow-hidden rounded-[30px] border border-white/60 bg-white/30 px-5 py-7 shadow-[0_26px_60px_-28px_rgba(128,118,190,0.55)] backdrop-blur-md sm:rounded-[34px] sm:px-9 sm:py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent"
      />

      <div className="flex justify-center">
        <div className="flex gap-1 rounded-full border border-white/50 bg-white/35 p-1 backdrop-blur-sm">
          {modes.map((mode) => {
            const active = mode.id === modeId
            return (
              <button
                key={mode.id}
                type="button"
                aria-pressed={active}
                onClick={() => onModeChange(mode.id)}
                className={`min-w-[92px] rounded-full px-4 py-2 text-sm transition-all duration-300 focus-visible:ring-2 focus-visible:ring-indigo-200 focus-visible:outline-none ${
                  active
                    ? 'bg-white/85 font-semibold text-slate-700 shadow-sm shadow-indigo-200/60'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {mode.label}
                <span className={`ml-1 text-xs ${active ? 'text-indigo-400' : 'text-slate-400'}`}>
                  {mode.minutes}′
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <p className="mt-8 text-center text-[clamp(3.5rem,16vw,6.5rem)] font-extrabold leading-none tracking-[-0.03em] text-slate-800 tabular-nums select-none">
        {formatTime(remainingMs)}
      </p>

      <p className="mt-4 text-center text-xs tracking-[0.14em] text-slate-500 sm:text-sm">
        {isRunning ? '正在流动的时间里，只做这一件事' : tagline}
      </p>

      <div className="mx-auto mt-6 h-1.5 w-full max-w-[320px] overflow-hidden rounded-full bg-white/55">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#b5b0ea] via-[#cbbaf2] to-[#9fd8ec] transition-[width] duration-500 ease-linear"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={isRunning ? onPause : onStart}
          className="flex h-14 flex-1 max-w-[230px] items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#9d97e0] to-[#8fcbe6] text-[15px] font-medium text-white shadow-[0_14px_30px_-12px_rgba(110,104,190,0.7)] transition-all duration-300 hover:brightness-105 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-indigo-200 focus-visible:outline-none"
        >
          {isRunning ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
          <span>{isRunning ? '暂停' : '开始'}</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          aria-label="重置计时"
          className="flex h-14 w-14 items-center justify-center rounded-full border border-white/60 bg-white/40 text-slate-500 transition-all duration-300 hover:bg-white/65 hover:text-slate-700 active:scale-95 focus-visible:ring-2 focus-visible:ring-indigo-200 focus-visible:outline-none"
        >
          <ResetIcon className="h-[22px] w-[22px]" />
        </button>
      </div>
    </section>
  )
}
