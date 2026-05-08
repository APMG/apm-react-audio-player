import React, { useRef, useEffect } from 'react'
import Play from '../icons/Play/Play'
import Pause from '../icons/Pause/Pause'

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
  // references
  const audioPlayerRef = props.audioPlayerRef ?? useRef() // reference our audio component
  const progressBarRef = props.progressBarRef ?? useRef() // reference our progress bar
  const hasInitializedRef = useRef(false)

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

  const audioDuration = duration && !isNaN(duration) && calculateTime(duration)

  const formatDuration =
    duration &&
    !isNaN(duration) &&
    audioDuration &&
    formatCalculateTime(audioDuration)

  // Reload audio when audioSrc changes.
  // Skip load() on initial mount — calling it pre-buffers live streams so that
  // by the time the user clicks play the seekable window has advanced and
  // segments are stale. On first play the browser fetches the live edge
  // naturally. On subsequent src changes we do call load() to reset the element.
  // Use JSON.stringify to handle array comparisons by value instead of reference.
  useEffect(() => {
    if (audioPlayerRef.current && audioSrc) {
      if (hasInitializedRef.current) {
        resetDuration?.()
        try {
          audioPlayerRef.current.load()
        } catch (err) {
          console.warn('Failed to reload audio source:', err)
        }
      }
      hasInitializedRef.current = true
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
          {Array.isArray(audioSrc) ? (
            audioSrc.map((src, index) => (
              <source
                key={index}
                src={src}
                type={getTypeFromExtension(src)}
              />
            ))
          ) : audioSrc ? (
            <source src={audioSrc} type={getTypeFromExtension(audioSrc)} />
          ) : null}
          Your browser does not support the audio element.
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
