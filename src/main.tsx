import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ClerkProvider } from '@clerk/clerk-react';

const clerkPubKey = 'pk_test_ZW5hYmxlZC1jYWltYW4tNjMuY2xlcmsuYWNjb3VudHMuZGV2JA'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <ClerkProvider publishableKey={clerkPubKey}>
     <App />
     </ClerkProvider>
    
  </StrictMode>
);
