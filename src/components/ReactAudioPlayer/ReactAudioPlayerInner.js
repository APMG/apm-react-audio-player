import React, { useRef, useEffect } from 'react'
import Hls from 'hls.js'
import Play from '../icons/Play/Play'
import Pause from '../icons/Pause/Pause'

const getHlsSrc = (audioSrc) => {
  const urls = Array.isArray(audioSrc) ? audioSrc : [audioSrc]
  return urls.find((url) => url && url.split('?')[0].endsWith('.m3u8')) ?? null
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
  const recoveryTimerRef = useRef(null)
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
    prefix,
    intendedPlayingRef
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
    if (recoveryTimerRef.current) {
      clearTimeout(recoveryTimerRef.current)
      recoveryTimerRef.current = null
    }
    if (hlsRef.current) {
      hlsRef.current.destroy()
      hlsRef.current = null
    }

    const hlsSrc = getHlsSrc(audioSrc)
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

    if (hlsSrc && Hls.isSupported()) {
      // Recover from fatal errors instead of letting playback die silently.
      // Without recovery, one manifest/fragment fetch that fails past hls.js's
      // internal retries stops loading permanently — the buffer drains and
      // audio cuts out while the UI still reports a live stream. A single
      // startLoad() retry is not enough either: after a sustained outage
      // hls.js can stop emitting errors entirely, so recovery must be driven
      // by our own timers until fragments actually buffer again.
      let recoveryAttempts = 0
      let inRecoveryEpisode = false

      const clearRecoveryTimer = () => {
        if (recoveryTimerRef.current) {
          clearTimeout(recoveryTimerRef.current)
          recoveryTimerRef.current = null
        }
      }

      // Was the user's last deliberate action "play"? Prefer the intent ref
      // (survives OS interruptions and rebuild-induced pauses); fall back to
      // element-mirroring isPlaying when the app doesn't provide it.
      const userWantsPlayback = () =>
        intendedPlayingRef ? intendedPlayingRef.current : isPlayingRef.current

      const createHlsInstance = () => {
        const hls = new Hls({
          autoStartLoad: false,
          liveSyncDurationCount: 3,
          liveMaxLatencyDurationCount: 5,
          enableWorker: !isSafari,
          // Safari's MSE stalls at EXT-X-DISCONTINUITY boundaries without extra buffer tolerance.
          ...(isSafari && {
            maxBufferHole: 2,
            maxSeekHole: 2,
          }),
        })
        // Healthy again: fragments are flowing, stand down. If the recovery
        // process left the element paused (rebuilds run the media load
        // algorithm, which pauses silently) and the user still wants
        // playback, restart audio — the element was unlocked by the user's
        // original gesture, so this play() is permitted.
        hls.on(Hls.Events.FRAG_BUFFERED, () => {
          recoveryAttempts = 0
          clearRecoveryTimer()
          if (!inRecoveryEpisode) return
          inRecoveryEpisode = false
          const audio = audioPlayerRef.current
          if (audio && audio.paused && userWantsPlayback()) {
            const promise = audio.play()
            if (promise !== undefined) promise.catch(() => {})
          }
        })
        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (!data.fatal) return
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            inRecoveryEpisode = true
            scheduleRecovery(hls)
          } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError()
          } else {
            hls.destroy()
            if (hlsRef.current === hls) hlsRef.current = null
          }
        })
        hls.loadSource(hlsSrc)
        hls.attachMedia(audioPlayerRef.current)
        hlsRef.current = hls
        return hls
      }

      // Retry loop: 1s after the first fatal error, then every 10s until
      // FRAG_BUFFERED clears it. Attempts 1-2 restart loading in place; every
      // 3rd attempt tears the instance down and rebuilds it — the programmatic
      // equivalent of the page reload users otherwise perform by hand, which
      // clears hls.js/MSE states that startLoad() alone cannot escape.
      const scheduleRecovery = (hls) => {
        if (recoveryTimerRef.current) return // retry already pending
        const delay = recoveryAttempts === 0 ? 1000 : 10000
        recoveryTimerRef.current = setTimeout(() => {
          recoveryTimerRef.current = null
          if (hlsRef.current !== hls || !audioPlayerRef.current) return
          recoveryAttempts++
          if (recoveryAttempts % 3 === 0) {
            hls.destroy()
            const fresh = createHlsInstance()
            fresh.startLoad(-1)
            scheduleRecovery(fresh)
          } else {
            hls.startLoad(-1)
            // Watchdog: if this attempt buffers nothing, FRAG_BUFFERED never
            // clears the loop and the next timer escalates.
            scheduleRecovery(hls)
          }
        }, delay)
      }

      createHlsInstance()
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
      if (recoveryTimerRef.current) {
        clearTimeout(recoveryTimerRef.current)
        recoveryTimerRef.current = null
      }
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
        >
          {!isHlsManaged &&
            (Array.isArray(audioSrc) ? audioSrc : [audioSrc]).map((url, i) => (
              <source key={i} src={url} type={getTypeFromExtension(url)} />
            ))}
        </audio>
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
                  <div className='player-label-duration'>{`[${formatDuration ?? '-- : --'}]`}</div>
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
