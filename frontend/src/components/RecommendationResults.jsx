import '../styles/recommendation.css';

export default function RecommendationResults({ 
  recommendations, 
  preferences,
  isLoading 
}) {
  if (isLoading) {
    return (
      <div className="results-container loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Finding perfect resources for you...</p>
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="results-container empty-state">
        <div className="empty-illustration">📚</div>
        <h3>No Perfect Matches Found</h3>
        <p>
          We couldn't find resources that match exactly, 
          but here are some alternatives that might help you get started.
        </p>
        <p className="empty-tip">
          💡 Try adjusting your subject, level, or language preferences.
        </p>
      </div>
    );
  }

  return (
    <div className="results-container">
      <div className="results-header">
        <h2>✨ Recommended Resources</h2>
        <p className="results-subtitle">
          Based on your preferences: <strong>{preferences.subject}</strong> • 
          <strong> {preferences.level}</strong> • 
          <strong> {preferences.language}</strong>
        </p>
        <div className="results-count">
          Found <span className="count-badge">{recommendations.length}</span> 
          {recommendations.length === 1 ? ' resource' : ' resources'} for you
        </div>
      </div>

      <div className="recommendations-list">
        {recommendations.map((resource, index) => (
          <div key={resource.id} className="recommendation-card">
            <div className="card-header">
              <div className="card-rank">#{index + 1}</div>
              <div className="card-title-section">
                <h3 className="resource-title">{resource.title}</h3>
                <div className="match-score">
                  <div className="score-bar">
                    <div 
                      className="score-fill" 
                      style={{ width: `${resource.matchScore}%` }}
                    ></div>
                  </div>
                  <span className="score-text">{resource.matchScore}% match</span>
                </div>
              </div>
            </div>

            <p className="resource-description">{resource.description}</p>

            <div className="resource-details">
              <div className="detail-item">
                <span className="detail-label">📖 Subject:</span>
                <span className="detail-value">{resource.subject}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">🎓 Level:</span>
                <span className="detail-value">{resource.level}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">🌐 Language:</span>
                <span className="detail-value">{resource.language}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">📚 Type:</span>
                <span className="detail-value">{resource.type}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">🏢 Provider:</span>
                <span className="detail-value">{resource.provider}</span>
              </div>
            </div>

            {resource.matchReason && (
              <div className="match-reason">
                <span className="reason-icon">✓</span>
                <span className="reason-text">
                  This resource {resource.matchReason}
                </span>
              </div>
            )}

            <div className="resource-tags">
              {resource.tags.map((tag, idx) => (
                <span key={idx} className="tag">{tag}</span>
              ))}
            </div>

            <div className="resource-actions">
              <a 
                href={resource.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                📖 View Resource
              </a>
              <button className="btn btn-secondary save-btn">
                💾 Save for Later
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="results-footer">
        <p>
          💡 <strong>Pro tip:</strong> Save resources to access them anytime from your 
          Saved Resources page. Consider trying multiple resources to find your best fit!
        </p>
      </div>
    </div>
  );
}
