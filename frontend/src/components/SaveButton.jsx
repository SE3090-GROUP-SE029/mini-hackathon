import { useSavedResources } from '../hooks/useSavedResources';

export function SaveButton({ resource }) {
  const { isSaved, saveResource, removeResource } = useSavedResources();

  const resourceId = resource?.id;
  const hasValidId =
    (typeof resourceId === 'string' || typeof resourceId === 'number') &&
    String(resourceId).length > 0;
  const saved = hasValidId && isSaved(resourceId);
  const title = resource?.title ? String(resource.title) : 'this resource';

  function handleClick(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!hasValidId) {
      return;
    }

    if (saved) {
      removeResource(resourceId);
      return;
    }

    saveResource(resource);
  }

  const visibleLabel = saved ? '✓ Saved' : '♡ Save';
  const ariaLabel = saved
    ? `Remove ${title} from saved resources`
    : `Save ${title}`;

  return (
    <button
      type="button"
      className="counter"
      onClick={handleClick}
      disabled={!hasValidId}
      aria-pressed={saved}
      aria-label={ariaLabel}
    >
      {visibleLabel}
    </button>
  );
}

export default SaveButton;
