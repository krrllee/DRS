import React, { useState } from "react";
import httpClient from "./HttpClient";
import "./LoginPage.css";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const logInUser = async() =>{
    console.log(email,password);

    const resp = await httpClient.post("//localhost:5000/login",{
        email,
        password,
    });
    window.location.href = "/";
  };

  return (
    <div>
      <h1>Login</h1>
      <div className="forma">
      <form>
        <div>
          <label className="email-label">Email:</label>
          <input
            type="text"
            value={email}
            onChange={event => setEmail(event.target.value)}
            
          />
        </div>
        <div>
          <label className="password-label">Password:</label>
          <input
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            
          />
        </div>
        <button className="log" type="button" onClick={()=>logInUser()}>
          Submit
        </button>
      </form>
      </div>
    </div>
  );
};

export default LoginPage;
