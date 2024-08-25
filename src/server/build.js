const fs = require("fs")
const path = require("path")
const util = require("util")

let readFileAsync = util.promisify(fs.readFile)
async function startBuild(){
    console.time("BuildCopy")
    const publicDir = path.resolve("./public")
    const buildDir = path.resolve("./build")
    if(fs.existsSync(buildDir))fs.rmSync(buildDir, {recursive: true})
    fs.mkdirSync(buildDir)
    fs.cpSync(publicDir, buildDir, {recursive: true})
    console.timeEnd("BuildCopy")

    console.time("BuildInject")
    let buildPromises = fs.readdirSync(buildDir, {recursive: true}).map((relativeFilePath)=>{
        return new Promise(async(r)=>{
            try{
                let filePath = path.join(buildDir, relativeFilePath)
                let extName = path.extname(relativeFilePath)
                let fileData = await readFileAsync(filePath, "utf-8")
                switch(extName){
                    case(".html"):
                            fileData = fileData.replace("<!-- INJECT_NAV -->", `
                            <div id="nav">
                            <img class="logo" src="img/logo.svg" onclick="window.location.assign('./')">
                            ${filePath=="game.html"?'<input placeholder="Search" type="text" class="searchBar" id="search">':""}
                            <a href="game.html" style="margin:2vmin;">Games</a>
                            <a href="login.html" style="margin:2vmin;">Admin Login</a>
                            </nav>
                        `)
                        if(relativeFilePath=="game.html"){

                        }
                        break;
                    default:
                        break;
                }

                fs.writeFileSync(filePath, fileData)
                console.log(relativeFilePath+" completed")
                r("Success")
            }catch(err){
                // console.warn(err)

                console.log(relativeFilePath+" failed")
                r("Fail")
            }

        })
    })
    await Promise.all(buildPromises)

    console.timeEnd("BuildInject")
}
module.exports.startBuild = startBuild