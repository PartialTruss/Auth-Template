import { Navigate, Outlet } from "react-router-dom";

interface PrivateRouteProps {
  isAllowed: boolean;
  redirectPath: string;
}

const PrivateRoute = ({ isAllowed, redirectPath }: PrivateRouteProps) => {
  return isAllowed ? <Outlet /> : <Navigate to={redirectPath} replace />;
};

export default PrivateRoute;
