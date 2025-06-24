import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem("tlcify_access_token");

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
