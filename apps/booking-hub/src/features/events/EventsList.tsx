import { useGetEventsQuery } from '../../services/bookingApi';

export function EventsList() {
  const { data: events = [], isLoading, isFetching, isError, refetch } = useGetEventsQuery();

  if (isLoading) return <p role="status">Loading demo events…</p>;

  if (isError) {
    return (
      <div role="alert">
        <p>Unable to load events. Check that booking-service is running.</p>
        <button type="button" onClick={() => void refetch()} disabled={isFetching}>
          {isFetching ? 'Retrying…' : 'Retry'}
        </button>
      </div>
    );
  }

  return (
    <section aria-labelledby="booking-events-heading">
      <h2 id="booking-events-heading">Demo events</h2>
      {events.length === 0 && <p>No demo events available.</p>}
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <h3>{event.title}</h3>
            <p>{event.venue}</p>
            <time dateTime={event.startsAt}>
              {new Date(event.startsAt).toLocaleString()}
            </time>
          </li>
        ))}
      </ul>
    </section>
  );
}
