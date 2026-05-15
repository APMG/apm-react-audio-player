import React from 'react'
import { render, act } from '@testing-library/react'
import ReactAudioPlayerInner from './ReactAudioPlayerInner'

jest.mock('hls.js', () => {
  const mockHlsInstance = {
    loadSource: jest.fn(),
    attachMedia: jest.fn(),
    destroy: jest.fn(),
  }
  const MockHls = jest.fn(() => mockHlsInstance)
  MockHls.isSupported = jest.fn(() => false)
  MockHls._mockInstance = mockHlsInstance
  return MockHls
})

// Helper function tests
describe('getTypeFromExtension', () => {
  // We need to test this through the component since it's not exported
  // We'll verify the type attribute on rendered source tags

  test('returns correct MIME type for .m3u8', () => {
    const props = {
      audioSrc: 'https://example.com/stream.m3u8',
      audioPlayerRef: { current: null },
      progressBarRef: { current: null },
      isPlaying: false,
      isMuted: false,
      currentTime: 0,
      duration: 100,
      onLoadedMetadata: jest.fn(),
      calculateTime: jest.fn(() => '00:00'),
      togglePlaying: jest.fn(),
      changePlayerCurrentTime: jest.fn(),
      volumeControl: jest.fn(),
      toggleMute: jest.fn(),
      formatCalculateTime: jest.fn(),
      rewindControl: jest.fn(),
      forwardControl: jest.fn()
    }

    const { container } = render(<ReactAudioPlayerInner {...props} />)
    const source = container.querySelector('source')
    expect(source.getAttribute('type')).toBe('application/x-mpegURL')
  })

  test('returns correct MIME type for .aac', () => {
    const props = {
      audioSrc: 'https://example.com/audio.aac',
      audioPlayerRef: { current: null },
      progressBarRef: { current: null },
      isPlaying: false,
      isMuted: false,
      currentTime: 0,
      duration: 100,
      onLoadedMetadata: jest.fn(),
      calculateTime: jest.fn(() => '00:00'),
      togglePlaying: jest.fn(),
      changePlayerCurrentTime: jest.fn(),
      volumeControl: jest.fn(),
      toggleMute: jest.fn(),
      formatCalculateTime: jest.fn(),
      rewindControl: jest.fn(),
      forwardControl: jest.fn()
    }

    const { container } = render(<ReactAudioPlayerInner {...props} />)
    const source = container.querySelector('source')
    expect(source.getAttribute('type')).toBe('audio/aac')
  })

  test('returns correct MIME type for .mp3', () => {
    const props = {
      audioSrc: 'https://example.com/audio.mp3',
      audioPlayerRef: { current: null },
      progressBarRef: { current: null },
      isPlaying: false,
      isMuted: false,
      currentTime: 0,
      duration: 100,
      onLoadedMetadata: jest.fn(),
      calculateTime: jest.fn(() => '00:00'),
      togglePlaying: jest.fn(),
      changePlayerCurrentTime: jest.fn(),
      volumeControl: jest.fn(),
      toggleMute: jest.fn(),
      formatCalculateTime: jest.fn(),
      rewindControl: jest.fn(),
      forwardControl: jest.fn()
    }

    const { container } = render(<ReactAudioPlayerInner {...props} />)
    const source = container.querySelector('source')
    expect(source.getAttribute('type')).toBe('audio/mpeg')
  })

  test('returns correct MIME type for .ogg', () => {
    const props = {
      audioSrc: 'https://example.com/audio.ogg',
      audioPlayerRef: { current: null },
      progressBarRef: { current: null },
      isPlaying: false,
      isMuted: false,
      currentTime: 0,
      duration: 100,
      onLoadedMetadata: jest.fn(),
      calculateTime: jest.fn(() => '00:00'),
      togglePlaying: jest.fn(),
      changePlayerCurrentTime: jest.fn(),
      volumeControl: jest.fn(),
      toggleMute: jest.fn(),
      formatCalculateTime: jest.fn(),
      rewindControl: jest.fn(),
      forwardControl: jest.fn()
    }

    const { container } = render(<ReactAudioPlayerInner {...props} />)
    const source = container.querySelector('source')
    expect(source.getAttribute('type')).toBe('audio/ogg')
  })

  test('returns correct MIME type for .wav', () => {
    const props = {
      audioSrc: 'https://example.com/audio.wav',
      audioPlayerRef: { current: null },
      progressBarRef: { current: null },
      isPlaying: false,
      isMuted: false,
      currentTime: 0,
      duration: 100,
      onLoadedMetadata: jest.fn(),
      calculateTime: jest.fn(() => '00:00'),
      togglePlaying: jest.fn(),
      changePlayerCurrentTime: jest.fn(),
      volumeControl: jest.fn(),
      toggleMute: jest.fn(),
      formatCalculateTime: jest.fn(),
      rewindControl: jest.fn(),
      forwardControl: jest.fn()
    }

    const { container } = render(<ReactAudioPlayerInner {...props} />)
    const source = container.querySelector('source')
    expect(source.getAttribute('type')).toBe('audio/wav')
  })

  test('handles URLs with query parameters', () => {
    const props = {
      audioSrc: 'https://example.com/stream.m3u8?token=abc123',
      audioPlayerRef: { current: null },
      progressBarRef: { current: null },
      isPlaying: false,
      isMuted: false,
      currentTime: 0,
      duration: 100,
      onLoadedMetadata: jest.fn(),
      calculateTime: jest.fn(() => '00:00'),
      togglePlaying: jest.fn(),
      changePlayerCurrentTime: jest.fn(),
      volumeControl: jest.fn(),
      toggleMute: jest.fn(),
      formatCalculateTime: jest.fn(),
      rewindControl: jest.fn(),
      forwardControl: jest.fn()
    }

    const { container } = render(<ReactAudioPlayerInner {...props} />)
    const source = container.querySelector('source')
    expect(source.getAttribute('type')).toBe('application/x-mpegURL')
  })
})

