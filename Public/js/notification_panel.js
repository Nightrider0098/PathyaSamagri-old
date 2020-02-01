
$(document).ready(function () {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
        
        ready_JSON = JSON.parse(xhttp.response);
if(Object.keys(ready_JSON)[0]=='messages');
console.log(ready_JSON);
        }
    }
xhttp.open("GET","/notif_user",true);
xhttp.send();



});



