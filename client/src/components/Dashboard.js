import React, { useContext, useEffect, useState } from 'react'
import { LoginContext } from './ContextProvider/Context';
import { NavLink, useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';


const Dashboard = () => {
  const { logindata, setLoginData } = useContext(LoginContext);
  const [fullname, setFullName] = useState("")
  const [fullnameError, setFullnameError] = useState("")
  const [age, setAge] = useState("")
  const [ageError, setAgeError] = useState("")
  const [list, setList] = useState([])
  const [selectedIndex, setSelectedIndex] = useState("")

  const navigate = useNavigate();

  const AddDataHandler = async (e) => {
    e.preventDefault();

    console.log(fullname, age);

    let submit = true
    if (selectedIndex === "") {
      if (fullname === '') {
        setFullnameError("Please Enter Full Name")
        submit = false
      } else {
        setFullnameError("")
        submit = true;
      }
      if (age === "") {
        setAgeError("Please Enter Age")
        submit = false
      } else {
        setAgeError("")
        submit = true;
      }
      if (submit == true) {


        const api_call = await fetch("http://localhost:5000/adddata", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            fullname, age
          })
        })
        const res = await api_call.json();
        console.log(res.status);
        if (res.status == 201) {
          setFullName("")
          setAge("")
          alert("done")
          navigate("/")
        } else {
          console.log("error");

        }
        // console.log(api_call.status);

      }
    }

  }

  const getData = async () => {
    const res = await fetch("/getdata", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })

    const data = await res.json();
    if (res.status === 422 || !data) {
      console.log("error");
    } else {
      setList(data)
      //console.log(data);
    }
  }
  const deleteData = async (id) => {

    console.log(id);
    const res2 = await fetch(`/deletedata/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });
    console.log("sohil", res2);

    const deletedata = await res2.json();
    console.log(deletedata);

    if (res2.status === 422 || !deletedata) {
      console.log("error");
    } else {
      console.log("data deleted");
      getData();
    }

  }

  const DashboardValid = async () => {
    let token = localStorage.getItem("usersdatatoken");
    if (token) {
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
        navigate("/");
      }
    }
    else {
      console.log("user not verify");
    }
  }


  useEffect(() => {
    setTimeout(() => {
      DashboardValid();
    }, 2000)

  }, [])

  useEffect(()=>{
    getData();
  })
  return (
    <>
      {
        logindata != '' ? <>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h1>User Email:{logindata ? logindata.validUserOne.email : ""}</h1>
          </div>

          <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
            <div>
              <section>
                <div className="form_data">
                  <div className="form_heading">
                    <h1>Add Data</h1>
                  </div>
                  <form>
                    <div className="form_input">
                      <label htmlFor="fullname">Full name</label>
                      <input type="text"
                        onChange={(e) => setFullName(e.target.value)}
                        value={fullname}
                        name="fullname" id="fullname" placeholder='Enter Full Name' />
                    </div>
                    <div style={{ color: "red" }}>{fullnameError}</div>
                    <div className="form_input">
                      <label htmlFor="age">Age</label>
                      <div className="two">
                        <input type="text"
                          onChange={(e) => setAge(e.target.value)}
                          value={age}
                          name="age" id="age" placeholder='Enter Age' />

                      </div>
                    </div>
                    <div style={{ color: "red" }}>{ageError}</div>

                    <button className='btn' onClick={AddDataHandler}>Add</button>

                  </form>

                </div>

              </section>
            </div>

            <div>
              <section>
                <div className="form_data" style={{ marginLeft: "100px", minWidth: "550px" }}>
                  <div className="form_heading">
                    <h1>View Data</h1>

                    {

                      list.length === 0 ? <>
                        No Data Found
                      </> :
                        <>
                          <Table striped bordered hover size="sm">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Full Name</th>
                                <th>Age</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>

                              {
                                list.map((item, index) => {
                                  return (
                                    <tr>
                                      <td>{index + 1}</td>

                                      <td style={{ textAlign: "center" }}><div style={{ marginTop: "2rem" }}>{item.fullname}</div></td>
                                      <td style={{ textAlign: "center" }}><div style={{ marginTop: "2rem" }}>{item.age}</div></td>
                                      <td style={{ textAlign: "center" }}>
                                        <div style={{ marginTop: "2rem" }}>

                                          <button type='button' style={{textDecoration:"none"}}><NavLink to={`/editdata/${item._id}`}>Edit</NavLink></button>
                                          {/* <NavLink onClick={()=> editData(item._id)}>Edit</NavLink> */}
                                          <button type='button' style={{textDecoration:"none"}}><NavLink onClick={() => deleteData(item._id)} >Delete</NavLink></button>
                                        </div>
                                      </td>

                                    </tr>
                                  )
                                })


                              }
                            </tbody>
                          </Table>
                        </>
                    }

                  </div>
                </div>

              </section>
            </div>

          </div>


        </>
          :
          <>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <img src="./man.png" style={{ width: "200px", marginTop: 20 }} alt="" />
              <h1>Guest User</h1>
            </div>
          </>
      }
    </>
  )
}

export default Dashboard