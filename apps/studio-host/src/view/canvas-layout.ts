import { resolveVirtualScrollPageLeft } from './page-left';

type CanvasLayout = {
  getPageOffset(pageIndex: number): number;
  getPageLeft(pageIndex: number): number;
  getPageWidth(pageIndex: number): number;
};

export function inferCanvasDevicePixelRatio(
  canvas: HTMLCanvasElement,
  layout: CanvasLayout,
  pageIndex: number,
  fallbackDpr = window.devicePixelRatio || 1,
): number {
  const pageWidth = layout.getPageWidth(pageIndex);
  if (pageWidth <= 0) {
    return fallbackDpr;
  }

  const inferredDpr = canvas.width / pageWidth;
  if (!Number.isFinite(inferredDpr) || inferredDpr <= 0) {
    return fallbackDpr;
  }

  return inferredDpr;
}

export function applyCanvasDisplayLayout(
  canvas: HTMLCanvasElement,
  layout: CanvasLayout,
  pageIndex: number,
  scrollContentWidth: number,
  dpr: number,
): void {
  const safeDpr = Number.isFinite(dpr) && dpr > 0 ? dpr : 1;
  canvas.style.top = `${layout.getPageOffset(pageIndex)}px`;
  canvas.style.left = `${resolveVirtualScrollPageLeft(layout, pageIndex, scrollContentWidth)}px`;
  canvas.style.transform = 'none';

  const pageDisplayWidth =
    canvas.width > 0 ? canvas.width / safeDpr : layout.getPageWidth(pageIndex);
  const pageDisplayHeight = canvas.height > 0 ? canvas.height / safeDpr : 0;
  canvas.style.width = `${pageDisplayWidth}px`;
  if (pageDisplayHeight > 0) {
    canvas.style.height = `${pageDisplayHeight}px`;
  }
}
