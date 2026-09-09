/*
 * Soft Mac-style startup chime — synthesized live with the Web Audio API.
 * No audio files, zero network cost. The chord is a wide B♭ major spread
 * (the same chord family as the classic Macintosh startup "bong").
 *
 * Loudness design: laptop/phone speakers physically cannot reproduce a
 * 116 Hz fundamental, so the chord carries its energy in the 200–950 Hz
 * harmonics (Bb3 core + triangle body, D4, F4, Bb4, Bb5) and opens with a
 * pitch-dropping "bong" thump whose overtones read as loud on small
 * speakers. Everything routes through a master gain into a compressor so
 * the summed chord is full without clipping.
 *
 * Browsers block audio until the user interacts with the page. This module
 * therefore treats playback as a promise: it only reports success when the
 * AudioContext is actually running, and the preloader arms a persistent
 * gesture fallback that retries on every tap/keypress until it sounds.
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

/**
 * True when audio cannot currently sound (no Web Audio, or the context is
 * not running — i.e. autoplay policy still holds the context suspended).
 */
export function isAudioBlocked() {
  const at = getCtx()
  return !at || at.state !== 'running'
}

/**
 * Resolve true only once the context is actually running. If it starts
 * suspended, resume() and wait briefly — a resume triggered inside a user
 * gesture completes within milliseconds.
 */
function ensureRunning(at, timeoutMs = 500) {
  if (at.state === 'running') return Promise.resolve(true)
  return new Promise((resolve) => {
    let settled = false
    const done = (ok) => {
      if (settled) return
      settled = true
      at.removeEventListener('statechange', onChange)
      clearTimeout(timer)
      resolve(ok)
    }
    const onChange = () => {
      if (at.state === 'running') done(true)
    }
    const timer = setTimeout(() => done(at.state === 'running'), timeoutMs)
    at.addEventListener('statechange', onChange)
    at.resume().catch(() => {})
  })
}

function playVoice(at, dest, freq, gainValue, startDelay, duration, type = 'sine') {
  const osc = at.createOscillator()
  const osc2 = at.createOscillator()
  const gain = at.createGain()
  const filter = at.createBiquadFilter()

  osc.type = type
  osc2.type = type
  osc.frequency.value = freq
  osc2.frequency.value = freq * 1.004 // slow detune beat = analog warmth

  filter.type = 'lowpass'
  filter.frequency.value = Math.min(freq * 6, 6200)
  filter.Q.value = 0.4

  const t0 = at.currentTime + startDelay
  // Struck-bell envelope: quick attack, long decay
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.exponentialRampToValueAtTime(gainValue, t0 + 0.05)
  gain.gain.exponentialRampToValueAtTime(gainValue * 0.5, t0 + 1.2)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)

  osc.connect(gain)
  osc2.connect(gain)
  gain.connect(filter)
  filter.connect(dest)

  osc.start(t0)
  osc2.start(t0)
  osc.stop(t0 + duration + 0.1)
  osc2.stop(t0 + duration + 0.1)
}

/**
 * Play the startup chime. Resolves true if it actually sounded,
 * false if the AudioContext could not be started (autoplay policy).
 */
export function playStartupChime() {
  const at = getCtx()
  if (!at) return Promise.resolve(false)

  return ensureRunning(at).then((running) => {
    if (!running) return false

    const now = at.currentTime

    // Master bus → compressor → destination. Every voice routes through
    // here so the chord sums loud but never clips.
    const master = at.createGain()
    master.gain.value = 1.0
    const comp = at.createDynamicsCompressor()
    comp.threshold.value = -14
    comp.knee.value = 24
    comp.ratio.value = 5
    comp.attack.value = 0.004
    comp.release.value = 0.35
    master.connect(comp)
    comp.connect(at.destination)

    // Percussive "bong" attack: a pitch-dropping thump whose overtones
    // give the chord its strike transient (and audible punch on small
    // speakers that can't reproduce the low fundamental).
    const thumpGain = at.createGain()
    thumpGain.gain.setValueAtTime(0.55, now)
    thumpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9)
    const thump = at.createOscillator()
    thump.type = 'sine'
    thump.frequency.setValueAtTime(170, now)
    thump.frequency.exponentialRampToValueAtTime(58, now + 0.35)
    thump.connect(thumpGain)
    thumpGain.connect(master)
    thump.start(now)
    thump.stop(now + 1)

    // B♭ major spread — energy placed in ranges small speakers reproduce.
    const voices = [
      { f: 116.54, g: 0.45, d: 5.5 },          // Bb2 root (body on good speakers)
      { f: 174.61, g: 0.30, d: 5.0 },          // F3  fifth
      { f: 233.08, g: 0.40, d: 4.8 },          // Bb3 octave core
      { f: 233.08, g: 0.16, d: 4.4, t: 'triangle' }, // Bb3 harmonic richness
      { f: 293.66, g: 0.26, d: 4.2 },          // D4  major third
      { f: 349.23, g: 0.18, d: 3.8 },          // F4  fifth above
      { f: 466.16, g: 0.14, d: 3.4 },          // Bb4 shimmer
      { f: 932.33, g: 0.06, d: 2.6 },          // Bb5 glass
    ]
    voices.forEach((v, i) => playVoice(at, master, v.f, v.g, i * 0.015, v.d, v.t))
    return true
  })
}

/**
 * Arm a persistent fallback for autoplay-blocked playback: on every
 * tap/keypress, try to resume the context and play; only stop listening
 * once the chime has actually sounded. Returns a cleanup function.
 */
export function armChimeFallback() {
  const events = ['pointerdown', 'touchstart', 'keydown']
  const fire = () => {
    playStartupChime().then((ok) => {
      if (ok) teardown()
      // Still blocked? Keep listening — the next gesture retries.
    })
  }
  const opts = { passive: true }
  events.forEach((e) => window.addEventListener(e, fire, opts))
  function teardown() {
    events.forEach((e) => window.removeEventListener(e, fire))
  }
  return teardown
}
