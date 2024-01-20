require("dotenv").config()
const express = require("express")
const router = new express.Router();
const bcrypt = require("bcryptjs")
const userdb = require("../models/userSchema")
const infodb = require("../models/infoSchema")
const authenticate = require("../middleware/authenticate");

router.post("/register", async (req, res) => {
    const { fname, email, password, cpassword } = req.body;

    console.log(fname, email, password, cpassword);
    if (!fname || !email || !password || !cpassword) {
        res.status(422).json({ error: "fill the details" })
    }
    try {
        const preuser = await userdb.findOne({ email: email });
        if (preuser) {
            res.status(422).json({ error: "This Email is Already Exist" })
            console.log("Email Already Exist");
        } else if (password !== cpassword) {
            res.status(422).json({ error: "Password and Confirm Password does not match" });
        } else {

            const finalUser = await userdb({
                fname: fname,
                email: email,
                password: password,
                cpassword: cpassword,
            });
            console.log("Registration Succesfully");
            // console.log(finalUser);
            const data = await finalUser.save();
            // console.log(finalUser);
            res.status(201).json({ status: 201, data });
        }
    } catch (error) {
        res.status(422).json(error)
        console.log("catch error :", error);
    }
})
router.post("/login", async (req, res) => {

    const { email, password } = req.body;
    console.log(email,password);
    if (!email || !password) {
        res.status(422).json({ error: "fill all the details" })
    }

    try {
        const userValid = await userdb.findOne({ email: email })

        if (userValid) {

            const isMatch = await bcrypt.compare(password, userValid.password)
            console.log("55"+isMatch);
            if (!isMatch) {
                res.status(422).json({ error: "Invalid details" })
            } else {

                //token genrate 

                const token = await userValid.generateAuthtoken()

                console.log("63"+token);
                //cookie Genrate
                res.cookie("usercookie", token, {
                    expires: new Date(Date.now() + 9000000),
                    httpOnly: false
                })
                const result = {
                    userValid,
                    token
                }    
                res.status(202).json({ status: 202, result })
                
            }
        } else {
            res.status(422).json({ error: "User does not Exist!" })
        }

    } catch (error) {
        res.status(422).json(error)
        console.log("catch block");
    }
});
router.get("/validuser", authenticate, async (req, res) => {
    try {
        const validUserOne = await userdb.findOne({ _id: req.userId });
        res.status(201).json({status:201,validUserOne});
        
    } catch (error) {
        res.status(401).json({ status: 401, error });
    }
})
router.get("/logout", authenticate, async (req, res) => {
    try {
        req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
            return curelem.tokens !== req.token
        })
        res.clearCookie("usercookie", { path: "/" });
        req.rootUser.save();
        console.log("USer Logout");
        res.status(201).json({ status: 201 })
    } catch (error) {
        console.log("Error");
        res.status(401).json({ status: 401, error });
    }
})

router.post("/adddata", async (req, res) => {
    
    console.log(req.body);
    const { fullname,age } = req.body

    console.log(fullname+age);

    if (!fullname || !age) {
        res.status(422).json("Plz Fill Data")
    }

    try {
        
        const addData = new infodb({
            fullname: fullname,
            age: age
        })

        const finaldata = await addData.save();
        res.status(201).json({ status: 201, finaldata });
        console.log("Data Added Successfully");
    } catch (error) {
        res.status(422).json(error)
    }
})
router.get("/getdata", async (req, res) => {
    try {
        const getAllData = await infodb.find();
        res.status(201).json(getAllData)
    } catch (error) {
        res.status(422).json(error)
    }
})
router.delete("/deletedata/:id", async (req, res) => {
    try {
        const { id } = req.params
        console.log(id);
        const deletedData = await infodb.findByIdAndDelete({ _id: id });
        console.log(deletedData);
        res.status(201).json(deletedData);
    } catch (error) {
        res.status(422).json(error);
    }
})
router.get("/getdata/:id", async (req, res) => {

    try {

        const { id } = req.params
        const selectedData = await infodb.findById({ _id: id })
        res.status(201).json(selectedData)
    } catch (error) {
        res.status(422).json(error)
    }
})
router.patch("/updatedata/:id", async (req, res) => {
    try {
        const { id } = req.params
        const updatedData = await infodb.findByIdAndUpdate(id, req.body, {
            new: true
        })
        console.log("check :", updatedData);
        res.status(201).json(updatedData)
    } catch (error) {
        res.status(422).json(error)
    }
})
module.exports = router

