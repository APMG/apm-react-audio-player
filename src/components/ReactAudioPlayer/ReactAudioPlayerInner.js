import React, { useRef, useEffect } from 'react'
import Hls from 'hls.js'
import Play from '../icons/Play/Play'
import Pause from '../icons/Pause/Pause'

const getHlsSrc = (audioSrc) => {
  const urls = Array.isArray(audioSrc) ? audioSrc : [audioSrc]
  return urls.find((url) => url && url.split('?')[0].endsWith('.m3u8')) ?? null
}

const getNonHlsSrc = (audioSrc) => {
  if (!Array.isArray(audioSrc)) return audioSrc || undefined
  const nonHls = audioSrc.find((url) => url && !url.split('?')[0].endsWith('.m3u8'))
  return nonHls ?? audioSrc[0] ?? undefined
}

const getTypeFromExtension = (url) => {
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
      return undefined // Let browser auto-detect
  }
}

const ReactAudioPlayerInner = (props) => {
  // Always call hooks unconditionally — use internal refs when props don't provide them
  const internalAudioRef = useRef()
  const internalProgressBarRef = useRef()
  const internalHlsRef = useRef(null)
  const hasInitializedRef = useRef(false)
  // Track isPlaying via a ref so the source-change useEffect can read the
  // current value without adding isPlaying to its dependency array.
  const isPlayingRef = useRef(false)

  const customStyles = props ? props.style : ''
  const {
    title,
    audioSrc,
    volumeCtrl,
    playBtnClass,
    customHtml,
    onLoadedMetadata,
    resetDuration,
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

  const audioPlayerRef = props.audioPlayerRef ?? internalAudioRef
  const progressBarRef = props.progressBarRef ?? internalProgressBarRef
  const hlsRef = props.hlsRef ?? internalHlsRef
  const hlsSrcForRender = getHlsSrc(audioSrc)
  const isHlsManaged = !!(hlsSrcForRender && Hls.isSupported())

  // Keep isPlayingRef in sync on every render (runs before effects).
  isPlayingRef.current = isPlaying

  const audioDuration = duration && !isNaN(duration) && calculateTime(duration)

  const formatDuration =
    duration &&
    !isNaN(duration) &&
    audioDuration &&
    formatCalculateTime(audioDuration)

  // Manage audio source changes. For HLS sources hls.js owns the loading cycle;
  // for everything else we fall back to the native load() path.
  // JSON.stringify handles array-valued audioSrc comparisons by value.
  useEffect(() => {
    if (!audioPlayerRef.current || !audioSrc) return

    if (hasInitializedRef.current) {
      resetDuration?.()
    }

    // Tear down any existing hls.js instance before re-evaluating the source.
    if (hlsRef.current) {
      hlsRef.current.destroy()
      hlsRef.current = null
    }

    const hlsSrc = getHlsSrc(audioSrc)
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

    if (hlsSrc && Hls.isSupported()) {
      const hls = new Hls({
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 5,
        enableWorker: !isSafari,
        // Safari's MSE stalls at EXT-X-DISCONTINUITY boundaries without extra buffer tolerance.
        ...(isSafari && {
          maxBufferHole: 2,
          maxSeekHole: 2,
        }),
      })
      hls.loadSource(hlsSrc)
      hls.attachMedia(audioPlayerRef.current)
      hlsRef.current = hls
    } else {
      // Non-HLS: call load() to prime the new source.
      // Safari: skip load() when playing — the synchronous play() called in the
      //   gesture handler would be aborted (AbortError), losing the user activation token.
      // Chrome/Firefox: always call load(); AudioContext defers play() via pendingPlayRef
      //   until after this effect, so load() and play() are sequenced with no concurrent abort.
      if (hasInitializedRef.current && (!isSafari || !isPlayingRef.current)) {
        try {
          audioPlayerRef.current.load()
        } catch (err) {
          console.warn('Failed to reload audio source:', err)
        }
      }
    }

    hasInitializedRef.current = true

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [JSON.stringify(audioSrc)])

  // Set initial volume to 100%
  useEffect(() => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.volume = 1.0
    }
  }, [])

  // Helper to determine if controls should show
  const showControls =
    duration !== Infinity &&
    duration !== undefined &&
    !isNaN(duration) &&
    isFinite(duration)

  return (
    audioSrc && (
      <div
        className='audioPlayer'
        style={customStyles && customStyles.audioPlayer}
      >
        <audio
          ref={audioPlayerRef}
          preload='none'
          onLoadedMetadata={onLoadedMetadata}
          muted={isMuted}
          src={isHlsManaged ? undefined : getNonHlsSrc(audioSrc)}
        />
        <div className='player-layout'>
          {volumeCtrl && (
            <div className='player-controls-secondary-outer'>
              <div className='player-volume-control'>
                <div className='player-volume-icon'>
                  <button
                    onClick={toggleMute}
                    aria-label={isMuted === true ? 'Muted' : 'Not Muted'}
                    title={isMuted === true ? 'Muted' : 'Not Muted'}
                  >
                    {!isMuted ? (
                      <img src='/img/icon-volume-low.svg' alt='Volume Button' />
                    ) : (
                      <img
                        src='/img/icon-volume-mute.svg'
                        alt='Volume Mute Button'
                      />
                    )}
                  </button>
                </div>
                <div className='player-timeline player-controls-secondary'>
                  <input
                    id='player-volume'
                    type='range'
                    className='player-volume-progress'
                    min={0}
                    max={100}
                    defaultValue={100}
                    aria-hidden='true'
                    aria-valuetext='100%'
                    onChange={(e) => volumeControl(e)}
                  />
                </div>
                <div>
                  <img src='/img/icon-volume-high.svg' alt='Volume Button' />
                </div>
              </div>
              <div className='player-volume-label'>Volume</div>
            </div>
          )}
          <div className='player-controls'>
            {showControls && (
              <div className='player-backward-forward-controls'>
                <button onClick={rewindControl}>
                  <img
                    src='/img/icon-rewind-15.svg'
                    alt='Backward 15 seconds'
                  />
                </button>
              </div>
            )}
            <div
              className={`${
                isPlaying ? 'is-playing' : ''
              } player-btn-play-pause-outer`}
            >
              <button
                onClick={togglePlaying}
                className={playBtnClass}
                style={customStyles && customStyles.playPause}
                id='playbutton'
              >
                {isPlaying ? <Pause /> : <Play />}
              </button>
            </div>
            {showControls && (
              <div className='player-backward-forward-controls'>
                <button onClick={forwardControl}>
                  <img
                    src='/img/icon-forward-15.svg'
                    alt='Forward 15 seconds'
                  />
                </button>
              </div>
            )}
          </div>
          {showControls && (
            <div className='player-timeline'>
              <div className='player-currentTime'>
                {calculateTime(currentTime)}
              </div>
              <div className='player-timeline-progress-outer'>
                <input
                  type='range'
                  className='player-timeline-progress'
                  defaultValue='0'
                  ref={progressBarRef}
                  onChange={changePlayerCurrentTime}
                  aria-label='Audio progress'
                  max={duration}
                />
              </div>
              <div
                className='player-duration'
                style={customStyles && customStyles.duration}
              >
                {duration && !isNaN(duration)
                  ? calculateTime(duration)
                  : '-- : --'}
              </div>
            </div>
          )}
          <div className='player-content'>
            {customHtml && customHtml}
            <div className='player-audio-type type-sm'>
              {duration === Infinity ? (
                <div className='player-live-label'>
                  {prefix ? prefix : 'On Air'}
                </div>
              ) : (
                <div className='player-label'>
                  listen
                  <div className='player-label-duration'>{`[${formatDuration}]`}</div>
                </div>
              )}
              <div className='player-title'>
                {title || ''} {subtitle && `by ${subtitle}`}{' '}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  )
}

export default ReactAudioPlayerInner
