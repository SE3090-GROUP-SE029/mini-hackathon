const {
  SUBJECTS,
  EDUCATION_LEVELS,
  LANGUAGES,
} = require('../constants/resourceEnums');
const { asTrimmedString, parseHours } = require('../utils/sanitize');

function validateRecommendation(req, res, next) {
  const subject = asTrimmedString(req.body.subject);
  const educationLevel = asTrimmedString(req.body.educationLevel);
  const language = asTrimmedString(req.body.language);
  const studyGoal = asTrimmedString(req.body.studyGoal);
  const hours = parseHours(req.body.availableHours);
  const errors = {};

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

  if (!Number.isFinite(hours)) {
    errors.availableHours = 'Enter how many hours you can study each week.';
  } else if (hours < 1 || hours > 24) {
    errors.availableHours = 'Study hours must be between 1 and 24 per week.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Please fix the highlighted fields to get recommendations.',
      errors,
    });
  }

  req.recommendationInput = {
    subject,
    educationLevel,
    language,
    studyGoal,
    availableHours: hours,
  };

  return next();
}

module.exports = validateRecommendation;
