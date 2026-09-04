import { Link } from 'react-router-dom';

function About() {
  return (
    <section className="page about-page">
      <div className="container">
        <header className="page-header">
          <p className="eyebrow">About / Impact</p>
          <h1>A calmer way to reach Sri Lankan study materials</h1>
          <p>
            EduLanka is built around a local problem: exam resources exist, but they are not
            organised for the students who need them most.
          </p>
        </header>

        <article className="about-block">
          <h2>Sri Lankan education challenges</h2>
          <p>
            National exams still decide university places and career paths. Yet the supporting
            material — marking schemes, Sinhala-medium notes, Tamil-medium commerce papers, ICT
            practicals — is fragmented. Urban tuition centres accumulate private banks of papers.
            Rural students rely on whatever a teacher can photocopy. Online, the same PDF is
            posted in dozens of groups with no consistent title, language tag or syllabus year.
          </p>
          <p>
            Language adds another split. A Combined Mathematics student in English medium cannot
            easily reuse a Sinhala note pack. A Tamil-medium Accounting student may never see an
            English Drive folder that already has the paper they need. Without a shared catalogue,
            duplication and exclusion happen at the same time.
          </p>
        </article>

        <article className="about-block">
          <h2>How EduLanka helps</h2>
          <p>
            EduLanka indexes resources by subject, education level, type, language and tags.
            Students search once, filter to O/L, A/L or University, open the details, visit the
            source, and save the item in the browser. A recommendation form turns a study goal
            into a ranked shortlist using transparent scores rather than a hidden model.
          </p>
        </article>

        <div className="about-grid">
          <article>
            <h2>Benefits for students</h2>
            <ul>
              <li>Less time spent asking seniors for “the 2023 paper”.</li>
              <li>Clear language and level labels before they open a link.</li>
              <li>A saved list that survives a refresh, useful during study leave.</li>
              <li>Recommendations they can explain: subject, level, language, tags.</li>
            </ul>
          </article>
          <article>
            <h2>Benefits for schools</h2>
            <ul>
              <li>Teachers can point a class to one catalogue instead of a chat dump.</li>
              <li>Libraries can highlight local-syllabus notes and past papers.</li>
              <li>ICT labs can bookmark video courses that match O/L and A/L practicals.</li>
              <li>No student accounts to administer for the MVP.</li>
            </ul>
          </article>
          <article>
            <h2>Benefits for self-learners</h2>
            <ul>
              <li>Adults repeating O/L English or Accounting can start without a tuition class.</li>
              <li>Undergraduates can find foundation ICT and science material quickly.</li>
              <li>Study hours are converted into a simple weekly plan.</li>
              <li>The app still works from the sample catalogue if the server is down.</li>
            </ul>
          </article>
        </div>

        <div className="cta-band about-cta">
          <h2>Ready to look up a subject?</h2>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/resources">
              Open the catalogue
            </Link>
            <Link className="btn btn-ghost" to="/recommendations">
              Ask for a shortlist
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
