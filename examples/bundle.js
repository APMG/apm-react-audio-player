// examples/hls-example.jsx
import React5, { useRef as useRef4 } from "react";

// src/components/ReactAudioPlayer/ReactAudioPlayer.js
import React4, { useRef as useRef3 } from "react";

// src/hooks/useReactAudioPlayer.js
import { useState, useRef, useEffect } from "react";
var useAudioPlayer = (audioRef, progressBarRef, volumeCtrl, initialDuration = void 0) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(initialDuration);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFinishedPlaying, setIsFinishedPlaying] = useState(false);
  const animationRef = useRef();
  const [isMuted, setIsMuted] = useState(false);
  const isStream = audioRef.current && audioRef.current.duration === Infinity;
  useEffect(() => {
    if (currentTime === Number(duration)) {
      setIsFinishedPlaying(true);
    }
  }, [currentTime]);
  const onLoadedMetadata = () => {
    const seconds = Math.floor(audioRef.current.duration);
    setDuration(seconds);
    if (audioRef.current.duration !== Infinity) {
      progressBarRef.current.max = seconds;
    }
  };
  const updateCurrentTime = () => {
    setCurrentTime(progressBarRef.current.value);
  };
  const whilePlaying = () => {
    if (audioRef.current.duration !== Infinity) {
      progressBarRef.current.value = Math.floor(audioRef.current.currentTime);
    }
    progressBarRef.current.style.setProperty(
      "--seek-before-width",
      `${progressBarRef.current.value / duration * 100}%`
    );
    updateCurrentTime();
    if (!isStream && progressBarRef.current.value === duration) {
      setIsFinishedPlaying(true);
      return;
    }
    animationRef.current = window.requestAnimationFrame(whilePlaying);
  };
  const pause = () => {
    setIsPlaying(false);
    audioRef.current.pause();
    window.cancelAnimationFrame(animationRef.current);
  };
  const play = () => {
    setIsPlaying(true);
    setIsFinishedPlaying(false);
    audioRef.current.play();
    if (audioRef.current.duration !== Infinity) {
      animationRef.current = window.requestAnimationFrame(whilePlaying);
    }
  };
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  };
  const togglePlaying = () => {
    if (!isPlaying) {
      play();
    } else {
      pause();
    }
  };
  const changePlayerCurrentTime = () => {
    audioRef.current.currentTime = progressBarRef.current.value;
    setCurrentTime(progressBarRef.current.value);
    progressBarRef.current.style.setProperty(
      "--seek-before-width",
      `${progressBarRef.current.value / duration * 100}%`
    );
  };
  const changeRange = () => {
    audioRef.current.currentTime = progressBarRef.current.value;
    updateCurrentTime();
    changePlayerCurrentTime();
  };
  const rewindControl = () => {
    progressBarRef.current.value = Number(progressBarRef.current.value) - 15;
    changeRange();
  };
  const forwardControl = () => {
    progressBarRef.current.value = Number(progressBarRef.current.value) + 15;
    changeRange();
  };
  const volumeControl = (e) => {
    const { value } = e.target;
    const volume = value / 100;
    audioRef.current.volume = volume;
  };
  const formatCalculateTime = (timeString) => {
    const toString = String(timeString);
    if (toString.split(":").length === 3) {
      const [hours, minutes, seconds] = toString.split(":");
      return `${parseInt(hours)}hr ${parseInt(minutes)}min ${parseInt(
        seconds
      )}sec`;
    } else if (toString.split(":").length === 2) {
      const [minutes, seconds] = toString.split(":");
      return `${parseInt(minutes)}min ${parseInt(seconds)}sec`;
    }
  };
  return {
    onLoadedMetadata,
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
  };
};

// src/components/ReactAudioPlayer/ReactAudioPlayerInner.js
import React3, { useRef as useRef2 } from "react";

// src/components/icons/Play/Play.js
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var Play = () => {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      stroke: "currentColor",
      fill: "currentColor",
      strokeWidth: "0",
      viewBox: "0 0 448 512",
      className: "play",
      height: "1em",
      width: "1em",
      xmlns: "http://www.w3.org/2000/svg",
      role: "img",
      "aria-labelledby": "play playButton",
      children: [
        /* @__PURE__ */ jsx("title", { id: "play", children: "Play" }),
        /* @__PURE__ */ jsx("desc", { id: "playButton", children: "Play Button" }),
        /* @__PURE__ */ jsx("path", { d: "M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z" })
      ]
    }
  );
};
var Play_default = Play;

