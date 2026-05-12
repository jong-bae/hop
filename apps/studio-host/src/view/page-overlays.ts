const pageOverlaySelector = (pageIndex: number) =>
  `[data-rhwp-overlay="behind-${pageIndex}"], [data-rhwp-overlay="front-${pageIndex}"]`;

export function applyPageOverlayDisplayLayout(
  container: HTMLElement,
  canvas: HTMLCanvasElement,
  pageIndex: number,
): void {
  const overlays = container.querySelectorAll<HTMLElement>(pageOverlaySelector(pageIndex));
  for (const overlay of overlays) {
    overlay.style.top = canvas.style.top;
    overlay.style.left = canvas.style.left;
    overlay.style.transform = canvas.style.transform;
    overlay.style.width = canvas.style.width;
    overlay.style.height = canvas.style.height;
  }
}

export function removePageOverlays(container: HTMLElement, pageIndex: number): void {
  container
    .querySelectorAll(pageOverlaySelector(pageIndex))
    .forEach((overlay) => overlay.remove());
}

export function removeAllPageOverlays(container: HTMLElement): void {
  container
    .querySelectorAll('[data-rhwp-overlay]')
    .forEach((overlay) => overlay.remove());
}
