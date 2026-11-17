import React, { Suspense } from 'react';

const RemoteApp = React.lazy(() => import('virtualizationApp/App'));

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Головний Shell-додаток</h1>
      <hr />
      
      {/* Огортаємо в Suspense, бо мікрофронтенд підвантажується асинхронно */}
      <Suspense fallback={<div>Завантаження віртуалізованого списку...</div>}>
        <RemoteApp />
      </Suspense>
    </div>
  );
}

export default App;