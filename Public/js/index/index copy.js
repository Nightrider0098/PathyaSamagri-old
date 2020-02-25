
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



                        for (i = 0; i < result_JSON['book_find'].length; i++) {
                            if (result_JSON['book_find'][i]['available_now'] == 0){
                                book_tags = book_tags + '<div class="book-data shadow-box" style="opacity: 0.7; border-color: red ;display:flex;flex-direction: column;max-width:300px;border-width: 1px;border-style: solid;">' 
                                if (result_JSON['book_find'][i]['book_anom'] == 0)
                                    book_tags = book_tags + `<img style="margin: 0 auto 10px auto; max-width: 180px" src="images/books/${result_JSON['book_find'][i]['img_id']}">`
                                else
                                    book_tags = book_tags + `<img style="margin: 0 auto 10px auto; max-width: 180px" src="images/anom_user/${result_JSON['book_find'][i]['img_id']}">`
                                book_tags = book_tags + `   
                                
                        <h3>${Object.values(result_JSON['book_find'][i])[1]}</h3>
                        <h4>${Object.values(result_JSON['book_find'][i])[2]}</h4>
                        <h4 style="font-family:impact" >Price:- Rs   ${Object.values(result_JSON['book_find'][i])[13]}</h4>
                        
                        <h4>For:- ${Object.values(result_JSON['book_find'][i])[8]}</h4>
                        <div class="container">
                        <div class="interior">
                        <a class="btn a-link" href="#open-modal${i}">more details</a>
                        </div>
                        </div>
                        </div>`;
                        }else{
                                book_tags = book_tags + '<div class="book-data shadow-box" style="border-color: black ;max-width:300px;border-width: 1px;display:flex;flex-direction: column;border-style: solid;">' 
                                if (result_JSON['book_find'][i]['book_anom'] == 0)
                                book_tags = book_tags + `<img style="margin: 0 auto 10px auto; max-width: 180px" src="images/books/${result_JSON['book_find'][i]['img_id']}">`
                            else
                                book_tags = book_tags + `<img style="margin: 0 auto 10px auto; max-width: 180px" src="images/anom_user/${result_JSON['book_find'][i]['img_id']}">`
                            book_tags = book_tags +   `
                        <h3>${Object.values(result_JSON['book_find'][i])[1]}</h3>
                        <h4>${Object.values(result_JSON['book_find'][i])[2]}</h4>
                        <h4 style="font-family:impact" >Price:- Rs   ${Object.values(result_JSON['book_find'][i])[13]}</h4>
                        
                        <h4> For:- ${Object.values(result_JSON['book_find'][i])[8]}</h4>
                        <div class="container">
                        <div class="interior">
                        <a class="btn a-link" href="#open-modal${i}">more details</a>
                        </div>
                        </div>
                        </div>`;
                        }}
                        //for each books
                        for (j = 0; j < result_JSON['book_find'].length; j++) {
                            book_display = book_display + `
                    <div class="bg-wrapper " id="open-modal${j}">
                    <div class="wrapper" >
                    
                    <div class="close-holder">
                        <a href="#close-book${j}"   title="Close" class="modal-close a-link"><i class="fas fa-times" title="close">close</i></a>
                    <a class='close-wrapper' id='close-book${j}' ></a>
                        </div>
            
                    <div class="data-flexbox">
                    <div class="img-wrapper">
                    <img style="max-width:100%" src="images/books/${result_JSON['book_find'][j]['img_id']}" alt="never mine">
                    </div>

                    <div class="text-data-container" >`;

                            for (i = 0; i < Object.keys(result_JSON['book_find'][0]).length; i++) {
                                if (i == 5 || i == 10 || i == 11)
                                    continue;
                                book_display = book_display + `<div class="book-chr-holder">
                        <h3 class="keys">${Object.keys(result_JSON['book_find'][j])[i]}</h3>
                        <h3 class="values">${Object.values(result_JSON['book_find'][j])[i]}</h3>
                    </div>`;
                            }

                            book_display = book_display + `
                    <div class='book-chr-holder'>
                    <div class="button-holder">
                    
                    <form class="btn-frm" action='/mysql/book_booked' method="GET">
                    <input type="text" name="book_id" hidden value="${Object.values(result_JSON['book_find'][j])[0]}">
                    <button  type="submit" id="book${j}" class="learn-more new-btn btn-1">
                    <span class="circle" aria-hidden="true">
                    <span class="icon arrow">
                    </span>
                    </span>
                    <span class="button-text">Confirm</span>
                    </button>
                    </form>
                    
                    </div>
                    </div>
                    </div>
                    </div>
                    </div>
                    </div>`;
                        }

                        $("#book-data-holders").html(book_tags + book_display);
                    }
                }
            }            //for initailly loading books details into html
            else if (Object.keys(result_JSON)[0] == "recent_books") {
                book_tags = '';
                book_display = '';


                for (i = 0; i < result_JSON['recent_books'].length; i++) {
                    if (result_JSON['recent_books'][i]['available_now'] == 0) {
                        book_tags = book_tags + `<div class="book-data shadow-box" style="opacity: 0.7;border-color: red ;display:flex;flex-direction: column;max-width:300px; margin: 20px auto 0 auto ; border-width: 1px;border-style: solid;">`
                        if (result_JSON['recent_books'][i]['book_anom'] == 0)
                            book_tags = book_tags + `<img style="margin: 0 auto 10px auto; max-width: 180px" src="images/books/${result_JSON['recent_books'][i]['img_id']}">`
                        else
                            book_tags = book_tags + `<img style="margin: 0 auto 10px auto; max-width: 180px" src="images/anom_user/${result_JSON['recent_books'][i]['img_id']}">`
                        book_tags = book_tags + `
                       <h3>${Object.values(result_JSON['recent_books'][i])[1]}</h3>
                        <h4>${Object.values(result_JSON['recent_books'][i])[2]}</h4>
                        <h4 style="font-family:impact" >Price:- Rs   ${Object.values(result_JSON['recent_books'][i])[13]}</h4>
                        
                        <h4>For:- ${Object.values(result_JSON['recent_books'][i])[8]}</h4>
                        
                        <div class="container">
                        <div class="interior">
                        <a class="btn a-link" href="#open-modal${i}">more details</a>
                        </div>
                        </div>
                        </div>`;
                    }
                    else
{                        book_tags = book_tags + '<div class="book-data shadow-box" style="border-color: black ;display:flex;flex-direction: column;max-width:300px; margin: 20px auto 0 auto; border-width: 1px;border-style: solid;">' 
                        if (result_JSON['recent_books'][i]['book_anom'] == 0)
                            book_tags = book_tags + `<img style="margin: 0 auto 10px auto; max-width: 180px" src="images/books/${result_JSON['recent_books'][i]['img_id']}">`
                        else
                            book_tags = book_tags + `<img style="margin: 0 auto 10px auto; max-width: 180px" src="images/anom_user/${result_JSON['recent_books'][i]['img_id']}">`
                        book_tags = book_tags + `
                        <h3>${Object.values(result_JSON['recent_books'][i])[1]}</h3>
                        <h4>${Object.values(result_JSON['recent_books'][i])[2]}</h4>
                        <h4 style="font-family:impact" >Price:- Rs   ${Object.values(result_JSON['recent_books'][i])[13]}</h4>
                        
                        <h4>For:- ${Object.values(result_JSON['recent_books'][i])[8]}</h4>
                        <div class="container">
                        <div class="interior">
                        <a class="btn a-link" href="#open-modal${i}">more details</a>
                        </div>
                        </div>
                        </div>`;
                                   }                   }
                    //for each books
                    for (j = 0; j < result_JSON['recent_books'].length; j++) {
                        book_display = book_display + `
                    <div class="bg-wrapper" id="open-modal${j}" >
                    <div class="wrapper"  style="calc" >
                    
                    <div class="close-holder">
                        <a href="#close-book${j}"   title="Close" class="modal-close a-link"><i class="fas fa-times" title="close">close</i></a>
                    <a class='close-wrapper' id='close-book${j}' ></a>
                        </div>
            
                    <div class="data-flexbox">
                    <div class="img-wrapper">
                    `
                        if (result_JSON['recent_books'][j]['book_anom'] == 1)
                            book_display = book_display +

                                `<img src="images/anom_user/${result_JSON['recent_books'][j]['img_id']}">`
                        else
                            book_display = book_display +

                                `<img src="images/books/${result_JSON['recent_books'][j]['img_id']}">`

                        book_display = book_display + `
                    </div>

                    <div class="text-data-container">`;

                        for (i = 0; i < Object.keys(result_JSON['recent_books'][0]).length; i++) {
                            if (i == 5 || i == 10 || i == 11)
                                continue;
                            book_display = book_display + `<div class="book-chr-holder">
                        <h3 class="keys">${Object.keys(result_JSON['recent_books'][j])[i]}</h3>
                        <h3 class="values">${Object.values(result_JSON['recent_books'][j])[i]}</h3>
                    </div>`;
                        }

                        book_display = book_display + `
                    <div class='book-chr-holder'>
                    <div class="button-holder">
                    
                        <form class="btn-frm" action='/mysql/book_booked' method="GET">
                        <input type="text" name="book_id" hidden value="${Object.values(result_JSON['recent_books'][j])[0]}">
                        <button  type="submit" id="book${j}" class="learn-more new-btn btn-1">
                        <span class="circle" aria-hidden="true">
                        <span class="icon arrow">
                        </span>
                        </span>
                        <span class="button-text">Confirm</span>
                        </button>
                        </form>
                        
                    </div>
                    </div>
                    </div>
                    </div>
                    </div>
                    </div>`;
                    }

                    $("#book-data-holders").html(book_tags + book_display);
console.log("completed");

                }

            }
        }
        xhttp.open("GET", "http://" + window.location.host + "/mysql/recent_books1", true);
        xhttp.send();


        var book_index = 0;
        var Srch_Box = 0;
        $("#book_search-button").click(function () {
            var data = $("#search-book-title").val();
            Srch_Box = 1;
            book_index = 0;
            xhttp.open("GET", "http://" + window.location.host + "/mysql/api/book1?title=" + encodeURI(data) + "&limit=0", true);
            xhttp.send();

            book_index = book_index + 12;
            console.log("http://" + window.location.host + "/mysql/api/book1?title=" + encodeURI(data) + "&limit=0");
        });


        $("#search-book-title").keyup((e) => {
            if (e.keyCode == 13) {
                var data = $("#search-book-title").val();
                Srch_Box = 1;

                book_index = 0;
                xhttp.open("GET", "http://" + window.location.host + "/mysql/api/book1?title=" + encodeURI(data) + "&limit=0 ", true);
                xhttp.send();

                book_index = book_index + 12;
            }
            else {

                var input_string = $("input").val();
                xhttp.open("GET", "http://" + window.location.host + "/mysql/api/book1/hint?title=" + input_string, true);
                xhttp.send();
            }
        });

        //loading next book content
        $("#next").on('click', () => {
            book_index = book_index + 12;
            xhttp.open("GET", "http://" + window.location.host + "/mysql/recent_books1?index=" + book_index, true);
            xhttp.send();

        });

        $("#previous").on('click', () => {
            if (book_index >= 12) {
                book_index = book_index - 12;
                xhttp.open("GET", "http://" + window.location.host + "/mysql/recent_books1?index=" + book_index, true);
                xhttp.send();
            }
            else { alert("reached starting index"); }

        });




    })
