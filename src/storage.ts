interface Storage {
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
}

(window as any).db = (window as any).db ?? {};
const db: { [k: string]: string } = (window as any).db;

function getItem(k: string): string {
  return db[k];
}

function setItem(k: string, v: string): void {
  db[k] = v;
}

export function defaultStorage(): Storage {
  // desktop anki
  if (navigator.userAgent.includes('QtWebEngine')) {
    return { setItem, getItem };
  }

  return window.localStorage ?? window.sessionStorage;
}

export const dump = JSON.stringify;
export const parse = JSON.parse;
