import React, { Suspense, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n'; // Import the i18n configuration
import './sentry'; // Import Sentry initialization
import * as Sentry from "@sentry/react";

// Optional: Add a loading fallback for Suspense
const LoadingFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    Loading...
  </div>
);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Suspense fallback={<LoadingFallback />}>
      <App />
    </Suspense>
  </React.StrictMode>
);

useEffect(() => {
  Sentry.captureException(new Error("Тестовая ошибка из Vedaverse"));
}, []);
