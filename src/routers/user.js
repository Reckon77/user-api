const express = require("express")
const router = new express.Router()
const User=require("../models/user")
const multer=require('multer')

//multer config
const upload = multer(
    { 
        limits:{
            fileSize:1000000
        },
        //iamge validation
        fileFilter(req,file,callBack){
            if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                return callBack(new Error('Please upload an image document'))
                }
                callBack(undefined, true)

        }
    }
    )
//new user insert route
router.post('/insert', upload.single('user_image'),async(req,res)=>{
    const user = new User(req.body)
    if(req.file){
        user.user_image = req.file.buffer
    }
    try{
        await user.save()
        res.redirect('/all')
        // res.status(201).send({msg:"New user successfully added"})
    }catch(e){
        res.status(400).send(e)
    }

})
//get image by user id route
router.get('/image/:user_id', async (req, res) => {
    try {
    const user = await User.findById(req.params.user_id)
    if (!user || !user.user_image) {
    throw new Error()
    }
    res.set('Content-Type', 'image/png')
    res.send(user.user_image)
    } catch (e) {
    res.status(404).send({error:"Failed to fetch image!"})
    }
})
//user details route
router.get('/details/:user_id',async (req, res) => {
      const _id = req.params.user_id
      try{
          const user=await User.findById(_id)
          if (!user) {
              res.status(404).send({error:"User doesn't exist"})
          }else{
              res.send(user)
          }
          
      }catch(e){
          res.status(500).send({error:"Something went wrong!"})
      }
})
//delete user route
router.delete('/delete/:user_id', async (req, res) => {
    const _id = req.params.user_id
    try {
        const user = await User.findByIdAndDelete(_id)
        if (!user) {
        return res.status(404).send({error:"User doesn't exist"})
        }
        res.send({msg:"User successfully removed"})
       } catch (e) {
        res.status(500).send({error:"Something went wrong!"})
       }
})

//update user route
router.patch("/update/:user_id",async (req,res)=>{
    const _id = req.params.user_id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['user_name', 'user_email', 'user_password', 'user_image','total_orders']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try{
        const user= await User.findById(_id)
        updates.forEach((update)=>{
            user[update]=req.body[update]
        })
        await user.save()
        if(!user){
            res.status(404).send({error:"User doesn't exist"})
        }else{
            res.send({msg:"User successfully updated"})
        }
    }catch(e){
        res.status(400).send(e)
    }
})
module.exports=router