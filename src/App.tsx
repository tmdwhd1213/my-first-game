import { useState } from 'react'
import MainMenu from './components/MainMenu'
import GameCanvas from './components/GameCanvas'

function App() {
  const [gameStarted, setGameStarted] = useState(false) // 게임 시작 상태

  const handleStartGame = () => {
    setGameStarted(true) // 게임 시작
  }

  const handleSettings = () => {
    alert('Settings menu coming soon!')
  }

  const handleExit = () => {
    alert('Exiting game...')
  }

  const handleExitGame = () => {
    setGameStarted(false) // 메인 화면으로 돌아가기
    console.log('test')
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {!gameStarted ? (
        <MainMenu
          onStartGame={handleStartGame}
          onSettings={handleSettings}
          onExit={handleExit}
        />
      ) : (
        <GameCanvas onExit={handleExitGame} />
      )}
    </div>
  )
}

export default App
