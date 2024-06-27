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

  return (
    <ReactAudioPlayerInner
      {...props}
      audioPlayerRef={audioPlayerRef}
      progressBarRef={progressBarRef}
      isPlaying={isPlaying}
      isMuted={isMuted}
      currentTime={currentTime}
      duration={duration}
      customStyles={customStyles}
      onLoadedMetadata={onLoadedMetadata}
      calculateTime={calculateTime}
      togglePlaying={togglePlaying}
      changePlayerCurrentTime={changePlayerCurrentTime}
      volumeControl={volumeControl}
      toggleMute={toggleMute}
      formatCalculateTime={formatCalculateTime}
      rewindControl={rewindControl}
      forwardControl={forwardControl}
    />
  )
}

export default ReactAudioPlayer
