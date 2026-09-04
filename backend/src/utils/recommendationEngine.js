function tokenize(text = '') {
  return String(text)
    .toLowerCase()
    .split(/[^a-zA-Z0-9\u0D80-\u0DFF\u0B80-\u0BFF]+/)
    .filter((token) => token.length > 2);
}

function scoreResource(resource, preferences) {
  let score = 0;
  const reasons = [];

  if (resource.subject === preferences.subject) {
    score += 40;
    reasons.push('Matches your subject');
  }

  if (resource.educationLevel === preferences.educationLevel) {
    score += 30;
    reasons.push('Matches your education level');
  }

  if (resource.language === preferences.language) {
    score += 20;
    reasons.push('Matches your preferred language');
  }

  const goalTokens = tokenize(preferences.studyGoal);
  const tags = Array.isArray(resource.tags) ? resource.tags : [];
  const matchingTags = tags.filter((tag) => {
    const normalised = String(tag).toLowerCase();
    return goalTokens.some(
      (token) => normalised.includes(token) || token.includes(normalised)
    );
  });

  if (matchingTags.length > 0) {
    score += 10;
    reasons.push(`Related tags: ${matchingTags.join(', ')}`);
  }

  return {
    ...resource,
    matchScore: score,
    matchReasons: reasons,
  };
}

function buildStudyPlan(availableHours, topType) {
  const hours = Number(availableHours) || 0;
  const weeklySessions = Math.max(1, Math.round(hours / 2));
  const estimatedWeeks = hours <= 4 ? 8 : hours <= 10 ? 5 : 3;

  let focus;
  if (hours <= 4) {
    focus = 'Use short notes and one past-paper section each week.';
  } else if (hours <= 10) {
    focus = 'Mix notes with timed past papers twice a week.';
  } else {
    focus = 'Run a full cycle: notes, tutorials, then timed papers.';
  }

  return {
    availableHours: hours,
    weeklySessions,
    estimatedWeeks,
    suggestedFormat: topType || 'Notes',
    focus,
  };
}

function recommendResources(resources, preferences) {
  const scored = resources.map((resource) => scoreResource(resource, preferences));
  const subjectMatches = scored.filter((resource) => resource.subject === preferences.subject);
  const pool = subjectMatches.length
    ? subjectMatches
    : scored.filter((resource) => resource.matchScore > 0);

  const ranked = [...pool].sort(
    (a, b) => b.matchScore - a.matchScore || a.title.localeCompare(b.title)
  );

  const studyPlan = buildStudyPlan(
    preferences.availableHours,
    ranked[0]?.type
  );

  const explanation = ranked.length
    ? `We ranked ${ranked.length} resource${ranked.length === 1 ? '' : 's'} for ${preferences.subject} at ${preferences.educationLevel} level in ${preferences.language}. Subject, level, language and study-goal tags were scored locally — no AI required.`
    : 'No close matches were found. Try a different subject, level or language.';

  return {
    explanation,
    studyPlan,
    results: ranked,
    resultCount: ranked.length,
  };
}

module.exports = {
  tokenize,
  scoreResource,
  buildStudyPlan,
  recommendResources,
};
