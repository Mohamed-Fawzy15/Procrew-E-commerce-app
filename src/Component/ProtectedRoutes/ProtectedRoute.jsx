import { Navigate } from "react-router-dom";
import { useUser } from "../../Hooks/useUser";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for user state to stabilize
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Adjust delay if needed
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    console.log("ProtectedRoute: No user, redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    console.log("ProtectedRoute: User not admin, redirecting to /");
    return <Navigate to="/" replace />;
  }

  return children;
}
