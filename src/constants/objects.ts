import Coin from '../classes/Coin'
import Monster, { MonsterAppearance } from '../classes/Monster'
import Platform, { PlatformAppearance } from '../classes/Platform'
import { playerAppearances } from './appearance'

type AppearanceKey = keyof typeof playerAppearances

export interface Player {
  x: number
  y: number
  width: number
  height: number
  dy: number
  onGround: boolean
  flip: boolean
  lives: number // 목숨 추가
  isInvincible: boolean // 무적 상태
  invincibleTime: number // 무적 지속 시간 (ms)
  appearance: AppearanceKey // 이미지 경로 또는 외형 키
  coin: number
}

export const platforms = [
  new Platform(0, 300, 400, 20, PlatformAppearance.Default),
  new Platform(450, 200, 100, 20, PlatformAppearance.Default),
  new Platform(600, 150, 150, 20, PlatformAppearance.Default),
  new Platform(800, 150, 150, 20, PlatformAppearance.Default),
  new Platform(1000, 150, 150, 20, PlatformAppearance.Default),
  new Platform(1200, 250, 200, 20, PlatformAppearance.Default),
  new Platform(1500, 250, 200, 20, PlatformAppearance.Default),
  new Platform(1700, 300, 200, 20, PlatformAppearance.Default),
  new Platform(1950, 250, 200, 20, PlatformAppearance.Default),
]

export const monsters = [
  new Monster(700, 120, 30, 30, MonsterAppearance.Default),
  new Monster(1000, 100, 30, 30, MonsterAppearance.Monster2),
]

export const initializeCoins = () => [
  new Coin(300, 220, 30, 30),
  new Coin(500, 170, 30, 30),
  new Coin(600, 170, 30, 30),
]

export const initialPlayerState: Player = {
  x: 50,
  y: 200,
  width: 30,
  height: 30,
  flip: true,
  dy: 0,
  onGround: false,
  lives: 3,
  isInvincible: false,
  invincibleTime: 1500,
  appearance: 'default', // 기본 외형 설정
  coin: 0,
}
