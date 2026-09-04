require('dotenv').config();

const Resource = require('../models/Resource');
const { connectDb } = require('../config/db');
const { createSamplePdf } = require('./createSamplePdf');
const resourceService = require('../services/resourceService');
const { getExtension } = require('../utils/fileValidation');
const { sanitiseFileName } = require('../utils/sanitize');

const SEED_RESOURCES = [
  {
    title: 'G.C.E. A/L Physics Mechanics Revision Paper',
    description:
      'A mechanics-focused revision paper for G.C.E. Advanced Level Physics covering motion, Newton’s laws, work, energy, and momentum with structured exam-style questions.',
    subject: 'Physics',
    educationLevel: 'G.C.E. A/L',
    resourceType: 'Revision Paper',
    language: 'English',
    providerName: 'NIE Physics Unit',
    uploadedBy: 'EduLanka Seed',
    tags: ['Physics', 'Mechanics', 'A/L', 'Revision'],
    fileName: 'al-physics-mechanics-revision.pdf',
  },
  {
    title: 'G.C.E. A/L Chemistry Organic Chemistry Notes',
    description:
      'Study notes on organic chemistry for G.C.E. A/L students, including hydrocarbons, functional groups, isomerism, and common reaction pathways used in the national paper.',
    subject: 'Chemistry',
    educationLevel: 'G.C.E. A/L',
    resourceType: 'Study Note',
    language: 'English',
    providerName: 'Colombo District Science Section',
    uploadedBy: 'EduLanka Seed',
    tags: ['Chemistry', 'Organic', 'A/L', 'Notes'],
    fileName: 'al-chemistry-organic-notes.pdf',
  },
  {
    title: 'G.C.E. O/L Mathematics Model Paper',
    description:
      'A full model paper for G.C.E. Ordinary Level Mathematics with Paper I and Paper II style questions on algebra, geometry, statistics, and number patterns.',
    subject: 'Mathematics',
    educationLevel: 'G.C.E. O/L',
    resourceType: 'Model Paper',
    language: 'English',
    providerName: 'Department of Examinations Practice Set',
    uploadedBy: 'EduLanka Seed',
    tags: ['Mathematics', 'O/L', 'Model paper'],
    fileName: 'ol-mathematics-model-paper.pdf',
  },
  {
    title: 'Grade 10 Science Term Test Paper',
    description:
      'School-based term test paper for Grade 10 Science covering matter, energy, living systems, and practical-based structured questions used in the third term.',
    subject: 'Science',
    educationLevel: 'Grade 10',
    resourceType: 'Question Paper',
    language: 'Sinhala',
    providerName: 'Western Province Education Department',
    uploadedBy: 'EduLanka Seed',
    tags: ['Science', 'Grade 10', 'Term test'],
    fileName: 'grade-10-science-term-test.pdf',
  },
  {
    title: 'Grade 11 ICT Revision Notes',
    description:
      'Concise ICT revision notes for Grade 11 students covering system software, databases, web design basics, and information systems before the G.C.E. O/L examination.',
    subject: 'ICT',
    educationLevel: 'Grade 11',
    resourceType: 'Study Note',
    language: 'English',
    providerName: 'School ICT Laboratory Pack',
    uploadedBy: 'EduLanka Seed',
    tags: ['ICT', 'Grade 11', 'Revision', 'Notes'],
    fileName: 'grade-11-ict-revision-notes.pdf',
  },
  {
    title: 'G.C.E. A/L Biology Human Biology Notes',
    description:
      'Human biology lecture notes for G.C.E. A/L Biology, with diagrams and summaries of the digestive, circulatory, respiratory, and nervous systems.',
    subject: 'Biology',
    educationLevel: 'G.C.E. A/L',
    resourceType: 'Lecture Note',
    language: 'English',
    providerName: 'Kandy Biology Teachers Circle',
    uploadedBy: 'EduLanka Seed',
    tags: ['Biology', 'Human biology', 'A/L'],
    fileName: 'al-biology-human-biology-notes.pdf',
  },
  {
    title: 'Grade 9 English Grammar Revision Paper',
    description:
      'A grammar-focused revision paper for Grade 9 English with tenses, reported speech, prepositions, and comprehension tasks aligned to the national syllabus.',
    subject: 'English',
    educationLevel: 'Grade 9',
    resourceType: 'Revision Paper',
    language: 'English',
    providerName: 'English Language Unit',
    uploadedBy: 'EduLanka Seed',
    tags: ['English', 'Grammar', 'Grade 9'],
    fileName: 'grade-9-english-grammar-revision.pdf',
  },
  {
    title: 'G.C.E. O/L History Model Paper',
    description:
      'Ordinary Level History model paper covering ancient kingdoms, colonial administration, and independence, with structured and essay questions in Sinhala.',
    subject: 'History',
    educationLevel: 'G.C.E. O/L',
    resourceType: 'Model Paper',
    language: 'Sinhala',
    providerName: 'e-thaksalawa History Pack',
    uploadedBy: 'EduLanka Seed',
    tags: ['History', 'O/L', 'Sri Lanka'],
    fileName: 'ol-history-model-paper.pdf',
  },
  {
    title: 'Grade 8 Mathematics Fractions Worksheet',
    description:
      'A classroom worksheet for Grade 8 Mathematics focusing on equivalent fractions, mixed numbers, and word problems that prepare students for later algebra.',
    subject: 'Mathematics',
    educationLevel: 'Grade 8',
    resourceType: 'Tutorial',
    language: 'Tamil',
    providerName: 'Northern Province Mathematics Unit',
    uploadedBy: 'EduLanka Seed',
    tags: ['Mathematics', 'Fractions', 'Grade 8', 'Tamil medium'],
    fileName: 'grade-8-mathematics-fractions.pdf',
  },
  {
    title: 'G.C.E. A/L Combined Mathematics Calculus Paper',
    description:
      'A past-paper style calculus paper for Combined Mathematics covering differentiation, integration, and applications of calculus used in G.C.E. A/L Paper II.',
    subject: 'Combined Mathematics',
    educationLevel: 'G.C.E. A/L',
    resourceType: 'Past Paper',
    language: 'English',
    providerName: 'Combined Mathematics Support Pack',
    uploadedBy: 'EduLanka Seed',
    tags: ['Combined Mathematics', 'Calculus', 'A/L', 'Past paper'],
    fileName: 'al-combined-maths-calculus.pdf',
  },
  {
    title: 'Grade 12 Accounting Company Accounts Tutorial',
    description:
      'Worked examples and tutorial questions on company accounts, share capital, and financial statements for Grade 12 Commerce stream students.',
    subject: 'Accounting',
    educationLevel: 'Grade 12',
    resourceType: 'Tutorial',
    language: 'English',
    providerName: 'Commerce Hub Sri Lanka',
    uploadedBy: 'EduLanka Seed',
    tags: ['Accounting', 'Company accounts', 'Grade 12'],
    fileName: 'grade-12-accounting-tutorial.pdf',
  },
  {
    title: 'G.C.E. O/L Science Model Paper',
    description:
      'Sinhala-medium G.C.E. O/L Science model paper with multiple-choice and structured questions on biology, chemistry, and physics units from the current syllabus.',
    subject: 'Science',
    educationLevel: 'G.C.E. O/L',
    resourceType: 'Model Paper',
    language: 'Sinhala',
    providerName: 'National Institute of Education',
    uploadedBy: 'EduLanka Seed',
    tags: ['Science', 'O/L', 'Sinhala medium'],
    fileName: 'ol-science-model-paper.pdf',
  },
];

