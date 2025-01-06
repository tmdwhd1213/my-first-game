import { useEffect, useRef, useState } from 'react'
import { initialPlayerState, monsters, platforms } from '../constants/objects'
import { GRAVITY, JUMP_STRENGTH } from '../constants/settings'
import Platform from '../classes/Platform'
import {
  drawBackground,
  drawLives,
  drawMonsters,
  drawPlatforms,
  drawPlayer,
} from '../utils/canvasUtils'
import background from '../assets/background/background.webp'
import heartIcon from '../assets/heart/heart-icon.png'

const useGameLogic = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const [gameOver, setGameOver] = useState(false)
  const scrollOffset = useRef(0)
  const animationFrameId = useRef<number | null>(null)
  const player = useRef({ ...initialPlayerState }).current

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
      if (keys['ArrowRight']) {
        player.x += 5
        player.flip = true
        if (player.x > canvas.width / 2) {
          scrollOffset.current += player.x - canvas.width / 2
          player.x = canvas.width / 2
        }
      }

      if (keys['ArrowLeft'] && player.x > 0) {
        player.x -= 5
        player.flip = false
      }

      if (keys['c'] && player.onGround) {
        player.dy = JUMP_STRENGTH
        player.onGround = false
      }
    }

    const triggerInvincibility = () => {
      player.isInvincible = true
      setTimeout(() => {
        player.isInvincible = false
      }, player.invincibleTime)
    }

    const decreaseLives = () => {
      if (player.isInvincible) return
      player.lives -= 1
      triggerInvincibility()

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

    const checkCollisions = () => {
      player.onGround = false
      platforms.forEach((platform) => {
        if (
          player.y + player.height >= platform.y &&
          player.y + player.height <= platform.y + platform.height &&
          player.x + player.width > platform.x - scrollOffset.current &&
          player.x < platform.x + platform.width - scrollOffset.current
        ) {
          player.onGround = true
          player.dy = 0
          player.y = platform.y - player.height
        }
      })

      monsters.forEach((monster) => {
        if (
          player.x + player.width > monster.x - scrollOffset.current &&
          player.x < monster.x + monster.width - scrollOffset.current &&
          player.y + player.height > monster.y &&
          player.y < monster.y + monster.height
        ) {
          decreaseLives()
        }
      })

      if (player.y > canvas.height) {
        decreaseLives()
        resetPlayerToNearestPlatform()
      }
    }

    const applyGravity = () => {
      if (!player.onGround) {
        player.dy += GRAVITY
        player.y += player.dy
      }
    }

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      drawBackground(ctx, backgroundImage, canvasRef.current)
      drawPlayer(ctx, player, player.flip)
      drawPlatforms(ctx, platforms, scrollOffset.current)
      drawMonsters(ctx, monsters, scrollOffset.current)
      drawLives(ctx, player, heartImage)

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
