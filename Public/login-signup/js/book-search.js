// import { object } from "joi";

// import { object } from "joi";

//search for books with title

$(document).ready(function () {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var result_JSON = JSON.parse(xhttp.response);

            if (Object.keys(result_JSON)[0] == "hint_find") {

                var suggestion_list = "";
                for (i = 0; i < Object.values(result_JSON)[0].length; i++) {

                    suggestion_list = suggestion_list.concat(`<option value=${Object.values(result_JSON)[0][i]}>`)
                    // suggestion_list = suggestion_list.concat(Object.values(result_JSON)[0][i]);

                }

                $("#suggestion").html(suggestion_list)

            }
            else if (Object.keys(result_JSON)[0] == "book_find") {
                if (result_JSON['book_find'] == 0) {
                    alert("no such book");
                }

                else {

                    var table = "<table>";
                    table += "<tr>";

                    for (j = 0; j < Object.values(result_JSON[0]).length; j++) {
                        table += "<th>";
                        table += Object.keys(result_JSON[0])[j];
                        table += "</th>";


                    }
                    table += "</tr>";

                    for (i = 0; i < result_JSON.length; i++) {
                        table = table + "<tr>";


                        for (j = 1; j < Object.values(result_JSON[i]).length; j++) {
                            table += "<td>";
                            table += Object.values(result_JSON[i])[j];
                            table += "</td>";
                        }

                        table += "</tr>";


                    }
                    table += "</table>";



                    $("#data_display").html(table);
                }
            }
        }
    }
    $("button").click(function () {
        var data = $("#search-book-title").val();
        xhttp.open("GET", "http://localhost:5400/mysql/api/book?title=" + data, true);
        xhttp.send();
    });


    $("input").keyup((e) => {
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
});