var scroll = { x: 0, y: 0, speedX: 3 / 60, speedY: 3 / 60 }
scroll.style = document.createElement("style")
document.body.appendChild(scroll.style)

setInterval(() => {
  scroll.x += scroll.speedX
  scroll.y += scroll.speedY

  scroll.x = scroll.x % 100
  scroll.y = scroll.y % 100

  scroll.style.innerHTML = `
  body{
    background-position:${scroll.x}vw ${scroll.y}vh;
  }
  `
}, 1000 / 60)
