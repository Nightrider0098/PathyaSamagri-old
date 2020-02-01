
$(document).ready(function () {
    // var book_tags = '', book_display = '';
    var xhttp = new XMLHttpRequest();
    var req_bk = "";
    //request handler
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var result_JSON = JSON.parse(xhttp.response);
            var book_tags = '', book_display = '';
            //search hint list
            if (Object.keys(result_JSON)[0] == "hint_find") {

                var suggestion_list = "";
                for (i = 0; i < Object.values(result_JSON)[0].length; i++) {

                    suggestion_list = suggestion_list.concat(`<option value="${Object.values(result_JSON)[0][i]}">`)
                    // suggestion_list = suggestion_list.concat(Object.values(result_JSON)[0][i]);

                }

                $("#suggestion").html(suggestion_list)

            }
            //book search from search box
            else if (Object.keys(result_JSON)[0] == "book_find") {
                if (result_JSON['book_find'] == 0) {
                    alert("no such book");
                }
                else {

                    for (i = 0; i < result_JSON['book_find'].length; i++) {
                        if (result_JSON['book_find'][0]['available_now'] == 0)
                            book_tags = book_tags + '<div class="book-data" style="border-color: red ;border-width: 1px;border-style: solid;">' + `<img src="./images/logo.png"><h3>${Object.values(result_JSON['book_find'][i])[1]}</h3><h4>${Object.values(result_JSON['book_find'][i])[2]}</h4><h4>${Object.values(result_JSON['book_find'][i])[8]}</h4><div class="container"><div class="interior"><a class="btn" href="#open-modal${i}">more details</a></div></div></div>`;
                        else
                            book_tags = book_tags + '<div class="book-data" style="border-color: black ;border-width: 1px;border-style: solid;">' + `<img src="./images/logo.png"><h3>${Object.values(result_JSON['book_find'][i])[1]}</h3><h4>${Object.values(result_JSON['book_find'][i])[2]}</h4><h4>${Object.values(result_JSON['book_find'][i])[8]}</h4><div class="container"><div class="interior"><a class="btn" href="#open-modal${i}">more details</a></div></div></div>`;
                    }

                    for (j = 0; j < Object.keys(result_JSON['book_find']).length; j++) {

                        book_display = book_display + `<div id="open-modal${j}" class="modal-window"><div><a href="#"  title="Close" class="modal-close">Close</a>`;
                        book_display = book_display + `  <img src="./images/logo.png">`

                        for (i = 0; i < Object.keys(result_JSON['book_find'][1]).length; i++) {
                            book_display = book_display + `<h3>${Object.keys(result_JSON['book_find'][j])[i]} ${Object.values(result_JSON['book_find'][j])[i]}</h3>`;
                        }

                        book_display = book_display + "</div></div>";
                    }

                    $("#book-data-holders").html(book_tags + book_display);



                }
            }
            //for initailly loading books details into html
            else if (Object.keys(result_JSON)[0] == "recent_books") {
                book_tags = '';
                book_display = '';
                console.log(result_JSON);


                for (i = 0; i < result_JSON['recent_books'].length; i++) {
                    if (result_JSON['recent_books'][0]['available_now'] == 0)
                        book_tags = book_tags + '<div class="book-data shadow-box" style="border-color: red ;border-width: 1px;border-style: solid;">' + `<img src="./images/logo.png"><h3>${Object.values(result_JSON['recent_books'][i])[1]}</h3><h4>${Object.values(result_JSON['recent_books'][i])[2]}</h4><h4>${Object.values(result_JSON['recent_books'][i])[8]}</h4><div class="container"><div class="interior"><a class="btn" href="#open-modal${i}">more details</a></div></div></div>`;
                    else
                        book_tags = book_tags + '<div class="book-data shadow-box" style="border-color: black ;border-width: 1px;border-style: solid;">' + `<img src="./images/logo.png"><h3>${Object.values(result_JSON['recent_books'][i])[1]}</h3><h4>${Object.values(result_JSON['recent_books'][i])[2]}</h4><h4>${Object.values(result_JSON['recent_books'][i])[8]}</h4><div class="container"><div class="interior"><a class="btn" href="#open-modal${i}">more details</a></div></div></div>`;
                }

                for (j = 0; j < result_JSON['recent_books'].length; j++) {
                    book_display = book_display + `<div id="open-modal${j}" class="modal-window"><div><a href="#" title="Close" class="modal-close">Close</a>`;
                    book_display = book_display + `  <img src="images/logo.png">`

                    for (i = 0; i < Object.keys(result_JSON['recent_books'][1]).length; i++) {
                        book_display = book_display + `<h3>${Object.keys(result_JSON['recent_books'][j])[i]} ${Object.values(result_JSON['recent_books'][j])[i]}</h3>`;
                    }
                    book_display = book_display + `<form action='/mysql/book_booked' method='get' ><input hidden name='book_id' value="${Object.values(result_JSON['recent_books'][j])[0]}"><button type='submit' id='book${j}' class='fetch_details'>get the book</button></form></div></div>`;
                }

                $("#book-data-holders").html(book_tags + book_display);
                

            }

        }
    }
    xhttp.open("GET", "http://localhost:5400/mysql/recent_books", true);
    xhttp.send();


    $("#book_search-button").click(function () {
        var data = $("#search-book-title").val();
        xhttp.open("GET", "http://localhost:5400/mysql/api/book?title=" + data, true);
        xhttp.send();
    });


    $("#search-book-title").keyup((e) => {
        if (e.keyCode == 13) {
            var data = $("#search-book-title").val();
            xhttp.open("GET", "http://localhost:5400/mysql/api/book?title=" + data, true);
            xhttp.send();
        }
        else {

            var input_string = $("input").val();
            xhttp.open("GET", "http://localhost:5400/mysql/api/book/hint?title=" + input_string, true);
            xhttp.send();
        }
    });

    var book_index = 0;
    $("#next").on('click', () => {
        book_index = book_index + 12;
        xhttp.open("GET", "http://localhost:5400/mysql/recent_books?index=" + book_index, true);
        xhttp.send();
    });




})

