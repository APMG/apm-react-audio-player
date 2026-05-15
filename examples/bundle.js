// examples/hls-example.jsx
import React5, { useRef as useRef4 } from 'react'

// src/components/ReactAudioPlayer/ReactAudioPlayer.js
import React4, { useRef as useRef3 } from 'react'

// src/hooks/useReactAudioPlayer.js
import { useState, useRef, useEffect } from 'react'
var useAudioPlayer = (
  audioRef,
  progressBarRef,
  volumeCtrl,
  initialDuration = void 0
) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(initialDuration)
  const [currentTime, setCurrentTime] = useState(0)
  const [isFinishedPlaying, setIsFinishedPlaying] = useState(false)
  const animationRef = useRef()
  const [isMuted, setIsMuted] = useState(false)
  const isStream = audioRef.current && audioRef.current.duration === Infinity
  useEffect(() => {
    if (currentTime === Number(duration)) {
      setIsFinishedPlaying(true)
    }
  }, [currentTime])
  useEffect(() => {
    if (duration === Infinity && animationRef.current) {
      window.cancelAnimationFrame(animationRef.current)
    }
  }, [duration])
  const onLoadedMetadata = () => {
    if (!audioRef.current) return
    const seconds = Math.floor(audioRef.current.duration)
    setDuration(seconds)
    if (audioRef.current.duration !== Infinity && progressBarRef.current) {
      progressBarRef.current.max = seconds
    }
  }
  const updateCurrentTime = () => {
    if (progressBarRef.current) {
      setCurrentTime(progressBarRef.current.value)
    }
  }
  const whilePlaying = () => {
    if (!progressBarRef.current || !audioRef.current) {
      return
    }
    if (audioRef.current.duration !== Infinity) {
      progressBarRef.current.value = Math.floor(audioRef.current.currentTime)
      progressBarRef.current.style.setProperty(
        '--seek-before-width',
        `${(progressBarRef.current.value / duration) * 100}%`
      )
    }
    updateCurrentTime()
    if (!isStream && progressBarRef.current.value === duration) {
      setIsFinishedPlaying(true)
      return
    }
    animationRef.current = window.requestAnimationFrame(whilePlaying)
  }
  const pause = () => {
    setIsPlaying(false)
    audioRef.current.pause()
    window.cancelAnimationFrame(animationRef.current)
  }
  const play = () => {
    setIsPlaying(true)
    setIsFinishedPlaying(false)
    audioRef.current.play()
    const dur = audioRef.current.duration
    if (dur !== Infinity && !isNaN(dur) && isFinite(dur)) {
      animationRef.current = window.requestAnimationFrame(whilePlaying)
    }
  }
  const toggleMute = () => {
    setIsMuted(!isMuted)
  }
  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60)
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`
    const seconds = Math.floor(secs % 60)
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`
    return `${returnedMinutes}:${returnedSeconds}`
  }
  const togglePlaying = () => {
    if (!isPlaying) {
      play()
    } else {
      pause()
    }
  }
  const changePlayerCurrentTime = () => {
    if (!progressBarRef.current || !audioRef.current) return
    audioRef.current.currentTime = progressBarRef.current.value
    setCurrentTime(progressBarRef.current.value)
    progressBarRef.current.style.setProperty(
      '--seek-before-width',
      `${(progressBarRef.current.value / duration) * 100}%`
    )
  }
  const changeRange = () => {
    if (!progressBarRef.current || !audioRef.current) return
    audioRef.current.currentTime = progressBarRef.current.value
    updateCurrentTime()
    changePlayerCurrentTime()
  }
  const rewindControl = () => {
    if (!progressBarRef.current) return
    progressBarRef.current.value = Number(progressBarRef.current.value) - 15
    changeRange()
  }
  const forwardControl = () => {
    if (!progressBarRef.current) return
    progressBarRef.current.value = Number(progressBarRef.current.value) + 15
    changeRange()
  }
  const volumeControl = (e) => {
    if (!audioRef.current) return
    const { value } = e.target
    const volume = value / 100
    audioRef.current.volume = volume
  }
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
  return {
    onLoadedMetadata,
    calculateTime,
    togglePlaying,
    changePlayerCurrentTime,
    rewindControl,
    forwardControl,
    play,
    pause,
    isPlaying,
    isFinishedPlaying,
    currentTime,
    duration,
    volumeCtrl,
    isMuted,
    volumeControl,
    toggleMute,
    formatCalculateTime
  }
}

