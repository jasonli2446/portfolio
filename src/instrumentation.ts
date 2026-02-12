export async function register() {
  // Node.js 25+ exposes a global `localStorage` that exists as an empty object
  // without functional methods (getItem, setItem, etc.) unless --localstorage-file
  // is provided. This breaks any library code that calls localStorage.getItem()
  // during SSR. Patch it with a working in-memory implementation.
  if (
    typeof globalThis.localStorage !== 'undefined' &&
    typeof globalThis.localStorage.getItem !== 'function'
  ) {
    const storage = new Map<string, string>();
    Object.defineProperty(globalThis, 'localStorage', {
      value: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, String(value)),
        removeItem: (key: string) => { storage.delete(key); },
        clear: () => storage.clear(),
        get length() { return storage.size; },
        key: (index: number) => [...storage.keys()][index] ?? null,
      },
      configurable: true,
    });
  }
}
