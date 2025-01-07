import GameObject from './GameObject'

export enum MonsterAppearance {
  Default = 'default',
  Monster2 = 'monster2',
}

export default class Monster extends GameObject {
  public appearance: MonsterAppearance

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    appearance: MonsterAppearance = MonsterAppearance.Default // 기본값 설정
  ) {
    super(x, y, width, height) // 부모 클래스 생성자 호출
    this.appearance = appearance
  }

  public move(speed: number) {
    this.x += speed
  }

  draw(
    ctx: CanvasRenderingContext2D,
    scrollOffset: number,
    monsterImage: HTMLImageElement
  ) {
    ctx.drawImage(
      monsterImage,
      this.x - scrollOffset,
      this.y,
      this.width,
      this.height
    )
  }
}
