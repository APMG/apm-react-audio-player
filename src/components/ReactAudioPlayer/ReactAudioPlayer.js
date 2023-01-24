import React, { useRef } from 'react'
// import styles from '../../ReactAudioPlayer.module.css'
import { BsArrowLeftShort, BsArrowRightShort } from 'react-icons/bs'
import { FaPlay, FaPause } from 'react-icons/fa'
import { useAudioPlayer } from '../../hooks/ReactAudioPlayer'

const ReactAudioPlayer = (props) => {
  // references
  const audioPlayer = useRef() // reference our audio component
  const progressBar = useRef() // reference our progress bar

  const customStyles = props ? props.style : ''
  const { title, description, audioSrc, forwardBackward } = props

  // hooks
  const {
    onLoadedMetadata,
    calculateTime,
    togglePlaying,
    changePlayerCurrentTime,
    backThirty,
    forwardThirty,
    isPlaying,
    currentTime,
    duration
  } = useAudioPlayer(audioPlayer, progressBar)

  return (
    audioSrc && (
      <div
        className='audioPlayer'
        style={customStyles && customStyles.audioPlayer}
      >
        <audio
          ref={audioPlayer}
          src={audioSrc}
          preload='metadata'
          onLoadedMetadata={onLoadedMetadata}
        />

        {/* back 30 seconds */}
        {forwardBackward && (
          <button className='forwardBackward' onClick={backThirty}>
            30
            <BsArrowLeftShort />
          </button>
        )}
        <div className='playPauseContainer'>
          <button
            onClick={togglePlaying}
            className='playPause'
            style={customStyles && customStyles.playPause}
          >
            {isPlaying ? <FaPause /> : <FaPlay className='play' />}
          </button>
        </div>

        {/* skip to 30 seconds */}
        {forwardBackward && (
          <button className='forwardBackward' onClick={forwardThirty}>
            <BsArrowRightShort />
            30
          </button>
        )}

        {/* current time */}
        <div className='currentTime'>{calculateTime(currentTime)}</div>

        {/* progress bar */}
        <div className='progressBarContainer'>
          <input
            type='range'
            className='progressBar'
            defaultValue='0'
            ref={progressBar}
            onChange={changePlayerCurrentTime}
          />
        </div>

        {/* duration */}
        <div className='duration' style={customStyles && customStyles.duration}>
          {duration && !isNaN(duration) && calculateTime(duration)}
        </div>

        {/* title and description */}
        <div className='textBox'>
          <div className='textBoxTitle'>
            {title || 'Audio Player missing title'}
          </div>
          <div className='textBoxDescription'>
            {description || 'Audio Player missing description'}
          </div>
        </div>
      </div>
    )
  )
}

export default ReactAudioPlayer
