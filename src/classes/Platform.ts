import GameObject from './GameObject'

export enum PlatformAppearance {
  Default = 'default',
}

export default class Platform extends GameObject {
  public appearance: PlatformAppearance

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    appearance: PlatformAppearance = PlatformAppearance.Default // 기본값 설정
  ) {
    super(x, y, width, height) // 부모 클래스 생성자 호출
    this.appearance = appearance
  }

  draw(
    ctx: CanvasRenderingContext2D,
    scrollOffset: number,
    platformImage: HTMLImageElement
  ) {
    ctx.drawImage(
      platformImage,
      this.x - scrollOffset,
      this.y,
      this.width,
      this.height
    )
  }
}
