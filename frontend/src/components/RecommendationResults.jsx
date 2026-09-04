import EmptyResourceState from './EmptyResourceState';
import ResourceList from './ResourceList';

function RecommendationResults({ recommendation, onSave, saved }) {
  if (!recommendation) return null;

  const { explanation, studyPlan, results, resultCount } = recommendation;

  return (
    <section className="results-panel" aria-live="polite">
      <div className="results-header">
        <div>
          <p className="eyebrow">Ranked for you</p>
          <h2>{resultCount} recommended resource{resultCount === 1 ? '' : 's'}</h2>
          <p>{explanation}</p>
        </div>
        <button type="button" className="btn btn-secondary" onClick={onSave}>
          {saved ? 'Recommendation saved' : 'Save this recommendation'}
        </button>
      </div>

      {studyPlan ? (
        <dl className="plan-grid">
          <div>
            <dt>Hours / week</dt>
            <dd>{studyPlan.availableHours}</dd>
          </div>
          <div>
            <dt>Suggested sessions</dt>
            <dd>{studyPlan.weeklySessions}</dd>
          </div>
          <div>
            <dt>Estimated weeks</dt>
            <dd>{studyPlan.estimatedWeeks}</dd>
          </div>
          <div>
            <dt>Start with</dt>
            <dd>{studyPlan.suggestedFormat}</dd>
          </div>
        </dl>
      ) : null}

      {studyPlan?.focus ? <p className="plan-focus">{studyPlan.focus}</p> : null}

      {results.length === 0 ? (
        <EmptyResourceState
          title="No matching resources yet"
          message="Try another subject, education level or language. You can still browse the full catalogue."
        />
      ) : (
        <ResourceList resources={results} showScore />
      )}
    </section>
  );
}

export default RecommendationResults;
