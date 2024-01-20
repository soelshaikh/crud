import React, { useState } from 'react'
import "./style.css"
import { NavLink, useNavigate } from 'react-router-dom'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Register = () => {
    const navigate = useNavigate();
    const [fname,setFname] = useState("");
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [cpassword,setCpassword] = useState("")
    const [fnameError, setFnameError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [cPasswordError, setCpasswordError] = useState("")
    const [passShow, setPassShow] = useState(false);
    const [cpassShow, setCPassShow] = useState(false);

    const [selectedIndex, setSelectedIndex] = useState("")


    const passwordShowHideHandler = () => {
        if (passShow === false) {
            setPassShow(true)
        } else {
            setPassShow(false)
        }
    }
    const cPasswordShowHideHandler = () => {
        if (cpassShow === false) {
            setCPassShow(true)
        } else {
            setCPassShow(false)
        }
    }

    const RegisterHandler = async(e) =>{
        e.preventDefault();
        // console.log(fname,email,password,cpassword);
        let submit = true
        if (selectedIndex === '') {
            if (fname === '') {
                setFnameError("Please Enter Full Name")
                submit = false
            } else {
                setFnameError("")
                submit = true
            }
            if (email === '') {
                setEmailError("Please Enter Email address")
                submit = false
            } else if (!email.includes("@")) {
                setEmailError("Please Enter Valid Email address")
                submit = false
            }
            else {
                setEmailError("")
                submit = true
            }
            if (password === '') {
                setPasswordError("Please Enter Password")
                submit = false
            } else if (password.length < 6) {
                setPasswordError("Please Enter minimum 6 Character")
                submit = false
            } else {
                setPasswordError("")
                submit = true
            }
            if (cpassword === '') {
                setCpasswordError("Please Enter Confirm Password")
                submit = false
            } else if (cpassword.length < 6) {
                setCpasswordError("Please Enter minimum 6 Character")
                submit = false
            } else {
                setCpasswordError("")
                submit = true
            }
            if (password !== cpassword) {
                setCpasswordError("Password and Confirm Password not match")
                submit=false
            }

        }
        if (submit === true) {
 
            console.log(fname, email, password, cpassword);
            const data = await fetch("http://localhost:5000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fname, email, password, cpassword
                })
            })

            const res = await data.json();
            console.log(res.status);
            if (res.status === 201) {
                alert("user registration done");
                
                setFname("")
                setEmail("")
                setPassword("")
                setCpassword("")
                navigate("/login")
                
            } else {
                alert("This Email is Already Exist")
            }
        } else {
            console.log("false");
        }
        

     
    }

  return (
    <>
           <>
            <section>
                <div className="form_data">
                    <div className="form_headi
                    ng">
                        <h1>Register</h1>
                        
                    </div>

                    <form>
                        <div className="form_input">
                            <label htmlFor="fname">Name</label>
                            <input type="text"
                            onChange={(e) => setFname(e.target.value)}
                            value={fname} name="fname" 
                            id="fname" placeholder='Enter Your Name' />
                        </div>
                        <div style={{ color: "red" }}>{fnameError}</div>
                        <div className="form_input">
                            <label htmlFor="email">Email</label>
                            <input type="email" 
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            name="email" id="email" placeholder='Enter Your Email Address' />
                        </div>
                        <div style={{ color: "red" }}>{emailError}</div>

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
                        <div style={{ color: "red" }}>{passwordError}</div>


                        <div className="form_input">
                            <label htmlFor="password">Confirm Password</label>
                            <div className="two">
                                <input type={!cpassShow ? "password" : "text"} 
                                   onChange={(e) => setCpassword(e.target.value)}
                                   value={cpassword}
                                name="cpassword" id="cpassword" placeholder='Confirm password' />
                                <div className='showpass' onClick={() => { cPasswordShowHideHandler() }}>
                                                        {cpassShow === false ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                                    </div>
                            </div>
                        </div>
                        <div style={{ color: "red" }}>{cPasswordError}</div>


                        <button className='btn' onClick={RegisterHandler} >Sign Up</button>
                        <p>Already have an account? <NavLink to="/login">Log In</NavLink></p>
                    </form>

                </div>
            </section>
        </>
    </>
  )
}

export default Register