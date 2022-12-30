//server creation

// 1. import express
const express = require('express')

// import dataservices
const dataservices = require('./services/data.service')

// import cors 
const cors = require('cors')


// import jwt
const jwt = require('jsonwebtoken')

// 2. create an application using the express
const app = express()

// to parse json from request body
app.use(express.json())

// Give command to share data via cors
app.use(cors({
    origin:['http://localhost:4200', 'http://192.168.0.147:8080']
}))

// 3. create a port number
app.listen(3000,() =>{
    console.log('listening on port 3000');
})


// Applicatoin specific middleware
const appMiddleware =(req,res,next)=>{
    console.log('Applicatoin specific middleware');
    next();
}
app.use(appMiddleware)

// Router specific middleware
const jwtMiddleware =(req,res,next)=>{

    try{
        console.log('Router specific middleware');

        const token = req.headers['x-access-token']; //ttssggsbhhhhe
        const data = jwt.verify(token,'superkey2022')
        console.log(data);
        next();
    }

    catch{
       res.status(422).json({
        statusCode:422,
        status:false,
        message:'Please login first'
       })
    }
}


// 4. resolving http request
// get, post, put, patch, delete 

// resolving get request
// app.get('/',(req,res)=>{
//     res.send('Get request')
// })

// // resolving post request
// app.post('/',(req,res)=>{
//     res.send('Post request')
// })

// // resolving put request
// app.put('/',(req,res)=>{
//     res.send('Put request')
// })

// // resolving patch request
// app.patch('/',(req,res)=>{
//     res.send('Patch request')
// })

// // resolving delete request
// app.delete('/',(req,res)=>{
//     res.send('Delete request')
// })

// API request
// registration request

app.post('/register',(req,res)=>{
    console.log(req.body);
    dataservices.register(req.body.acno, req.body.username, req.body.password) //data
    .then(result=>{
        res.status(result.statusCode).json(result);
    })
})
 // login request
 app.post('/login',(req,res)=>{
     console.log(req.body);
     dataservices.login(req.body.acno, req.body.pswd)
     .then(result=>{
        res.status(result.statusCode).json(result);

     })
 })
 // deposit request
 app.post('/deposit',jwtMiddleware,(req,res)=>{
     console.log(req.body);
     dataservices.deposit(req.body.acno, req.body.password, req.body.amount)
     .then(result=>{
        res.status(result.statusCode).json(result)

     })
 })
 // withdraw request
 app.post('/withdraw',jwtMiddleware,(req,res)=>{
     console.log(req.body);
     dataservices.withdraw(req.body.acno, req.body.password, req.body.amount)
     .then(result=>{
        res.status(result.statusCode).json(result);

     })
 })
//   transaction request
 app.post('/transaction',jwtMiddleware,(req,res)=>{
     console.log(req.body);
     dataservices.getTransaction(req.body.acno)  
     .then(result=>{
      res.status(result.statusCode).json(result);

     })
 })
// delete request
app.delete('/deleteAcc/:acno',(req,res)=>{
    dataservices.deleteAcc(req.params.acno)  
    .then(result=>{
     res.status(result.statusCode).json(result);

    })
})