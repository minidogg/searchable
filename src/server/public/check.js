setInterval(async()=>{
    let warning = "The code you were using has ran out!"
    let d = await fetch("./check")
    d = await d.text()
    if(d=="true"){
        try{
        document.getElementById("games").innerHTML = warning
        }catch{}
        try{
            document.getElementById("container").innerHTML = warning
        }catch{}
    }
},5000)