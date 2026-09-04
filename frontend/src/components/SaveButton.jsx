import { useSavedResources } from '../hooks/useSavedResources';

function SaveButton({ resource, variant = 'default' }) {
  const { isSaved, toggleResource } = useSavedResources();
  const saved = isSaved(resource.id);

  return (
    <button
      type="button"
      className={saved ? 'btn btn-saved' : 'btn btn-primary'}
      onClick={() => toggleResource(resource)}
      aria-pressed={saved}
    >
      {saved ? (variant === 'remove' ? 'Remove from saved' : 'Saved') : 'Save resource'}
    </button>
  );
}

export default SaveButton;
