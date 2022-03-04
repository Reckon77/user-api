const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const userSchema=new mongoose.Schema({
    user_name: {
        type: String,
        trim: true,
        required: true
        },
    user_email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true
        },
    user_password:{
            type:String,
            required: true,
            trim: true
        },

    user_image:{
            type: Buffer
        },
    total_orders:Number,
},{
    timestamps: {
    createdAt: 'created_at',
    updatedAt: 'last_logged_in'
  }})
//Hash the password
userSchema.pre('save',async function (next){
    const user = this
    if (user.isModified('user_password')) {
    user.user_password = await bcrypt.hash(user.user_password, 8)
    }
    next()
})
//remove the password and image buffer before details
userSchema.methods.toJSON=function(){
    const user=this
    const userObject=user.toObject()
    delete userObject.user_password
    delete userObject.user_image
    return userObject
}

const User = mongoose.model('User',userSchema)

module.exports=User