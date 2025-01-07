import GameObject from './GameObject'

export default class Coin extends GameObject {
  public collected: boolean

  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height) // 부모 클래스 생성자 호출
    this.collected = false // 초기 상태는 "수집되지 않음"
  }

  draw(
    ctx: CanvasRenderingContext2D,
    scrollOffset: number,
    coinImage: HTMLImageElement
  ) {
    if (!this.collected) {
      // 수집되지 않은 코인만 그리기
      ctx.drawImage(
        coinImage,
        this.x - scrollOffset,
        this.y,
        this.width,
        this.height
      )
    }
  }
}
