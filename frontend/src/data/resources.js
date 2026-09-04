export const resources = [
  {
    id: 'al-combined-maths-nie',
    title: 'Combined Mathematics A/L revision notes',
    description:
      'Structured Combined Mathematics notes aligned with the Sri Lankan GCE A/L syllabus, covering algebra, calculus, and mechanics.',
    subject: 'Combined Mathematics',
    level: 'A/L',
    language: 'English',
    type: 'Notes',
    provider: 'National Institute of Education',
    url: 'https://nie.lk/',
    tags: ['A/L', 'Mathematics', 'Revision'],
  },
  {
    id: 'ol-science-ethaksalawa',
    title: 'O/L Science lessons on e-thaksalawa',
    description:
      'Video and text lessons for GCE O/L Science, including matter, energy, and the environment, for Sinhala-medium students.',
    subject: 'Science',
    level: 'O/L',
    language: 'Sinhala',
    type: 'Video',
    provider: 'e-thaksalawa',
    url: 'https://www.e-thaksalawa.moe.gov.lk/',
    tags: ['O/L', 'Science', 'Sinhala'],
  },
  {
    id: 'al-physics-tamil',
    title: 'A/L Physics past-paper walkthroughs',
    description:
      'Worked examples from recent A/L Physics papers, with Tamil explanations of mechanics, waves, and electricity.',
    subject: 'Physics',
    level: 'A/L',
    language: 'Tamil',
    type: 'Past papers',
    provider: 'Department of Examinations',
    url: 'https://www.doenets.lk/',
    tags: ['A/L', 'Physics', 'Tamil'],
  },
  {
    id: 'english-bc-skills',
    title: 'English skills for school and university',
    description:
      'Listening, reading, and writing practice for students moving from O/L English into university coursework.',
    subject: 'English',
    level: 'O/L',
    language: 'English',
    type: 'Course',
    provider: 'British Council Sri Lanka',
    url: 'https://www.britishcouncil.lk/',
    tags: ['English', 'Language'],
  },
  {
    id: 'uni-cs-uoc',
    title: 'Introduction to Computer Science',
    description:
      'Open introductory computing material useful for first-year university students in Sri Lanka.',
    subject: 'Computer Science',
    level: 'University',
    language: 'English',
    type: 'Course',
    provider: 'University of Colombo',
    url: 'https://cmb.ac.lk/',
    tags: ['University', 'Computing'],
  },
  {
    id: 'ol-history-sinhala',
    title: 'O/L History source pack',
    description:
      'Primary-source summaries and timelines for GCE O/L History, written in Sinhala.',
    subject: 'History',
    level: 'O/L',
    language: 'Sinhala',
    type: 'Notes',
    provider: 'Ministry of Education',
    url: 'https://moe.gov.lk/',
    tags: ['O/L', 'History'],
  },
  {
    id: 'al-biology-open',
    title: 'A/L Biology practical guide',
    description:
      'Practical-experiment notes for A/L Biology, including microscopy, ecology, and physiology.',
    subject: 'Biology',
    level: 'A/L',
    language: 'English',
    type: 'Guide',
    provider: 'Open Educational Resources',
    url: 'https://www.oercommons.org/',
    tags: ['A/L', 'Biology', 'Practical'],
  },
  {
    id: 'ict-ol-notes',
    title: 'O/L ICT fundamentals',
    description:
      'Short notes on hardware, software, networks, and responsible ICT use for O/L students.',
    subject: 'ICT',
    level: 'O/L',
    language: 'English',
    type: 'Notes',
    provider: 'EduLanka Hub',
    url: 'https://www.nie.lk/',
    tags: ['O/L', 'ICT'],
  },
  {
    id: 'incomplete-optional-fields',
    title: 'Community study checklist',
    description: 'A lightweight checklist for planning weekly study hours.',
    subject: 'Study skills',
    level: 'O/L',
    language: 'English',
    type: 'Checklist',
  },
];

export function getResourceById(id) {
  if (id == null) {
    return null;
  }

  const normalized = String(id).trim();
  if (normalized.length === 0) {
    return null;
  }

  return (
    resources.find((item) => String(item.id) === normalized) ?? null
  );
}

export default resources;
