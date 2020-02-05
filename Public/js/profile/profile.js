
$(document).ready(function () {

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            var result_JSON = JSON.parse(xhttp.response);
            var book_tags = '',
                book_display = '';

            var username = result_JSON['username'];
            var book_issued = result_JSON['book_issued'];
            //label fill ups
            if (result_JSON['book_donated'] == null)
                $("#lb-donated-book-num").text("0");
            else
                $("#lb-donated-book-num").text(result_JSON['book_donated']);

            $("#lb-user-name").text(username);
            $("#lb-book-issue").text(result_JSON['book_issued']);
            $("#lb-user-email").text(result_JSON['email']);
            $("#lb-user-address").text(result_JSON['address']);
            $("#lb-user-phone").text(result_JSON['phone_no']);

            console.log(result_JSON);
            if (Object.keys(result_JSON)[0] == "user_books") {
                //for each book
                for (i = 0; i < result_JSON['user_books'].length; i++) {
                    if (result_JSON['user_books'][i]['available_now'] == 0)
                        book_tags = book_tags + '<div class="book-data shadow-box" style="border-color: red ;border-width: 1px;border-style: solid;">' + `<img src="./images/logo.png"><h3>${Object.values(result_JSON['user_books'][i])[1]}</h3><h4>${Object.values(result_JSON['user_books'][i])[2]}</h4><h4>${Object.values(result_JSON['user_books'][i])[8]}</h4><div class="container"><div class="interior"><a class="btn" href="#open-modal${i}">more details</a></div></div></div>`;
                    else
                        book_tags = book_tags + '<div class="book-data shadow-box" style="border-color: black ;border-width: 1px;border-style: solid;">' + `<img src="./images/logo.png"><h3>${Object.values(result_JSON['user_books'][i])[1]}</h3><h4>${Object.values(result_JSON['user_books'][i])[2]}</h4><h4>${Object.values(result_JSON['user_books'][i])[8]}</h4><div class="container"><div class="interior"><a class="btn" href="#open-modal${i}">more details</a></div></div></div>`;
                }
                //for popup of each book
                for (j = 0; j < result_JSON['user_books'].length; j++) {
                    book_display = book_display + `<div id="open-modal${j}" class="modal-window"><div><a href="#" title="Close" class="modal-close">Close</a>`;
                    book_display = book_display + `  <img src=". /images/logo.png">`

                    for (i = 0; i < Object.keys(result_JSON['user_books'][1]).length; i++) {
                        book_display = book_display + `<h3>${Object.keys(result_JSON['user_books'][j])[i]} ${Object.values(result_JSON['user_books'][j])[i]}</h3>`;
                        //to buttons for upadate and remove query

                    }
                    book_display = book_display + `<form action='/book_edit' method='GET'><input type="text" name= "book_id" value='${Object.values(result_JSON['user_books'][j])[0]}' hidden><button type='submit'>update</button></form><form action='/mysql/delete/${result_JSON['user_books'][j]['title']}' method='DELETE'><button type='submit' >delete</button></form>`

                    book_display = book_display + "</div></div>";
                }
                $("#book-data-holders").html(book_tags + book_display);

            }
            else if (Object.keys(result_JSON)[0] == "user_noti") {
                if (result_JSON['user_noti'] == '{}'){
                console.log(result_JSON['user_noti']);
                $("#noti_tab").html("\nno new notification");
                }
                else
                $("#noti_tab").html("\n"+result_JSON['user_noti'].split('\n'));}
                
                



        }
    }

    setTimeout(user_data, 100);
    setTimeout(user_data_1, 500);
    setTimeout(user_data_3, 900);

    setTimeout(user_data_2, 1200);

    function user_data_3() {
        xhttp.open("GET", "http://localhost:5400/mysql/user_books?index=0", true);
        xhttp.send();
    }

    function user_data() {
        xhttp.open("GET", "http://localhost:5400/user_noti", true)
        xhttp.send();
    }
    function user_data_1() {
        xhttp.open("GET", "http://localhost:5400/user_details", true)
        xhttp.send();
    }


    function user_data_2(){
        xhttp.open("GET", "http://localhost:5400/mysql/user_book_issued", true)
        xhttp.send();

    }
    var book_index = 0;
    //loading next book content
    $("#next").on('click', () => {
        book_index = book_index + 12;
        xhttp.open("GET", "http://localhost:5400/mysql/user_books?index=" + book_index, true);
        xhttp.send();
    });

    $("#previous").on('click', () => {
        if (book_index >= 12) {
            book_index = book_index - 12;
            xhttp.open("GET", "http://localhost:5400/mysql/user_books?index=" + book_index, true);
            xhttp.send();
        }
        else { alert("reached starting index"); }

    });


})