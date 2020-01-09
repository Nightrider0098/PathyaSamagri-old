function perform() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.status == 200 && xhr.readyState == 4) {
            document.getElementById("all_books").innerHTML = xhr.response;
        }

    }
    var owner_name = document.getElementById("owner_id").value;
    xhr.open("GET", "http://localhost:5400/mongoose/user_book?owner_id=" + owner_name, true);
    xhr.send();
}

var input = document.getElementById("owner_id");

// Execute a function when the user releases a key on the keyboard
input.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("submit").click();
  }
});