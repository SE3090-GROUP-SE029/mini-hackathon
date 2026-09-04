import { Link } from 'react-router-dom';

function ImpactSection() {
  return (
    <section className="impact-section">
      <div className="container">
        <p className="eyebrow">Why this exists</p>
        <h2>Scattered resources slow Sri Lankan students down</h2>
        <div className="impact-grid">
          <article>
            <h3>The problem</h3>
            <p>
              Past papers live in Facebook groups. Notes sit in personal Google Drives. Tutorials
              are forwarded on WhatsApp and then disappear. Students in rural schools spend more
              time hunting for materials than studying them.
            </p>
          </article>
          <article>
            <h3>The EduLanka approach</h3>
            <p>
              One catalogue, one search, one saved list. Students can filter by subject, O/L, A/L
              or university, and get local recommendations without creating an account.
            </p>
          </article>
          <article>
            <h3>Who benefits</h3>
            <p>
              School students preparing for national exams, undergraduates filling syllabus gaps,
              and self-learners who need English, Sinhala or Tamil materials in one place.
            </p>
          </article>
        </div>
        <Link className="btn btn-primary" to="/about">
          Read the full impact story
        </Link>
      </div>
    </section>
  );
}

export default ImpactSection;
