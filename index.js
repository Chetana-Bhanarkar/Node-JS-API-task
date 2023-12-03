const express = require('express')
const app = express() ; 
const port = 3000 ; 

const user = require('./routes/user.auth.route')

app.use(express.json()) ; 
app.use(express.urlencoded({extended:false}))


app.use('/api/v1/user',user)

app.listen(port , ()=>{
    console.log('server start');
})