async function seed() {
  await connectDb(process.env.MONGODB_URI);

  let created = 0;
  let skipped = 0;

  for (const item of SEED_RESOURCES) {
    const pdf = createSamplePdf(item.title, [
      item.description,
      `Subject: ${item.subject}`,
      `Level: ${item.educationLevel}`,
      `Language: ${item.language}`,
      'EduLanka sample paper for development and testing.',
    ]);

    const fileHash = resourceService.hashFileBuffer(pdf);
    const existing = await Resource.findOne({
      $or: [{ fileHash }, { title: item.title }],
    });

    if (existing) {
      skipped += 1;
      continue;
    }

    const fakeFile = {
      originalname: item.fileName,
      mimetype: 'application/pdf',
      buffer: pdf,
      size: pdf.length,
    };

    const gridFsFileId = await resourceService.uploadBufferToGridFS(fakeFile);

    await resourceService.createResource({
      title: item.title,
      description: item.description,
      subject: item.subject,
      educationLevel: item.educationLevel,
      resourceType: item.resourceType,
      language: item.language,
      providerName: item.providerName,
      uploadedBy: item.uploadedBy,
      tags: item.tags,
      fileName: sanitiseFileName(item.fileName),
      fileType: getExtension(item.fileName).replace('.', '').toUpperCase(),
      fileSize: pdf.length,
      fileHash,
      gridFsFileId,
    });

    created += 1;
  }

  console.log(`Seed complete. Created ${created} resource(s), skipped ${skipped}.`);
  process.exit(0);
}

seed().catch((error) => {
  console.error('Unable to seed resources. Check MONGODB_URI and try again.');
  console.error(error.message);
  process.exit(1);
});
