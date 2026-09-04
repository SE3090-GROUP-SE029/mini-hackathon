// Form validation utility with friendly error messages
export const validateRecommendationForm = (formData) => {
  const errors = {};

  // Subject validation
  if (!formData.subject || formData.subject.trim() === "") {
    errors.subject = "Please select a subject area";
  }

  // Level validation
  if (!formData.level || formData.level.trim() === "") {
    errors.level = "Please select your education level";
  }

  // Language validation
  if (!formData.language || formData.language.trim() === "") {
    errors.language = "Please choose your preferred language";
  }

  // Goal validation
  if (!formData.goal || formData.goal.trim() === "") {
    errors.goal = "Tell us what you want to learn";
  } else if (formData.goal.trim().length < 10) {
    errors.goal = "Please describe your learning goal in at least 10 characters";
  }

  // Available hours validation
  if (!formData.availableHours || formData.availableHours === "") {
    errors.availableHours = "How many hours per week can you study?";
  } else {
    const hours = parseInt(formData.availableHours);
    if (isNaN(hours) || hours < 1 || hours > 24) {
      errors.availableHours = "Study time should be between 1 and 24 hours per week";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validate individual fields as user types (for real-time feedback)
export const validateField = (fieldName, value) => {
  const errors = {};

  switch (fieldName) {
    case "subject":
      if (!value || value.trim() === "") {
        errors.subject = "Please select a subject area";
      }
      break;

    case "level":
      if (!value || value.trim() === "") {
        errors.level = "Please select your education level";
      }
      break;

    case "language":
      if (!value || value.trim() === "") {
        errors.language = "Please choose your preferred language";
      }
      break;

    case "goal":
      if (!value || value.trim() === "") {
        errors.goal = "Tell us what you want to learn";
      } else if (value.trim().length < 10) {
        errors.goal = "Please describe your learning goal in at least 10 characters";
      }
      break;

    case "availableHours":
      if (!value || value === "") {
        errors.availableHours = "How many hours per week can you study?";
      } else {
        const hours = parseInt(value);
        if (isNaN(hours) || hours < 1 || hours > 24) {
          errors.availableHours = "Study time should be between 1 and 24 hours per week";
        }
      }
      break;

    default:
      break;
  }

  return errors[fieldName] || null;
};
