import GameObject from './GameObject'

export enum WingAppearance {
  Default = 'default',
}

export default class Wing extends GameObject {
  public appearance: WingAppearance
  public isEaten: boolean

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    appearance: WingAppearance = WingAppearance.Default // 기본값 설정
  ) {
    super(x, y, width, height) // 부모 클래스 생성자 호출
    this.appearance = appearance
    this.isEaten = false // 초기 상태는 "먹지 않음"
  }

  draw(
    ctx: CanvasRenderingContext2D,
    scrollOffset: number,
    wingImage: HTMLImageElement
  ) {
    if (!this.isEaten) {
      ctx.drawImage(
        wingImage,
        this.x - scrollOffset,
        this.y,
        this.width,
        this.height
      )
    }
  }
}
