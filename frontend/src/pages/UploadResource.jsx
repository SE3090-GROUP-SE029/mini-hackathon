import { Link } from 'react-router-dom'
import ResourceUpload from '../components/ResourceUpload.jsx'

function UploadResource() {
  return (
    <main className="resources-page upload-page">
      <header className="resources-page__header">
        <p className="resources-page__eyebrow">Contribute</p>
        <h1>Upload Educational Resource</h1>
        <p className="resources-page__lead">
          Share a past paper, model paper, or study note so other Sri Lankan students
          can find and use it.
        </p>
        <Link className="resources-page__back" to="/resources">
          Back to resources
        </Link>
      </header>

      <ResourceUpload />
    </main>
  )
}

export default UploadResource
