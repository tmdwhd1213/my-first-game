import Monster from '../classes/Monster'
import Platform from '../classes/Platform'
import { playerAppearances } from '../constants/appearance'
import { Player } from '../constants/objects'

export const drawPlayer = (
  ctx: CanvasRenderingContext2D,
  player: Player,
  flip: boolean = true
) => {
  const image = playerAppearances[player.appearance]

  // 이미지가 로드되지 않았으면 건너뜀
  if (!image || !image.complete) {
    console.warn(
      `Image for appearance '${player.appearance}' is not loaded yet.`
    )
    return
  }

  if (flip) {
    // 캔버스 상태 저장
    ctx.save()

    // 캔버스 원점 이동 및 반전
    ctx.translate(player.x + player.width / 2, player.y + player.height / 2)
    ctx.scale(-1, 1)

    // 이미지의 반전된 위치에 그리기
    ctx.drawImage(
      image,
      -player.width / 2, // 반전된 기준에서 x, y 조정
      -player.height / 2,
      player.width,
      player.height
    )

    // 캔버스 상태 복원
    ctx.restore()
  } else {
    // 일반적인 이미지 그리기
    ctx.drawImage(image, player.x, player.y, player.width, player.height)
  }
}

export const drawPlatforms = (
  ctx: CanvasRenderingContext2D,
  platforms: Platform[],
  scrollOffset: number
) => {
  ctx.fillStyle = 'green'
  platforms.forEach((platform) => {
    ctx.fillRect(
      platform.x - scrollOffset,
      platform.y,
      platform.width,
      platform.height
    )
  })
}

export const drawMonsters = (
  ctx: CanvasRenderingContext2D,
  monsters: Monster[],
  scrollOffset: number
) => {
  ctx.fillStyle = 'purple'
  monsters.forEach((monster) => {
    ctx.fillRect(
      monster.x - scrollOffset,
      monster.y,
      monster.width,
      monster.height
    )
  })
}

export const drawLives = (
  ctx: CanvasRenderingContext2D,
  player: Player,
  heartImage: HTMLImageElement
) => {
  if (!heartImage.complete) return
  for (let i = 0; i < player.lives; i++) {
    ctx.drawImage(heartImage, 750 - i * 30, 10, 20, 20)
  }
}

export const drawBackground = (
  ctx: CanvasRenderingContext2D,
  backgroundImage: HTMLImageElement,
  canvas: any
) => {
  if (backgroundImage.complete) {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height)
  } else {
    ctx.fillStyle = '#87CEEB'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
}
