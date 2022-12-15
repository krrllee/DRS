import React, { useState } from "react";
import HttpClient from "./HttpClient";
import "./RegisterPage.css";

const RegisterPage = () => {
  const [username, setUsername] = useState<string>("");
  const [first_name, setFirstName] = useState<string>("");
  const [last_name, setLastName] = useState<string>("");
  const [adress,setAddress]=useState<string>("");
  const [city,setCity] = useState<string>("");
  const [state,setState] = useState<string>("");
  const [phone_number,setPhoneNumber] = useState<string>("");
  const [email,setEmail]=useState<string>("");
  const [password,setPassword]=useState<string>("");


  const registerUser = async() => {
    console.log(username,email,password);
      try{
        const resp = await HttpClient.post("http://127.0.0.1:5000/registration",{
          username,
          first_name,
          last_name,
          adress,
          city,
          state,
          phone_number,
          email,
          password,
          
      });
      window.location.href = "/";
      }
      catch(error:any){
        if(error.response.status ===401)
        {
          alert("Invalid credentials");
        }
      }
        
    
  };

  return (
    <div className="register">      
        <h1>Register</h1>
      <form>
        <div>
          <label className="username-label">Username</label>
          <input className="username-input"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </div>
        <div>
          <label className="firstname-label">First name</label>
          <input
            type="text"
            value={first_name}
            onChange={(event) => setFirstName(event.target.value)}
            required
          />
        </div>
        <div>
          <label className="lastname-label">Last name</label>
          <input
            type="text"
            value={last_name}
            onChange={(event) => setLastName(event.target.value)}
            required
          />
        </div>
        <div>
             <label className="address-label">Address</label>
            <input
                type="text"
                value={adress}
                onChange={(event)=>setAddress(event.target.value)}
                required
                    />
                </div>
                <div>
                    <label className="city-label">City</label>
                    <input
                        type="text"
                        value={city}
                        onChange={(event)=>setCity(event.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="state-label">State</label>
                    <input
                        type="text"
                        value={state}
                        onChange={(event)=>setState(event.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="pn-label">Phone number</label>
                    <input
                        type="text"
                        value={phone_number}
                        onChange={(event)=>setPhoneNumber(event.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="email-label">Email</label>
                    <input
                        type="text"
                        value={email}
                        onChange={(event)=>setEmail(event.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="password-label">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(event)=>setPassword(event.target.value)}
                        required
                    />
                </div>
                <div className="submit">
                <button type = "button" onClick={()=>registerUser()}>Submit</button>
                </div>
                
      </form>
    </div>
  );
};

export default RegisterPage;
