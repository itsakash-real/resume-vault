import { Navigate } from 'react-router-dom';

function ProtectedRoute({ isAuthenticated, children }) {
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If authenticated, show the page
  return children;
}

export default ProtectedRoute;