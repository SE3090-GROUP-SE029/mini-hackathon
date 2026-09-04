import ResourceCard from './ResourceCard';

function ResourceList({
  resources,
  showScore = false,
  saveVariant = 'default',
  showManageActions = false,
  onDelete,
}) {
  return (
    <div className="resource-grid">
      {resources.map((resource) => (
        <ResourceCard
          key={resource.id}
          resource={resource}
          showScore={showScore}
          saveVariant={saveVariant}
          showManageActions={showManageActions}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default ResourceList;
