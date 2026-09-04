import { Link } from 'react-router-dom';

function EmptyResourceState({
  title = 'No resources found',
  message = 'Try another search term or clear the filters to see the full catalogue.',
  actionLabel = 'Browse all resources',
  actionTo = '/resources',
}) {
  return (
    <div className="empty-state" role="status">
      <h2>{title}</h2>
      <p>{message}</p>
      {actionTo ? (
        <Link className="btn btn-primary" to={actionTo}>
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

export default EmptyResourceState;
