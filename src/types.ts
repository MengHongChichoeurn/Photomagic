export type ToolType = 
  | 'move'
  | 'marquee'
  | 'lasso'
  | 'brush'
  | 'eraser'
  | 'pen'
  | 'text'
  | 'shape'
  | 'eyedropper';

export type BlendMode = 
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'soft-light';

export interface Layer {
  id: string;
  name: string;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  visible: boolean;
  opacity: number; // 0 - 100
  blend: BlendMode;
  locked?: boolean;
}

export interface HistoryItem {
  id: string;
  action: string;
  time: string;
  snapshot?: ImageData;
}

export interface RecentFile {
  id: string;
  name: string;
  format: 'PSD' | 'PNG' | 'JPG' | 'SVG' | 'TIF';
  date: string;
  size: string;
  width: number;
  height: number;
  thumbnail?: string;
}

export interface DocumentSettings {
  name: string;
  width: number;
  height: number;
  dpi: number;
  colorMode: 'RGB' | 'CMYK' | 'Grayscale';
  background: 'white' | 'dark' | 'transparent';
}

export type OSMode = 'win' | 'mac';
