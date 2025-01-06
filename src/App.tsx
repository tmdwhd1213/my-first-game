import React from 'react'
import GameCanvas from './components/GameCanvas'

function App() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4"></h1>
      <GameCanvas />
    </div>
  )
}

export default App
