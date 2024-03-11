import { useState, useRef } from 'react'

export const useAudioPlayer = (audioRef, progressBarRef) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const animationRef = useRef() // reference the animation

  const onLoadedMetadata = () => {
    const seconds = Math.floor(audioRef.current.duration)
    setDuration(seconds)
    progressBarRef.current.max = seconds
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
      return
    }
    animationRef.current = window.requestAnimationFrame(whilePlaying)
  }

  const pause = () => {
    audioRef.current.pause()
    window.cancelAnimationFrame(animationRef.current)
  }

  const restart = () => {
    progressBarRef.current.value = 0
    updateCurrentTime()
    pause()
  }

  const play = () => {
    audioRef.current.play()
    animationRef.current = window.requestAnimationFrame(whilePlaying)
  }

  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60)
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`
    const seconds = Math.floor(secs % 60)
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`
    return `${returnedMinutes}:${returnedSeconds}`
  }

  const togglePlaying = () => {
    const prevState = isPlaying
    setIsPlaying(!prevState)
    if (!prevState) {
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

  return {
    onLoadedMetadata,
    calculateTime,
    togglePlaying,
    changePlayerCurrentTime,
    backThirty,
    forwardThirty,
    isPlaying,
    currentTime,
    duration
  }
}
