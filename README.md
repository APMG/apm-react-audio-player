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

[Breaking Changes](#breaking-changes)

[HLS Support](#hls-support)
  - [Browser Compatibility](#browser-compatibility)
  - [HLS Usage Examples](#hls-usage-examples)
  - [Live Stream Detection](#live-stream-detection)
  - [Supported Audio Formats](#supported-audio-formats)

[Examples](#examples)
  - [Running the Examples](#running-the-examples)
  - [Building the Examples](#building-the-examples)

[Publishing](#publishing)

[License](#license)


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
`audioSrc` | String or Array | *empty string* | **String:** Single audio source URL<br>**Array:** Multiple source URLs for progressive enhancement (e.g., `['stream.m3u8', 'audio.aac', 'audio.mp3']`)
`description` | String | *empty string* | The description of the audio track
`audioPlayerRef` | Object | *empty object* | A ref object for the audio player
`progressBarRef` | Object | *empty object* | A ref object for the progress bar
`onLoadedMetadata` | Function | --- | A function to handle the `loadedmetadata` event
`togglePlaying` | Function | --- | A function to toggle the playing state
`isPlaying` | Boolean | false | Whether the audio is currently playing
`isMuted` | Boolean | false | Whether the audio is currently muted
`toggleMute` | Function | --- | A function to toggle the mute state
`volumeCtrl` | Boolean | false | Whether to show volume controls
`volumeControl` | Function | --- | A function to handle volume changes
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
        volumeCtrl={true}
        volumeControl={volumeControl}
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

## Breaking Changes

### Version 1.0.29+

**Removed `isLive` prop:** The `isLive` prop has been removed from `ReactAudioPlayerInner`. Live stream detection is now **automatic** based on the HTML5 audio `duration` property.

- **Old behavior:** You had to manually pass `isLive={true}` for live streams
- **New behavior:** The player automatically detects live streams when `duration === Infinity`

**Migration:**
```javascript
// ❌ Old - Remove the isLive prop
<ReactAudioPlayerInner
  audioSrc="https://example.com/live.m3u8"
  isLive={true}  // <-- Remove this
  // ... other props
/>

// ✅ New - Detection is automatic
<ReactAudioPlayerInner
  audioSrc="https://example.com/live.m3u8"
  // ... other props
/>
```

The UI will automatically adapt based on the audio metadata - no manual configuration needed.

## HLS Support

The audio player now supports HLS (HTTP Live Streaming) for both live streams and pre-recorded content using native browser support. The player uses HTML5 `<source>` tags for progressive enhancement, allowing browsers to fall back to alternate formats if HLS is not supported.

### Browser Compatibility

| Browser | HLS Support | Fallback Behavior |
|---------|------------|-------------------|
| Safari (all versions) | Native ✓ | N/A |
| iOS Safari | Native ✓ | N/A |
| Chrome 142+ | Native ✓ | N/A |
| Edge 142+ | Native ✓ | N/A |
| Mobile Chrome/Android | Native ✓ | N/A |
| Chrome <142 | None | Automatically uses AAC/MP3 |
| Firefox | None | Automatically uses AAC/MP3 |
| Edge <142 | None | Automatically uses AAC/MP3 |

**Note:** Chrome and Edge added native HLS support in version 142 (December 2024). Older versions will automatically skip HLS sources and use alternative formats.

### HLS Usage Examples

**See `examples/hls-example.jsx` for a complete working example with multiple HLS scenarios.**

#### Basic HLS with Progressive Enhancement

Provide multiple source formats to ensure compatibility across all browsers:

```javascript
<ReactAudioPlayerInner
  title="Podcast Episode"
  audioSrc={[
    'https://example.com/episode.m3u8',
    'https://example.com/episode.aac',
    'https://example.com/episode.mp3'
  ]}
  // ... other props
/>
```

Browsers will try sources in order:
1. Modern browsers (Safari, Chrome 142+, Edge 142+) will play the HLS stream
2. Older browsers will skip the .m3u8 and fall back to AAC or MP3

#### Live Radio Stream

```javascript
<ReactAudioPlayerInner
  title="Live Radio"
  audioSrc={['https://stream.example.com/live.m3u8']}
  // ... other props
/>
```

#### Single Source (Backward Compatible)

The player maintains backward compatibility with the original single-source API:

```javascript
<ReactAudioPlayerInner
  title="Audio Track"
  audioSrc="https://example.com/audio.mp3"
  // ... other props
/>
```

### Live Stream Detection

The player automatically detects live streams using the HTML5 audio `duration` property:

- **Live streams:** `duration === Infinity`
  - Timeline/seek controls are hidden
  - Rewind/forward buttons are hidden
  - "On Air" label is displayed

- **Pre-recorded audio:** `duration` is a finite number
  - Timeline/seek controls are shown
  - Rewind/forward buttons are shown
  - Duration is displayed

No additional props are needed - the player automatically adapts its UI based on whether the content is live or pre-recorded.

### Supported Audio Formats

The player automatically detects MIME types from file extensions:

| Extension | MIME Type |
|-----------|-----------|
| `.m3u8` | `application/x-mpegURL` |
| `.mp3` | `audio/mpeg` |
| `.aac` | `audio/aac` |
| `.ogg` | `audio/ogg` |
| `.wav` | `audio/wav` |

## Examples

The `examples/` directory contains working demonstrations of the audio player with HLS support.

### Running the Examples

**Option 1: Using the serve script (recommended)**
```bash
# Start local server and open examples in browser
yarn serve:examples

# Or using npm
npm run serve:examples
```

This will start a local server on port 8000 and automatically open the examples page in your browser.

**Option 2: Open HTML file directly**
1. Open `examples/index.html` in a web browser
2. The page includes three examples:
   - HLS with progressive enhancement (fallback sources)
   - Live HLS stream (MPR Current)
   - Regular MP3 (backward compatible)

### Building the Examples

The examples use a pre-built bundle (`examples/bundle.js`). If you modify the source code and want to rebuild the examples:

```bash
# Rebuild the examples bundle
yarn build:examples

# Or using npm
npm run build:examples
```

**Files:**
- `examples/index.html` - Main example page with CSS and layout
- `examples/hls-example.jsx` - React components demonstrating HLS features
- `examples/bundle.js` - Compiled bundle (auto-generated, don't edit directly)
- `examples/hls-test.html` - Additional test page for development

## Publishing

1. Ensure every merge request and/or change to `apm-react-audio-player` should always come with an updated version (ex. 1.0.17 to 1.0.18) in the package.json.
2. Once the changes is on Main branch, locally run:
   1. `git pull main`
   2. `yarn run build` or `npm run build`
   3. `yarn publish` or `npm publish`

## License

MIT © [Phanx091](https://github.com/Phanx091)
