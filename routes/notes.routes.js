const express = require("express")
const noteRouter = express.Router()
const NoteModel = require("../model/note.model")

noteRouter.get("/", async(req, res)=>{
    try{
        const notes = await NoteModel.find({authorID : req.body.authorID})
        res.status(200).send(notes)
    }
    catch(err){
        res.status(400).send({"msg" : err.message})
    }
})

//----------------------------------------------------

noteRouter.post("/create", async(req, res)=>{
    const data = req.body
    try{
        const note = new NoteModel(data)
        await note.save()
        res.status(200).send({"msg" : "New Note created"})
    }
    catch(err){
        res.status(400).send({"msg" : err.message})
    }
})

//----------------------------------------------------


noteRouter.patch("/update/:noteID",async(req, res)=>{
    const {noteID} = req.params
    const updationdata = req.body
    const note = await NoteModel.findOne({_id : noteID})
    try{
        //if(author who has logged in !== author who is making the changes to note){
        if(req.body.authorID !== note.authorID){
            res.status(200).send({"msg" : "You are not authorized to do this."})            
        }
        else{
            await NoteModel.findByIdAndUpdate({_id : noteID}, updationdata)
            res.status(200).send("note updated")
        }
    } 
    catch(err){
        res.status(400).send({"msg" : err.message})
    }
})
 
//----------------------------------------------------

noteRouter.delete("/delete/:noteID",async(req, res)=>{
    const {noteID} = req.params
    const note = await NoteModel.findOne({_id : noteID})
    try{
        if(req.body.authorID !== note.authorID){
            res.status(200).send({"msg" : "You are not authorized to do this."})            
        }
        else{            
            await NoteModel.findByIdAndDelete({_id : noteID})
            res.status(200).send("note deleted")
        }
    } 
    catch(err){
        res.status(400).send({"msg" : err.message})
    }
})


module.exports = noteRouter