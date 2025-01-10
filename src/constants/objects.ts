import FinishLine, { FinishLineAppearance } from '@/classes/FinishLine'
import Coin from '../classes/Coin'
import Meat, { MeatAppearance } from '../classes/Meat'
import Monster, { MonsterAppearance } from '../classes/Monster'
import Platform, { PlatformAppearance } from '../classes/Platform'
import Wing, { WingAppearance } from '../classes/Wing'
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
  hasWings: boolean // 초기 상태는 날개 없음
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
  new Platform(2250, 250, 150, 20, PlatformAppearance.Default),
  new Platform(2500, 200, 150, 20, PlatformAppearance.Default),
  new Platform(2750, 150, 150, 20, PlatformAppearance.Default),
  new Platform(3000, 250, 150, 20, PlatformAppearance.Default),
  new Platform(3150, 250, 150, 20, PlatformAppearance.Default),
  new Platform(3300, 250, 150, 20, PlatformAppearance.Default),
  new Platform(3550, 200, 150, 20, PlatformAppearance.Default),
  new Platform(3750, 100, 150, 20, PlatformAppearance.Default),
  new Platform(3950, 300, 150, 20, PlatformAppearance.Default),
]

export const finishLine = new FinishLine(
  4030,
  250,
  60,
  60,
  FinishLineAppearance.Default
)
export const monsters = [
  new Monster(700, 120, 30, 30, MonsterAppearance.Default),
  new Monster(1000, 100, 30, 30, MonsterAppearance.Monster2),
  new Monster(1500, 100, 30, 30, MonsterAppearance.Monster2),
  new Monster(1700, 250, 30, 30, MonsterAppearance.Default),
  new Monster(2570, 170, 30, 30, MonsterAppearance.Default),
  new Monster(3100, 230, 30, 30, MonsterAppearance.Default),
  new Monster(3300, 100, 30, 30, MonsterAppearance.Monster2),
  new Monster(3800, 70, 30, 30, MonsterAppearance.Monster2),
]

export const initializeMeats = () => [
  new Meat(0, 120, 30, 30, MeatAppearance.Default),
  new Meat(1800, 100, 30, 30, MeatAppearance.Default),
]

export const initializeWings = () => [
  new Wing(550, 100, 50, 50, WingAppearance.Default),
  new Wing(2100, 180, 50, 50, WingAppearance.Default),
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
  hasWings: false,
  isInvincible: false,
  invincibleTime: 1.5 * 1000, // ms
  appearance: 'default', // 기본 외형 설정
  coin: 0,
}
