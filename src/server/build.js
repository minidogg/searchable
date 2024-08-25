const fs = require("fs")
const path = require("path")
async function startBuild(){
    console.time("BuildCopy")
    const publicDir = path.resolve("./public")
    const buildDir = path.resolve("./build")
    if(fs.existsSync(buildDir))fs.rmSync(buildDir, {recursive: true})
    fs.mkdirSync(buildDir)
    fs.cpSync(publicDir, buildDir, {recursive: true})
    console.timeEnd("BuildCopy")

    console.time("BuildInject")

    console.timeEnd("BuildInject")
}
module.exports.startBuild = startBuild