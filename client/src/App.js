import {  Route, Routes, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import { useContext, useEffect } from "react";
import { LoginContext } from "./components/ContextProvider/Context";
import Edit from "./components/Edit";


function App() {

  const { logindata, setLoginData } = useContext(LoginContext);


  const navigate = useNavigate();

  const DashboardValid = async () => {
    let token = localStorage.getItem("usersdatatoken");

    if(token){
      const res = await fetch("/validuser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        }
      });
  
      const data = await res.json();
  
      if (data.status == 401 || !data) {
        console.log("user not valid");
      } else {
        console.log("user verify");
        setLoginData(data)
        navigate("/");
      }
    }
    console.log("user not verify");
  }

  useEffect(() => {
    setTimeout(()=>{
      DashboardValid();
      
    },2000)

  }, [])

  return (
    <div>
        <Header />
        <Routes>
           <Route path="/" element={<Dashboard />} />
          <Route path="/Login" element={<Login/>}/>
          <Route path="/register" element={<Register />} />
          <Route path="editdata/:id" element={<Edit/>}/>
        </Routes>
    </div>
  );
}

export default App;
