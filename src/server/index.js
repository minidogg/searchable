const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser")
const crypto = require("crypto");

const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const fs = require("fs");
var admins = {}
var sessions = {}


if(!fs.existsSync("./admins.json")){
    fs.writeFileSync("admins.json", JSON.stringify(
    {
        "admin":{
          "password": "21232f297a57a5a743894a0e4a801fc3", //md5 hash
        }
    }
    ),"utf-8")
}
admins = JSON.parse(fs.readFileSync("./admins.json","utf-8"))
setInterval(()=>{
    fs.writeFileSync("./admins.json",JSON.stringify(admins),"utf-8")
},2000)

console.log(crypto.createHash('md5').update("password").digest('hex'))


setInterval(() => {
    let dateNow = Date.now();
    for(let i = 0;i<Object.keys(sessions).length;i++){
        if(sessions[Object.keys(sessions)[i]].expires < dateNow&&sessions[Object.keys(sessions)[i]].code!=""){
            sessions[Object.keys(sessions)[i]].code = ""
        }
    }
}, 5000);

const requiresCode = ["/game.html", "/game.js", "play.html", "play.js"];
const forbiddenPage = path.join(__dirname, "/public/403.html");

app.use(cookieParser());
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.get("/code", (req, res) => {
    if (req.query.code.length !== 5) {
        res.send("You managed to send an invalid code?!?!?!???!!?!?");
        return;
    }
    if (!Object.entries(sessions).find((e) => e[1].code == req.query.code)) {
        res.redirect("/index.html?invalidCode");
        return;
    }
    res.cookie("code", req.query.code, { maxAge: 34560000, httpOnly: true });
    res.redirect("/game.html");
});

app.post("/dashboard",(req,res)=>{
    if(typeof(req.body.admin)!== "string" || typeof(req.body.password)!== "string"){
        res.send("Body entries must be strings!")
    }
    var password = crypto.createHash('md5').update(req.body.password).digest('hex')
    
    if(typeof(admins[req.body.admin])!=="undefined"&&admins[req.body.admin]["password"] === password){
        var token = crypto.randomBytes(16).toString("hex");
        sessions[token] = {name:req.body.admin,code:"",expires:Date.now()}
        res.cookie("token", token, { maxAge: 34560000, httpOnly: true })
        res.redirect("/dashboard.html")
    }else{
        res.redirect("/login.html")
    }
})

app.get("/dashboard",(req,res)=>{
    res.redirect("/dashboard.html")
})
app.get("/adminSession",(req,res)=>{
    if(typeof(sessions[req.cookies.token])!=="undefined")res.send(JSON.stringify(sessions[req.cookies.token]))
})

app.use(function (req, res, next) {
    if (!requiresCode.includes(req.path) && !req.path.startsWith("/games")) {
        next();
        return;
    }
    var code = req.cookies.code;
    if (code == undefined || !Object.entries(sessions).find((e) => e[1].code == code)) {
        res.status(403);
        res.sendFile(forbiddenPage);
        return;
    }
    next(); // <-- important!
});
app.use(function (req, res, next) {
    if (!req.path.startsWith("/dashboard") ){
        next();
        return;
    }
    var token = req.cookies.token;
    if (token==undefined||!sessions[token]) {

        res.redirect("/login.html")
        return;
    }
    next(); // <-- important!
});

app.get("/check", (req, res) => {
    res.send(
        req.cookies.code == undefined ||
            !Object.entries(sessions).find((e) => e[1].code == req.cookies.code),
    );
});

const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
app.get("/newCode", (req, res) => {
    if(typeof(sessions[req.cookies.token])=="undefined"){
        res.send("no perms L")
        return
    }
    sessions[req.cookies.token].code = genRanHex(5)
    console.log(req.query)
    sessions[req.cookies.token].expires = parseFloat(req.query.expires)
    res.send(sessions[req.cookies.token].code)
});
app.use(express.static(path.join(__dirname, "/public")));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
