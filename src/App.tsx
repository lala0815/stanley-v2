import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Auth } from './pages/Auth';
import { Home } from './pages/Home';
import { Streams } from './pages/Streams';
import { HostStream } from './components/stream/host/HostStream';
import { AudienceStream } from './components/stream/audience/AudienceStream';
import { useAuthStore } from './stores/authStore';

import { SignIn, SignOutButton  } from '@clerk/clerk-react';
import { useAuth } from '@clerk/clerk-react';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoaded, userId } = useAuth();

  // If auth is still loading, you might want to show a loader or just return null
  if (!isLoaded) return null;

  return userId ? <>{children}</> : <Navigate to="/auth" />;
};

function App() {
  const { userId } = useAuth();
  return (
    <Router>
        <header style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
        {userId && (
          <SignOutButton>
            <button>Sign Out</button>
          </SignOutButton>
        )}
      </header>
      <Routes>
        <Route path="/auth" element={<SignIn />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/streams"
          element={
            <PrivateRoute>
              <Streams />
            </PrivateRoute>
          }
        />
        <Route
          path="/stream/host"
          element={
            <PrivateRoute>
              <HostStream />
            </PrivateRoute>
          }
        />
        <Route
          path="/stream/audience/:channelName"
          element={
            <PrivateRoute>
              <AudienceStream />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;