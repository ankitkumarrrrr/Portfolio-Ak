/*
 * Soft Mac-style startup chime — synthesized live with the Web Audio API.
 * No audio files, zero network cost. The chord is a wide B♭ major spread
 * (the same chord family as the classic Macintosh startup "bong"):
 * a deep Bb2 root, fifths, octave, major third, and a glassy Bb5 shimmer,
 * each voice a detuned sine pair through a lowpass for warmth.
 *
 * Browsers block audio until the user interacts with the page, so this
 * module can also arm a one-shot fallback: if the context is still
 * suspended when the preloader finishes, the chime fires on the first
 * tap/keypress instead of never.
 */

let ctx = null

function getCtx() {
  if (ctx) return ctx
  try {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  } catch {
    ctx = null
  }
  return ctx
}

function playVoice(at, freq, gainValue, startDelay, duration, type = 'sine') {
  const osc = at.createOscillator()
  const osc2 = at.createOscillator()
  const gain = at.createGain()
  const filter = at.createBiquadFilter()

  osc.type = type
  osc2.type = type
  osc.frequency.value = freq
  osc2.frequency.value = freq * 1.004 // slow detune beat = analog warmth

  filter.type = 'lowpass'
  filter.frequency.value = Math.min(freq * 6, 5200)
  filter.Q.value = 0.4

  const t0 = at.currentTime + startDelay
  // Soft attack, long exponential-ish decay, gentle release
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.exponentialRampToValueAtTime(gainValue, t0 + 0.06)
  gain.gain.exponentialRampToValueAtTime(gainValue * 0.4, t0 + duration * 0.35)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)

  osc.connect(gain)
  osc2.connect(gain)
  gain.connect(filter)
  filter.connect(at.destination)

  osc.start(t0)
  osc2.start(t0)
  osc.stop(t0 + duration + 0.1)
  osc2.stop(t0 + duration + 0.1)
}

/**
 * Play the startup chime. Returns true if it actually sounded,
 * false if the AudioContext was suspended (autoplay policy).
 */
export function playStartupChime() {
  const at = getCtx()
  if (!at) return false

  if (at.state === 'suspended') {
    at.resume().catch(() => {})
    // Can't confirm audible playback — treat as blocked
    return false
  }

  const now = at.currentTime
  // Master fade so the chord blooms together
  const master = at.createGain()
  master.gain.setValueAtTime(0.0001, now)
  master.gain.exponentialRampToValueAtTime(0.9, now + 0.12)
  master.gain.connect(at.destination)
  void master

  // B♭ major spread — deep root, open fifths, warm third, glassy top
  const voices = [
    { f: 116.54, g: 0.30, d: 5.2 }, // Bb2 root
    { f: 174.61, g: 0.22, d: 4.8 }, // F3  fifth
    { f: 233.08, g: 0.24, d: 4.6 }, // Bb3 octave
    { f: 293.66, g: 0.16, d: 4.0 }, // D4  major third
    { f: 349.23, g: 0.10, d: 3.6 }, // F4  fifth above
    { f: 466.16, g: 0.08, d: 3.2 }, // Bb4 shimmer
    { f: 932.33, g: 0.04, d: 2.4 }, // Bb5 glass
  ]
  voices.forEach((v, i) => playVoice(at, v.f, v.g, i * 0.015, v.d))
  return true
}

/**
 * Arm a one-shot fallback: if the chime was blocked by autoplay policy,
 * play it the first time the visitor taps or presses any key.
 * Returns a cleanup function.
 */
export function armChimeFallback() {
  const fire = () => {
    playStartupChime()
    teardown()
  }
  const opts = { once: true, passive: true }
  const events = ['pointerdown', 'touchstart', 'keydown']
  events.forEach((e) => window.addEventListener(e, fire, opts))
  function teardown() {
    events.forEach((e) => window.removeEventListener(e, fire))
  }
  return teardown
}
