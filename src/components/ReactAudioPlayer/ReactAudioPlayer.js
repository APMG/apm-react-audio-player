import React, { useRef } from 'react'
import { useAudioPlayer } from '../../hooks/useReactAudioPlayer'
import ReactAudioPlayerInner from './ReactAudioPlayerInner'

const ReactAudioPlayer = (props) => {
  // references
  const audioPlayerRef = props.audioPlayerRef ?? useRef() // reference our audio component
  const progressBarRef = props.progressBarRef ?? useRef() // reference our progress bar

  const customStyles = props ? props.style : ''

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
    <ReactAudioPlayerInner
      {...props}
      audioPlayerRef={audioPlayerRef}
      progressBarRef={progressBarRef}
      customStyles={customStyles}
      onLoadedMetadata={onLoadedMetadata}
      calculateTime={calculateTime}
      togglePlaying={togglePlaying}
      changePlayerCurrentTime={changePlayerCurrentTime}
      isPlaying={isPlaying}
      currentTime={currentTime}
      duration={duration}
      volumeControl={volumeControl}
    />
  )
}

export default ReactAudioPlayer
