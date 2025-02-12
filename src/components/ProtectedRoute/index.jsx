// filepath: /c:/Users/lenovo/jobbyyy/src/components/ProtectedRoute/index.jsx
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import PropTypes from "prop-types";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const jwtToken = Cookies.get("jwt_token");
  if (jwtToken === undefined) {
    return <Navigate to="/login" />;
  }
  return <Component {...rest} />;
};

ProtectedRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
};

export default ProtectedRoute;
