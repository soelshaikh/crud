
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("./db/conn")
const router = require("./routes/router")
const port = 5000;
app.use(express.json())
app.use(cors())
app.use(router)
app.use(cookieParser())



app.listen(port, () => {
    console.log(`Server created at: ${port}`);
})
