import React, { useRef } from 'react'
// import styles from '../../ReactAudioPlayer.module.css'
import Play from '../icons/Play/Play'
import Pause from '../icons/Pause/Pause'
import { useAudioPlayer } from '../../hooks/useReactAudioPlayer'

const ReactAudioPlayer = (props) => {
  // references
  const audioPlayerRef = props.audioPlayerRef ?? useRef() // reference our audio component
  const progressBarRef = props.progressBarRef ?? useRef() // reference our progress bar

  const customStyles = props ? props.style : ''
  const {
    title,
    description,
    audioSrc,
    volumeCtrl,
    playBtnClass,
    customHtml,
    customProps,
    isLive
  } = props

  // hooks
  const {
    onLoadedMetadata,
    calculateTime,
    togglePlaying,
    changePlayerCurrentTime,
    isPlaying,
    currentTime,
    duration,
    volumeControl
  } = useAudioPlayer(audioPlayerRef, progressBarRef)

  return (
    audioSrc && (
      <div>
        <div
          className='audioPlayer'
          style={customStyles && customStyles.audioPlayer}
        >
          <audio
            ref={audioPlayerRef}
            src={audioSrc}
            preload='metadata'
            onLoadedMetadata={onLoadedMetadata}
          />
          <div className='player-layout'>
            {volumeCtrl && (
              <div className='player-controls-secondary-outer'>
                <div>
                  <span className='player-volume-text'>
                    <img src='/img/icon-volume-low.svg' alt='' />
                    Volume
                  </span>
                  <div className='player-controls player-controls-secondary'>
                    <div className='player-volume'>
                      <input
                        type='range'
                        className='player-timeline-progress js-player-volume-current'
                        min={0}
                        max={100}
                        aria-hidden='true'
                        onChange={(e) => volumeControl(e)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className='player-controls'>
              <div className='player-btn-play-pause-outer'>
                <button
                  onClick={togglePlaying}
                  className={playBtnClass}
                  style={customStyles && customStyles.playPause}
                >
                  {isPlaying ? <Pause /> : <Play />}
                </button>
              </div>
            </div>
            {customHtml && customHtml}
            {customProps.audioThumbnailSrc && (
              <div className='player-thumb-and-text'>
                <div className='player-thumbnail'>
                  <img
                    className='player-thumbnail'
                    src={customProps.audioThumbnailSrc}
                    alt={customProps.audioThumbnailAlt}
                  />
                </div>
              </div>
            )}
            {!isLive && (
              <>
                {/* current time */}
                <div className='player-currentTime'>
                  {calculateTime(currentTime)}
                </div>
                {/* progress bar */}
                <div className='player-timeline'>
                  <input
                    type='range'
                    className='player-timeline-progress'
                    defaultValue='0'
                    aria-hidden='true'
                    ref={progressBarRef}
                    onChange={changePlayerCurrentTime}
                  />
                </div>
                {/* duration */}
                <div
                  className='player-duration'
                  style={customStyles && customStyles.duration}
                >
                  {duration && !isNaN(duration) && calculateTime(duration)}
                </div>
              </>
            )}
            {/* title and description */}
            <div className='player-content'>
              <div className='player-audio-type type-sm'>
                {isLive ? (
                  <div className='player-live-label'>On Air</div>
                ) : (
                  <div className='player-title'> {title || ''} </div>
                )}
                <div className='player-description'>{description || ''} </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  )
}

export default ReactAudioPlayer
