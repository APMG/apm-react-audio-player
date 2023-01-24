# apm-react-audio-player

This is a light react audio player that is wrapped around a HTML5 audio tag, created for use on American Public Media and Minnesota Public Radio's websites.

The library was designed to add a audio player to a body of a story which will not trigger the static audio player.

![alt text](/public//audioPlayerImg.jpg)

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
import { ReactAudioPlayer } from 'apm-react-audio-player';
```
## Usage

### Props
See the [audio tag documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) for detailed explanations of these attributes.

Prop | Type | Default | Notes
--- | --- | --- | ---
`title` | String | *empty string* | ---
`description` | String | *empty string* | ---
`url` | String | *empty string* | ---
`customStyles` | Object | --- | ---
`forwardBackward` | Boolean | false | ---

### Example

```javascript
class Example extends Component {
  const url='example.mp3'
  const audioStyles = {
    audioPlayer: {
      width: '1200px',
      backgroundColor: 'lightBlue'
    },
    playPause: {
      background: 'blue'
    },
    duration: {
      color: '#26c9c3'
    }
  };
  render() {
    return (
      <ReactAudioPlayer
      title={'title'}
      description={'description'}
      audioSrc={url}
      audioStyles={audioStyles}
      forwardBackward={true}
    />
    )
  }
}
```

## License

MIT © [Phanx091](https://github.com/Phanx091)
