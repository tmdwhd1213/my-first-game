import { useEffect, useRef, useState } from 'react'
import {
  finishLine,
  initializeCoins,
  initializeMeats,
  initializeWings,
  initialPlayerState,
  monsters,
  platforms,
} from '../constants/objects'
import { GRAVITY, JUMP_STRENGTH } from '../constants/settings'
import Platform from '../classes/Platform'
import {
  drawBackground,
  drawCoins,
  drawCollectedCoins,
  drawFinishLine,
  drawLives,
  drawMeats,
  drawMonsters,
  drawPlatforms,
  drawPlayer,
  drawWings,
} from '../utils/canvasUtils'
import background from '../assets/background/background.webp'
import heartIcon from '../assets/heart/heart-icon.png'
import { coinAppearances } from '../constants/appearance'

const useGameLogic = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  onExit: () => void
) => {
  const [gameOver, setGameOver] = useState(false)
  const scrollOffset = useRef(0)
  const animationFrameId = useRef<number | null>(null)
  const player = useRef({ ...initialPlayerState }).current

  let invincibilityTimeout: NodeJS.Timeout | null = null

  let coins = initializeCoins()
  let meats = initializeMeats()
  let wings = initializeWings()

  // 이미지
  const heartImage = new Image() // 하트 이미지 전역 생성
  heartImage.src = heartIcon
  const backgroundImage = new Image()
  backgroundImage.src = background
  /////

  const resetPlayerPosition = () => {
    Object.assign(player, { ...initialPlayerState })
  }

  const restartGame = () => {
    resetPlayerPosition()
    scrollOffset.current = 0
    setGameOver(false)

    // 코인 초기화
    coins = initializeCoins()

    // 기존 AnimationFrame 중단
    if (animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current)
    }

    // 새로운 AnimationFrame 시작
    startGameLoop()
  }

  const startGameLoop = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const keys: Record<string, boolean> = {}

    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return
      keys[e.key] = true
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (gameOver) return
      keys[e.key] = false
    }

    const handleMovement = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      // 좌우 이동
      if (keys['ArrowRight'] && player.x + player.width < canvas.width) {
        player.x += 5
        player.flip = true

        // 캔버스 스크롤 이동 조건 수정
        if (player.x > canvas.width / 2) {
          scrollOffset.current += player.x - canvas.width / 2
          player.x = canvas.width / 2
        }
      }

      if (keys['ArrowLeft'] && player.x > 0) {
        player.x -= 5
        player.flip = false
      }

      // 날개로 인한 공중 이동
      if (player.hasWings) {
        if (keys['ArrowUp'] && player.y > 0) {
          player.y -= 5 // 위로 이동
        }
        if (keys['ArrowDown'] && player.y + player.height < canvas.height) {
          player.y += 5 // 아래로 이동
        }
      } else {
        // 점프 (일반 상황)
        if (keys['c'] && player.onGround) {
          player.dy = JUMP_STRENGTH
          player.onGround = false
        }
      }
    }

    const triggerInvincibility = (
      invincibleTime: number,
      fromWings: boolean = false
    ) => {
      if (invincibilityTimeout) {
        clearTimeout(invincibilityTimeout) // 기존 타임아웃 제거
      }

      player.isInvincible = true

      if (fromWings) {
        player.hasWings = true // 날개로 인한 상태
      }
      player.onGround = false // 공중에서 자유롭게 이동 가능
      player.dy = 0 // 중력 초기화

      invincibilityTimeout = setTimeout(() => {
        player.isInvincible = false

        if (fromWings) {
          player.hasWings = false // 날개 상태 종료
        }

        invincibilityTimeout = null
      }, invincibleTime)
    }

    const decreaseLives = () => {
      if (player.isInvincible) return

      player.lives -= 1
      triggerInvincibility(player.invincibleTime)

      if (player.lives <= 0) {
        setGameOver(true)
      }
    }

    const findNearestPlatform = (): Platform | null => {
      let nearestPlatform: Platform | null = null
      let minDistance = Infinity

      platforms.forEach((platform) => {
        const distance =
          Math.abs(
            player.x - (platform.x + platform.width / 2 - scrollOffset.current)
          ) + Math.abs(player.y - platform.y)
        if (distance < minDistance) {
          minDistance = distance
          nearestPlatform = platform
        }
      })

      return nearestPlatform
    }

    const resetPlayerToNearestPlatform = () => {
      const nearestPlatform = findNearestPlatform()
      if (nearestPlatform) {
        player.x =
          nearestPlatform.x +
          nearestPlatform.width / 2 -
          player.width / 2 -
          scrollOffset.current
        player.y = nearestPlatform.y - player.height
        player.dy = 0
        player.onGround = true
      }
    }

    const checkCollisions = async () => {
      player.onGround = false

      // 땅바닥
      platforms.forEach((platform) => {
        if (
          player.y + player.height >= platform.y &&
          player.y + player.height <= platform.y + platform.height &&
          player.x + player.width > platform.x - scrollOffset.current &&
          player.x < platform.x + platform.width - scrollOffset.current
        ) {
          player.onGround = true
          player.dy = 0 // 중력 초기화
          player.y = platform.y - player.height
        }
      })

      // 피니시라인 충돌
      if (
        player.x + player.width > finishLine.x - scrollOffset.current &&
        player.x < finishLine.x + finishLine.width - scrollOffset.current &&
        player.y + player.height > finishLine.y &&
        player.y < finishLine.y + finishLine.height
      ) {
        alert('🎉 축하합니다! 스테이지 1 클리어! 🎉')
        await onExit() // 메인 화면으로 이동
      }

      // 몬스터랑 부딪혔을 때
      monsters.forEach((monster) => {
        if (
          player.x + player.width > monster.x - scrollOffset.current &&
          player.x < monster.x + monster.width - scrollOffset.current &&
          player.y + player.height > monster.y &&
          player.y < monster.y + monster.height
        ) {
          if (!player.isInvincible) {
            decreaseLives()
          }
        }
      })

      // 고기 먹기
      meats.forEach((meat) => {
        if (
          !meat.isEaten && // 아직 먹히지 않은 경우만 체크
          player.x + player.width > meat.x - scrollOffset.current &&
          player.x < meat.x + meat.width - scrollOffset.current &&
          player.y + player.height > meat.y &&
          player.y < meat.y + meat.height
        ) {
          meat.isEaten = true
          player.lives++
        }
      })

      // 날개 먹기
      wings.forEach((wing) => {
        if (
          !wing.isEaten && // 아직 먹히지 않은 경우만 체크
          player.x + player.width > wing.x - scrollOffset.current &&
          player.x < wing.x + wing.width - scrollOffset.current &&
          player.y + player.height > wing.y &&
          player.y < wing.y + wing.height
        ) {
          wing.isEaten = true
          player.hasWings = true // 날개 상태 활성화
          player.isInvincible = true // 무적 상태

          const invincibleTime = 5000 * 1000 // 5초
          triggerInvincibility(invincibleTime, true)
        }
      })

      // 동전 먹기
      coins.forEach((coin) => {
        if (
          !coin.collected && // 아직 먹히지 않은 경우만 체크
          player.x + player.width > coin.x - scrollOffset.current &&
          player.x < coin.x + coin.width - scrollOffset.current &&
          player.y + player.height > coin.y &&
          player.y < coin.y + coin.height
        ) {
          coin.collected = true // 먹힌 상태로 플래그 변경
          player.coin++
        }
      })

      // 플랫폼에서 떨어질 때,
      if (player.y > canvas.height) {
        decreaseLives()
        resetPlayerToNearestPlatform()
      }
    }

    const applyGravity = () => {
      if (!player.onGround && !player.hasWings) {
        player.dy += GRAVITY
        player.y += player.dy
      }
    }

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      drawBackground(ctx, backgroundImage, canvasRef.current)
      drawCollectedCoins(
        ctx,
        coinAppearances.default,
        canvasRef.current,
        player.coin
      )
      drawPlayer(ctx, player, player.flip)
      drawPlatforms(ctx, platforms, scrollOffset.current)
      drawCoins(ctx, coins, scrollOffset.current)
      drawMonsters(ctx, monsters, scrollOffset.current)
      drawMeats(ctx, meats, scrollOffset.current)
      drawWings(ctx, wings, scrollOffset.current)
      drawLives(ctx, player, heartImage)
      drawFinishLine(ctx, finishLine, scrollOffset.current)

      if (!gameOver) {
        handleMovement()
        applyGravity()
        checkCollisions()
      }

      animationFrameId.current = requestAnimationFrame(update)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    update()

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }

  useEffect(() => {
    startGameLoop()

    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [gameOver])

  return { gameOver, restartGame, player, scrollOffset }
}

export default useGameLogic
