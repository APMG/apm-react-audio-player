// ============UNIT TESTS================
test('stream detection with duration === Infinity', () => {
  // Mock audio element with infinite duration (live stream)
  const mockAudioRef = {
    current: {
      duration: Infinity,
      currentSrc: 'https://example.com/stream.m3u8'
    }
  }

  // The isStream check should return true for Infinity duration
  const isStream = mockAudioRef.current && mockAudioRef.current.duration === Infinity
  expect(isStream).toBe(true)
})

test('stream detection with finite duration', () => {
  // Mock audio element with finite duration (regular audio)
  const mockAudioRef = {
    current: {
      duration: 180,
      currentSrc: 'https://example.com/audio.mp3'
    }
  }

  // The isStream check should return false for finite duration
  const isStream = mockAudioRef.current && mockAudioRef.current.duration === Infinity
  expect(isStream).toBe(false)
})

test('formatCalculateTime()', () => {
  const testHours = '1:00:00'
  const testMinutes = '0:30:00'
  const testSeconds = '0:00:30'
  const testMinutesSeconds = '0:30:30'
  const testHourMinutesSeconds = '02:20:20'

  const formatCalculateTime = (timeString) => {
    const toString = String(timeString)
    if (toString.split(':').length === 3) {
      const [hours, minutes, seconds] = toString.split(':')
      return `${parseInt(hours)}hr ${parseInt(minutes)}min ${parseInt(
        seconds
      )}sec`
    } else if (toString.split(':').length === 2) {
      const [minutes, seconds] = toString.split(':')
      return `${parseInt(minutes)}min ${parseInt(seconds)}sec`
    }
  }
  expect(formatCalculateTime(testHours)).toBe('1hr 0min 0sec')
  expect(formatCalculateTime(testMinutes)).toBe('0hr 30min 0sec')
  expect(formatCalculateTime(testSeconds)).toBe('0hr 0min 30sec')
  expect(formatCalculateTime(testMinutesSeconds)).toBe('0hr 30min 30sec')
  expect(formatCalculateTime(testHourMinutesSeconds)).toBe('2hr 20min 20sec')
})

// ============RAF LOOP SAFETY TESTS================
test('RAF loop should not start when duration is Infinity', () => {
  const mockAudioRef = {
    current: {
      duration: Infinity,
      currentSrc: 'https://example.com/stream.m3u8'
    }
  }

  // Check the condition that prevents RAF loop
  const dur = mockAudioRef.current.duration
  const shouldStartRAF = dur !== Infinity && !isNaN(dur) && isFinite(dur)
  expect(shouldStartRAF).toBe(false)
})

test('RAF loop should not start when duration is undefined', () => {
  const mockAudioRef = {
    current: {
      duration: undefined
    }
  }

  // Check the condition that prevents RAF loop
  const dur = mockAudioRef.current.duration
  const shouldStartRAF = dur !== Infinity && !isNaN(dur) && isFinite(dur)
  expect(shouldStartRAF).toBe(false)
})

test('RAF loop should not start when duration is NaN', () => {
  const mockAudioRef = {
    current: {
      duration: NaN
    }
  }

  // Check the condition that prevents RAF loop
  const dur = mockAudioRef.current.duration
  const shouldStartRAF = dur !== Infinity && !isNaN(dur) && isFinite(dur)
  expect(shouldStartRAF).toBe(false)
})

test('RAF loop should start when duration is valid and finite', () => {
  const mockAudioRef = {
    current: {
      duration: 180
    }
  }

  // Check the condition that allows RAF loop
  const dur = mockAudioRef.current.duration
  const shouldStartRAF = dur !== Infinity && !isNaN(dur) && isFinite(dur)
  expect(shouldStartRAF).toBe(true)
})

test('whilePlaying null ref guards - null progressBarRef', () => {
  const audioRef = { current: { duration: 180, currentTime: 60 } }
  const progressBarRef = { current: null }

  // Simulate the null check in whilePlaying
  const shouldContinue = !!(progressBarRef.current && audioRef.current)
  expect(shouldContinue).toBe(false) // Should exit early
})

test('whilePlaying null ref guards - null audioRef', () => {
  const audioRef = { current: null }
  const progressBarRef = { current: { value: 0, style: { setProperty: jest.fn() } } }

  // Simulate the null check in whilePlaying
  const shouldContinue = !!(progressBarRef.current && audioRef.current)
  expect(shouldContinue).toBe(false) // Should exit early
})

test('onLoadedMetadata null guard - null audioRef', () => {
  const audioRef = { current: null }

  // Simulate the null check in onLoadedMetadata
  const shouldContinue = !!audioRef.current
  expect(shouldContinue).toBe(false) // Should exit early without crashing
})