// src/components/ReactAudioPlayer/ReactAudioPlayerInner.js
import React3, { useRef as useRef2, useEffect as useEffect2 } from 'react'

// src/components/icons/Play/Play.js
import React from 'react'
var Play = () => {
  return /* @__PURE__ */ React.createElement(
    'svg',
    {
      stroke: 'currentColor',
      fill: 'currentColor',
      strokeWidth: '0',
      viewBox: '0 0 448 512',
      className: 'play',
      height: '1em',
      width: '1em',
      xmlns: 'http://www.w3.org/2000/svg',
      role: 'img',
      'aria-labelledby': 'play playButton'
    },
    /* @__PURE__ */ React.createElement('title', { id: 'play' }, 'Play'),
    /* @__PURE__ */ React.createElement(
      'desc',
      { id: 'playButton' },
      'Play Button'
    ),
    /* @__PURE__ */ React.createElement('path', {
      d: 'M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z'
    })
  )
}
var Play_default = Play

// src/components/icons/Pause/Pause.js
import React2 from 'react'
var Pause = () => {
  return /* @__PURE__ */ React2.createElement(
    'svg',
    {
      stroke: 'currentColor',
      fill: 'currentColor',
      strokeWidth: '0',
      viewBox: '0 0 448 512',
      height: '1em',
      width: '1em',
      xmlns: 'http://www.w3.org/2000/svg',
      role: 'img',
      'aria-labelledby': 'pause pauseButton'
    },
    /* @__PURE__ */ React2.createElement('title', { id: 'pause' }, 'Pause'),
    /* @__PURE__ */ React2.createElement(
      'desc',
      { id: 'pauseButton' },
      'Pause Button'
    ),
    /* @__PURE__ */ React2.createElement('path', {
      d: 'M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z'
    })
  )
}
var Pause_default = Pause

