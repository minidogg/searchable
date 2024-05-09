(async () => {
  const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
  const gamesEl = document.getElementById("games")

  function quickEl(type,html,className,src="",parent=false){
    let el = document.createElement(type)
    el.innerHTML = html
    el.classList.add(className)
    el.src = src
    if(parent!==false)parent.appendChild(el)

    return el
  }
  async function addGame(name = "Placeholder", gameId = "placeholder", cover = "img/placeholderIcon.svg") {
    let game = document.createElement("div")
    // game.innerHTML = `      
    //   <img class="gameCover" src="img/placeholderIcon.svg">
    //   <span class="gameName">Game</span>
    // `
    game.classList.add("game")

    quickEl("img","","gameCover","img/placeholderIcon.svg",game)
    quickEl("span",name,"gameName","",game)

    game.querySelector("img").src = cover
    game.querySelector(".gameName").innerHTML = name
    game.onclick = ()=>{
      setTimeout(()=>{
        window.location.assign("./play.html?id="+encodeURIComponent(gameId))
      },250)
    }

    gamesEl.appendChild(game)
  }

  for(let i = 0;i<100;i++){
    addGame(genRanHex(5))
  }

  const search = document.getElementById("search")
  setInterval(()=>{
    let searchValue = search.value.toLowerCase()
    Array.from(gamesEl.children).forEach(el=>{
      let name = el.querySelector("span").textContent.toLowerCase()
      el.style.display=name.includes(searchValue)?"block":"none"
    })
  },500)
})()