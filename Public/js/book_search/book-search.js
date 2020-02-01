// import { object } from "joi";

// import { object } from "joi";

//search for books with title

$(document).ready(function () {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var result_JSON = JSON.parse(xhttp.response);

            if (Object.keys(result_JSON)[0] == "book_find") {

                if (result_JSON['book_find'] == 0) {
                    alert("no such book");
                }
                else {

                    for (i = 0; i < result_JSON['book_find'].length; i++) {
                        
                        book_tags = book_tags + '<div class="book-data" style="border-color: black ;border-width: 1px;border-style: solid;">' + `<img src="./images/logo.png"><h3>${Object.values(result_JSON['book_find'][i])[1]}</h3><h4>${Object.values(result_JSON['book_find'][i])[2]}</h4><h4>${Object.values(result_JSON['book_find'][i])[8]}</h4><div class="container"><div class="interior"><a class="btn" href="#open-modal${i}">more details</a></div></div></div>`;
                    }

                    for (j = 0; j < result_JSON['book_find'].length; j++) {
                        book_display = book_display + `<div id="open-modal${j}" class="modal-window"><div><a href="#" title="Close" class="modal-close">Close</a>`;
                        book_display = book_display + `  <img src=". /images/logo.png">`

                        for (i = 0; i < Object.keys(result_JSON['book_find'][1]).length; i++) {
                            book_display = book_display + `<h3>${Object.keys(result_JSON['book_find'][j])[i]} ${Object.values(result_JSON['book_find'][j])[i]}</h3>`;
                        }
                        book_display = book_display + "</div></div>";
                    }

                    $("body").html(book_tags + book_display);

                }



            }

        }
    }

    // //for updating range for edition
    // $("#slider").on('change',function () {
    //     $('#value_slider').html($('#slider').val());
    // })
    // $('#value_slider').html($("#slider").val())





});