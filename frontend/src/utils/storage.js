const SAVED_KEY = 'edulanka.savedResources';
const RECOMMENDATION_KEY = 'edulanka.savedRecommendation';

let savedCache = null;
let recommendationCache = undefined;

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function readJson(key, fallback) {
  if (!canUseStorage()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getSavedResources() {
  if (!savedCache) {
    const stored = readJson(SAVED_KEY, []);
    savedCache = Array.isArray(stored) ? stored : [];
  }
  return savedCache;
}

export function saveResource(resource) {
  if (!resource?.id) return getSavedResources();
  const current = getSavedResources();
  if (current.some((item) => item.id === resource.id)) return current;
  savedCache = [resource, ...current];
  writeJson(SAVED_KEY, savedCache);
  return savedCache;
}

export function removeResource(resourceId) {
  savedCache = getSavedResources().filter((item) => item.id !== resourceId);
  writeJson(SAVED_KEY, savedCache);
  return savedCache;
}

export function isSaved(resourceId) {
  return getSavedResources().some((item) => item.id === resourceId);
}

export function getSavedRecommendation() {
  if (recommendationCache === undefined) {
    recommendationCache = readJson(RECOMMENDATION_KEY, null);
  }
  return recommendationCache;
}

export function saveRecommendation(payload) {
  recommendationCache = payload;
  writeJson(RECOMMENDATION_KEY, payload);
  return payload;
}

export function clearSavedRecommendation() {
  recommendationCache = null;
  if (!canUseStorage()) return;
  window.localStorage.removeItem(RECOMMENDATION_KEY);
}
