import React, { useContext, useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { LoginContext } from './ContextProvider/Context';


const Login = () => {

  const navigate = useNavigate();
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [LoginEmailError, setLoginEmailError] = useState("")
  const [LoginPassError, setLoginPassError] = useState("")
  const [passShow, setPassShow] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState("")
  const { logindata, setLoginData } = useContext(LoginContext);
  
  const passwordShowHideHandler = () => {
    if (passShow === false) {
        setPassShow(true)
    } else {
        setPassShow(false)
    }
}
  const loginHandler = async (e) => {

    e.preventDefault();
    let submit = false;
    if (selectedIndex === "") {
        if (email === "") {
            submit = false;
            setLoginEmailError("Please Enter Email ")
        }
        else {
            submit = true
            setLoginEmailError("")
        } if (password === "") {
            submit = false;
            setLoginPassError("Please Enter Password")
        } else {
            submit = true
            setLoginPassError("")
        }

    }
    if (submit === true) {
        const login_api = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email, password
            })
        })

        const res = await login_api.json();
        console.log(res.status);
        if (res.status == 202){
            localStorage.setItem("usersdatatoken", res.result.token)
            alert("Login Successfull..!")
            navigate("/")
            //alert("done")
            setEmail("")
            setPassword("")
        } else {
            alert("Invalid details")

        }

    }
}

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
      navigate("/*");
  } else {
      console.log("user verify");
      setLoginData(data)
      navigate("/dash");
  }
}
  else{
      console.log("user not verify");
  }
}


useEffect(() => {
  setTimeout(() => {
      DashboardValid();
      
  }, 2000)

}, [])
  return (
    
<>
<section>
                <div className="form_data">
                    <div className="form_heading">
                        <h1>Log In</h1>

                    </div>


                    <form>
                        <div className="form_input">
                            <label htmlFor="email">Email</label>
                            <input type="email" 
                            value={email} 
                            onChange={(e)=>setEmail(e.target.value)} 
                            name="email" id="email" placeholder='Enter Your Email Address' />
                        </div>
                        <div style={{ color: "red" }}>{LoginEmailError}</div>
                        <div className="form_input">
                            <label htmlFor="password">Password</label>
                            <div className="two">
                                <input type={!passShow ? "password" : "text"} 
                                   onChange={(e) => setPassword(e.target.value)}
                                   value={password}
                                name="password" id="password" placeholder='Enter Your password' />
                                <div className='showpass' onClick={() => { passwordShowHideHandler() }}>
                                                        {passShow === false ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                                    </div>
                            </div>
                        </div>
                        <div style={{ color: "red" }}>{LoginPassError}</div>

                        <button className='btn' onClick={loginHandler}>Login</button>
                        <p>Don't have an Account? <NavLink to="/register">Register</NavLink> </p>
                    </form>

                </div>
            </section>
</>
  )
}

export default Login