const cookieParser = require("cookie-parser")

const express = require('express')
const app = express()
const port = 3000
const path = require('path')

var codes = [
    ["admin","abcde",Date.now()+(60*1000*5)]
]
setInterval(()=>{
    let dateNow = Date.now()
    for(let i = 0;i<codes.length;i++){
        if(codes[i][2]<dateNow&&codes[i][1]!=="this code has been reset"){
            codes[i][1]="this code has been reset"
        }
    }
},5000)

const requiresCode = [
    "/game.html",
    "/game.js",
    "play.html",
    "play.js"
]
const forbiddenPage = path.join(__dirname,"/public/403.html")

app.use(cookieParser());



app.get("/code",(req,res)=>{
    if(req.query.code.length!==5){
        res.send("You managed to send an invalid code?!?!?!???!!?!?")
        return
    }
    if(!codes.find(e=>e[1]==req.query.code)){
        res.redirect("/index.html?invalidCode")
        return
    }
    res.cookie('code',req.query.code, { maxAge: 34560000, httpOnly: true });
    res.redirect("/game.html")
})

app.use(function (req, res, next) {
    if(!requiresCode.includes(req.path)&&!req.path.startsWith("/games")){
        next()
        return
    }
    // check if client sent cookie
    // res.cookie('cookieName',"a", { maxAge: 900000, httpOnly: true });
    var code = req.cookies.code
    if(code==undefined||!codes.find(e=>e[1]==code)){
        res.status(403)
        res.sendFile(forbiddenPage)
        return
    }
    // if (cookie === undefined) {
    //   // no: set a new cookie
    //   var randomNumber=Math.random().toString();
    //   randomNumber=randomNumber.substring(2,randomNumber.length);
    //   res.cookie('cookieName',randomNumber, { maxAge: 900000, httpOnly: true });
    //   console.log('cookie created successfully');
    // } else {
    //   // yes, cookie was already present 
    //   console.log('cookie exists', cookie);
    // } 
    next(); // <-- important!
});

app.get("/check",(req,res)=>{
    res.send(req.cookies.code==undefined||!codes.find(e=>e[1]==req.cookies.code))
})
app.use(express.static(path.join(__dirname,"/public")))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})