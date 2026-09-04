import { useCallback, useMemo, useSyncExternalStore } from 'react';
import {
  getSavedResources,
  isSaved as isResourceSaved,
  removeResource as removeStoredResource,
  saveResource as persistResource,
} from '../utils/storage';

const listeners = new Set();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return getSavedResources();
}

export function useSavedResources() {
  const savedResources = useSyncExternalStore(subscribe, getSnapshot, () => []);

  const saveResource = useCallback((resource) => {
    persistResource(resource);
    emitChange();
  }, []);

  const removeResource = useCallback((resourceId) => {
    removeStoredResource(resourceId);
    emitChange();
  }, []);

  const toggleResource = useCallback((resource) => {
    if (isResourceSaved(resource.id)) {
      removeStoredResource(resource.id);
    } else {
      persistResource(resource);
    }
    emitChange();
  }, []);

  const isSaved = useCallback(
    (resourceId) => savedResources.some((item) => item.id === resourceId),
    [savedResources]
  );

  const savedCount = savedResources.length;

  const value = useMemo(
    () => ({
      savedResources,
      savedCount,
      saveResource,
      removeResource,
      toggleResource,
      isSaved,
    }),
    [savedResources, savedCount, saveResource, removeResource, toggleResource, isSaved]
  );

  return value;
}
