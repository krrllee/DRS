import React from "react";
import "./LandingPage.css";

const LandingPage: React.FC = () => {
  return (
    <div>
      <h1>Welcome</h1>
      <br />
      <div className="login">
      <a href="/login">
        <button className="login-button">Login</button>
      </a>
      </div>   
      <a href="/register">
        <button className="register-button">Register</button>
      </a>
    </div>
  );
};

export default LandingPage;
