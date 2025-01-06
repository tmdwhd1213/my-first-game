export default class GameObject {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number
  ) {}

  draw(ctx: CanvasRenderingContext2D, ...args: any[]) {
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }
}
