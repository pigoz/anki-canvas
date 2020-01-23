interface Storage {
  getItem(k: string): string | null | undefined;
  setItem(k: string, v: string): void;
  removeItem(k: string): void;
}

(window as any).db = (window as any).db ?? {};
const db: { [k: string]: string } = (window as any).db;

function getItem(k: string): string | null | undefined {
  return db[k];
}

function setItem(k: string, v: string): void {
  db[k] = v;
}

function removeItem(k: string): void {
  delete db[k];
}

export function defaultStorage(): Storage {
  // desktop anki
  if (navigator.userAgent.includes('QtWebEngine')) {
    return { setItem, getItem, removeItem };
  }

  return window.localStorage ?? window.sessionStorage;
}

export function isStorageSupported(s: Storage): boolean {
  try {
    const key = '__anki_canvas_store_check__';
    s.setItem(key, key);
    s.removeItem(key);
    return true;
  } catch (e) {
    return false;
  }
}

export const dump = JSON.stringify;
export const parse = JSON.parse;
