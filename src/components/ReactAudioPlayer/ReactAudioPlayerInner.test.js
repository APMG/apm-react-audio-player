import React from 'react'
import { render } from '@testing-library/react'
import ReactAudioPlayerInner from './ReactAudioPlayerInner'

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
    expect(sources[0].getAttribute('src')).toBe('https://example.com/stream.m3u8')
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
    expect(sources[1].getAttribute('src')).toBe('https://example.com/second.aac')
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
    const backwardControls = container.querySelectorAll('.player-backward-forward-controls')

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
    const backwardControls = container.querySelectorAll('.player-backward-forward-controls')

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
    const backwardControls = container.querySelectorAll('.player-backward-forward-controls')

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
    const backwardControls = container.querySelectorAll('.player-backward-forward-controls')

    expect(timeline).toBeNull()
    expect(backwardControls.length).toBe(0)
  })
})