// src/components/icons/Pause/Pause.js
import React2 from "react";
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var Pause = () => {
  return /* @__PURE__ */ jsxs2(
    "svg",
    {
      stroke: "currentColor",
      fill: "currentColor",
      strokeWidth: "0",
      viewBox: "0 0 448 512",
      height: "1em",
      width: "1em",
      xmlns: "http://www.w3.org/2000/svg",
      role: "img",
      "aria-labelledby": "pause pauseButton",
      children: [
        /* @__PURE__ */ jsx2("title", { id: "pause", children: "Pause" }),
        /* @__PURE__ */ jsx2("desc", { id: "pauseButton", children: "Pause Button" }),
        /* @__PURE__ */ jsx2("path", { d: "M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z" })
      ]
    }
  );
};
var Pause_default = Pause;

// src/components/ReactAudioPlayer/ReactAudioPlayerInner.js
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
var getTypeFromExtension = (url) => {
  const extension = url.split(".").pop().split("?")[0];
  switch (extension) {
    case "m3u8":
      return "application/x-mpegURL";
    case "aac":
      return "audio/aac";
    case "mp3":
      return "audio/mpeg";
    case "ogg":
      return "audio/ogg";
    case "wav":
      return "audio/wav";
    default:
      return void 0;
  }
};
var ReactAudioPlayerInner = (props) => {
  const audioPlayerRef = props.audioPlayerRef ?? useRef2();
  const progressBarRef = props.progressBarRef ?? useRef2();
  const customStyles = props ? props.style : "";
  const {
    title,
    audioSrc,
    volumeCtrl,
    playBtnClass,
    customHtml,
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
    forwardControl,
    subtitle,
    prefix
  } = props;
  const audioDuration = duration && !isNaN(duration) && calculateTime(duration);
  const formatDuration = duration && !isNaN(duration) && audioDuration && formatCalculateTime(audioDuration);
  return audioSrc && /* @__PURE__ */ jsxs3(
    "div",
    {
      className: "audioPlayer",
      style: customStyles && customStyles.audioPlayer,
      children: [
        /* @__PURE__ */ jsxs3(
          "audio",
          {
            ref: audioPlayerRef,
            preload: "none",
            onLoadedMetadata,
            muted: isMuted,
            children: [
              Array.isArray(audioSrc) ? audioSrc.map((src, index) => /* @__PURE__ */ jsx3(
                "source",
                {
                  src,
                  type: getTypeFromExtension(src)
                },
                index
              )) : audioSrc ? /* @__PURE__ */ jsx3("source", { src: audioSrc, type: getTypeFromExtension(audioSrc) }) : null,
              "Your browser does not support the audio element."
            ]
          }
        ),
        /* @__PURE__ */ jsxs3("div", { className: "player-layout", children: [
          volumeCtrl && /* @__PURE__ */ jsxs3("div", { className: "player-controls-secondary-outer", children: [
            /* @__PURE__ */ jsxs3("div", { className: "player-volume-control", children: [
              /* @__PURE__ */ jsx3("div", { className: "player-volume-icon", children: /* @__PURE__ */ jsx3(
                "button",
                {
                  onClick: toggleMute,
                  "aria-label": isMuted === true ? "Muted" : "Not Muted",
                  title: isMuted === true ? "Muted" : "Not Muted",
                  children: !isMuted ? /* @__PURE__ */ jsx3("img", { src: "/img/icon-volume-low.svg", alt: "Volume Button" }) : /* @__PURE__ */ jsx3(
                    "img",
                    {
                      src: "/img/icon-volume-mute.svg",
                      alt: "Volume Mute Button"
                    }
                  )
                }
              ) }),
              /* @__PURE__ */ jsx3("div", { className: "player-timeline player-controls-secondary", children: /* @__PURE__ */ jsx3(
                "input",
                {
                  id: "player-volume",
                  type: "range",
                  className: "player-volume-progress",
                  min: 0,
                  max: 100,
                  "aria-hidden": "true",
                  "aria-valuetext": "100%",
                  onChange: (e) => volumeControl(e)
                }
              ) }),
              /* @__PURE__ */ jsx3("div", { children: /* @__PURE__ */ jsx3("img", { src: "/img/icon-volume-high.svg", alt: "Volume Button" }) })
            ] }),
            /* @__PURE__ */ jsx3("div", { className: "player-volume-label", children: "Volume" })
          ] }),
          /* @__PURE__ */ jsxs3("div", { className: "player-controls", children: [
            duration !== Infinity && /* @__PURE__ */ jsx3("div", { className: "player-backward-forward-controls", children: /* @__PURE__ */ jsx3("button", { onClick: rewindControl, children: /* @__PURE__ */ jsx3(
              "img",
              {
                src: "/img/icon-rewind-15.svg",
                alt: "Backward 15 seconds"
              }
            ) }) }),
            /* @__PURE__ */ jsx3(
              "div",
              {
                className: `${isPlaying ? "is-playing" : ""} player-btn-play-pause-outer`,
                children: /* @__PURE__ */ jsx3(
                  "button",
                  {
                    onClick: togglePlaying,
                    className: playBtnClass,
                    style: customStyles && customStyles.playPause,
                    id: "playbutton",
                    children: isPlaying ? /* @__PURE__ */ jsx3(Pause_default, {}) : /* @__PURE__ */ jsx3(Play_default, {})
                  }
                )
              }
            ),
            duration !== Infinity && /* @__PURE__ */ jsx3("div", { className: "player-backward-forward-controls", children: /* @__PURE__ */ jsx3("button", { onClick: forwardControl, children: /* @__PURE__ */ jsx3(
              "img",
              {
                src: "/img/icon-forward-15.svg",
                alt: "Forward 15 seconds"
              }
            ) }) })
          ] }),
          duration !== Infinity && /* @__PURE__ */ jsxs3("div", { className: "player-timeline", children: [
            /* @__PURE__ */ jsx3("div", { className: "player-currentTime", children: calculateTime(currentTime) }),
            /* @__PURE__ */ jsx3("div", { className: "player-timeline-progress-outer", children: /* @__PURE__ */ jsx3(
              "input",
              {
                type: "range",
                className: "player-timeline-progress",
                defaultValue: "0",
                ref: progressBarRef,
                onChange: changePlayerCurrentTime,
                "aria-label": "Audio progress",
                max: duration
              }
            ) }),
            /* @__PURE__ */ jsx3(
              "div",
              {
                className: "player-duration",
                style: customStyles && customStyles.duration,
                children: duration && !isNaN(duration) ? calculateTime(duration) : "-- : --"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs3("div", { className: "player-content", children: [
            customHtml && customHtml,
            /* @__PURE__ */ jsxs3("div", { className: "player-audio-type type-sm", children: [
              duration === Infinity ? /* @__PURE__ */ jsx3("div", { className: "player-live-label", children: prefix ? prefix : "On Air" }) : /* @__PURE__ */ jsxs3("div", { className: "player-label", children: [
                "listen",
                /* @__PURE__ */ jsx3("div", { className: "player-label-duration", children: `[${formatDuration}]` })
              ] }),
              /* @__PURE__ */ jsxs3("div", { className: "player-title", children: [
                title || "",
                " ",
                subtitle && `by ${subtitle}`,
                " "
              ] })
            ] })
          ] })
        ] })
      ]
    }
  );
};
var ReactAudioPlayerInner_default = ReactAudioPlayerInner;

// src/components/ReactAudioPlayer/ReactAudioPlayer.js
import { jsx as jsx4 } from "react/jsx-runtime";

// examples/hls-example.jsx
import { jsx as jsx5, jsxs as jsxs4 } from "react/jsx-runtime";
var HLSExample = () => {
  return /* @__PURE__ */ jsxs4("div", { style: { maxWidth: "800px", margin: "50px auto", padding: "20px" }, children: [
    /* @__PURE__ */ jsx5("h1", { children: "HLS Audio Player Examples" }),
    /* @__PURE__ */ jsxs4("section", { style: { marginBottom: "40px", padding: "20px", border: "1px solid #ccc", borderRadius: "5px" }, children: [
      /* @__PURE__ */ jsx5("h2", { children: "Example 1: HLS with Progressive Enhancement" }),
      /* @__PURE__ */ jsxs4("p", { style: { background: "#f0f0f0", padding: "10px", borderRadius: "3px" }, children: [
        /* @__PURE__ */ jsx5("strong", { children: "Sources:" }),
        " HLS (.m3u8) \u2192 AAC \u2192 MP3",
        /* @__PURE__ */ jsx5("br", {}),
        /* @__PURE__ */ jsx5("strong", { children: "Expected:" }),
        " Modern browsers use HLS, older browsers fall back to AAC/MP3"
      ] }),
      /* @__PURE__ */ jsx5(
        HLSPlayer,
        {
          title: "Podcast Episode with HLS",
          audioSrc: [
            "https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_4x3/bipbop_4x3_variant.m3u8",
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs4("section", { style: { marginBottom: "40px", padding: "20px", border: "1px solid #ccc", borderRadius: "5px" }, children: [
      /* @__PURE__ */ jsx5("h2", { children: "Example 2: HLS Live Stream" }),
      /* @__PURE__ */ jsxs4("p", { style: { background: "#f0f0f0", padding: "10px", borderRadius: "3px" }, children: [
        /* @__PURE__ */ jsx5("strong", { children: "Source:" }),
        " HLS live stream (.m3u8)",
        /* @__PURE__ */ jsx5("br", {}),
        /* @__PURE__ */ jsx5("strong", { children: "Expected:" }),
        ' Timeline controls hidden, "On Air" label shown, duration = Infinity'
      ] }),
      /* @__PURE__ */ jsx5(
        HLSPlayer,
        {
          title: "MPR Current Live",
          audioSrc: [
            "https://hls.stream.publicradio.org/current-hls/playlist.m3u8",
            "https://current.stream.publicradio.org/current.aac"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs4("section", { style: { marginBottom: "40px", padding: "20px", border: "1px solid #ccc", borderRadius: "5px" }, children: [
      /* @__PURE__ */ jsx5("h2", { children: "Example 3: Regular MP3 (Backward Compatible)" }),
      /* @__PURE__ */ jsxs4("p", { style: { background: "#f0f0f0", padding: "10px", borderRadius: "3px" }, children: [
        /* @__PURE__ */ jsx5("strong", { children: "Source:" }),
        " MP3 only (single string)",
        /* @__PURE__ */ jsx5("br", {}),
        /* @__PURE__ */ jsx5("strong", { children: "Expected:" }),
        " Timeline controls shown, duration displayed"
      ] }),
      /* @__PURE__ */ jsx5(
        HLSPlayer,
        {
          title: "Regular Audio Track",
          audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs4("section", { style: { padding: "20px", background: "#1e1e1e", color: "#00ff00", borderRadius: "5px" }, children: [
      /* @__PURE__ */ jsx5("h3", { style: { marginTop: 0, color: "#00ff00" }, children: "Browser Information" }),
      /* @__PURE__ */ jsx5(BrowserInfo, {})
    ] })
  ] });
};
var HLSPlayer = ({ title, audioSrc }) => {
  const audioPlayerRef = useRef4();
  const progressBarRef = useRef4();
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
  } = useAudioPlayer(audioPlayerRef, progressBarRef);
  React5.useEffect(() => {
    if (duration !== void 0) {
      const isLive = duration === Infinity;
      console.log(`[${title}] Loaded:`, {
        duration: isLive ? "Infinity (LIVE)" : `${duration}s`,
        source: audioPlayerRef.current?.currentSrc,
        isLive
      });
    }
  }, [duration, title]);
  return /* @__PURE__ */ jsx5(
    ReactAudioPlayerInner_default,
    {
      title,
      audioSrc,
      audioPlayerRef,
      progressBarRef,
      onLoadedMetadata,
      isPlaying,
      togglePlaying,
      isMuted,
      currentTime,
      duration,
      toggleMute,
      volumeCtrl: volumeControl,
      changePlayerCurrentTime,
      rewindControl,
      forwardControl,
      calculateTime,
      formatCalculateTime
    }
  );
};
var BrowserInfo = () => {
  const [hlsSupported, setHlsSupported] = React5.useState(false);
  React5.useEffect(() => {
    const audio = document.createElement("audio");
    const supported = audio.canPlayType("application/x-mpegURL") !== "";
    setHlsSupported(supported);
  }, []);
  return /* @__PURE__ */ jsxs4("div", { style: { fontFamily: "monospace", fontSize: "14px" }, children: [
    /* @__PURE__ */ jsxs4("div", { children: [
      "Browser: ",
      navigator.userAgent
    ] }),
    /* @__PURE__ */ jsxs4("div", { children: [
      "Platform: ",
      navigator.platform
    ] }),
    /* @__PURE__ */ jsxs4("div", { style: { color: hlsSupported ? "#00ffff" : "#ffff00" }, children: [
      "Native HLS Support: ",
      hlsSupported ? "YES \u2713" : "NO \u2717"
    ] }),
    /* @__PURE__ */ jsx5("div", { style: { marginTop: "10px", fontSize: "12px", color: "#888" }, children: "Check the browser console for detailed playback information." })
  ] });
};
var hls_example_default = HLSExample;
if (typeof document !== "undefined") {
  import("react-dom/client").then(({ createRoot }) => {
    const root = createRoot(document.getElementById("root"));
    root.render(/* @__PURE__ */ jsx5(HLSExample, {}));
  });
}
export {
  hls_example_default as default
};
