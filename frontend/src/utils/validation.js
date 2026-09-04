import { EDUCATION_LEVELS, LANGUAGES, SUBJECTS } from '../data/resourceConstants';

export const EMPTY_RECOMMENDATION_FORM = {
  subject: '',
  educationLevel: '',
  language: '',
  studyGoal: '',
  availableHours: '',
};

export function validateRecommendationForm(values) {
  const errors = {};
  const subject = values.subject?.trim();
  const educationLevel = values.educationLevel?.trim();
  const language = values.language?.trim();
  const studyGoal = values.studyGoal?.trim();
  const hours = Number(values.availableHours);

  if (!subject) {
    errors.subject = 'Please choose a subject.';
  } else if (!SUBJECTS.includes(subject)) {
    errors.subject = 'Choose a subject from the list.';
  }

  if (!educationLevel) {
    errors.educationLevel = 'Please choose an education level.';
  } else if (!EDUCATION_LEVELS.includes(educationLevel)) {
    errors.educationLevel = 'Choose O/L, A/L or University.';
  }

  if (!language) {
    errors.language = 'Please choose a language.';
  } else if (!LANGUAGES.includes(language)) {
    errors.language = 'Choose English, Sinhala or Tamil.';
  }

  if (!studyGoal) {
    errors.studyGoal = 'Tell us what you want to achieve.';
  } else if (studyGoal.length < 10) {
    errors.studyGoal = 'Please write at least 10 characters so we can match better resources.';
  }

  if (values.availableHours === '' || values.availableHours === null || values.availableHours === undefined) {
    errors.availableHours = 'Enter how many hours you can study each week.';
  } else if (!Number.isFinite(hours) || hours < 1 || hours > 24) {
    errors.availableHours = 'Study hours must be between 1 and 24 per week.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    values: {
      subject,
      educationLevel,
      language,
      studyGoal,
      availableHours: hours,
    },
  };
}
