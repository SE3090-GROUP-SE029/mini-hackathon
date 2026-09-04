import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import ResourceDetails from './pages/ResourceDetails.jsx'
import Resources from './pages/Resources.jsx'
import UploadResource from './pages/UploadResource.jsx'
import './styles/resources.css'

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <NavLink to="/resources" className="app-logo">
          EduLanka
        </NavLink>
        <nav className="app-nav" aria-label="Main">
          <NavLink to="/resources">Resources</NavLink>
          <NavLink to="/upload">Upload Resource</NavLink>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Navigate to="/resources" replace />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/resources/:id" element={<ResourceDetails />} />
        <Route path="/upload" element={<UploadResource />} />
      </Routes>
    </div>
  )
}

export default App
