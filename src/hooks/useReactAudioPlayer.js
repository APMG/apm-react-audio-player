import { useState, useRef } from 'react'

export const useAudioPlayer = (audioRef, progressBarRef, volumeCtrl) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isFinishedPlaying, setIsFinishedPlaying] = useState(false)
  const animationRef = useRef() // reference the animation
  const [isMuted, setIsMuted] = useState(false)

  const onLoadedMetadata = () => {
    const seconds = Math.floor(audioRef.current.duration)
    setDuration(seconds)

    if (!audioRef.current.currentSrc.includes('stream')) {
      progressBarRef.current.max = seconds
    }
  }

  const updateCurrentTime = () => {
    setCurrentTime(progressBarRef.current.value)
  }

  const whilePlaying = () => {
    progressBarRef.current.value = Math.floor(audioRef.current.currentTime)
    progressBarRef.current.style.setProperty(
      '--seek-before-width',
      `${(progressBarRef.current.value / duration) * 100}%`
    )
    updateCurrentTime()

    // when you reach the end of the song
    if (progressBarRef.current.value === duration) {
      restart()
      setIsFinishedPlaying(true)
      return
    }
    animationRef.current = window.requestAnimationFrame(whilePlaying)
  }

  const pause = () => {
    setIsPlaying(false)
    audioRef.current.pause()
    window.cancelAnimationFrame(animationRef.current)
  }

  const restart = () => {
    progressBarRef.current.value = 0
    updateCurrentTime()
    pause()
  }

  const play = () => {
    setIsPlaying(true)
    audioRef.current.play()
    animationRef.current = window.requestAnimationFrame(whilePlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60)
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`
    const seconds = Math.floor(secs % 60)
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`
    return `${returnedMinutes}:${returnedSeconds}`
  }

  const togglePlaying = () => {
    if (!isPlaying) {
      play()
    } else {
      pause()
    }
  }

  const changePlayerCurrentTime = () => {
    audioRef.current.currentTime = progressBarRef.current.value
    setCurrentTime(progressBarRef.current.value)

    progressBarRef.current.style.setProperty(
      '--seek-before-width',
      `${(progressBarRef.current.value / duration) * 100}%`
    )
  }

  const timeTravel = (newTime) => {
    progressBarRef.current.value = newTime
    updateCurrentTime()
    changePlayerCurrentTime()
  }

  const backThirty = () => {
    timeTravel(Number(progressBarRef.current.value) - 30)
  }

  const forwardThirty = () => {
    timeTravel(Number(progressBarRef.current.value) + 30)
  }

  const volumeControl = (e) => {
    const { value } = e.target
    const volume = value / 100
    audioRef.current.volume = volume
  }

  return {
    onLoadedMetadata,
    calculateTime,
    togglePlaying,
    changePlayerCurrentTime,
    backThirty,
    forwardThirty,
    isPlaying,
    isFinished: isFinishedPlaying,
    currentTime,
    duration,
    volumeCtrl,
    volumeControl,
    toggleMute,
    isMuted
  }
}
