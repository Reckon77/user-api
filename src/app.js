const express = require("express")
const path=require('path');
require("./db/mongoose") 
const app = express()
const port=process.env.PORT || 3000

const userRouter=require("./routers/user")
const viewRouter=require("./routers/view")
const viewsPath=path.join(__dirname,'../templates/views')
app.set('view engine','hbs')
app.set('views',viewsPath)
app.use(express.json())
app.use(userRouter)
app.use(viewRouter)


app.listen(port,()=>{
    console.log("Server running on port "+port)
})