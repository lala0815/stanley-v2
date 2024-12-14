import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Auth } from "./pages/Auth";
import { Home } from "./pages/Home";
import { Streams } from "./pages/Streams";
import { HostStream } from "./components/stream/host/HostStream";
import { AudienceStream } from "./components/stream/audience/AudienceStream";
import { useAuthStore } from "./stores/authStore";
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" />;
};
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
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
