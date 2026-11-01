import { SparkleIcon } from './icons'

interface EncouragementModalProps {
  open: boolean
  eyebrow: string
  message: string
  onClose: () => void
}

export default function EncouragementModal({
  open,
  eyebrow,
  message,
  onClose,
}: EncouragementModalProps) {
  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="专注鼓励"
      className="fixed inset-0 z-50 flex items-center justify-center px-5"
    >
      <div
        className="absolute inset-0 animate-fade-in bg-[#4a4168]/25 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-[340px] animate-pop-in rounded-[30px] border border-white/70 bg-white/80 p-7 text-center shadow-[0_30px_70px_-30px_rgba(90,80,150,0.65)] backdrop-blur-xl sm:p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#e9e6ff] to-[#ffe9f3]">
          <SparkleIcon className="h-6 w-6 text-indigo-400" />
        </div>

        <p className="mt-5 text-[10px] tracking-[0.35em] text-slate-400">{eyebrow}</p>
        <p className="mt-3 text-xl leading-relaxed font-semibold text-slate-800">{message}</p>
        <p className="mt-2 text-xs leading-relaxed text-slate-500">
          深呼吸一下，让这段专注慢慢沉淀。
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 h-11 w-full rounded-full bg-gradient-to-br from-[#9d97e0] to-[#8fcbe6] text-sm font-medium text-white shadow-[0_12px_26px_-12px_rgba(110,104,190,0.7)] transition hover:brightness-105 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-indigo-200 focus-visible:outline-none"
        >
          收下这份鼓励
        </button>
      </div>
    </div>
  )
}
