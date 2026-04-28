# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`apm-react-audio-player` is a lightweight React audio player built around the HTML5 audio tag, designed for American Public Media and Minnesota Public Radio websites. The library is meant to be embedded in story content without triggering the site's static audio player.

## Development Commands

### Build and Test
```bash
# Build the library for distribution
npm run build

# Run tests in watch mode
npm test

# Run tests once (CI mode)
npm run test:ci

# Run tests with coverage
npm run test:coverage
```

### Development
```bash
# Watch mode for development
npm run dev

# Lint the codebase
npm run eslint

# Format check
npm run prettier

# Format and fix
npm run prettier:fix
```

### Examples
```bash
# Build the examples bundle
npm run build:examples

# Serve examples on localhost:8000
npm run serve:examples
```

### Cleanup
```bash
# Remove node_modules, dist, and lock files
npm run clean
```

### Running Individual Tests
```bash
# Run a specific test file
npx jest src/components/ReactAudioPlayer/ReactAudioPlayerInner.test.js

# Run tests matching a pattern
npx jest --testNamePattern="your test name"
```

## Architecture

### Component Structure

The library exports three main items:
- **`ReactAudioPlayerInner`**: The core audio player component (most commonly used)
- **`ReactAudioPlayer`**: A wrapper component
- **`useAudioPlayer`**: A custom hook that manages audio player state and controls

### Key Files

- **`src/index.js`**: Entry point with named exports
- **`src/components/ReactAudioPlayer/ReactAudioPlayerInner.js`**: Main player UI component
- **`src/hooks/useReactAudioPlayer.js`**: Custom hook containing all audio player logic and state management
- **`rollup.config.mjs`**: Build configuration that outputs both CJS and ESM formats

### State Management Pattern

The `useAudioPlayer` hook encapsulates all audio player logic:
- Uses refs for the audio element (`audioRef`) and progress bar (`progressBarRef`)
- Manages playback state via `useState` (isPlaying, currentTime, duration, isMuted, etc.)
- Uses `requestAnimationFrame` for smooth progress bar updates during playback
- Automatically detects live streams vs. pre-recorded content based on `duration === Infinity`

**Important**: The RAF (requestAnimationFrame) loop is conditionally applied - it's **only used for pre-recorded content** with finite duration. For live streams (duration === Infinity), the RAF loop is skipped or cancelled to avoid unnecessary overhead.

### HLS Support

The player supports HLS (HTTP Live Streaming) via native browser support:
- **`audioSrc` prop** accepts either a single string or an array of URLs
- When an array is provided, the component renders multiple `<source>` tags for progressive enhancement
- **`getTypeFromExtension`** helper automatically maps file extensions to MIME types (.m3u8, .mp3, .aac, .ogg, .wav)
- Browsers that don't support HLS will automatically fall back to alternative formats

### Live Stream Detection

Live streams are automatically detected - **no manual configuration required**:
- When `duration === Infinity`, the UI automatically hides timeline/seek controls and displays "On Air"
- When duration is finite, full playback controls are shown
- The `isLive` prop was removed in v1.0.29+ in favor of automatic detection

### Source Reloading

When `audioSrc` changes, the component automatically calls `audioRef.current.load()` to reload the audio source. This is handled in a `useEffect` hook that uses `JSON.stringify(audioSrc)` to properly detect changes when `audioSrc` is an array.

## Testing

Tests use Jest with `jsdom` environment:
- **`jest.setup.js`**: Suppresses expected JSDOM warnings about HTMLMediaElement
- Tests are co-located with components (`*.test.js` files)
- Run tests in watch mode during development: `npm test`

## Build Process

Uses Rollup to bundle the library:
- Babel transpilation for React and modern JS features
- Outputs two formats: CommonJS (`dist/index.js`) and ES modules (`dist/index.modern.js`)
- External dependencies (react, rollup, rollup-plugin-babel) are not bundled
- Only `dist/` folder is published to npm (see `files` field in package.json)

## Publishing

Before publishing:
1. Increment version in `package.json` (must be done for every change merged to main)
2. Pull latest from main: `git pull main`
3. Build: `npm run build`
4. Publish: `npm publish`

## Important Implementation Notes

### Volume Initialization
The audio element's volume is set to 1.0 (100%) on mount via a `useEffect` hook in `ReactAudioPlayerInner`.

### Progress Bar Updates
- Progress bar updates use `requestAnimationFrame` for smooth, performant UI updates
- The RAF loop is **cancelled** when duration becomes Infinity (live stream metadata loads)
- Guards prevent null ref errors when timeline unmounts for live streams

### Custom Styling
The player accepts a `customStyles` prop with nested style objects:
- `customStyles.audioPlayer` - outer container styles
- `customStyles.playPause` - play/pause button styles
- `customStyles.duration` - duration display styles

### Asset Dependencies
The player references external image assets (volume icons, rewind/forward icons) that are expected to be served from `/img/` path. Consuming applications must provide these assets.
