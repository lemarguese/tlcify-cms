import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuthFunctions } from "@/pages/Authorization/utils/auth.ts";
import { Outlet } from "react-router";

interface ProtectedRouteProps {
  requiredPermissions?: string[];
}

const ProtectedRoute = ({ requiredPermissions }: ProtectedRouteProps) => {
  const token = localStorage.getItem("tlcify_access_token");
  const { user, fetchMyself } = getAuthFunctions();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyself().finally(() => setLoading(false));
  }, []);

  if (!token) return <Navigate to="/login"/>;
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login"/>;

  if (
    requiredPermissions &&
    !requiredPermissions.some((p) => user.permissions?.includes(p))
  ) {
    return <Navigate to="/forbidden"/>;
  }

  return <Outlet/>; // 👈 render children directly
};

export default ProtectedRoute;