// Component rendering tests
describe('ReactAudioPlayerInner rendering', () => {
  test('renders single source tag with string audioSrc', () => {
    const props = {
      audioSrc: 'https://example.com/audio.mp3',
      audioPlayerRef: { current: null },
      progressBarRef: { current: null },
      isPlaying: false,
      isMuted: false,
      currentTime: 0,
      duration: 100,
      onLoadedMetadata: jest.fn(),
      calculateTime: jest.fn(() => '00:00'),
      togglePlaying: jest.fn(),
      changePlayerCurrentTime: jest.fn(),
      volumeControl: jest.fn(),
      toggleMute: jest.fn(),
      formatCalculateTime: jest.fn(),
      rewindControl: jest.fn(),
      forwardControl: jest.fn()
    }

    const { container } = render(<ReactAudioPlayerInner {...props} />)
    const sources = container.querySelectorAll('source')
    expect(sources.length).toBe(1)
    expect(sources[0].getAttribute('src')).toBe('https://example.com/audio.mp3')
    expect(sources[0].getAttribute('type')).toBe('audio/mpeg')
  })

  test('renders multiple source tags with array audioSrc', () => {
    const props = {
      audioSrc: [
        'https://example.com/stream.m3u8',
        'https://example.com/audio.aac',
        'https://example.com/audio.mp3'
      ],
      audioPlayerRef: { current: null },
      progressBarRef: { current: null },
      isPlaying: false,
      isMuted: false,
      currentTime: 0,
      duration: 100,
      onLoadedMetadata: jest.fn(),
      calculateTime: jest.fn(() => '00:00'),
      togglePlaying: jest.fn(),
      changePlayerCurrentTime: jest.fn(),
      volumeControl: jest.fn(),
      toggleMute: jest.fn(),
      formatCalculateTime: jest.fn(),
      rewindControl: jest.fn(),
      forwardControl: jest.fn()
    }

    const { container } = render(<ReactAudioPlayerInner {...props} />)
    const sources = container.querySelectorAll('source')
    expect(sources.length).toBe(3)
    expect(sources[0].getAttribute('src')).toBe(
      'https://example.com/stream.m3u8'
    )
    expect(sources[0].getAttribute('type')).toBe('application/x-mpegURL')
    expect(sources[1].getAttribute('src')).toBe('https://example.com/audio.aac')
    expect(sources[1].getAttribute('type')).toBe('audio/aac')
    expect(sources[2].getAttribute('src')).toBe('https://example.com/audio.mp3')
    expect(sources[2].getAttribute('type')).toBe('audio/mpeg')
  })

  test('maintains correct source order', () => {
    const props = {
      audioSrc: [
        'https://example.com/first.mp3',
        'https://example.com/second.aac',
        'https://example.com/third.ogg'
      ],
      audioPlayerRef: { current: null },
      progressBarRef: { current: null },
      isPlaying: false,
      isMuted: false,
      currentTime: 0,
      duration: 100,
      onLoadedMetadata: jest.fn(),
      calculateTime: jest.fn(() => '00:00'),
      togglePlaying: jest.fn(),
      changePlayerCurrentTime: jest.fn(),
      volumeControl: jest.fn(),
      toggleMute: jest.fn(),
      formatCalculateTime: jest.fn(),
      rewindControl: jest.fn(),
      forwardControl: jest.fn()
    }

    const { container } = render(<ReactAudioPlayerInner {...props} />)
    const sources = container.querySelectorAll('source')
    expect(sources[0].getAttribute('src')).toBe('https://example.com/first.mp3')
    expect(sources[1].getAttribute('src')).toBe(
      'https://example.com/second.aac'
    )
    expect(sources[2].getAttribute('src')).toBe('https://example.com/third.ogg')
  })

  test('hides timeline controls when duration is Infinity', () => {
    const props = {
      audioSrc: 'https://example.com/stream.m3u8',
      audioPlayerRef: { current: null },
      progressBarRef: { current: null },
      isPlaying: false,
      isMuted: false,
      currentTime: 0,
      duration: Infinity,
      onLoadedMetadata: jest.fn(),
      calculateTime: jest.fn(() => '00:00'),
      togglePlaying: jest.fn(),
      changePlayerCurrentTime: jest.fn(),
      volumeControl: jest.fn(),
      toggleMute: jest.fn(),
      formatCalculateTime: jest.fn(),
      rewindControl: jest.fn(),
      forwardControl: jest.fn()
    }

    const { container } = render(<ReactAudioPlayerInner {...props} />)
    const timeline = container.querySelector('.player-timeline')
    const backwardControls = container.querySelectorAll(
      '.player-backward-forward-controls'
    )

    expect(timeline).toBeNull()
    expect(backwardControls.length).toBe(0)
  })

  test('shows timeline controls when duration is finite', () => {
    const props = {
      audioSrc: 'https://example.com/audio.mp3',
      audioPlayerRef: { current: null },
      progressBarRef: { current: null },
      isPlaying: false,
      isMuted: false,
      currentTime: 0,
      duration: 180,
      onLoadedMetadata: jest.fn(),
      calculateTime: jest.fn(() => '00:00'),
      togglePlaying: jest.fn(),
      changePlayerCurrentTime: jest.fn(),
      volumeControl: jest.fn(),
      toggleMute: jest.fn(),
      formatCalculateTime: jest.fn(() => '3min 0sec'),
      rewindControl: jest.fn(),
      forwardControl: jest.fn()
    }

    const { container } = render(<ReactAudioPlayerInner {...props} />)
    const timeline = container.querySelector('.player-timeline')
    const backwardControls = container.querySelectorAll(
      '.player-backward-forward-controls'
    )

    expect(timeline).not.toBeNull()
    expect(backwardControls.length).toBe(2)
  })

  test('shows live label when duration is Infinity', () => {
    const props = {
      audioSrc: 'https://example.com/stream.m3u8',
      audioPlayerRef: { current: null },
      progressBarRef: { current: null },
      isPlaying: false,
      isMuted: false,
      currentTime: 0,
      duration: Infinity,
      onLoadedMetadata: jest.fn(),
      calculateTime: jest.fn(() => '00:00'),
      togglePlaying: jest.fn(),
      changePlayerCurrentTime: jest.fn(),
      volumeControl: jest.fn(),
      toggleMute: jest.fn(),
      formatCalculateTime: jest.fn(),
      rewindControl: jest.fn(),
      forwardControl: jest.fn()
    }

    const { container } = render(<ReactAudioPlayerInner {...props} />)
    const liveLabel = container.querySelector('.player-live-label')
    const playerLabel = container.querySelector('.player-label')

    expect(liveLabel).not.toBeNull()
    expect(playerLabel).toBeNull()
  })

  test('hides controls when duration is undefined (prevents flicker)', () => {
    const props = {
      audioSrc: 'https://example.com/audio.mp3',
      audioPlayerRef: { current: null },
      progressBarRef: { current: null },
      isPlaying: false,
      isMuted: false,
      currentTime: 0,
      duration: undefined,
      onLoadedMetadata: jest.fn(),
      calculateTime: jest.fn(() => '00:00'),
      togglePlaying: jest.fn(),
      changePlayerCurrentTime: jest.fn(),
      volumeControl: jest.fn(),
      toggleMute: jest.fn(),
      formatCalculateTime: jest.fn(),
      rewindControl: jest.fn(),
      forwardControl: jest.fn()
    }

    const { container } = render(<ReactAudioPlayerInner {...props} />)
    const timeline = container.querySelector('.player-timeline')
    const backwardControls = container.querySelectorAll(
      '.player-backward-forward-controls'
    )

    expect(timeline).toBeNull()
    expect(backwardControls.length).toBe(0)
  })

  test('hides controls when duration is NaN (prevents flicker)', () => {
    const props = {
      audioSrc: 'https://example.com/audio.mp3',
      audioPlayerRef: { current: null },
      progressBarRef: { current: null },
      isPlaying: false,
      isMuted: false,
      currentTime: 0,
      duration: NaN,
      onLoadedMetadata: jest.fn(),
      calculateTime: jest.fn(() => '00:00'),
      togglePlaying: jest.fn(),
      changePlayerCurrentTime: jest.fn(),
      volumeControl: jest.fn(),
      toggleMute: jest.fn(),
      formatCalculateTime: jest.fn(),
      rewindControl: jest.fn(),
      forwardControl: jest.fn()
    }

    const { container } = render(<ReactAudioPlayerInner {...props} />)
    const timeline = container.querySelector('.player-timeline')
    const backwardControls = container.querySelectorAll(
      '.player-backward-forward-controls'
    )

    expect(timeline).toBeNull()
    expect(backwardControls.length).toBe(0)
  })

  test('falls back to native source tags when Hls.isSupported() is false', () => {
    const props = {
      audioSrc: 'https://example.com/stream.m3u8',
      audioPlayerRef: { current: null },
      progressBarRef: { current: null },
      isPlaying: false,
      isMuted: false,
      currentTime: 0,
      duration: Infinity,
      onLoadedMetadata: jest.fn(),
      calculateTime: jest.fn(() => '00:00'),
      togglePlaying: jest.fn(),
      changePlayerCurrentTime: jest.fn(),
      volumeControl: jest.fn(),
      toggleMute: jest.fn(),
      formatCalculateTime: jest.fn(),
      rewindControl: jest.fn(),
      forwardControl: jest.fn()
    }

    const { container } = render(<ReactAudioPlayerInner {...props} />)
    // isSupported() is false in jsdom, so native <source> tag should render
    const source = container.querySelector('source')
    expect(source).not.toBeNull()
    expect(source.getAttribute('type')).toBe('application/x-mpegURL')
  })

  test('audio reload with array audioSrc - same values different reference', () => {
    const mockLoad = jest.fn()
    const audioRef = { current: { load: mockLoad } }
    const progressRef = { current: null }

    const props = {
      audioSrc: ['https://example.com/stream.m3u8'],
      audioPlayerRef: audioRef,
      progressBarRef: progressRef,
      isPlaying: false,
      isMuted: false,
      currentTime: 0,
      duration: 100,
      onLoadedMetadata: jest.fn(),
      calculateTime: jest.fn(() => '00:00'),
      togglePlaying: jest.fn(),
      changePlayerCurrentTime: jest.fn(),
      volumeControl: jest.fn(),
      toggleMute: jest.fn(),
      formatCalculateTime: jest.fn(),
      rewindControl: jest.fn(),
      forwardControl: jest.fn()
    }

    // Initial render
    const { rerender } = render(<ReactAudioPlayerInner {...props} />)
    const initialLoadCount = mockLoad.mock.calls.length

    // Rerender with new array reference but same values
    rerender(
      <ReactAudioPlayerInner
        {...props}
        audioSrc={['https://example.com/stream.m3u8']}
      />
    )

    // Should NOT reload because the values are the same
    expect(mockLoad.mock.calls.length).toBe(initialLoadCount)
  })
})

