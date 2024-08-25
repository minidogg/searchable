document.getElementById("nav").innerHTML = `
    <img class="logo" src="img/logo.svg" onclick="window.location.assign('./')">
    ${location.pathname=="/game.html"?'<input placeholder="Search" type="text" class="searchBar" id="search">':""}
    <a href="game.html" style="margin:2vmin;">Games</a>
    <a href="login.html" style="margin:2vmin;">Admin Login</a>
`