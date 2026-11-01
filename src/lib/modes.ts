export const MODES = [
  { id: 'focus', label: '专注', minutes: 25, tagline: '把注意力，交给眼前这一件事' },
  { id: 'break', label: '休息', minutes: 5, tagline: '松开肩膀，让呼吸慢下来' },
] as const

export type ModeId = (typeof MODES)[number]['id']
export type TimerMode = (typeof MODES)[number]
