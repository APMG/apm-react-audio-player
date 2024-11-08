# apm-react-audio-player

This is a light react audio player that is wrapped around a HTML5 audio tag, created for use on American Public Media and Minnesota Public Radio's websites.

The library was designed to add a audio player to a body of a story which will not trigger the static audio player.

![Alt text](./public//audioimg.png)

## Table of Contents

[Dependencies](#dependencies)

[Installation](#installation)
  - [NPM](#npm)
  - [YARN](#yarn)

[Importing](#importing)
  - [ES6 Import](#es6-import)

[Usage](#usage)
  - [Props](#props)
  - [Example](#example)

[License] (#License)


## Dependencies

As of version 1.0.0, this library has no dependencies for usage.

## Installation

There are several ways to install APM Player on your site.

### NPM

```sh
npm install apm-react-audio-player
```

or to use yarn:

### YARN

```sh
yarn add apm-react-audio-player
```

## Importing

### ES6 Import

The easiest way to include this in modern javascript, assuming you are using something like and Babel, is to use an `import` statement.
The library uses named exports for all modules.

To import the player module:

```javascript
import { ReactAudioPlayerInner, useAudioPlayer } from 'apm-react-audio-player';
```
## Usage

### Props
See the [audio tag documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) for detailed explanations of these attributes.


Prop | Type | Default | Notes
--- | --- | --- | ---
`title` | String | *empty string* | The title of the audio track
`audioSrc` | String | *empty string* | The source URL of the audio file
`description` | String | *empty string* | The description of the audio track
`audioPlayerRef` | Object | *empty object* | A ref object for the audio player
`progressBarRef` | Object | *empty object* | A ref object for the progress bar
`onLoadedMetadata` | Function | --- | A function to handle the `loadedmetadata` event
`togglePlaying` | Function | --- | A function to toggle the playing state
`isPlaying` | Boolean | false | Whether the audio is currently playing
`isMuted` | Boolean | false | Whether the audio is currently muted
`toggleMute` | Function | --- | A function to toggle the mute state
`volumeCtrl` | Function | --- | A function to control the volume
`currentTime` | Number | null | The current time of the audio track
`duration` | Number | null | The duration of the audio track
`rewindControl` | Function | --- | A function to rewind the audio track
`forwardControl` | Function | --- | A function to fast forward the audio track
`changePlayerCurrentTime` | Function | --- | A function to change the current time of the audio track
`calculateTime` | Function | --- | A function to calculate the time for the audio track
`formatCalculateTime` | Function | --- | A function to format the calculated time
`playBtnClass` | String | *empty string* | The CSS class for the play button
`customStyles` | Object | --- | Custom styles for the audio player
`customHtml` | JSX.Element | `<></>` | Custom HTML to be rendered inside the player

### Example

```javascript
import { ReactAudioPlayerInner, useAudioPlayer } from 'apm-react-audio-player';

const Example = () => {

  const audioPlayerRef = React.useRef();
  const progressBarRef = React.useRef();

  const {
    onLoadedMetadata,
    calculateTime,
    volumeControl,
    togglePlaying,
    toggleMute,
    isMuted,
    changePlayerCurrentTime,
    play,
    isPlaying,
    isFinishedPlaying,
    currentTime,
    duration,
    formatCalculateTime,
    rewindControl,
    forwardControl
  } = useAudioPlayer(audioPlayerRef, progressBarRef);

    return (
       <ReactAudioPlayerInner
        title={'MPR NEWS'}
        audioSrc={'https://play.publicradio.org/web/o/minnesota/podcasts/art_hounds/2024/06/26/arthounds_art-hounds-franconia_20240626_64.mp3'}
        description={'description'}
        playBtnClass="player-btn player-btn-playpause js-player-play"
        audioPlayerRef={audioPlayerRef}
        progressBarRef={progressBarRef}
           onLoadedMetadata={onLoadedMetadata}
        play={play}
        isPlaying={isPlaying}
        togglePlaying={togglePlaying}
        isMuted={isMuted}
        currentTime={currentTime}
        duration={duration}
        isAudioFinished={isFinishedPlaying}
        toggleMute={toggleMute}
        volumeCtrl={volumeControl}
        changePlayerCurrentTime={changePlayerCurrentTime}
        rewindControl={rewindControl}
        forwardControl={forwardControl}
        calculateTime={calculateTime}
        formatCalculateTime={formatCalculateTime}
        customHtml={<></>}
    />
  )
}
```

## Publishing

1. Ensure every merge request and/or change to `apm-react-audio-player` should always come with an updated version (ex. 1.0.17 to 1.0.18) in the package.json.
2. Once the changes is on Main branch, locally run:
   1. `git pull main`
   2. `yarn run build` or `npm run build`
   3. `yarn publish` or `npm publish`

## License

MIT © [Phanx091](https://github.com/Phanx091)
