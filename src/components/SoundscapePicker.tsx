import type { SoundId } from '../lib/sounds'
import { BirdIcon, CoffeeIcon, RainIcon, VolumeIcon } from './icons'

const SOUNDS: { id: SoundId; label: string; hint: string; Icon: typeof RainIcon }[] = [
  { id: 'rain', label: '下雨声', hint: '窗边细雨', Icon: RainIcon },
  { id: 'cafe', label: '咖啡馆', hint: '低声人语', Icon: CoffeeIcon },
  { id: 'forest', label: '森林鸟鸣', hint: '风过林梢', Icon: BirdIcon },
]

interface SoundscapePickerProps {
  active: SoundId | null
  volume: number
  onToggle: (id: SoundId) => void
  onVolumeChange: (value: number) => void
}

export default function SoundscapePicker({
  active,
  volume,
  onToggle,
  onVolumeChange,
}: SoundscapePickerProps) {
  return (
    <section className="w-full rounded-[26px] border border-white/55 bg-white/25 p-5 shadow-[0_18px_44px_-30px_rgba(128,118,190,0.6)] backdrop-blur-md sm:rounded-[30px] sm:p-6">
      <div className="flex items-center justify-between">
        <p className="text-xs tracking-[0.22em] text-slate-500">白噪音 · 环境音</p>
        <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              active ? 'animate-pulse bg-emerald-400/80' : 'bg-slate-300'
            }`}
          />
          {active ? '播放中' : '未播放'}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2.5">
        {SOUNDS.map(({ id, label, hint, Icon }) => {
          const playing = active === id
          return (
            <button
              key={id}
              type="button"
              aria-pressed={playing}
              onClick={() => onToggle(id)}
              className={`group flex flex-col items-center gap-2 rounded-2xl border px-2 py-3.5 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-indigo-200 focus-visible:outline-none ${
                playing
                  ? 'border-white/80 bg-white/70 shadow-[0_10px_24px_-16px_rgba(120,110,190,0.7)]'
                  : 'border-white/40 bg-white/20 hover:border-white/60 hover:bg-white/40'
              }`}
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-300 ${
                  playing
                    ? 'animate-pulse bg-gradient-to-br from-[#e7e5ff] to-[#e0f0fb] text-indigo-500'
                    : 'bg-white/45 text-slate-500 group-hover:text-slate-700'
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className={`text-[13px] ${playing ? 'font-medium text-slate-700' : 'text-slate-500'}`}>
                {label}
              </span>
              <span className="hidden text-[11px] tracking-wide text-slate-400 sm:block">{hint}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <VolumeIcon
          className={`h-4 w-4 shrink-0 ${volume === 0 ? 'text-slate-300' : 'text-slate-400'}`}
        />
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={volume}
          aria-label="白噪音音量"
          onChange={(event) => onVolumeChange(Number(event.target.value))}
          className="volume-slider flex-1"
          style={{
            background: `linear-gradient(90deg, #a9a2e6 0%, #90cfe9 ${volume}%, rgba(255,255,255,0.55) ${volume}%, rgba(255,255,255,0.55) 100%)`,
          }}
        />
        <span className="w-9 shrink-0 text-right text-[11px] text-slate-400 tabular-nums">
          {volume}%
        </span>
      </div>
    </section>
  )
}
