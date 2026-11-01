export type SoundId = 'rain' | 'cafe' | 'forest'

type Builder = (ctx: AudioContext, out: AudioNode) => void

/**
 * 浏览器实时合成的白噪音引擎，不依赖任何外部音频文件。
 * 音量由 master GainNode 统一控制，切换音效时静默回收所有节点与定时器。
 */
class SoundEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private volume = 0.55
  private cleanups: Array<() => void> = []
  private pendingTimers = new Set<number>()

  async play(id: SoundId) {
    this.stop()
    const ctx = this.getContext()
    if (ctx.state === 'suspended') await ctx.resume()

    const builders: Record<SoundId, Builder> = {
      rain: this.buildRain,
      cafe: this.buildCafe,
      forest: this.buildForest,
    }
    builders[id](ctx, this.master!)
  }

  stop() {
    this.pendingTimers.forEach((timer) => clearTimeout(timer))
    this.pendingTimers.clear()
    this.cleanups.forEach((cleanup) => {
      try {
        cleanup()
      } catch {
        /* 节点可能已自然结束，忽略即可 */
      }
    })
    this.cleanups = []
  }

  setVolume(value: number) {
    this.volume = Math.min(1, Math.max(0, value))
    if (this.ctx && this.master) {
      this.master.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.1)
    }
  }

  private getContext() {
    if (!this.ctx) {
      this.ctx = new AudioContext()
      this.master = this.ctx.createGain()
      this.master.gain.value = this.volume
      this.master.connect(this.ctx.destination)
    }
    return this.ctx
  }

  private noise(ctx: AudioContext, kind: 'white' | 'brown') {
    const length = Math.floor(ctx.sampleRate * 4)
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    let last = 0

    for (let i = 0; i < length; i += 1) {
      const white = Math.random() * 2 - 1
      if (kind === 'white') {
        data[i] = white * 0.5
      } else {
        last = (last + 0.02 * white) / 1.02
        data[i] = last * 3.4
      }
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true
    return source
  }

  private filter(ctx: AudioContext, type: BiquadFilterType, frequency: number, q = 0.7) {
    const node = ctx.createBiquadFilter()
    node.type = type
    node.frequency.value = frequency
    node.Q.value = q
    return node
  }

  private gain(ctx: AudioContext, value: number) {
    const node = ctx.createGain()
    node.gain.value = value
    return node
  }

  /** 用极慢的 LFO 给音量加一点起伏，听感更像自然声。 */
  private swell(ctx: AudioContext, target: GainNode, depth: number, rate: number) {
    const lfo = ctx.createOscillator()
    const amount = this.gain(ctx, depth)
    lfo.frequency.value = rate
    lfo.connect(amount)
    amount.connect(target.gain)
    lfo.start()
    this.cleanups.push(() => {
      lfo.stop()
      lfo.disconnect()
      amount.disconnect()
    })
  }

  private delay(ms: number, run: () => void) {
    const timer = window.setTimeout(() => {
      this.pendingTimers.delete(timer)
      run()
    }, ms)
    this.pendingTimers.add(timer)
  }

  private buildRain: Builder = (ctx, out) => {
    const source = this.noise(ctx, 'white')
    const clean = this.filter(ctx, 'highpass', 220, 0.8)
    const body = this.filter(ctx, 'lowpass', 2400, 0.5)
    const level = this.gain(ctx, 0.5)

    source.connect(clean)
    clean.connect(body)
    body.connect(level)
    level.connect(out)
    this.swell(ctx, level, 0.1, 0.14)

    source.start()
    this.cleanups.push(() => {
      source.stop()
      source.disconnect()
    })
  }

  private buildCafe: Builder = (ctx, out) => {
    const murmurSource = this.noise(ctx, 'brown')
    const murmurFilter = this.filter(ctx, 'lowpass', 380, 0.9)
    const murmurLevel = this.gain(ctx, 0.55)

    murmurSource.connect(murmurFilter)
    murmurFilter.connect(murmurLevel)
    murmurLevel.connect(out)
    this.swell(ctx, murmurLevel, 0.08, 0.09)

    const chatterSource = this.noise(ctx, 'white')
    const chatterFilter = this.filter(ctx, 'bandpass', 800, 1.2)
    const chatterLevel = this.gain(ctx, 0.12)

    chatterSource.connect(chatterFilter)
    chatterFilter.connect(chatterLevel)
    chatterLevel.connect(out)

    murmurSource.start()
    chatterSource.start()
    this.cleanups.push(() => {
      murmurSource.stop()
      chatterSource.stop()
      murmurSource.disconnect()
      chatterSource.disconnect()
    })

    const scheduleClink = () => {
      this.delay(1600 + Math.random() * 4200, () => {
        this.clink(ctx, out)
        scheduleClink()
      })
    }
    scheduleClink()
  }

  private buildForest: Builder = (ctx, out) => {
    const windSource = this.noise(ctx, 'white')
    const windLow = this.filter(ctx, 'lowpass', 900, 0.6)
    const windHigh = this.filter(ctx, 'highpass', 140, 0.7)
    const windLevel = this.gain(ctx, 0.16)

    windSource.connect(windHigh)
    windHigh.connect(windLow)
    windLow.connect(windLevel)
    windLevel.connect(out)
    this.swell(ctx, windLevel, 0.06, 0.18)

    windSource.start()
    this.cleanups.push(() => {
      windSource.stop()
      windSource.disconnect()
    })

    const scheduleCall = () => {
      this.delay(1800 + Math.random() * 4000, () => {
        this.birdCall(ctx, out)
        scheduleCall()
      })
    }
    scheduleCall()
  }

  /** 咖啡杯碟轻轻碰撞的一声。 */
  private clink(ctx: AudioContext, out: AudioNode) {
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const level = this.gain(ctx, 0.0001)

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(900 + Math.random() * 700, now)
    level.gain.exponentialRampToValueAtTime(0.09, now + 0.02)
    level.gain.exponentialRampToValueAtTime(0.0001, now + 0.35)

    osc.connect(level)
    level.connect(out)
    osc.start(now)
    osc.stop(now + 0.4)
  }

  private birdCall(ctx: AudioContext, out: AudioNode) {
    const chirps = 2 + Math.floor(Math.random() * 3)
    for (let i = 0; i < chirps; i += 1) {
      this.delay(i * (90 + Math.random() * 30), () => this.chirp(ctx, out))
    }
  }

  /** 一段短促的上扬音阶，听起来像林间的鸟鸣。 */
  private chirp(ctx: AudioContext, out: AudioNode) {
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const level = this.gain(ctx, 0.0001)
    const base = 1500 + Math.random() * 1800

    osc.type = 'sine'
    osc.frequency.setValueAtTime(base, now)
    osc.frequency.linearRampToValueAtTime(base * 1.4, now + 0.05)
    osc.frequency.linearRampToValueAtTime(base * 0.85, now + 0.12)
    level.gain.exponentialRampToValueAtTime(0.08, now + 0.015)
    level.gain.exponentialRampToValueAtTime(0.0001, now + 0.13)

    osc.connect(level)
    level.connect(out)
    osc.start(now)
    osc.stop(now + 0.14)
  }
}

export const soundEngine = new SoundEngine()
