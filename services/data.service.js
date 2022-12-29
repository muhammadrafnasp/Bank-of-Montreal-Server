// tmport JWT  
const jwt= require('jsonwebtoken')

// import db
const db = require('./db')
  
  
  //database

  userDetails = {
    1000:{acno:1000,username:"Amal",password:1000,balance:1000,transaction:[]},
    1001:{acno:1001,username:"Ammu",password:1001,balance:1001,transaction:[]},
    1002:{acno:1002,username:"Arun",password:1002,balance:1002,transaction:[]},
  
  }



  const register=(acno,username,password)=>{
   return db.User.findOne({acno}) //data
    .then(user=>{

    if(user){
     return {
      status:'false',
      statusCode:400,
      message:'user already registered'
     }
    }
    else{
     const newUser= new db.User({
       acno:acno,
       username:username,
       password:password,
       balance:0,
       transaction:[]
     })
     newUser.save(); //data saved in mongodb
     return {
      status:'true',
      statusCode:200,
      message:'Register successful'
     };
     
    }
})
  }


const login=(acno,pswd)=>{
  return db.User.findOne({acno,pswd}) //data
  .then(user=>{
  
    if(user){
      currentUser=user.username
      currentAcno=acno;
      const token = jwt.sign({
        currentAcno:acno},
        'superkey2022') //To generate key
      
      return{
        status:'true',
        statusCode:'200',
        message:'Login successful',
        token:token,
        currentUser:currentUser,
        currentAcno:acno
      }
    }
    else{
      return{
        status:'false',
        statusCode:'400',
        message:'Invalid User Details'

      }
    }
  })

  // else{
  //   return {
  //     status:'false',
  //     statusCode:'400',
  //     message:'Invalid userdetails'

  //   }
  // }
}




const deposit=(acno,pswd,amt)=>{
  var amount = parseInt(amt)

    return db.User.findOne({acno,pswd}) //data
    .then(user=>{
      if(user){
        user.balance +=amount;
        user.transaction.push({
          Type:'Credit',
          Amount:amount
  
        })
        user.save();
        return{
          status:'true',
          statusCode:'200',
          message:`${amount} is credited and balance is ${user.balance}`
  
        }
  
      }
      else{
        return {
          status:'false',
          statusCode:'400',
          message:'Incorrect userdetails'
  
        }
  
      }
    })
  }


const withdraw=(acno,pswd,amt)=>{
  let amount = parseInt(amt)  
  return db.User.findOne({acno,pswd}) //data
  .then(user=>{
    if(user){
      if(user.balance>amount){
        user.balance -=amount;
        user.transaction.push({
          Type:'Debit',
          Amount:amount
  
        })
        user.save();
        return{
          status:'true',
          statusCode:'200',
          message:`${amount} is debited and balance is ${user.balance}`
  
        }

      }
    }
    else{
      return {
        status:'false',
        statusCode:'400',
        message:'Incorrect userdetails'

      
    }
  }
})
}

//   if(pswd == userDetails[acno]['password']){
//       if(userDetails[acno]['balance']>amount){
//         userDetails[acno]['balance']-=amount;
//         userDetails[acno]['transaction'].push({
//           Type:'Debit',
//           Amount:amount
//         })
//         return{
//           status:'true',
//           statusCode:'200',
//           message:`${amount} is debited and balance is ${userDetails[acno]['balance']}`
  
//         }
  

//       }else{
//         // alert('Transaction failed')
//         return {
//           status:'false',
//           statusCode:'400',
//           message:'Transaction failed'
  
//         }
//       }

//     }else{
//       // alert('password mis match')
//       return{
//         status:'false',
//         statusCode:'400',
//         message:'Password Incorrect'

//       }
//     }

// }else{
//   // alert('Invalid data');
//   return {
//     status:'false',
//     statusCode:'400',
//     message:'Invalid data'

//   }

// }

// }

const getTransaction=(acno)=>{
return db.User.findOne({acno}) //data
.then(user=>{
  if(user){
   
  return{
    status:'true',
    statusCode:'200',
    transaction:user.transaction

  }
  }
  else{
    return {
      status:'false',
      statusCode:'400',
      message:'User not found'

    
  }
  }
})

 }

 //To delete an account

 const deleteAcc=(acno)=>{
  return db.User.deleteOne({acno})
  .then(user=>{
    if(user){
      return{
        status:true,
        statusCode:200,
        message:'User deleted successfully'
    
      }
    }
    else{
      return {
        status:false,
        statusCode:400,
        message:'User not found'
  
      
    }
    }
  })
 }





module.exports={
  register,
  login,
  deposit,
  withdraw,
  getTransaction,
  deleteAcc

}