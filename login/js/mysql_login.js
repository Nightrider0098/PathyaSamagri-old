// const path = require("path");
// const current_url = process.env.current_url;

function btn_signup() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
           // Typical action to be performed when the document is ready:
            document.getElementById("lol").innerHTML = xhttp.responseText;
            console.log(xhttp.responseText);
                  }
    };
    xhttp.open("GET", "http://localhost:5400/login", true);
    xhttp.send();    
}
