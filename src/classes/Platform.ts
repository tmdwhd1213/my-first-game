import GameObject from './GameObject'

export default class Platform extends GameObject {
  public draw(ctx: CanvasRenderingContext2D, scrollOffset: number) {
    ctx.fillStyle = 'green'
    ctx.fillRect(this.x - scrollOffset, this.y, this.width, this.height)
  }
}
