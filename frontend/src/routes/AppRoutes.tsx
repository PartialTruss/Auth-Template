import { Route, Routes } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import LoginPage from "../pages/LoginPage";
import PasswordResetPage from "../pages/PasswordResetPage";
import SignupPage from "../pages/SignupPage";
import UserInfoPage from "../pages/UserInfoPage";
import VerifyPage from "../pages/VerifyPage";
import PrivateRoute from "./PrivateRoute";

const AppRoutes = () => {
  const user = useUser();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/sign-up" element={<SignupPage />} />
      <Route path="/verify-email" element={<VerifyPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route
        path="/forgot-password/:passwordResetCode"
        element={<PasswordResetPage />}
      />

      <Route
        element={<PrivateRoute isAllowed={!!user} redirectPath="/login" />}
      >
        <Route path="/" element={<UserInfoPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
