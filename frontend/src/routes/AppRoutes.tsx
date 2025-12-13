import { Route, Routes } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import LoginPage from "../pages/LoginPage";
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
      <Route
        element={<PrivateRoute isAllowed={!!user} redirectPath="/login" />}
      >
        <Route path="/" element={<UserInfoPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
