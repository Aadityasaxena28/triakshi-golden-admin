import { verifyTokenAPI } from "@/API/AuthAPI";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function RequireAuth() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      setAuthorized(false);
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const valid = await verifyTokenAPI();
        if (!valid) {
          localStorage.removeItem("adminToken");
          setAuthorized(false);
        } else {
          setAuthorized(true);
        }
      } catch {
        localStorage.removeItem("adminToken");
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div>Checking authentication...</div>; // or spinner
  }

  if (!authorized) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
