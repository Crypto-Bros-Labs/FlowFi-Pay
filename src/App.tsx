import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from "./shared/pages/LandingPage";
import LoginPage from './features/login/ui/pages/LoginPage';
import SignUpPage from './features/login/ui/pages/SignUpPage';
import OtpPage from './features/login/ui/pages/OtpPage';
import OnOffRampPage from './features/exchange/ui/pages/OnOffRampPage';
import ProtectedRoute from './shared/pages/ProtectedRoute';
import SetAmountPage from './features/charge/ui/pages/SetAmountPage';
import HistoryPage from './features/history/ui/pages/HistoryPage';
import ProfilePage from './features/profile/ui/pages/ProfilePage';
import MainPage from './features/charge/ui/pages/MainPage';
import SelectTokenPage from './features/charge/ui/pages/SelectTokenPage';
import AddAccountPage from './features/profile/ui/pages/AddAccountPage';
import AddWalletPage from './features/profile/ui/pages/AddWalletPage';
import { DialogProvider } from './shared/contexts/DialogProvider';


function App() {
  return (
    <Router>
      <DialogProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          {/* Rutas públicas (redirigen si está autenticado) */}
          <Route
            path="/login"
            element={
              <ProtectedRoute requireAuth={false}>
                <LoginPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/otp"
            element={
              <ProtectedRoute requireAuth={false}>
                <OtpPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/on-off-ramp'
            element={
              <OnOffRampPage />
            }
          />

          {/* Rutas privadas */}
          <Route path='/signup'
            element={
              <ProtectedRoute>
                <SignUpPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/select-token'
            element={
              <ProtectedRoute>
                <SelectTokenPage />
              </ProtectedRoute>
            }
          />

          <Route
            path='/add-account'
            element={
              <ProtectedRoute>
                <AddAccountPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/add-wallet'
            element={
              <ProtectedRoute>
                <AddWalletPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/set-amount"
            element={
              <ProtectedRoute >
                <SetAmountPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedRoute >
                <HistoryPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute >
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/main"
            element={
              <ProtectedRoute >
                <MainPage />
              </ProtectedRoute>
            }
          />

        </Routes>
      </DialogProvider>
    </Router>
  );
}

export default App;