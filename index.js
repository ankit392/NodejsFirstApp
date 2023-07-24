

import  express  from "express";
import fs from 'fs';
import path  from "path";
import mongoose from 'mongoose';
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";



const app=express()

//Middleware
app.use(express.static(path.join(path.resolve(),"./public")))
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
// render views file and redirect means Api own




app.set("view engine","ejs")

//Dtabase temporary
const users=[]

mongoose.connect("mongodb://localhost:27017",{
  dbName:"backend",
})
.then(()=>{console.log("SuccessFull")})
.catch(e=>console.log(error))

const userSchema=new mongoose.Schema({
  name:String,
  email:String,
  password:String,
})
const user=mongoose.model("user",userSchema)









// For mongodb hardcoded

  




// app.get("/users",(req,res)=>{

//   res.json({
//     users,
//   })
// })

// app.get("/success",(req,res)=>{

//   res.render("success")
// })


// PSOt Api
// app.post("/contact",async(req,res)=>{

//   // console.log(req.body)
//    const {name,email}=req.body;
//   // users.push({username:req.body.name,useremail:req.body.email})
//     await mssage.create({name:name,email:email})
//   res.redirect("/success")
// });

const isauthenticated=async(req,res,next)=>{

  const {token}=req.cookies;
 
    if(token){
     const decoded=jwt.verify(token,"sghvsjgcshgjks")
     
     req.User=await user.findById(decoded._id)
   // console.log(req.User)
        next()
    }
    else
     res.redirect("/login")

};

// Authentication
app.get("/",isauthenticated,(req,res)=>{

  // const pathloc=path.resolve();
  res.render("logout",{name:req.User.name})

});
app.get("/login",(req,res)=>{
  res.render("login")
})

app.post("/login",async(req,res)=>{
     
  const{email,password}=req.body;

  let user1=await user.findOne({email});
  if(!user1) return res.redirect("/register");

  const match  = await bcrypt.compare(password,user1.password);
   if(!match) return res.render("login",{email,message:"Incorrect password"})
   

    const token=jwt.sign({_id:user1._id},"sghvsjgcshgjks")
    

  res.cookie("token",token,{
    httpOnly:true,expires:new Date(Date.now()+60*1000),
  })
  res.redirect("/")


})






app.get("/login ",(req,res)=>{
  res.render("login");
})

app.get("/register",(req,res)=>{
  res.render("register")
})
//Action
app.post("/register",async(req,res)=>{

  const {name,email,password}=req.body;


  const user1=await user.findOne({email})
  if(user1){
    res.redirect("/login")
  }

  const ishashed=await bcrypt.hash(password,10);




    const User=await user.create({
      name,
      email,
      password:ishashed,
    }
      );

    const token=jwt.sign({_id:User._id},"sghvsjgcshgjks")
    console.log(token)

  res.cookie("token",token,{
    httpOnly:true,expires:new Date(Date.now()+60*1000),
  })
  res.redirect("/")

 


})
app.get("/logout",(req,res)=>{
  res.cookie("token",null,{
    httpOnly:true,expires:new Date(Date.now()),
  })
  res.redirect("/")
})



app.listen(5000,()=>{
  console.log("sever is working")
});