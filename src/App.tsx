import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./shared/pages/LandingPage";
import LoginPage from "./features/login/ui/pages/LoginPage";
import SignUpPage from "./features/login/ui/pages/SignUpPage";
import OtpPage from "./features/login/ui/pages/OtpPage";
import ProtectedRoute from "./shared/pages/ProtectedRoute";
import ProtectedLogin from "./shared/pages/ProtectedLogin";
import SetAmountPage from "./features/charge/ui/pages/SetAmountPage";
import HistoryPage from "./features/history/ui/pages/HistoryPage";
import ProfilePage from "./features/profile/ui/pages/ProfilePage";
import MainPage from "./features/charge/ui/pages/MainPage";
import SelectTokenPage from "./features/charge/ui/pages/SelectTokenPage";
import AddAccountPage from "./features/profile/ui/pages/AddAccountPage";
import AddWalletPage from "./features/profile/ui/pages/AddWalletPage";
import { DialogProvider } from "./shared/contexts/DialogProvider";
import SetAmountDynamicPage from "./features/wallet/ui/pages/SetAmountDynamicPage";
import SelectTokenDynamicPage from "./features/wallet/ui/pages/SelectTokenDynamicPage";
import ReceivePage from "./features/wallet/ui/pages/ReceivePage";
import QRScannerPage from "./features/wallet/ui/pages/QRScannerPage";
import { CurrencyProvider } from "./shared/contexts/CurrencyProvider";
import SellInfoPage from "./features/charge/ui/pages/SellInfoPage";
import TeamPage from "./features/profile/ui/pages/TeamPage";
import AddMemberPage from "./features/profile/ui/pages/AddMemberPage";
import SelectWalletDynamicPage from "./features/wallet/ui/pages/SelectWalletDynamicPage";
import { AppDataProvider } from "./shared/contexts/AppDataContext";
import { useEffect } from "react";
import authLocalService from "./features/login/data/local/authLocalService";
import userLocalService from "./features/login/data/local/userLocalService";
import DepositInfoPage from "./features/charge/ui/pages/DepositInfoPage";
import WithdrawalInfoPage from "./features/charge/ui/pages/WithdrawalInfoPage";
import SelectAccountPage from "./features/wallet/ui/pages/SelectAccountPage";

function App() {
  useEffect(() => {
    // Si los tokens han expirado, limpiar todo
    const hasTokens = authLocalService.hasTokens();
    const userData = userLocalService.getUserData();

    if (!hasTokens || !userData?.hasAllData) {
      // Limpiar localStorage completamente
      localStorage.clear();
      sessionStorage.clear();
      console.log("Datos de autenticación limpiados");
    }
  }, []);
  return (
    <Router>
      <CurrencyProvider>
        <DialogProvider>
          <AppDataProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/recovery-order/:id" element={<SellInfoPage />} />
              <Route
                path="/withdrawal-order/:id"
                element={<WithdrawalInfoPage />}
              />
              <Route path="/deposit-order/:id" element={<DepositInfoPage />} />

              {/* Rutas públicas (redirigen si está autenticado) */}
              <Route
                path="/login"
                element={
                  <ProtectedLogin requireAuth={false}>
                    <LoginPage />
                  </ProtectedLogin>
                }
              />
              <Route
                path="/otp"
                element={
                  <ProtectedLogin requireAuth={false}>
                    <OtpPage />
                  </ProtectedLogin>
                }
              />

              {/* Rutas privadas */}
              <Route
                path="/signup"
                element={
                  <ProtectedRoute>
                    <SignUpPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/select-token"
                element={
                  <ProtectedRoute>
                    <SelectTokenPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/add-account"
                element={
                  <ProtectedRoute>
                    <AddAccountPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-wallet"
                element={
                  <ProtectedRoute>
                    <AddWalletPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/set-amount"
                element={
                  <ProtectedRoute>
                    <SetAmountPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <HistoryPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/main"
                element={
                  <ProtectedRoute>
                    <MainPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/set-amount-dynamic"
                element={
                  <ProtectedRoute
                    allowedRoles={["USER", "EMPLOYEE", "BUSINESS"]}
                  >
                    <SetAmountDynamicPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/select-token-dynamic"
                element={
                  <ProtectedRoute
                    allowedRoles={["USER", "EMPLOYEE", "BUSINESS"]}
                  >
                    <SelectTokenDynamicPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/select-wallet-dynamic"
                element={
                  <ProtectedRoute
                    allowedRoles={["USER", "EMPLOYEE", "BUSINESS"]}
                  >
                    <SelectWalletDynamicPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/select-account/:type"
                element={
                  <ProtectedRoute
                    allowedRoles={["USER", "EMPLOYEE", "BUSINESS"]}
                  >
                    <SelectAccountPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="wallet/qr-scanner"
                element={
                  <ProtectedRoute
                    allowedRoles={["USER", "EMPLOYEE", "BUSINESS"]}
                  >
                    <QRScannerPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/receive"
                element={
                  <ProtectedRoute
                    allowedRoles={["USER", "EMPLOYEE", "BUSINESS"]}
                  >
                    <ReceivePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/team"
                element={
                  <ProtectedRoute allowedRoles={["USER", "BUSINESS"]}>
                    <TeamPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/add-member"
                element={
                  <ProtectedRoute allowedRoles={["USER", "BUSINESS"]}>
                    <AddMemberPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AppDataProvider>
        </DialogProvider>
      </CurrencyProvider>
    </Router>
  );
}

export default App;
