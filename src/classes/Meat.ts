import GameObject from './GameObject'

export enum MeatAppearance {
  Default = 'default',
}

export default class Meat extends GameObject {
  public appearance: MeatAppearance
  public isEaten: boolean

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    appearance: MeatAppearance = MeatAppearance.Default // 기본값 설정
  ) {
    super(x, y, width, height) // 부모 클래스 생성자 호출
    this.appearance = appearance
    this.isEaten = false // 초기 상태는 "먹지 않음"
  }

  draw(
    ctx: CanvasRenderingContext2D,
    scrollOffset: number,
    meatImage: HTMLImageElement
  ) {
    if (!this.isEaten) {
      ctx.drawImage(
        meatImage,
        this.x - scrollOffset,
        this.y,
        this.width,
        this.height
      )
    }
  }
}
