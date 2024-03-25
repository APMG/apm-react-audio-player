import React, { useRef } from 'react'
// import styles from '../../ReactAudioPlayer.module.css'
import Play from '../icons/Play/Play'
import Pause from '../icons/Pause/Pause'

const ReactAudioPlayerInner = (props) => {
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
    isMuted
  } = props

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
              <div>
                <span className='player-volume-text'>
                  <div className='player-volume-icon'>
                    <button
                      onClick={toggleMute}
                      aria-label={isMuted === true ? 'Muted' : 'Not Muted'}
                      title={isMuted === true ? 'Muted' : 'Not Muted'}
                    >
                      {!isMuted ? (
                        <img
                          src='/img/icon-volume-low.svg'
                          alt='Volume Button'
                        />
                      ) : (
                        <img
                          src='/img/icon-volume-mute.svg'
                          alt='Volume Mute Button'
                        />
                      )}
                    </button>
                  </div>
                  <label>Volume</label>
                </span>
                <div className='player-controls player-controls-secondary'>
                  <div className='player-volume'>
                    <input
                      id='player-volume'
                      type='range'
                      className='player-timeline-progress js-player-volume-current'
                      min={0}
                      max={100}
                      aria-hidden='true'
                      aria-valuetext='100%'
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
          {!isLive && (
            <>
              <div className='player-currentTime'>
                {calculateTime(currentTime)}
              </div>
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
              <div
                className='player-duration'
                style={customStyles && customStyles.duration}
              >
                {duration && !isNaN(duration) && calculateTime(duration)}
              </div>
            </>
          )}
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
    )
  )
}

export default ReactAudioPlayerInner
