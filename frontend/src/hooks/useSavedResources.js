import { useCallback, useEffect, useState } from 'react';
import {
  SAVED_RESOURCES_KEY,
  getSavedResources as readSavedResources,
  removeResource as storageRemoveResource,
  saveResource as storageSaveResource,
  subscribeSavedResources,
} from '../utils/storage';

export function useSavedResources() {
  const [savedResources, setSavedResources] = useState(readSavedResources);

  useEffect(() => {
    const unsubscribe = subscribeSavedResources(setSavedResources);
    return unsubscribe;
  }, []);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === SAVED_RESOURCES_KEY || event.key === null) {
        setSavedResources(readSavedResources());
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const saveResource = useCallback((resource) => {
    const next = storageSaveResource(resource);
    setSavedResources(next);
    return next;
  }, []);

  const removeResource = useCallback((resourceId) => {
    const next = storageRemoveResource(resourceId);
    setSavedResources(next);
    return next;
  }, []);

  const isSaved = useCallback(
    (resourceId) =>
      savedResources.some((item) => String(item.id) === String(resourceId)),
    [savedResources],
  );

  const getSavedResources = useCallback(() => savedResources, [savedResources]);

  return {
    savedResources,
    savedCount: savedResources.length,
    saveResource,
    removeResource,
    isSaved,
    getSavedResources,
  };
}

export default useSavedResources;
