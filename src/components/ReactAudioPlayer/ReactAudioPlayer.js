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
  const { title, description, audioSrc } = props

  // hooks
  const {
    onLoadedMetadata,
    calculateTime,
    togglePlaying,
    changePlayerCurrentTime,
    isPlaying,
    currentTime,
    duration
  } = useAudioPlayer(audioPlayerRef, progressBarRef)

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
        />

        <div className='playPauseContainer'>
          <button
            onClick={togglePlaying}
            className='playPause'
            style={customStyles && customStyles.playPause}
          >
            {isPlaying ? <Pause /> : <Play className='play' />}
          </button>
        </div>

        {/* current time */}
        <div className='currentTime'>{calculateTime(currentTime)}</div>

        {/* progress bar */}
        <div className='progressBarContainer'>
          <input
            type='range'
            className='progressBar'
            defaultValue='0'
            ref={progressBarRef}
            onChange={changePlayerCurrentTime}
          />
        </div>

        {/* duration */}
        <div className='duration' style={customStyles && customStyles.duration}>
          {duration && !isNaN(duration) && calculateTime(duration)}
        </div>

        {/* title and description */}
        <div className='textBox'>
          <div className='textBoxTitle'> {title || ''} </div>
          <div className='textBoxDescription'> {description || ''} </div>
        </div>
      </div>
    )
  )
}

export default ReactAudioPlayer
