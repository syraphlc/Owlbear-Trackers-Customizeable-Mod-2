import { BUBBLE_DIAMETER } from "./compoundItemHelpers";

export class BubblePosition {
  origin: { x: number; y: number };
  bounds: { width: number; height: number };
  barCount: number;
  barHeight: number;
  totalBarHeight: number;
  aboveToken: boolean;
  rowIndex = 0;
  columnIndex = 0;

  constructor(
    origin: { x: number; y: number },
    bounds: { width: number; height: number },
    barCount: number,
    barHeight: number,
    aboveToken: boolean = false,
    totalBarHeight = barCount * barHeight,
  ) {
    this.origin = origin;
    this.bounds = bounds;
    this.barCount = barCount;
    this.barHeight = barHeight;
    this.totalBarHeight = totalBarHeight;
    this.aboveToken = aboveToken;
  }

  getNew(width = BUBBLE_DIAMETER, height = width): { x: number; y: number } {
    if ((this.rowIndex + 1) * (width + 2) > this.bounds.width) {
      if (this.aboveToken) this.columnIndex--;
      else this.columnIndex++;
      this.rowIndex = 0;
    }

    const position = {
      x:
        this.origin.x +
        2 -
        this.bounds.width / 2 +
        this.rowIndex * (width + 2) +
        width / 2,
      y:
        this.origin.y -
        (this.aboveToken ? -2 - height / 2 : 2 + height / 2) -
        this.columnIndex * (height + 2) -
        (this.aboveToken ? 0 : this.totalBarHeight) +
        this.bounds.height / 2,
    };

    this.rowIndex++;
    return position;
  }
}
