# HLS Support Implementation Plan for apm-react-audio-player

## Overview
Add HLS (HTTP Live Streaming) support to the React audio player using HTML5 `<source>` tags for progressive enhancement (HLS → AAC → MP3 fallback), relying on native browser HLS support.

## Requirements Summary
- Support live streams (like radio) and pre-recorded audio with HLS
- Use HTML5 `<source>` tags for progressive enhancement fallback chain
- Use native browser HLS support only
- Support adaptive quality streaming (core HLS feature)
- Basic playback only - no advanced HLS features needed
- Maintain backward compatibility with existing single-source usage

## Implementation Approach

### 1. API Design - Multi-Source Support with Backward Compatibility

**Updated `audioSrc` Prop:**
- Accepts **string** (backward compatible): Single source URL
- Accepts **array of strings** (new): Multiple source URLs with progressive enhancement
- MIME types inferred from file extensions

**Live Stream Detection:**
- Automatically detect via `duration === Infinity` (no prop needed)
- Remove existing `isLive` prop from codebase

**Usage Examples:**
```javascript
// Backward compatible - existing code unchanged
<ReactAudioPlayer audioSrc="https://example.com/audio.mp3" />

// New multi-source with HLS fallback
<ReactAudioPlayer
  audioSrc={[
    'https://example.com/stream.m3u8',
    'https://example.com/audio.aac',
    'https://example.com/audio.mp3'
  ]}
/>

// Live stream (auto-detected when duration === Infinity)
<ReactAudioPlayer
  audioSrc={['https://stream.example.com/live.m3u8']}
/>
```

### 2. Browser Strategy

**Native HLS Support (2025):**
- **Safari (all versions)**: Native HLS support ✅
- **iOS Safari**: Native HLS support ✅
- **Chrome 142+**: Native HLS support ✅ (added Dec 2024)
- **Edge 142+**: Native HLS support ✅
- **Mobile Chrome/Android**: Native HLS support ✅

**No HLS.js Required:**
- Modern browsers handle HLS natively via `<source type="application/x-mpegURL">` tags
- Progressive enhancement: browser tries sources in order (HLS → AAC → MP3)
- Older browsers (Chrome <142, Firefox) will skip HLS and fall back to AAC/MP3 automatically

### 3. Implementation Strategy (Simplified - No HLS.js)

**Pure HTML5 Approach:**
- Use native `<source>` tags for progressive enhancement
- No JavaScript library dependencies
- No runtime detection or initialization logic needed
- Browser automatically handles HLS natively or falls back to next source

### 4. Stream Detection Improvements

**Current Implementation Issues:**
- Uses naive string matching: `.currentSrc.includes('stream')` (lines 16, 29, 39, 76 in useReactAudioPlayer.js)
- Has `isLive` prop that should be removed
- Not reliable for HLS streams

**New Approach:**
- **Live stream detection:** Check `duration === Infinity` (native HTML5 audio behavior)
- **Remove `isLive` prop** from component interface entirely
- **No utility functions needed** - native browser support handles everything

**Rationale:**
- More reliable than string matching or props
- `duration === Infinity` is standard for live streams
- No additional JavaScript needed
- Simpler API (one less prop to document)

## Files to Modify

### 1. ~~Create: `src/utils/hlsUtils.js`~~ (NOT NEEDED)
**No utility file needed** - native browser support handles everything

### 2. Modify: `src/hooks/useReactAudioPlayer.js`
**Current signature (line 3-8):**
```javascript
export const useAudioPlayer = (
  audioRef,
  progressBarRef,
  volumeCtrl,
  initialDuration = undefined
)
```

**New signature:**
```javascript
export const useAudioPlayer = (
  audioRef,
  progressBarRef,
  volumeCtrl,
  initialDuration = undefined
)
// No changes to signature - audioSrc stays in component
```

**Changes:**
- Replace naive stream detection (lines 16, 29, 39, 76) with `duration === Infinity` check
- Pass `audioSrc` through to inner component (no normalization needed in hook)
- **No HLS-specific logic needed** - browsers handle natively


### 3. Modify: `src/components/ReactAudioPlayer/ReactAudioPlayer.js`
**Changes:**
- No changes to hook call (audioSrc handled in inner component)
- Just pass `audioSrc` through to `ReactAudioPlayerInner` via props spread

### 4. Modify: `src/components/ReactAudioPlayer/ReactAudioPlayerInner.js`
**Current implementation (line 49-55):**
```javascript
<audio
  ref={audioPlayerRef}
  src={audioSrc}  // Single source
  preload='none'
  onLoadedMetadata={onLoadedMetadata}
  muted={isMuted}
/>
```

**New implementation:**
```javascript
<audio
  ref={audioPlayerRef}
  preload='none'
  onLoadedMetadata={onLoadedMetadata}
  muted={isMuted}
>
  {Array.isArray(audioSrc) ? (
    audioSrc.map((src, index) => (
      <source
        key={index}
        src={src}
        type={getTypeFromExtension(src)}
      />
    ))
  ) : audioSrc ? (
    <source src={audioSrc} type={getTypeFromExtension(audioSrc)} />
  ) : null}
  Your browser does not support the audio element.
</audio>
```

