import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from './Header'

const Edit = () => {

    const navigate = useNavigate()
  const [fullname, setFullName] = useState("")
  const [age, setAge] = useState("")
  const [fullnameError, setFullNameError] = useState("")
  const [ageError, setAgeError] = useState("")
  const [selectedIndex, setSelectedIndex] = useState("")

  const { id } = useParams("");
    const getData = async () => {

        const res = await fetch(`/getdata/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        })
    
        const data = await res.json()
        console.log(data);
        if (res.status === 422 || !data) {
          console.log("error")
        } else {
          setFullName(data.fullname)
          setAge(data.age)
        }
      }
      useEffect(() => {
        getData();
      }, [])
    
      const updateDataHandler = async (e) => {
        e.preventDefault();
    
        let submit = false;
    
        if (selectedIndex === "") {
    
          if (fullname == "") {
            submit = false;
            setFullNameError("Enter Full Name")
          } else {
            submit = true
            setFullNameError("")
          }
          if (age == "") {
            submit = false;
            setAgeError("Enter Age")
          } else {
            submit = true
            setAgeError("")
          }
        }
        if (submit == true) {
          console.log("sohil");
          const api = await fetch(`/updatedata/${id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              fullname,age
            })
          })
    
          const datares = await api.json();
          console.log(datares);
    
          if (api.status == 422 || !datares) {
            alert("fill the data");
          } else {
            navigate("/")
            console.log("data updated");
          }
    
        }
      }
  return (
    <div>
        
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
            <div>
              <section>
                <div className="form_data">
                  <div className="form_heading">
                    <h1>Upate Data</h1>
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

                    <button className='btn' onClick={updateDataHandler}>Update</button>

                  </form>

                </div>

              </section>
            </div>



          </div>
    </div>
  )
}

export default Edit