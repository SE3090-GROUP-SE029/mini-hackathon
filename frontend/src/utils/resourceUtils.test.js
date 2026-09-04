import assert from 'node:assert/strict'
import test from 'node:test'
import {
  filterByEducationLevel,
  filterByLanguage,
  filterBySubject,
  filterByType,
  getResourceCount,
  getResourceCountLabel,
  processResources,
  searchResources,
  sortResources,
} from './resourceUtils.js'
import { validateResourceForm } from './resourceValidation.js'

const sample = [
  {
    id: '1',
    title: 'Physics Grade 12 Mechanics Paper',
    description: 'A mechanics-focused revision paper for G.C.E. A/L students.',
    subject: 'Physics',
    educationLevel: 'G.C.E. A/L',
    resourceType: 'Past Paper',
    language: 'English',
    createdAt: '2026-09-04T10:00:00.000Z',
  },
  {
    id: '2',
    title: 'Grade 10 Mathematics Revision Paper',
    description: 'Algebra and geometry questions for Grade 10.',
    subject: 'Mathematics',
    educationLevel: 'Grade 10',
    resourceType: 'Revision Paper',
    language: 'Sinhala',
    createdAt: '2026-08-01T10:00:00.000Z',
  },
  {
    id: '3',
    title: 'O/L History Model Paper',
    description: 'Covers ancient kingdoms and independence.',
    subject: 'History',
    educationLevel: 'G.C.E. O/L',
    resourceType: 'Model Paper',
    language: 'Tamil',
    createdAt: '2026-07-01T10:00:00.000Z',
  },
]

test('search is case-insensitive and trims whitespace', () => {
  const results = searchResources(sample, '  PHYSICS  ')
  assert.equal(results.length, 1)
  assert.equal(results[0].title, 'Physics Grade 12 Mechanics Paper')
})

test('search matches description text', () => {
  const results = searchResources(sample, 'mechanics')
  assert.equal(results.length, 1)
})

test('search matches subject', () => {
  const results = searchResources(sample, 'mathematics')
  assert.equal(results.length, 1)
})

test('empty search returns all resources', () => {
  assert.equal(searchResources(sample, '   ').length, 3)
})

test('filters can be combined', () => {
  const results = processResources(sample, {
    subject: 'Physics',
    level: 'G.C.E. A/L',
    language: 'English',
    type: 'all',
  })
  assert.equal(results.length, 1)
  assert.equal(results[0].subject, 'Physics')
})

test('individual filters work', () => {
  assert.equal(filterBySubject(sample, 'History').length, 1)
  assert.equal(filterByEducationLevel(sample, 'Grade 10').length, 1)
  assert.equal(filterByType(sample, 'Model Paper').length, 1)
  assert.equal(filterByLanguage(sample, 'Tamil').length, 1)
})

test('sorts by newest, oldest, A-Z and Z-A', () => {
  assert.equal(sortResources(sample, 'newest')[0].id, '1')
  assert.equal(sortResources(sample, 'oldest')[0].id, '3')
  assert.equal(sortResources(sample, 'title-asc')[0].title.startsWith('Grade'), true)
  assert.equal(sortResources(sample, 'title-desc')[0].title.startsWith('Physics'), true)
})

test('count labels are friendly', () => {
  assert.equal(getResourceCountLabel(0), 'No resources found')
  assert.equal(getResourceCountLabel(1), '1 resource found')
  assert.equal(getResourceCountLabel(24), '24 resources found')
  assert.equal(getResourceCount(sample), 3)
})

test('upload validation covers required fields and file rules', () => {
  const empty = validateResourceForm({
    title: '',
    description: '',
    subject: '',
    educationLevel: '',
    resourceType: '',
    language: '',
    file: null,
  })

  assert.equal(empty.isValid, false)
  assert.equal(empty.errors.title, 'Please enter a resource title.')
  assert.equal(empty.errors.subject, 'Please select a subject.')
  assert.equal(empty.errors.educationLevel, 'Please select an education level.')
  assert.equal(empty.errors.language, 'Please select a language.')
  assert.equal(empty.errors.file, 'Please upload a PDF or supported document.')

  const oversized = validateResourceForm({
    title: 'Physics paper',
    description: 'Past paper covering mechanics and motion for A/L students.',
    subject: 'Physics',
    educationLevel: 'G.C.E. A/L',
    resourceType: 'Past Paper',
    language: 'English',
    file: { name: 'paper.pdf', size: 21 * 1024 * 1024 },
  })

  assert.equal(oversized.errors.file, 'File size must be less than 20 MB.')

  const valid = validateResourceForm({
    title: 'Physics paper',
    description: 'Past paper covering mechanics and motion for A/L students.',
    subject: 'Physics',
    educationLevel: 'G.C.E. A/L',
    resourceType: 'Past Paper',
    language: 'English',
    file: { name: 'paper.pdf', size: 1024 },
  })

  assert.equal(valid.isValid, true)
})
