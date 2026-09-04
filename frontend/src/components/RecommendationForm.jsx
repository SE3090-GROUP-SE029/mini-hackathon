import { useState } from 'react';
import { validateRecommendationForm, validateField } from '../utils/validation.js';
import '../styles/recommendation.css';

export default function RecommendationForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    subject: '',
    level: '',
    language: '',
    goal: '',
    availableHours: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Real-time validation for touched fields
    if (touched[name]) {
      const fieldError = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: fieldError
      }));
    }
  };

  // Mark field as touched when user leaves it
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate field on blur
    const fieldError = validateField(name, formData[name]);
    setErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const validation = validateRecommendationForm(formData);
    setErrors(validation.errors);
    
    // Mark all fields as touched
    setTouched({
      subject: true,
      level: true,
      language: true,
      goal: true,
      availableHours: true
    });

    if (validation.isValid) {
      onSubmit(formData);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      subject: '',
      level: '',
      language: '',
      goal: '',
      availableHours: ''
    });
    setErrors({});
    setTouched({});
  };

  return (
    <div className="recommendation-form-container">
      <div className="form-header">
        <h2>Find Your Perfect Resource</h2>
        <p>Tell us about your learning needs and we'll recommend resources tailored for you.</p>
      </div>

      <form onSubmit={handleSubmit} className="recommendation-form">
        {/* Subject Selection */}
        <div className="form-group">
          <label htmlFor="subject">
            📚 What subject do you want to learn?
            <span className="required">*</span>
          </label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-input ${errors.subject ? 'error' : ''}`}
            disabled={isLoading}
          >
            <option value="">Choose a subject...</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="Language Arts">Language Arts</option>
            <option value="Social Studies">Social Studies</option>
            <option value="Technology">Technology</option>
          </select>
          {errors.subject && touched.subject && (
            <span className="error-message">{errors.subject}</span>
          )}
        </div>

        {/* Education Level Selection */}
        <div className="form-group">
          <label htmlFor="level">
            🎓 What's your education level?
            <span className="required">*</span>
          </label>
          <select
            id="level"
            name="level"
            value={formData.level}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-input ${errors.level ? 'error' : ''}`}
            disabled={isLoading}
          >
            <option value="">Choose your level...</option>
            <option value="O/L">O/L (Ordinary Level)</option>
            <option value="A/L">A/L (Advanced Level)</option>
            <option value="University">University</option>
          </select>
          {errors.level && touched.level && (
            <span className="error-message">{errors.level}</span>
          )}
        </div>

        {/* Language Selection */}
        <div className="form-group">
          <label htmlFor="language">
            🌐 Preferred language?
            <span className="required">*</span>
          </label>
          <select
            id="language"
            name="language"
            value={formData.language}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-input ${errors.language ? 'error' : ''}`}
            disabled={isLoading}
          >
            <option value="">Choose a language...</option>
            <option value="English">English</option>
            <option value="Sinhala">Sinhala (සිංහල)</option>
            <option value="Tamil">Tamil (தமிழ்)</option>
          </select>
          {errors.language && touched.language && (
            <span className="error-message">{errors.language}</span>
          )}
        </div>

        {/* Learning Goal */}
        <div className="form-group">
          <label htmlFor="goal">
            🎯 What do you want to learn? (Describe in detail)
            <span className="required">*</span>
          </label>
          <textarea
            id="goal"
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Example: I want to understand calculus and solve differential equations for my A/L exam..."
            className={`form-input textarea ${errors.goal ? 'error' : ''}`}
            rows="4"
            disabled={isLoading}
          />
          <div className="character-count">
            {formData.goal.length} characters (minimum 10)
          </div>
          {errors.goal && touched.goal && (
            <span className="error-message">{errors.goal}</span>
          )}
        </div>

        {/* Available Study Hours */}
        <div className="form-group">
          <label htmlFor="availableHours">
            ⏱️ How many hours per week can you study?
            <span className="required">*</span>
          </label>
          <div className="hours-input-wrapper">
            <input
              id="availableHours"
              name="availableHours"
              type="number"
              min="1"
              max="24"
              value={formData.availableHours}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter 1-24 hours"
              className={`form-input ${errors.availableHours ? 'error' : ''}`}
              disabled={isLoading}
            />
            <span className="input-suffix">hours/week</span>
          </div>
          {errors.availableHours && touched.availableHours && (
            <span className="error-message">{errors.availableHours}</span>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Finding resources...' : '🔍 Get Recommendations'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
            disabled={isLoading}
          >
            Clear Form
          </button>
        </div>
      </form>

      {/* Info Box */}
      <div className="info-box">
        <p>
          💡 <strong>Tip:</strong> Your study goal helps us match the most relevant resources. 
          The more details you provide, the better our recommendations!
        </p>
      </div>
    </div>
  );
}
