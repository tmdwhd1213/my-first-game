import GameObject from './GameObject'

export enum FinishLineAppearance {
  Default = 'default',
}

export default class FinishLine extends GameObject {
  public appearance: FinishLineAppearance

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    appearance: FinishLineAppearance = FinishLineAppearance.Default // 기본값 설정
  ) {
    super(x, y, width, height) // 부모 클래스 생성자 호출
    this.appearance = appearance
  }

  draw(
    ctx: CanvasRenderingContext2D,
    scrollOffset: number,
    FinishLineImage: HTMLImageElement
  ) {
    ctx.drawImage(
      FinishLineImage,
      this.x - scrollOffset,
      this.y,
      this.width,
      this.height
    )
  }
}
