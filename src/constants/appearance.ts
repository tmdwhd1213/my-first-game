import defaultImageSrc from '@/assets/heros/cat.png'
import catImageSrc from '@/assets/heros/cat.png'
import dogImageSrc from '@/assets/heros/cat.png'
import alienImageSrc from '@/assets/heros/cat.png'

export const playerAppearances: Record<string, HTMLImageElement> = {
  default: createImage(defaultImageSrc),
  cat: createImage(catImageSrc),
  dog: createImage(dogImageSrc),
  alien: createImage(alienImageSrc),
}

// 이미지 객체를 생성하는 함수
function createImage(src: string): HTMLImageElement {
  const img = new Image()
  img.src = src
  return img
}
