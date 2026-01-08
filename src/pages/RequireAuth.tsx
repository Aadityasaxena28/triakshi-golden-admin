import { Navigate, Outlet } from "react-router-dom";

export function RequireAuth() {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    return <Navigate to="/login"  />;
  }
  return <Outlet />;
}
