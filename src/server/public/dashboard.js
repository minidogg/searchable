(async () => {
  const srcUrl = window.location.host
  const linkEl = document.getElementById("link")
  const invalidEl = document.getElementById("invalidate")
  const newEl = document.getElementById("new")
  const minuteValueEl = document.getElementById("minuteValue")
  const usernameEl = document.getElementById("username")

  var session = {}
  async function updateDashboard(){
    session = await fetch("./adminSession")
    session = await session.json()

    usernameEl.textContent = session.name
    linkEl.textContent = session.code
  }
  updateDashboard()
  
  newEl.onclick = async ()=>{
    await fetch("./newCode")
    
    updateDashboard()
  }
})()
