interface IconProps {
  className?: string
}

const strokeProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

export function RainIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...strokeProps}>
      <path d="M6.9 12.9a3.3 3.3 0 0 1 .2-6.5 5.1 5.1 0 0 1 9.5-1 3.6 3.6 0 0 1 1.1 7.5H6.9Z" />
      <path d="M9.1 16.2 8.2 18.4M12.5 16.2l-.9 2.2M15.9 16.2l-.9 2.2" />
    </svg>
  )
}

export function CoffeeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...strokeProps}>
      <path d="M4.9 10.4h11.3v4.7a4.5 4.5 0 0 1-4.5 4.5H9.4a4.5 4.5 0 0 1-4.5-4.5v-4.7Z" />
      <path d="M16.2 11.4h1.3a2.6 2.6 0 0 1 0 5.2h-1.3" />
      <path d="M8.4 7.6c-.6-.9.5-1.4.2-2.3M11.9 7.6c-.6-.9.5-1.4.2-2.3" />
    </svg>
  )
}

export function BirdIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...strokeProps}>
      <path d="M17.7 5.3a3 3 0 0 0-3.2 3v1.4l-9.2 7.1 8.1-.8 2.3 2.9v-3.2a3 3 0 0 0 2-10.4Z" />
      <circle cx="15.9" cy="7.7" r="0.7" fill="currentColor" stroke="none" />
      <path d="M5.6 19.3c1.9 0 3-.8 3.6-2.2" />
    </svg>
  )
}

export function PlayIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path
        d="M7.8 5.6c0-1 1.1-1.6 1.9-1.1l9.6 6.4c.7.5.7 1.5 0 2l-9.6 6.4c-.8.5-1.9-.1-1.9-1.1V5.6Z"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function PauseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <rect x="7" y="5.4" width="3.5" height="13.2" rx="1.5" />
      <rect x="13.5" y="5.4" width="3.5" height="13.2" rx="1.5" />
    </svg>
  )
}

export function ResetIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...strokeProps}>
      <path d="M5.2 12a6.9 6.9 0 1 0 2.2-5" />
      <path d="M5.2 5.3v4.2h4.2" />
    </svg>
  )
}

export function VolumeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...strokeProps}>
      <path d="M11.1 5.7 7.5 8.9H4.7v6.2h2.8l3.6 3.2V5.7Z" />
      <path d="M15 9.2a4 4 0 0 1 0 5.6M17.7 6.6a7.7 7.7 0 0 1 0 10.8" />
    </svg>
  )
}

export function SparkleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M11.6 2.9c.6 4.6 2 6 6.6 6.6-4.6.6-6 2-6.6 6.6-.6-4.6-2-6-6.6-6.6 4.6-.6 6-2 6.6-6.6Z" />
      <path d="M18.1 15.1c.3 2 1.1 2.8 3.1 3.1-2 .3-2.8 1.1-3.1 3.1-.3-2-1.1-2.8-3.1-3.1 2-.3 2.8-1.1 3.1-3.1Z" />
    </svg>
  )
}
