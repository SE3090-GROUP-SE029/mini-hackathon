import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import ResourceDetails from './pages/ResourceDetails.jsx';
import SavedResources from './pages/SavedResources.jsx';
import { resources } from './data/resources.js';
import './pages/ResourceDetails.css';

function ResourcesIndex() {
  return (
    <section className="resource-details">
      <h1>Resources</h1>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, textAlign: 'left' }}>
        {resources.map((resource) => (
          <li key={resource.id} style={{ marginBottom: '12px' }}>
            <Link to={`/resources/${resource.id}`}>{resource.title}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function App() {
  return (
    <BrowserRouter>
      <nav
        style={{
          display: 'flex',
          gap: '16px',
          padding: '16px 40px',
          textAlign: 'left',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <Link to="/resources">Resources</Link>
        <Link to="/saved">Saved</Link>
      </nav>
      <Routes>
        <Route path="/resources/:id" element={<ResourceDetails />} />
        <Route path="/resources" element={<ResourcesIndex />} />
        <Route path="/saved" element={<SavedResources />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
