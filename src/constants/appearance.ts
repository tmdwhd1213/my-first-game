import { createImage } from './settings'
import defaultImageSrc from '@/assets/heros/cat.png'
import catImageSrc from '@/assets/heros/cat.png'
import dogImageSrc from '@/assets/heros/cat.png'
import alienImageSrc from '@/assets/heros/cat.png'
import defaultCoinImageSrc from '@/assets/coins/coin.png'
import defaultMonsterImageSrc from '@/assets/monster/monster.png'
import monster2ImageSrc from '@/assets/monster/monster2.png'
import defaultplatformImageSrc from '@/assets/ground/ground.png'
import defaultMeat from '@/assets/meat/hot-dog.png'
import defaultWing from '@/assets/wing/heart-wings.png'

export const playerAppearances: Record<string, HTMLImageElement> = {
  default: createImage(defaultImageSrc),
  cat: createImage(catImageSrc),
  dog: createImage(dogImageSrc),
  alien: createImage(alienImageSrc),
}

export const coinAppearances: Record<string, HTMLImageElement> = {
  default: createImage(defaultCoinImageSrc),
}

export const monsterAppearances: Record<string, HTMLImageElement> = {
  default: createImage(defaultMonsterImageSrc),
  monster2: createImage(monster2ImageSrc),
}

export const meatAppearances: Record<string, HTMLImageElement> = {
  default: createImage(defaultMeat),
}

export const wingAppearances: Record<string, HTMLImageElement> = {
  default: createImage(defaultWing),
}

export const platformAppearances: Record<string, HTMLImageElement> = {
  default: createImage(defaultplatformImageSrc),
}
