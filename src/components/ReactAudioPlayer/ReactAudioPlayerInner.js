import React, { useRef } from 'react'
import Play from '../icons/Play/Play'
import Pause from '../icons/Pause/Pause'

const ReactAudioPlayerInner = (props) => {
  // references
  const audioPlayerRef = props.audioPlayerRef ?? useRef() // reference our audio component
  const progressBarRef = props.progressBarRef ?? useRef() // reference our progress bar

  const customStyles = props ? props.style : ''
  const {
    title,
    audioSrc,
    volumeCtrl,
    playBtnClass,
    customHtml,
    isLive,
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
    forwardControl
  } = props

  const audioDuration = duration && !isNaN(duration) && calculateTime(duration)

  const formatDuration =
    duration &&
    !isNaN(duration) &&
    audioDuration &&
    formatCalculateTime(audioDuration)

  return (
    audioSrc && (
      <div
        className='audioPlayer'
        style={customStyles && customStyles.audioPlayer}
      >
        <audio
          ref={audioPlayerRef}
          src={audioSrc}
          preload='metadata'
          onLoadedMetadata={onLoadedMetadata}
          muted={isMuted}
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
            {!isLive && (
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
              >
                {isPlaying ? <Pause /> : <Play />}
              </button>
            </div>
            {!isLive && (
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
          {!isLive && (
            <>
              <div className='player-timeline'>
                <div className='player-timeline-progress-outer'>
                  <input
                    type='range'
                    className='player-timeline-progress'
                    defaultValue='0'
                    ref={progressBarRef}
                    onChange={changePlayerCurrentTime}
                    aria-label="Audio progress"
                    max={duration}
                  />
                </div>
                <div className='player-times'>
                  <div className='player-currentTime'>
                    {calculateTime(currentTime)}
                  </div>
                  <div
                    className='player-duration'
                    style={customStyles && customStyles.duration}
                  >
                    {duration && !isNaN(duration) && calculateTime(duration)}
                  </div>
                </div>
              </div>
            </>
          )}
          <div className='player-content'>
            {customHtml && customHtml}
            <div className='player-audio-type type-sm'>
              {isLive ? (
                <div className='player-live-label'>On Air</div>
              ) : (
                <div className='player-label'>
                  listen
                  <div className='player-label-duration'>{`[${formatDuration}]`}</div>
                </div>
              )}
              <div className='player-title'>{title || ''} </div>
            </div>
          </div>
        </div>
      </div>
    )
  )
}

export default ReactAudioPlayerInner
