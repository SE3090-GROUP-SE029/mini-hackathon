// Local recommendation engine - matches resources based on form preferences
import { resources } from '../data/resources.js';

/**
 * Calculate match score for a resource based on user preferences
 * Higher score = better match
 */
const calculateMatchScore = (resource, preferences) => {
  let score = 0;
  const maxScore = 100;

  // Subject match (40 points - highest priority)
  if (resource.subject.toLowerCase() === preferences.subject.toLowerCase()) {
    score += 40;
  } else if (
    resource.tags.some(tag => 
      tag.toLowerCase() === preferences.subject.toLowerCase()
    )
  ) {
    score += 20;
  }

  // Level match (30 points - high priority)
  if (resource.level === preferences.level) {
    score += 30;
  } else if (resource.level === "O/L" && preferences.level === "A/L") {
    // A/L students can benefit from O/L resources as foundation
    score += 15;
  } else if (resource.level === "A/L" && preferences.level === "University") {
    // University students can benefit from A/L resources
    score += 15;
  }

  // Language match (20 points)
  if (resource.language === preferences.language) {
    score += 20;
  }

  // Study goal match (10 points - softer matching on tags/description)
  const goalLower = preferences.goal.toLowerCase();
  if (
    resource.title.toLowerCase().includes(goalLower) ||
    resource.description.toLowerCase().includes(goalLower) ||
    resource.tags.some(tag => goalLower.includes(tag.toLowerCase()))
  ) {
    score += 10;
  }

  // Hours availability bonus (helps filter by resource type)
  // Interactive courses are better for limited time
  if (preferences.availableHours < 5) {
    if (resource.type === "Interactive Course" || resource.type === "Video Course") {
      score += 5;
    }
  } else if (preferences.availableHours > 10) {
    // Textbooks are good for dedicated study time
    if (resource.type === "Textbook" || resource.type === "Practice Problems") {
      score += 5;
    }
  }

  return Math.min(score, maxScore);
};

/**
 * Get recommendations based on user preferences
 * Returns array of resources sorted by relevance
 */
export const getRecommendations = (preferences) => {
  if (!preferences || Object.keys(preferences).length === 0) {
    return [];
  }

  // Calculate scores for all resources
  const scoredResources = resources.map(resource => ({
    ...resource,
    matchScore: calculateMatchScore(resource, preferences),
    matchReason: generateMatchReason(resource, preferences)
  }));

  // Filter out low matches (below 20% relevance) and sort by score
  return scoredResources
    .filter(item => item.matchScore >= 20)
    .sort((a, b) => b.matchScore - a.matchScore);
};

/**
 * Generate a human-readable explanation for why a resource was recommended
 */
const generateMatchReason = (resource, preferences) => {
  const reasons = [];

  // Check subject match
  if (resource.subject.toLowerCase() === preferences.subject.toLowerCase()) {
    reasons.push(`matches your subject area (${preferences.subject})`);
  }

  // Check level match
  if (resource.level === preferences.level) {
    reasons.push(`designed for your level (${preferences.level})`);
  }

  // Check language match
  if (resource.language === preferences.language) {
    reasons.push(`available in your language`);
  }

  // Check type suitability
  if (preferences.availableHours < 5) {
    if (resource.type === "Interactive Course" || resource.type === "Video Course") {
      reasons.push(`good for your available study time`);
    }
  }

  return reasons.length > 0 
    ? reasons.join(", ")
    : "relevant to your learning needs";
};

/**
 * Get alternative suggestions when no strong matches found
 */
export const getAlternativeSuggestions = (preferences) => {
  const mainRecommendations = getRecommendations(preferences);
  
  if (mainRecommendations.length > 0) {
    return mainRecommendations;
  }

  // If no strong matches, suggest by level
  const byLevel = resources
    .filter(r => r.level === preferences.level)
    .sort(() => 0.5 - Math.random()) // Random sample
    .slice(0, 3);

  if (byLevel.length > 0) {
    return byLevel;
  }

  // If still nothing, suggest by subject
  const bySubject = resources
    .filter(r => r.subject === preferences.subject)
    .slice(0, 3);

  return bySubject;
};

/**
 * Get resource statistics for display
 */
export const getResourceStats = () => {
  const stats = {
    total: resources.length,
    byLevel: {},
    byLanguage: {},
    bySubject: {}
  };

  resources.forEach(resource => {
    stats.byLevel[resource.level] = (stats.byLevel[resource.level] || 0) + 1;
    stats.byLanguage[resource.language] = (stats.byLanguage[resource.language] || 0) + 1;
    stats.bySubject[resource.subject] = (stats.bySubject[resource.subject] || 0) + 1;
  });

  return stats;
};
