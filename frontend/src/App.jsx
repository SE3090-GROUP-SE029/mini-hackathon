import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import About from './pages/About';
import Home from './pages/Home';
import Recommendations from './pages/Recommendations';
import ResourceDetails from './pages/ResourceDetails';
import Resources from './pages/Resources';
import SavedResources from './pages/SavedResources';
import UploadResource from './pages/UploadResource';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/resources/new" element={<UploadResource />} />
          <Route path="/resources/:id/edit" element={<UploadResource />} />
          <Route path="/resources/:id" element={<ResourceDetails />} />
          <Route path="/saved" element={<SavedResources />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
