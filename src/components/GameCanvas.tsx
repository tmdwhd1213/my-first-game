import React, { useRef } from 'react'
import useGameLogic from '../hooks/useGameLogic'

interface GameCanvasProps {
  onExit: () => void // 메인 화면으로 돌아가기 콜백
}

const GameCanvas: React.FC<GameCanvasProps> = ({ onExit }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const { gameOver, restartGame } = useGameLogic(canvasRef)

  return (
    <div className="relative">
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-75">
          <h1 className="text-white text-4xl font-bold mb-4">Game Over</h1>
          <button
            onClick={restartGame}
            className="px-4 py-2 bg-white text-black font-bold rounded-lg shadow-lg hover:bg-gray-300"
          >
            Restart
          </button>
        </div>
      )}
      <div className="absolute bottom-4 right-4">
        <button
          onClick={onExit}
          className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg shadow-lg hover:bg-red-600"
        >
          Exit
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="bg-blue-200 border-2 border-black"
      />
    </div>
  )
}

export default GameCanvas
