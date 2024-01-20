import React, { Fragment, useContext } from 'react'
import { Avatar } from '@mui/material'
import { NavLink, useNavigate } from 'react-router-dom'
import "./header.css"
import { LoginContext } from './ContextProvider/Context'

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const Header = () => {

    const { logindata, setLoginData } = useContext(LoginContext);


    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const logoutuser = async () => {
        let token = localStorage.getItem("usersdatatoken");

        const res = await fetch("/logout", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
                Accept: "application/json"
            },
            credentials: "include"
        });

        const data = await res.json();
        console.log(data);

        if (data.status == 201) {
            console.log("use logout");
            localStorage.removeItem("usersdatatoken");
            setLoginData(false)
            navigate("/");
        } else {
            console.log("error");
        }
    }

    // const goDash = () => {
    //     navigate("/dash")
    // }

    const goLogin = () => {
        navigate("/login")
    }
    const goRegister = () => {
        navigate("/register")
    }
  return (
        <>
             <header>
                <nav>
                    
                <NavLink to="/"><h1>React App</h1></NavLink>
                    <div className="avtar">
                        
                    {
                            logindata.validUserOne ? <Avatar style={{ background: "salmon", fontWeight: "bold", textTransform: "capitalize" }} onClick={handleClick}>{logindata.validUserOne.fname[0].toUpperCase()}</Avatar> :
                                <Avatar style={{ background: "blue" }} onClick={handleClick} />
                        }

                    </div>

                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        {
                            logindata.validUserOne ? (
                                <Fragment>
                                    {/* <MenuItem onClick={() => {
                                        goDash()
                                        handleClose()
                                    }}>Profile</MenuItem> */}
                                    <MenuItem onClick={() => {
                                        logoutuser()
                                        handleClose()
                                    }}>Logout</MenuItem>
                                </Fragment>
                            ) : (
                                <Fragment>
                                    <MenuItem onClick={() => {
                                        goLogin()
                                        handleClose()
                                    }}>Login</MenuItem>
                                    <MenuItem onClick={() => {
                                        goRegister()
                                        handleClose()
                                    }}>Register</MenuItem>
                                </Fragment>
                            )
                        }

                    </Menu>
                </nav>
            </header>
        </>
    )
}

export default Header