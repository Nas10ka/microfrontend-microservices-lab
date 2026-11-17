import React, { Suspense } from 'react';
import RemoteErrorBoundary from './RemoteErrorBoundary';

const RemoteApp = React.lazy(() => import('virtualizationApp/App'));
const BookingHubApp = React.lazy(() => import('bookingHubApp/App'));

function App() {
  const isBookings = window.location.pathname.replace(/\/$/, '') === '/bookings';

  return (
    <div style={{ padding: '20px' }}>
      <h1>Головний Shell-додаток</h1>
      <nav aria-label="Applications" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <a href="/" aria-current={!isBookings ? 'page' : undefined}>Virtualization</a>
        <a href="/bookings" aria-current={isBookings ? 'page' : undefined}>BookingHub</a>
      </nav>
      <hr />

      <RemoteErrorBoundary>
        {/* Огортаємо в Suspense, бо мікрофронтенд підвантажується асинхронно */}
        <Suspense fallback={<div role="status">{isBookings ? 'Loading BookingHub…' : 'Завантаження віртуалізованого списку...'}</div>}>
          {isBookings ? <BookingHubApp /> : <RemoteApp />}
        </Suspense>
      </RemoteErrorBoundary>
    </div>
  );
}

export default App;
