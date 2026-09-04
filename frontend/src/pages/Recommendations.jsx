import { useMemo, useState } from 'react';
import { requestRecommendations } from '../api/resourcesApi';
import LoadingState from '../components/LoadingState';
import RecommendationForm from '../components/RecommendationForm';
import RecommendationResults from '../components/RecommendationResults';
import { getSavedRecommendation, saveRecommendation } from '../utils/storage';
import { EMPTY_RECOMMENDATION_FORM, validateRecommendationForm } from '../utils/validation';

function Recommendations() {
  const stored = useMemo(() => getSavedRecommendation(), []);
  const [values, setValues] = useState(stored?.values || EMPTY_RECOMMENDATION_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(stored?.recommendation || null);
  const [saved, setSaved] = useState(Boolean(stored?.recommendation));

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = validateRecommendationForm(values);
    setErrors(result.errors);
    if (!result.isValid) {
      setRecommendation(null);
      return;
    }

    setLoading(true);
    setSaved(false);
    await new Promise((resolve) => window.setTimeout(resolve, 400));

    try {
      const data = await requestRecommendations(result.values);
      setRecommendation(data);
    } catch (error) {
      setErrors(error.errors || { studyGoal: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!recommendation) return;
    saveRecommendation({
      values,
      recommendation,
      savedAt: new Date().toISOString(),
    });
    setSaved(true);
  };

  return (
    <section className="page">
      <div className="container recommend-layout">
        <header className="page-header">
          <p className="eyebrow">Local recommendation engine</p>
          <h1>Tell us how you study. We’ll rank the catalogue.</h1>
          <p>
            Subject, education level and language are required. Your study goal needs at least 10
            characters, and weekly hours must be between 1 and 24. Matching uses +40 for subject,
            +30 for level, +20 for language and +10 for matching tags.
          </p>
        </header>

        <RecommendationForm
          values={values}
          errors={errors}
          onChange={(next) => {
            setValues(next);
            setSaved(false);
          }}
          onSubmit={handleSubmit}
          submitting={loading}
        />

        {loading ? <LoadingState label="Scoring resources against your goals…" /> : null}

        {!loading ? (
          <RecommendationResults
            recommendation={recommendation}
            onSave={handleSave}
            saved={saved}
          />
        ) : null}
      </div>
    </section>
  );
}

export default Recommendations;
