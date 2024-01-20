const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { json } = require("express")

const Skey = "soelshaikhshaikhsoelshaikhsoelab"


const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Not Valid Email")
            }
        }
    },
   
    password: {
        type: String,
        required: true,
        minlength: 6

    },
    cpassword: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }],
    dateCreated: {
        type: Date,
        default: Date.now
    }
})

userSchema.pre("save", async function (next) {

    
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12)
        this.cpassword = await bcrypt.hash(this.cpassword, 12)
    }
    next();
})

userSchema.methods.generateAuthtoken = async function () {

    try {

        let token1 = jwt.sign({ _id: this._id }, Skey, {
            expiresIn: "1d"
        })
        

        this.tokens = this.tokens.concat({ token: token1 })
        await this.save()
        return token1
    } catch (error) {
        res.status(422).json(error)
    }
}


const userdb = new mongoose.model("users", userSchema)


module.exports = userdb;

