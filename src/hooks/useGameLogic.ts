import { useEffect, useRef, useState } from 'react'
import {
  finishLine,
  initializeCoins,
  initializeMeats,
  initializeWings,
  initialPlayerState,
  initializeMonsters,
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
  let monsters = initializeMonsters()

  // 투사체 배열
  const projectiles = useRef<
    Array<{ x: number; y: number; direction: boolean }>
  >([])

  // 공격 간격 제어
  const attackCooldown = 100 // 공격 간격 (ms)
  const lastAttackTime = useRef(0)

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
    monsters = initializeMonsters()

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

      // X 키를 눌렀을 때 투사체 발사 (공격 속도 제한)
      if (e.key === 'x') {
        const currentTime = Date.now()
        if (currentTime - lastAttackTime.current >= attackCooldown) {
          projectiles.current.push({
            x: player.x + (player.flip ? player.width : 0), // 플레이어 위치 기준
            y: player.y + player.height / 2, // 플레이어 중심에서 발사
            direction: player.flip, // 방향 (true: 오른쪽, false: 왼쪽)
          })

          lastAttackTime.current = currentTime // 마지막 공격 시간 갱신
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (gameOver) return
      keys[e.key] = false
    }

    const updateProjectiles = () => {
      projectiles.current = projectiles.current.filter((projectile) => {
        // 투사체 이동 (오른쪽 또는 왼쪽)
        projectile.x += projectile.direction ? 10 : -10

        // 투사체가 사거리를 초과하면 제거
        return Math.abs(projectile.x - player.x) <= 500
      })
    }

    const drawProjectiles = () => {
      projectiles.current.forEach((projectile) => {
        ctx.beginPath()
        ctx.arc(projectile.x, projectile.y, 5, 0, Math.PI * 2) // 투사체 크기
        ctx.fillStyle = 'red' // 투사체 색상
        ctx.fill()
        ctx.closePath()
      })
    }

    const checkProjectileCollisions = () => {
      projectiles.current.forEach((projectile, projectileIndex) => {
        monsters.forEach((monster, monsterIndex) => {
          if (
            projectile.x > monster.x - scrollOffset.current &&
            projectile.x < monster.x + monster.width - scrollOffset.current &&
            projectile.y > monster.y &&
            projectile.y < monster.y + monster.height
          ) {
            // 몬스터에 맞았을 경우
            monsters.splice(monsterIndex, 1) // 몬스터 제거
            projectiles.current.splice(projectileIndex, 1) // 투사체 제거
          }
        })
      })
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
      monsters.forEach((monster, index) => {
        if (
          player.x + player.width > monster.x - scrollOffset.current &&
          player.x < monster.x + monster.width - scrollOffset.current &&
          player.y + player.height > monster.y &&
          player.y < monster.y + monster.height
        ) {
          if (player.hasWings) {
            // 날개 상태일 경우 몬스터 제거
            monsters.splice(index, 1)
          } else if (!player.isInvincible) {
            // 무적 상태가 아닐 경우 라이프 감소
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

          const invincibleTime = 5 * 1000 // 5초
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

      drawProjectiles() // 투사체 그리기

      if (!gameOver) {
        handleMovement()
        applyGravity()
        checkCollisions()
        updateProjectiles() // 투사체 이동 업데이트
        checkProjectileCollisions() // 투사체 충돌 체크
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
