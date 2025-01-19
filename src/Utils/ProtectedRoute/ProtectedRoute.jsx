import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({
  condition,
  navigate: { to, message },
  children,
}) => {
  if (condition) {
    return children;
  } else {
    return <Navigate to={to} state={{ message }} />;
  }
};
