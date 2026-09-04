import { Routes, Route } from 'react-router-dom'
import Recommendations from './pages/Recommendations'
import './App.css'

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<div className="home-page">Home Page - Coming Soon</div>} />
        <Route path="/resources" element={<div className="resources-page">Resources Page - Coming Soon</div>} />
        <Route path="/saved" element={<div className="saved-page">Saved Resources - Coming Soon</div>} />
        <Route path="/recommendations" element={<Recommendations />} />
      </Routes>
    </div>
  )
}

export default App
