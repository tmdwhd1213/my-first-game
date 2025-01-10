import React from 'react'

interface MainMenuProps {
  onStartGame: () => void // 게임 시작 콜백
  onSettings: () => void // 설정 메뉴 콜백
  onExit: () => void // 게임 종료 콜백
}

const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onSettings,
  onExit,
}) => {
  return (
    <div className="main-menu flex flex-col items-center space-y-4">
      <h1 className="text-4xl font-bold mb-6">Main Menu</h1>
      <button
        className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
        onClick={onStartGame}
      >
        Game Start
      </button>
      <button
        className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
        onClick={onSettings}
      >
        Settings
      </button>
      <button
        className="px-6 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600"
        onClick={onExit}
      >
        Exit
      </button>
    </div>
  )
}

export default MainMenu
