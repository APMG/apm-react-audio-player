import { useState, useRef, useEffect } from 'react'

export const useAudioPlayer = (
  audioRef,
  progressBarRef,
  volumeCtrl,
  initialDuration = undefined
) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(initialDuration)
  const [currentTime, setCurrentTime] = useState(0)
  const [isFinishedPlaying, setIsFinishedPlaying] = useState(false)
  const animationRef = useRef() // reference the animation
  const [isMuted, setIsMuted] = useState(false)
  const isStream =
    audioRef.current && audioRef.current.duration === Infinity

  useEffect(() => {
    if (currentTime === Number(duration)) {
      // restart()
      setIsFinishedPlaying(true)
    }
  }, [currentTime])

  useEffect(() => {
    // Cancel RAF loop if duration changes to Infinity (live stream metadata loaded)
    if (duration === Infinity && animationRef.current) {
      window.cancelAnimationFrame(animationRef.current)
    }
  }, [duration])

  const onLoadedMetadata = () => {
    if (!audioRef.current) return

    const seconds = Math.floor(audioRef.current.duration)
    setDuration(seconds)

    if (audioRef.current.duration !== Infinity && progressBarRef.current) {
      progressBarRef.current.max = seconds
    }
  }

  const resetDuration = () => {
    setDuration(undefined)
    setCurrentTime(0)
    if (progressBarRef.current) {
      progressBarRef.current.value = 0
    }
  }

  const updateCurrentTime = () => {
    if (progressBarRef.current) {
      setCurrentTime(progressBarRef.current.value)
    }
  }

  const whilePlaying = () => {
    // Guard against null refs (can happen when timeline unmounts for live streams)
    if (!progressBarRef.current || !audioRef.current) {
      return
    }

    const liveDuration = audioRef.current.duration
    if (liveDuration !== Infinity) {
      progressBarRef.current.value = Math.floor(audioRef.current.currentTime)
      progressBarRef.current.style.setProperty(
        '--seek-before-width',
        liveDuration > 0 ? `${(progressBarRef.current.value / liveDuration) * 100}%` : '0%'
      )
    }

    updateCurrentTime()

    // when you reach the end of the song
    if (!isStream && progressBarRef.current.value === duration) {
      // restart()
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

  // const restart = () => {
  //   progressBarRef.current.value = 0
  //   updateCurrentTime()
  //   pause()
  // }

  const play = () => {
    setIsPlaying(true)
    setIsFinishedPlaying(false)

    // For live streams (duration === Infinity), reset the audio element before
    // playing. The audioSrc useEffect in ReactAudioPlayerInner calls load() on
    // mount, which causes the browser to pre-buffer the HLS stream. By the time
    // the user clicks play the manifest's seekable window has moved forward and
    // old segments are gone, so the browser auto-seeks to the earliest available
    // position (e.g. 20s in), causing ads to start mid-stream. Calling load()
    // here reconnects to the current live edge and gets a fresh manifest.
    if (duration === Infinity) {
      audioRef.current.load()
    }

    audioRef.current.play()

    // Only start RAF loop for non-live streams with valid duration
    const dur = audioRef.current.duration
    if (dur !== Infinity && !isNaN(dur) && isFinite(dur)) {
      animationRef.current = window.requestAnimationFrame(whilePlaying)
    }
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
    if (!progressBarRef.current || !audioRef.current) return

    audioRef.current.currentTime = progressBarRef.current.value
    setCurrentTime(progressBarRef.current.value)

    const liveDuration = audioRef.current.duration
    progressBarRef.current.style.setProperty(
      '--seek-before-width',
      liveDuration > 0 ? `${(progressBarRef.current.value / liveDuration) * 100}%` : '0%'
    )
  }

  const changeRange = () => {
    if (!progressBarRef.current || !audioRef.current) return

    audioRef.current.currentTime = progressBarRef.current.value
    updateCurrentTime()
    changePlayerCurrentTime()
  }

  const rewindControl = () => {
    if (!progressBarRef.current) return

    progressBarRef.current.value = Number(progressBarRef.current.value) - 15
    changeRange()
  }

  const forwardControl = () => {
    if (!progressBarRef.current) return

    progressBarRef.current.value = Number(progressBarRef.current.value) + 15
    changeRange()
  }

  const volumeControl = (e) => {
    if (!audioRef.current) return

    const { value } = e.target
    const volume = value / 100
    audioRef.current.volume = volume
  }

  const formatCalculateTime = (timeString) => {
    const toString = String(timeString)
    if (toString.split(':').length === 3) {
      const [hours, minutes, seconds] = toString.split(':')
      return `${parseInt(hours)}hr ${parseInt(minutes)}min ${parseInt(
        seconds
      )}sec`
    } else if (toString.split(':').length === 2) {
      const [minutes, seconds] = toString.split(':')
      return `${parseInt(minutes)}min ${parseInt(seconds)}sec`
    }
  }

  return {
    onLoadedMetadata,
    resetDuration,
    calculateTime,
    togglePlaying,
    changePlayerCurrentTime,
    rewindControl,
    forwardControl,
    play,
    pause,
    isPlaying,
    isFinishedPlaying,
    currentTime,
    duration,
    volumeCtrl,
    isMuted,
    volumeControl,
    toggleMute,
    formatCalculateTime
  }
}
