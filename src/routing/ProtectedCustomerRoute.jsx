import { Navigate } from "react-router";

function ProtectedCustomerRoute({ children }) {
  const condition = true; // 👈 replace with your logic

  if (!condition) {
    // either show nothing:
    return null;
    // or redirect:
    // return <Navigate to="/login" replace />;
    // or show message:
    // return <h1>Website is under maintenance</h1>;
  }

  return children;
}

export default ProtectedCustomerRoute;
