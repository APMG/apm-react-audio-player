// Suppress expected JSDOM warnings in tests
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  // Suppress JSDOM "Not implemented" errors for HTMLMediaElement
  console.error = (...args) => {
    const message = args[0]?.toString() || '';
    if (message.includes('Not implemented: HTMLMediaElement')) {
      return;
    }
    originalError(...args);
  };

  // Suppress our audio reload warnings (which are expected in tests)
  console.warn = (...args) => {
    const message = args[0]?.toString() || '';
    if (message.includes('Failed to reload audio source')) {
      return;
    }
    originalWarn(...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});
