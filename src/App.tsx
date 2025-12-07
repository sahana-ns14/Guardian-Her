import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useProfileStore } from './store/useProfileStore';
import Welcome from './pages/Welcome';
import Setup from './pages/Setup';
import Login from './pages/Login';
import Home from './pages/Home';
import SaferRoutes from './components/modules/SaferRoutes';
import EmergencySupport from './components/modules/EmergencySupport';
import CheckInTimer from './components/modules/CheckInTimer';
import Chatbot from './components/modules/Chatbot';
import SafetyReporting from './components/modules/SafetyReporting';
import StatusUpdate from './components/modules/StatusUpdate';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import { Layout } from './components/Layout';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isSetupComplete } = useProfileStore();
  if (!isAuthenticated && !isSetupComplete) {
    return <Navigate to="/welcome" replace />;
  }
  return <>{children}</>;
};

const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isSetupComplete } = useProfileStore();
  if (isAuthenticated || isSetupComplete) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/welcome" element={<PublicOnlyRoute><Layout><Welcome /></Layout></PublicOnlyRoute>} />
        <Route path="/setup" element={<Layout><Setup /></Layout>} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/routes" element={<ProtectedRoute><Layout><SaferRoutes /></Layout></ProtectedRoute>} />
        <Route path="/support" element={<ProtectedRoute><Layout><EmergencySupport /></Layout></ProtectedRoute>} />
        <Route path="/timer" element={<ProtectedRoute><Layout><CheckInTimer /></Layout></ProtectedRoute>} />
        <Route path="/chatbot" element={<ProtectedRoute><Layout><Chatbot /></Layout></ProtectedRoute>} />
        <Route path="/report" element={<ProtectedRoute><Layout><SafetyReporting /></Layout></ProtectedRoute>} />
        <Route path="/status" element={<ProtectedRoute><Layout><StatusUpdate /></Layout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
