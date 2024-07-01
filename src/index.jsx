import React from 'react';
import { createRoot } from 'react-dom/client';
import './style.scss';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './components/app';

const queryClient = new QueryClient();

const root = createRoot(document.getElementById('main'));

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
