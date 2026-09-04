import { Link } from 'react-router-dom';
import ImpactSection from '../components/ImpactSection';

const stats = [
  { value: '10+', label: 'Curated Sri Lankan resources in the starter catalogue' },
  { value: '3', label: 'Education levels: O/L, A/L and University' },
  { value: '6', label: 'Core subjects from Maths to Sinhala' },
  { value: '1 min', label: 'Average time to find and save a useful resource' },
];

const benefits = [
  {
    title: 'Stop hunting across chats',
    body: 'Search titles, descriptions and subjects instead of scrolling Facebook groups and WhatsApp threads.',
  },
  {
    title: 'Filter to your exam',
    body: 'Narrow by O/L, A/L or University, then by Mathematics, Science, ICT, Commerce, English or Sinhala.',
  },
  {
    title: 'Save what you will actually use',
    body: 'Keep a personal list in this browser. It stays after refresh — no login required.',
  },
  {
    title: 'Get a ranked study shortlist',
    body: 'Tell EduLanka your subject, level, language and weekly hours. A local scoring engine ranks the best matches.',
  },
];

function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Sri Lanka’s student resource hub</p>
            <h1>Find notes, past papers and tutorials without the scavenger hunt.</h1>
            <p className="lede">
              High-quality study materials for Sri Lankan students are scattered across social
              groups, personal drives and messaging apps. EduLanka brings them into one searchable
              catalogue so you can spend time learning, not looking.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" to="/resources">
                Browse resources
              </Link>
              <Link className="btn btn-ghost" to="/recommendations">
                Get recommendations
              </Link>
            </div>
          </div>
          <div className="hero-panel" aria-hidden="true">
            <article className="floating-card">
              <span>O/L · Mathematics</span>
              <strong>Past papers 2015–2024</strong>
              <small>Department of Examinations</small>
            </article>
            <article className="floating-card floating-card-two">
              <span>A/L · Science</span>
              <strong>Biology video course</strong>
              <small>e-Thaksalawa</small>
            </article>
            <article className="floating-card floating-card-three">
              <span>Saved locally</span>
              <strong>Your list stays in this browser</strong>
              <small>No account needed</small>
            </article>
          </div>
        </div>
      </section>

      <section className="problem-section">
        <div className="container split">
          <div>
            <p className="eyebrow">The local problem</p>
            <h2>Good material exists. Finding it is the hard part.</h2>
            <p>
              A student in Jaffna, Matara or Badulla may need the same O/L Science notes as a
              student in Colombo. In practice those notes live in a senior’s Drive folder, a
              tuition master’s Telegram channel, or a PDF that was forwarded once and never
              organised. Tamil, Sinhala and English medium learners are left searching in
              parallel, with no shared index.
            </p>
          </div>
          <ul className="problem-list">
            <li>Past papers split across exam websites, groups and photocopies.</li>
            <li>Notes disappear when a WhatsApp chat is cleared.</li>
            <li>Video lessons are hard to match to the local syllabus.</li>
            <li>Self-learners have no single starting point.</li>
          </ul>
        </div>
      </section>

      <section className="solution-section">
        <div className="container">
          <p className="eyebrow">The EduLanka solution</p>
          <h2>One catalogue. Clear filters. Personal saves.</h2>
          <p className="section-intro">
            EduLanka is a lightweight hub for discovering, saving and accessing educational
            resources mapped to Sri Lankan subjects and exam levels. Search works even if the
            database is briefly unavailable, using the built-in sample catalogue.
          </p>
          <div className="benefit-grid">
            {benefits.map((item) => (
              <article key={item.title} className="benefit-card">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="container stats-grid">
          {stats.map((stat) => (
            <article key={stat.label}>
              <p className="stat-value">{stat.value}</p>
              <p>{stat.label}</p>
            </article>
          ))}
        </div>
      </section>

      <ImpactSection />

      <section className="cta-band">
        <div className="container cta-inner">
          <div>
            <h2>Start with a subject you have an exam for.</h2>
            <p>Open the catalogue, filter once, and save the resources you want to revisit.</p>
          </div>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/resources">
              Explore the catalogue
            </Link>
            <Link className="btn btn-ghost" to="/about">
              See who it helps
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
