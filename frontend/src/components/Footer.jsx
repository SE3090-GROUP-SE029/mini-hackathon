import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <p className="brand-name">EduLanka</p>
          <p>
            A free catalogue of notes, past papers, tutorials and video courses for Sri Lankan
            O/L, A/L and university learners.
          </p>
        </div>
        <div>
          <p className="footer-label">Explore</p>
          <Link to="/resources">Browse resources</Link>
          <Link to="/recommendations">Get recommendations</Link>
          <Link to="/saved">Saved list</Link>
          <Link to="/about">Impact</Link>
        </div>
        <div>
          <p className="footer-label">Built for</p>
          <p>Students, teachers, school libraries and self-learners across Sri Lanka.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
