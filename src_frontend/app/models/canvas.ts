export interface CanvasElement {
  type: 'sto' | 'toalet' | 'kuhinja';
  x: number;
  y: number;
  radius?: number;
  width?: number;
  height?: number;
  members?: number;
  color?: string;
  selected?: boolean;
  tableNumber?: number;
}
