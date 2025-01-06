import GameObject from './GameObject'

export default class Monster extends GameObject {
  public move(speed: number) {
    this.x += speed
  }

  draw(ctx: CanvasRenderingContext2D, scrollOffset: number) {
    ctx.fillStyle = 'purple'
    ctx.fillRect(this.x - scrollOffset, this.y, this.width, this.height)
  }
}
