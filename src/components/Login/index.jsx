import { useState } from "react";
import Cookies from "js-cookie";
import { Navigate, useNavigate } from "react-router-dom";

import "./index.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const navigate = useNavigate();

  const mockAuthenticate = (username, password) => {
    // Mock authentication logic
    if (username && password) {
      return { success: true, token: "mock-jwt-token" };
    }
    return { success: false, error: "Invalid username or password" };
  };

  const onSuccessLogin = (jwtToken) => {
    Cookies.set("jwt_token", jwtToken, { expires: 30 });
    navigate("/");
  };

  const onFailureLogin = (errorMsg) => {
    setErrorMsg(errorMsg);
    setShowErrorMsg(true);
  };

  const onSubmitForm = (event) => {
    event.preventDefault();
    const result = mockAuthenticate(username, password);

    if (result.success) {
      onSuccessLogin(result.token);
    } else {
      onFailureLogin(result.error);
    }
  };

  const renderUsernameField = () => (
    <div className="input-field-container">
      <label htmlFor="username" className="login-input-label">
        USERNAME
      </label>
      <input
        type="text"
        value={username}
        className="login-input-field"
        placeholder="Enter name as (rahul)"
        id="username"
        onChange={(e) => setUsername(e.target.value)}
      />
    </div>
  );

  const renderPasswordField = () => (
    <div className="input-field-container">
      <label htmlFor="password" className="login-input-label">
        PASSWORD
      </label>
      <input
        type="password"
        value={password}
        className="login-input-field"
        placeholder="Enter Password as (@rahul@2021)"
        id="password"
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>
  );

  const jwtToken = Cookies.get("jwt_token");
  if (jwtToken !== undefined) {
    return <Navigate to="/" />;
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={onSubmitForm}>
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="website-logo-login-form"
        />
        {renderUsernameField()}
        {renderPasswordField()}
        <div>
          <button type="submit" className="login-button">
            Login
          </button>
          {showErrorMsg && <p className="error-msg">*{errorMsg}</p>}
        </div>
      </form>
    </div>
  );
};

export default Login;
