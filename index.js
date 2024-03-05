const express = require('express');
const axios = require('axios');
const path = require("path");
const app = express();
var bodyParser = require('body-parser');
require('dotenv').config();
const PORT = process.env.PORT || 5500;

const base_url = "http://localhost:3000";

let user ={}
let role = 0;

app.set("views",path.join(__dirname,"/public/views"));
app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.use(express.static(__dirname + '/public'));

app.get("/",async(req, res) => {
    try {
        // const response = await axios.get(base_url + '/books');
        res.render("home", );
    } catch (err){
        console.error(err);
        res.status(500).send('Error');
    }
});


app.get("/login",(req,res)=>{
    res.render("login",{
        status:true,
        role,
        message:""
    })
})

app.get("/history",(req,res)=>{
    res.render("history",)
})

app.get("/home",(req,res)=>{
    res.render("home",)
})

app.get("/sale",(req,res)=>{
    res.render("sale",)
})

app.get("/profile",(req,res)=>{
    console.log(user);
    res.render("profile",)
})

app.get("/basketball",async(req,res)=>{
    const response = await axios.get(base_url+"/basketball");
    res.render("home_user",{
        stadium:response.data
    })
})

app.get("/football",async(req,res)=>{
    const response = await axios.get(base_url+"/football");
    res.render("home_user",{
        stadium:response.data
    })
})

app.get("/futsal",async(req,res)=>{
    const response = await axios.get(base_url+"/futsal");
    res.render("home_user",{
        stadium:response.data
    })
})

app.get("/Bat",async(req,res)=>{
    const response = await axios.get(base_url+"/Bat");
    res.render("home_user",{
        stadium:response.data
    })
})

app.get("/home_user",async(req,res)=>{
    const response = await axios.get(base_url+"/stadiums");
    console.log(response);
    res.render("home_user",{
        stadium:response.data
    })

})

app.get("/forgetpassword",(req,res)=>{
    res.render("forgetassword")
})



app.post("/login",async(req,res)=>{
    console.log(req.body)
    const response = await axios.post(base_url+"/login",req.body);
    if(response.data.status){
           role = response.data.role;
           user = response.data.user;
        
        res.redirect("/home_user",{
            role,user
        })
    }else{
       res.render("alert",{
        status:false,
        message:"ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง!"
       })
    }
})

app.post("/forget",async(req,res)=>{
    console.log(req.body)
    const response = await axios.post(base_url+"/forget",req.body);
    if(response.data){
        res.redirect("/changPassword")
    }else{
       res.render("alert",{
        status:false,
        message:"ชื่อผู้ใช้งานหรือEmailไม่ถูกต้อง!"
       })
    }
})


//-------------------------------------------------------------------------

app.listen(PORT, () => {
    console.log('Sever started on post 5500');
});