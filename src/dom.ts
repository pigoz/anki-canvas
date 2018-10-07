export function html(html: string) {
  const el = document.createElement('div');
  el.innerHTML = html;
  return el.firstChild;
}

export function render(id: string, t: HTMLElement) {
  const el = document.getElementById(id);
  if (el) {
    if (el.firstChild) {
      el.removeChild(el.firstChild);
    }
    el.appendChild(t);
  }
}
