import React,{useState,useEffect}from "react";
import HttpClient from "./HttpClient";


const HomePage:React.FC = () =>{

    const [user, setUser] = useState<string>("");

    const logOutUser = async () =>{
        await HttpClient.post("//localhost:5000/logout");
        window.location.href = "/";
    };

    useEffect(() => {
        (async () => {
          try {
            const resp = await HttpClient.get("//localhost:5000/@me");
            setUser(resp.data);
          } catch (error) {
            console.log("Not authenticated");
          }
        })();
      }, []);



    return(
        <div>
            <button type="button" onClick={()=>logOutUser()}>
                Logout
                </button>
        </div>
    );

};

export default HomePage;