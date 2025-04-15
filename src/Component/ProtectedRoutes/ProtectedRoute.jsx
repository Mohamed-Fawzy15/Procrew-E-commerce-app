import React from "react";
import { useUser } from "../../Hooks/useUser";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, adminOnly }) {
  const { user } = useUser();
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}
