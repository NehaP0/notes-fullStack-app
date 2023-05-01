const express = require("express")
const {UserModel} = require("../model/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');


const userRouter = express.Router()
userRouter.use(express.json())


userRouter.post("/register", async(req, res)=>{  //remeber its a "post" request
    const {name, email, password, age} = req.body
    try{
        bcrypt.hash(password, 5, async(err, hash)=>{
            const user = new UserModel({name, email, password : hash, age}) 
            await user.save()
            res.status(200).send({"msg" : "New user registered"})//standard way of sending response
        })        
    }
    catch(err){
        res.status(400).send({"err" : err.message})
    }
    
})

userRouter.post("/login", async(req, res)=>{ //remeber its a "post" request not "get" request
    const{email, password} = req.body

    try{
        const user = await UserModel.findOne({email}) //first find user by email only
        
        if(user){
            bcrypt.compare(password, user.password, function(err, result) {
                if(result == true){
                    const token = jwt.sign({ authorID :  user._id, authorName : user.name}, 'masai');
                    res.status(200).send({"msg": "Login Successful", "token" : token})
                } 
                else{
                    res.status(200).send({"msg": "Invalid Credentials"}) //200, not 400 coz request is successful
                }
            })
        } 
    }
    catch(err){
        res.status(400).send({"err" : err.message})
    }
})


module.exports = {userRouter}