// src/components/ReactAudioPlayer/ReactAudioPlayerInner.js
var getTypeFromExtension = (url) => {
  const extension = url.split('.').pop().split('?')[0]
  switch (extension) {
    case 'm3u8':
      return 'application/x-mpegURL'
    case 'aac':
      return 'audio/aac'
    case 'mp3':
      return 'audio/mpeg'
    case 'ogg':
      return 'audio/ogg'
    case 'wav':
      return 'audio/wav'
    default:
      return void 0
  }
}
var ReactAudioPlayerInner = (props) => {
  const audioPlayerRef = props.audioPlayerRef ?? useRef2()
  const progressBarRef = props.progressBarRef ?? useRef2()
  const customStyles = props ? props.style : ''
  const {
    title,
    audioSrc,
    volumeCtrl,
    playBtnClass,
    customHtml,
    onLoadedMetadata,
    calculateTime,
    togglePlaying,
    changePlayerCurrentTime,
    isPlaying,
    currentTime,
    duration,
    volumeControl,
    toggleMute,
    isMuted,
    formatCalculateTime,
    rewindControl,
    forwardControl,
    subtitle,
    prefix
  } = props
  const audioDuration = duration && !isNaN(duration) && calculateTime(duration)
  const formatDuration =
    duration &&
    !isNaN(duration) &&
    audioDuration &&
    formatCalculateTime(audioDuration)
  useEffect2(() => {
    if (audioPlayerRef.current && audioSrc) {
      try {
        audioPlayerRef.current.load()
      } catch (err) {
        console.warn('Failed to reload audio source:', err)
      }
    }
  }, [JSON.stringify(audioSrc)])
  useEffect2(() => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.volume = 1
    }
  }, [])
  const showControls =
    duration !== Infinity &&
    duration !== void 0 &&
    !isNaN(duration) &&
    isFinite(duration)
  return (
    audioSrc &&
    /* @__PURE__ */ React3.createElement(
      'div',
      {
        className: 'audioPlayer',
        style: customStyles && customStyles.audioPlayer
      },
      /* @__PURE__ */ React3.createElement(
        'audio',
        {
          ref: audioPlayerRef,
          preload: 'none',
          onLoadedMetadata,
          muted: isMuted
        },
        Array.isArray(audioSrc)
          ? audioSrc.map((src, index) =>
              /* @__PURE__ */ React3.createElement('source', {
                key: index,
                src,
                type: getTypeFromExtension(src)
              })
            )
          : audioSrc
          ? /* @__PURE__ */ React3.createElement('source', {
              src: audioSrc,
              type: getTypeFromExtension(audioSrc)
            })
          : null,
        'Your browser does not support the audio element.'
      ),
      /* @__PURE__ */ React3.createElement(
        'div',
        { className: 'player-layout' },
        volumeCtrl &&
          /* @__PURE__ */ React3.createElement(
            'div',
            { className: 'player-controls-secondary-outer' },
            /* @__PURE__ */ React3.createElement(
              'div',
              { className: 'player-volume-control' },
              /* @__PURE__ */ React3.createElement(
                'div',
                { className: 'player-volume-icon' },
                /* @__PURE__ */ React3.createElement(
                  'button',
                  {
                    onClick: toggleMute,
                    'aria-label': isMuted === true ? 'Muted' : 'Not Muted',
                    title: isMuted === true ? 'Muted' : 'Not Muted'
                  },
                  !isMuted
                    ? /* @__PURE__ */ React3.createElement('img', {
                        src: '/img/icon-volume-low.svg',
                        alt: 'Volume Button'
                      })
                    : /* @__PURE__ */ React3.createElement('img', {
                        src: '/img/icon-volume-mute.svg',
                        alt: 'Volume Mute Button'
                      })
                )
              ),
              /* @__PURE__ */ React3.createElement(
                'div',
                { className: 'player-timeline player-controls-secondary' },
                /* @__PURE__ */ React3.createElement('input', {
                  id: 'player-volume',
                  type: 'range',
                  className: 'player-volume-progress',
                  min: 0,
                  max: 100,
                  defaultValue: 100,
                  'aria-hidden': 'true',
                  'aria-valuetext': '100%',
                  onChange: (e) => volumeControl(e)
                })
              ),
              /* @__PURE__ */ React3.createElement(
                'div',
                null,
                /* @__PURE__ */ React3.createElement('img', {
                  src: '/img/icon-volume-high.svg',
                  alt: 'Volume Button'
                })
              )
            ),
            /* @__PURE__ */ React3.createElement(
              'div',
              { className: 'player-volume-label' },
              'Volume'
            )
          ),
        /* @__PURE__ */ React3.createElement(
          'div',
          { className: 'player-controls' },
          showControls &&
            /* @__PURE__ */ React3.createElement(
              'div',
              { className: 'player-backward-forward-controls' },
              /* @__PURE__ */ React3.createElement(
                'button',
                { onClick: rewindControl },
                /* @__PURE__ */ React3.createElement('img', {
                  src: '/img/icon-rewind-15.svg',
                  alt: 'Backward 15 seconds'
                })
              )
            ),
          /* @__PURE__ */ React3.createElement(
            'div',
            {
              className: `${
                isPlaying ? 'is-playing' : ''
              } player-btn-play-pause-outer`
            },
            /* @__PURE__ */ React3.createElement(
              'button',
              {
                onClick: togglePlaying,
                className: playBtnClass,
                style: customStyles && customStyles.playPause,
                id: 'playbutton'
              },
              isPlaying
                ? /* @__PURE__ */ React3.createElement(Pause_default, null)
                : /* @__PURE__ */ React3.createElement(Play_default, null)
            )
          ),
          showControls &&
            /* @__PURE__ */ React3.createElement(
              'div',
              { className: 'player-backward-forward-controls' },
              /* @__PURE__ */ React3.createElement(
                'button',
                { onClick: forwardControl },
                /* @__PURE__ */ React3.createElement('img', {
                  src: '/img/icon-forward-15.svg',
                  alt: 'Forward 15 seconds'
                })
              )
            )
        ),
        showControls &&
          /* @__PURE__ */ React3.createElement(
            'div',
            { className: 'player-timeline' },
            /* @__PURE__ */ React3.createElement(
              'div',
              { className: 'player-currentTime' },
              calculateTime(currentTime)
            ),
            /* @__PURE__ */ React3.createElement(
              'div',
              { className: 'player-timeline-progress-outer' },
              /* @__PURE__ */ React3.createElement('input', {
                type: 'range',
                className: 'player-timeline-progress',
                defaultValue: '0',
                ref: progressBarRef,
                onChange: changePlayerCurrentTime,
                'aria-label': 'Audio progress',
                max: duration
              })
            ),
            /* @__PURE__ */ React3.createElement(
              'div',
              {
                className: 'player-duration',
                style: customStyles && customStyles.duration
              },
              duration && !isNaN(duration) ? calculateTime(duration) : '-- : --'
            )
          ),
        /* @__PURE__ */ React3.createElement(
          'div',
          { className: 'player-content' },
          customHtml && customHtml,
          /* @__PURE__ */ React3.createElement(
            'div',
            { className: 'player-audio-type type-sm' },
            duration === Infinity
              ? /* @__PURE__ */ React3.createElement(
                  'div',
                  { className: 'player-live-label' },
                  prefix ? prefix : 'On Air'
                )
              : /* @__PURE__ */ React3.createElement(
                  'div',
                  { className: 'player-label' },
                  'listen',
                  /* @__PURE__ */ React3.createElement(
                    'div',
                    { className: 'player-label-duration' },
                    `[${formatDuration}]`
                  )
                ),
            /* @__PURE__ */ React3.createElement(
              'div',
              { className: 'player-title' },
              title || '',
              ' ',
              subtitle && `by ${subtitle}`,
              ' '
            )
          )
        )
      )
    )
  )
}
var ReactAudioPlayerInner_default = ReactAudioPlayerInner