describe('hls.js integration', () => {
  let Hls

  beforeEach(() => {
    Hls = require('hls.js')
    Hls.isSupported.mockReturnValue(true)
    Hls._mockInstance.loadSource.mockClear()
    Hls._mockInstance.attachMedia.mockClear()
    Hls._mockInstance.destroy.mockClear()
    Hls.mockClear()
  })

  afterEach(() => {
    Hls.isSupported.mockReturnValue(false)
  })

  const makeProps = (audioSrc) => ({
    audioSrc,
    audioPlayerRef: { current: document.createElement('audio') },
    progressBarRef: { current: null },
    isPlaying: false,
    isMuted: false,
    currentTime: 0,
    duration: Infinity,
    onLoadedMetadata: jest.fn(),
    calculateTime: jest.fn(() => '00:00'),
    togglePlaying: jest.fn(),
    changePlayerCurrentTime: jest.fn(),
    volumeControl: jest.fn(),
    toggleMute: jest.fn(),
    formatCalculateTime: jest.fn(),
    rewindControl: jest.fn(),
    forwardControl: jest.fn()
  })

  test('initializes hls.js and loads source for .m3u8 string src', () => {
    const props = makeProps('https://example.com/stream.m3u8')
    act(() => { render(<ReactAudioPlayerInner {...props} />) })

    expect(Hls).toHaveBeenCalledTimes(1)
    expect(Hls._mockInstance.loadSource).toHaveBeenCalledWith(
      'https://example.com/stream.m3u8'
    )
    expect(Hls._mockInstance.attachMedia).toHaveBeenCalledWith(
      props.audioPlayerRef.current
    )
  })

  test('picks the .m3u8 URL from an array and initializes hls.js', () => {
    const props = makeProps([
      'https://example.com/stream.m3u8',
      'https://example.com/fallback.aac'
    ])
    act(() => { render(<ReactAudioPlayerInner {...props} />) })

    expect(Hls._mockInstance.loadSource).toHaveBeenCalledWith(
      'https://example.com/stream.m3u8'
    )
  })

  test('suppresses <source> tags when hls.js is active', async () => {
    const props = makeProps('https://example.com/stream.m3u8')
    let container
    await act(async () => {
      ;({ container } = render(<ReactAudioPlayerInner {...props} />))
    })
    // hls.js owns the source — no <source> tag should be in the DOM
    expect(container.querySelector('source')).toBeNull()
  })

  test('destroys hls.js instance when component unmounts', () => {
    const props = makeProps('https://example.com/stream.m3u8')
    let unmount
    act(() => { ;({ unmount } = render(<ReactAudioPlayerInner {...props} />)) })
    act(() => { unmount() })

    expect(Hls._mockInstance.destroy).toHaveBeenCalled()
  })

  test('destroys and recreates hls.js instance when audioSrc changes', () => {
    const props = makeProps('https://example.com/stream.m3u8')
    let rerender
    act(() => { ;({ rerender } = render(<ReactAudioPlayerInner {...props} />)) })

    act(() => {
      rerender(
        <ReactAudioPlayerInner
          {...props}
          audioSrc='https://example.com/other-stream.m3u8'
        />
      )
    })

    expect(Hls._mockInstance.destroy).toHaveBeenCalled()
    expect(Hls._mockInstance.loadSource).toHaveBeenLastCalledWith(
      'https://example.com/other-stream.m3u8'
    )
  })

  test('does not use hls.js for non-HLS sources', () => {
    const props = makeProps('https://example.com/audio.mp3')
    act(() => { render(<ReactAudioPlayerInner {...props} />) })

    expect(Hls).not.toHaveBeenCalled()
  })
})