**Helper function to add:**
```javascript
const getTypeFromExtension = (url) => {
  const extension = url.split('.').pop().split('?')[0]
  switch (extension) {
    case 'm3u8':
      return 'application/x-mpegURL'
    case 'aac':
      return 'audio/aac'
    case 'mp3':
      return 'audio/mpeg'
    case 'ogg':
      return 'audio/ogg'
    case 'wav':
      return 'audio/wav'
    default:
      return undefined // Let browser auto-detect
  }
}
```

**Rationale:**
- Progressive enhancement: browser tries sources in order
- MIME types inferred from file extensions
- Maintains backward compatibility with single string `audioSrc`
- Simple type check: Array.isArray() determines multi-source vs single-source

**Additional changes:**
- Replace all `isLive` prop checks with `duration === Infinity` checks (lines 96, 120, 131, 160)
- Remove `isLive` from props destructuring (line 17)

### 5. ~~Modify: `package.json`~~ (NO CHANGES NEEDED)
**No new dependencies required** - using native browser HLS support only

### 6. Update: `README.md`
Add new sections:
- HLS Support overview (native browser support)
- Updated `audioSrc` prop documentation (string or array)
- Usage examples (live stream, VOD with fallbacks)
- Browser compatibility matrix (Safari, Chrome 142+, Edge 142+, mobile browsers)
- Note about automatic live stream detection via `duration === Infinity`
- Note about older browser fallback behavior (skips HLS, uses AAC/MP3)

## Implementation Sequence

1. **Hook Enhancement**
   - Modify `src/hooks/useReactAudioPlayer.js`:
     - Replace naive stream detection (lines 16, 29, 39, 76) with `duration === Infinity`

2. **Component Updates**
   - Modify `src/components/ReactAudioPlayer/ReactAudioPlayerInner.js`:
     - Add `getTypeFromExtension` helper function
     - Replace single `src` attribute with multiple `<source>` children
     - Handle both string and array `audioSrc`
     - Replace `isLive` prop checks with `duration === Infinity`
     - Remove `isLive` from props destructuring

3. **Documentation**
   - Update README.md with new API and examples

4. **Example Implementation**
   - Create example HTML file for manual browser testing with real HLS sources

## Edge Cases & Considerations

### Live Stream Duration
- **Scenario:** Live streams report Infinity or NaN for duration
- **Solution:** Already handled by existing code checking `!isNaN(duration)` (lines 35, 38, 151)
- **Code:** No changes needed

### Progress Bar for Live Streams
- **Scenario:** Live streams shouldn't show seek controls
- **Solution:** Use `duration === Infinity` check to hide timeline controls
- **Code:** Replace existing `isLive` prop checks with duration check

## Browser Compatibility

| Browser | HLS Support | Strategy | Fallback |
|---------|------------|----------|----------|
| Safari (all) | Native | `<source>` tags | N/A |
| iOS Safari | Native | `<source>` tags | N/A |
| Chrome 142+ | Native | `<source>` tags | N/A |
| Chrome <142 | None | Skip HLS source | AAC/MP3 |
| Firefox | None | Skip HLS source | AAC/MP3 |
| Edge 142+ | Native | `<source>` tags | N/A |
| Edge <142 | None | Skip HLS source | AAC/MP3 |

## Backward Compatibility

All existing code continues to work without changes:
- Single `audioSrc` prop still supported
- No breaking changes to API
- New props are optional
- Existing behavior preserved when new props not used

## Testing Strategy

### Jest Unit Tests

**Test file: `src/components/ReactAudioPlayer/ReactAudioPlayerInner.test.js`**
- Test `getTypeFromExtension` helper function:
  - Returns correct MIME type for .m3u8
  - Returns correct MIME type for .aac, .mp3, .ogg, .wav
  - Returns undefined for unknown extensions
  - Handles URLs with query parameters
- Test rendering with string `audioSrc`:
  - Renders single `<source>` tag
  - Sets correct type attribute
- Test rendering with array `audioSrc`:
  - Renders multiple `<source>` tags
  - Maintains correct order
  - Sets correct type for each source

**Test file: `src/hooks/useReactAudioPlayer.test.js`**
- Test stream detection with `duration === Infinity`:
  - Mock audio element with `duration: Infinity`
  - Verify timeline controls hidden
  - Verify progress bar updates skipped
- Test non-stream behavior:
  - Mock audio element with finite duration
  - Verify timeline controls shown
  - Verify progress bar updates work

### Manual Testing

**Create example file: `examples/hls-test.html`**
- Standalone HTML page with the React audio player
- Include real HLS test sources (live streams and VOD)
- Test progressive enhancement with multiple source formats
- Include console logging to verify behavior

**Manual test cases:**
- Test across Safari, Chrome 142+, Chrome <142, Firefox
- Test with live streams (duration === Infinity)
- Test with VOD content (finite duration)
- Verify progressive enhancement (HLS → AAC → MP3 fallback)
- Verify UI changes for live vs VOD streams