// examples/hls-example.jsx
var HLSExample = () => {
  return /* @__PURE__ */ React5.createElement(
    'div',
    { style: { maxWidth: '800px', margin: '50px auto', padding: '20px' } },
    /* @__PURE__ */ React5.createElement(
      'h1',
      null,
      'HLS Audio Player Examples'
    ),
    /* @__PURE__ */ React5.createElement(
      'section',
      {
        style: {
          marginBottom: '40px',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '5px'
        }
      },
      /* @__PURE__ */ React5.createElement(
        'h2',
        null,
        'Example 1: HLS with Progressive Enhancement'
      ),
      /* @__PURE__ */ React5.createElement(
        'p',
        {
          style: { background: '#f0f0f0', padding: '10px', borderRadius: '3px' }
        },
        /* @__PURE__ */ React5.createElement('strong', null, 'Sources:'),
        ' HLS (.m3u8) \u2192 AAC \u2192 MP3',
        /* @__PURE__ */ React5.createElement('br', null),
        /* @__PURE__ */ React5.createElement('strong', null, 'Expected:'),
        ' Modern browsers use HLS, older browsers fall back to AAC/MP3'
      ),
      /* @__PURE__ */ React5.createElement(HLSPlayer, {
        title: 'Podcast Episode with HLS',
        audioSrc: [
          'https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_4x3/bipbop_4x3_variant.m3u8',
          'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
        ]
      })
    ),
    /* @__PURE__ */ React5.createElement(
      'section',
      {
        style: {
          marginBottom: '40px',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '5px'
        }
      },
      /* @__PURE__ */ React5.createElement(
        'h2',
        null,
        'Example 2: HLS Live Stream'
      ),
      /* @__PURE__ */ React5.createElement(
        'p',
        {
          style: { background: '#f0f0f0', padding: '10px', borderRadius: '3px' }
        },
        /* @__PURE__ */ React5.createElement('strong', null, 'Source:'),
        ' HLS live stream (.m3u8)',
        /* @__PURE__ */ React5.createElement('br', null),
        /* @__PURE__ */ React5.createElement('strong', null, 'Expected:'),
        ' Timeline controls hidden, "On Air" label shown, duration = Infinity'
      ),
      /* @__PURE__ */ React5.createElement(HLSPlayer, {
        title: 'MPR Current Live',
        audioSrc: [
          'https://hls.stream.publicradio.org/current-hls/playlist.m3u8',
          'https://current.stream.publicradio.org/current.aac'
        ]
      })
    ),
    /* @__PURE__ */ React5.createElement(
      'section',
      {
        style: {
          marginBottom: '40px',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '5px'
        }
      },
      /* @__PURE__ */ React5.createElement(
        'h2',
        null,
        'Example 3: Regular MP3 (Backward Compatible)'
      ),
      /* @__PURE__ */ React5.createElement(
        'p',
        {
          style: { background: '#f0f0f0', padding: '10px', borderRadius: '3px' }
        },
        /* @__PURE__ */ React5.createElement('strong', null, 'Source:'),
        ' MP3 only (single string)',
        /* @__PURE__ */ React5.createElement('br', null),
        /* @__PURE__ */ React5.createElement('strong', null, 'Expected:'),
        ' Timeline controls shown, duration displayed'
      ),
      /* @__PURE__ */ React5.createElement(HLSPlayer, {
        title: 'Regular Audio Track',
        audioSrc:
          'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
      })
    ),
    /* @__PURE__ */ React5.createElement(
      'section',
      {
        style: {
          padding: '20px',
          background: '#1e1e1e',
          color: '#00ff00',
          borderRadius: '5px'
        }
      },
      /* @__PURE__ */ React5.createElement(
        'h3',
        { style: { marginTop: 0, color: '#00ff00' } },
        'Browser Information'
      ),
      /* @__PURE__ */ React5.createElement(BrowserInfo, null)
    )
  )
}
var HLSPlayer = ({ title, audioSrc }) => {
  const audioPlayerRef = useRef4()
  const progressBarRef = useRef4()
  const {
    isPlaying,
    currentTime,
    duration,
    isMuted,
    onLoadedMetadata,
    calculateTime,
    togglePlaying,
    changePlayerCurrentTime,
    volumeControl,
    toggleMute,
    formatCalculateTime,
    rewindControl,
    forwardControl
  } = useAudioPlayer(audioPlayerRef, progressBarRef)
  React5.useEffect(() => {
    if (duration !== void 0) {
      const isLive = duration === Infinity
      console.log(`[${title}] Loaded:`, {
        duration: isLive ? 'Infinity (LIVE)' : `${duration}s`,
        source: audioPlayerRef.current?.currentSrc,
        isLive
      })
    }
  }, [duration, title])
  return /* @__PURE__ */ React5.createElement(ReactAudioPlayerInner_default, {
    title,
    audioSrc,
    audioPlayerRef,
    progressBarRef,
    onLoadedMetadata,
    isPlaying,
    togglePlaying,
    isMuted,
    currentTime,
    duration,
    toggleMute,
    volumeCtrl: true,
    volumeControl,
    changePlayerCurrentTime,
    rewindControl,
    forwardControl,
    calculateTime,
    formatCalculateTime
  })
}
var BrowserInfo = () => {
  const [hlsSupported, setHlsSupported] = React5.useState(false)
  React5.useEffect(() => {
    const audio = document.createElement('audio')
    const supported = audio.canPlayType('application/x-mpegURL') !== ''
    setHlsSupported(supported)
  }, [])
  return /* @__PURE__ */ React5.createElement(
    'div',
    { style: { fontFamily: 'monospace', fontSize: '14px' } },
    /* @__PURE__ */ React5.createElement(
      'div',
      null,
      'Browser: ',
      navigator.userAgent
    ),
    /* @__PURE__ */ React5.createElement(
      'div',
      null,
      'Platform: ',
      navigator.platform
    ),
    /* @__PURE__ */ React5.createElement(
      'div',
      { style: { color: hlsSupported ? '#00ffff' : '#ffff00' } },
      'Native HLS Support: ',
      hlsSupported ? 'YES \u2713' : 'NO \u2717'
    ),
    /* @__PURE__ */ React5.createElement(
      'div',
      { style: { marginTop: '10px', fontSize: '12px', color: '#888' } },
      'Check the browser console for detailed playback information.'
    )
  )
}
var hls_example_default = HLSExample
if (typeof document !== 'undefined') {
  import('react-dom/client').then(({ createRoot }) => {
    const root = createRoot(document.getElementById('root'))
    root.render(/* @__PURE__ */ React5.createElement(HLSExample, null))
  })
}
export { hls_example_default as default }
