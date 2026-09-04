import { EDUCATION_LEVELS, LANGUAGES, SUBJECTS } from '../data/resourceConstants';

function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p className="field-error" id={id} role="alert">
      {message}
    </p>
  );
}

function RecommendationForm({ values, errors, onChange, onSubmit, submitting }) {
  const update = (event) => {
    const { name, value } = event.target;
    onChange({ ...values, [name]: value });
  };

  return (
    <form className="recommend-form" onSubmit={onSubmit} noValidate>
      <div className="form-grid">
        <label className="field" htmlFor="subject">
          <span>Subject</span>
          <select
            id="subject"
            name="subject"
            value={values.subject}
            onChange={update}
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? 'subject-error' : undefined}
            required
          >
            <option value="">Select a subject</option>
            {SUBJECTS.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          <FieldError id="subject-error" message={errors.subject} />
        </label>

        <label className="field" htmlFor="educationLevel">
          <span>Education level</span>
          <select
            id="educationLevel"
            name="educationLevel"
            value={values.educationLevel}
            onChange={update}
            aria-invalid={Boolean(errors.educationLevel)}
            aria-describedby={errors.educationLevel ? 'level-error' : undefined}
            required
          >
            <option value="">Select a level</option>
            {EDUCATION_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          <FieldError id="level-error" message={errors.educationLevel} />
        </label>

        <label className="field" htmlFor="language">
          <span>Language</span>
          <select
            id="language"
            name="language"
            value={values.language}
            onChange={update}
            aria-invalid={Boolean(errors.language)}
            aria-describedby={errors.language ? 'language-error' : undefined}
            required
          >
            <option value="">Select a language</option>
            {LANGUAGES.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
          <FieldError id="language-error" message={errors.language} />
        </label>

        <label className="field" htmlFor="availableHours">
          <span>Available hours each week</span>
          <input
            id="availableHours"
            name="availableHours"
            type="number"
            min="1"
            max="24"
            step="1"
            value={values.availableHours}
            onChange={update}
            aria-invalid={Boolean(errors.availableHours)}
            aria-describedby={errors.availableHours ? 'hours-error' : undefined}
            required
          />
          <FieldError id="hours-error" message={errors.availableHours} />
        </label>
      </div>

      <label className="field" htmlFor="studyGoal">
        <span>Study goal</span>
        <textarea
          id="studyGoal"
          name="studyGoal"
          rows="4"
          value={values.studyGoal}
          onChange={update}
          placeholder="Example: I want exam-prep past papers and revision notes for algebra."
          aria-invalid={Boolean(errors.studyGoal)}
          aria-describedby={errors.studyGoal ? 'goal-error' : 'goal-help'}
          required
        />
        <small id="goal-help">Write at least 10 characters. Mention topics such as algebra, biology or exam-prep.</small>
        <FieldError id="goal-error" message={errors.studyGoal} />
      </label>

      <button className="btn btn-primary" type="submit" disabled={submitting}>
        {submitting ? 'Finding matches…' : 'Get recommendations'}
      </button>
    </form>
  );
}

export default RecommendationForm;
