import { useState } from 'react';
import RecommendationForm from '../components/RecommendationForm.jsx';
import RecommendationResults from '../components/RecommendationResults.jsx';
import { getRecommendations } from '../utils/recommendationEngine.js';
import '../styles/recommendation.css';

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [preferences, setPreferences] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleFormSubmit = (formData) => {
    setIsLoading(true);
    setPreferences(formData);
    
    // Simulate processing delay for better UX
    setTimeout(() => {
      const results = getRecommendations(formData);
      setRecommendations(results);
      setIsLoading(false);
      setHasSearched(true);
      
      // Scroll to results
      setTimeout(() => {
        const resultsSection = document.querySelector('.results-section');
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }, 800); // 800ms delay to show the loading state
  };

  return (
    <div className="recommendations-page">
      <div className="page-header">
        <h1>Personalized Recommendations</h1>
        <p className="page-subtitle">
          Discover educational resources perfectly matched to your learning style and goals
        </p>
      </div>

      <div className="recommendations-content">
        <div className="form-section">
          <RecommendationForm 
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
          />
        </div>

        {hasSearched && (
          <div className="results-section">
            <RecommendationResults 
              recommendations={recommendations}
              preferences={preferences}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>

      <div className="how-it-works">
        <h3>How Our Recommendation System Works</h3>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>Tell Us About Yourself</h4>
              <p>Select your education level, preferred language, and subject of interest</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>Describe Your Goal</h4>
              <p>Share what you want to learn and how much time you can dedicate</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>Get Smart Matches</h4>
              <p>Our system analyzes your preferences and suggests the best resources</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h4>Start Learning</h4>
              <p>Access resources and save your favorites for continuous learning</p>
            </div>
          </div>
        </div>
      </div>

      <div className="faq-section">
        <h3>Frequently Asked Questions</h3>
        <div className="faq-items">
          <div className="faq-item">
            <h4>🤔 How does the recommendation algorithm work?</h4>
            <p>
              Our system matches your preferences against our resource database by analyzing 
              subject alignment, education level compatibility, language preference, and your 
              specific learning goals. Each resource gets a relevance score to ensure the best matches appear first.
            </p>
          </div>
          <div className="faq-item">
            <h4>📱 Is this free?</h4>
            <p>
              Yes! EduLanka Hub's recommendation system is completely free. We believe every 
              Sri Lankan student should have access to quality educational resources regardless of budget.
            </p>
          </div>
          <div className="faq-item">
            <h4>🔒 Is my information stored?</h4>
            <p>
              Your preferences are only used to generate recommendations and are not stored 
              on our servers. All data stays in your browser unless you save resources, which 
              are stored locally on your device.
            </p>
          </div>
          <div className="faq-item">
            <h4>❓ What if I can't find what I'm looking for?</h4>
            <p>
              Try adjusting your subject, education level, or describing your goal differently. 
              You can also browse our full resource catalog to explore all available options.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
