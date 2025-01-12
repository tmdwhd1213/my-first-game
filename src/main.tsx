import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import '@fontsource/noto-sans-kr'; // 기본(weight 400) 스타일
import '@fontsource/noto-sans-kr/700.css'; // 굵기(weight 700) 스타일

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
