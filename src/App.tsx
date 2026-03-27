/**
 * OpenBlock - 主应用入口
 */

import React from 'react'
import { BlockEditor } from './core/Editor'

function App() {
  const [content, setContent] = useState('')

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🧱 OpenBlock</h1>
        <span className="version">v0.0.1-mvp</span>
      </header>
      
      <main className="app-main">
        <BlockEditor 
          content={content}
          onChange={setContent}
          placeholder="开始记录你的想法..."
        />
      </main>
      
      <footer className="app-footer">
        <p>本地优先 · 数据开放 · 隐私保护</p>
      </footer>
    </div>
  )
}

export default App
