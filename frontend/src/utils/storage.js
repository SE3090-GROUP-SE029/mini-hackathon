export const SAVED_RESOURCES_KEY = 'edulanka_saved_resources';

const listeners = new Set();

function isValidResource(item) {
  return (
    item !== null &&
    typeof item === 'object' &&
    !Array.isArray(item) &&
    (typeof item.id === 'string' || typeof item.id === 'number') &&
    String(item.id).length > 0
  );
}

function readRaw() {
  try {
    return window.localStorage.getItem(SAVED_RESOURCES_KEY);
  } catch {
    return null;
  }
}

function writeRaw(json) {
  try {
    window.localStorage.setItem(SAVED_RESOURCES_KEY, json);
    return true;
  } catch {
    return false;
  }
}

function parseSavedResources(raw) {
  if (raw == null || raw === '') {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(isValidResource);
  } catch {
    return [];
  }
}

function notify(resources) {
  listeners.forEach((listener) => {
    listener(resources);
  });
}

export function getSavedResources() {
  return parseSavedResources(readRaw());
}

export function saveResource(resource) {
  if (!isValidResource(resource)) {
    return getSavedResources();
  }

  const current = getSavedResources();
  const alreadySaved = current.some(
    (item) => String(item.id) === String(resource.id),
  );

  if (alreadySaved) {
    return current;
  }

  const next = [...current, resource];
  writeRaw(JSON.stringify(next));
  notify(next);
  return next;
}

export function removeResource(resourceId) {
  const current = getSavedResources();
  const next = current.filter((item) => String(item.id) !== String(resourceId));

  if (next.length === current.length) {
    return current;
  }

  writeRaw(JSON.stringify(next));
  notify(next);
  return next;
}

export function isSaved(resourceId) {
  return getSavedResources().some(
    (item) => String(item.id) === String(resourceId),
  );
}

export function subscribeSavedResources(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
