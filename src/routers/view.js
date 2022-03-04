const express = require("express")
const router = new express.Router()
const User=require("../models/user")
//new user form route
router.get('/', (req,res)=>{
    res.render('newUser')
})
//Show all users route
router.get('/all',async(req,res)=>{
    try{
        const users = await User.find({});

        const userMap = {};
        users.forEach((user) => {
            userMap[user._id] = user;
        });
        res.render('users',{userMap:userMap})
        // res.send(userMap);
    }catch(err){
        res.status(500).send({error:"Something went wrong!"})
    }
})

module.exports=router