const express = require("express")
const connection = require("./db")
const auth = require("./middlewares/auth.middleware")
const {userRouter} = require("./routes/user.routes")
const noteRouter = require("./routes/notes.routes")
const cors = require("cors")

const server = express()


server.use(express.json())

server.use(cors())

server.use("/users", userRouter)

server.use(auth) //using middleware for protected routes

//Protected Routes:

server.use("/notes" , noteRouter)


//-------------------------------------------------------------------------------------------------------------------

server.listen(8000, async()=>{
    try{
        await connection
        console.log("Connected to db");
    }
    catch(err){
        console.log(err);
    }
    console.log("Server Running")
})

