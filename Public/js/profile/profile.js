
$(document).ready(function () {

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            var result_JSON = JSON.parse(xhttp.response)
            var book_tags = '',
                book_display = '';

            var data__ = '';


            if (Object.keys(result_JSON)[0] == "user_books") {
                if (result_JSON['user_books'].length == 0) {
                    alert("No more books found");
                }
                else {

                    for (i = 0; i < result_JSON['user_books'].length; i++) {
                        if (result_JSON['user_books'][i]['available_now'] == 0)
                            book_tags = book_tags + '<div class="book-data shadow-box" style="border-color: red ; max-width: 300px;margin:20px auto auto auto;border-width: 1px;border-style: solid; display:flex;flex-direction:column;">'
                        else {
                            book_tags = book_tags + '<div class="book-data shadow-box" style="border-color: black ; max-width: 300px;margin:20px auto auto auto;border-width: 1px;border-style: solid; display:flex;flex-direction:column;">'
                        }
                        book_tags = book_tags + `<img style="margin: 0 auto 10px auto;max-width: 180px;" src="images/books/${result_JSON['user_books'][i]['img_id']}">
                    <h3>${Object.values(result_JSON['user_books'][i])[1]}</h3>
                    <h4>${Object.values(result_JSON['user_books'][i])[2]}</h4>
                    <h4>${Object.values(result_JSON['user_books'][i])[8]}</h4>
                    <div class="container">
                    <div class="interior">
                    <a class="btn a-link" href="#open-modal${i}">more details</a>
                    </div>
                    </div>
                    </div>`;
                    }
                    //for each books
                    for (j = 0; j < result_JSON['user_books'].length; j++) {
                        book_display = book_display + `
            <div class="bg-wrapper " id="open-modal${j}">
            <div class="wrapper" >
            
            <div class="close-holder">
                <a href="#close-book${j}"   title="Close" class="modal-close a-link"><i class="fas fa-times" title="close">close</i></a>
            <a class='close-wrapper' id='close-book${j}' ></a>
                </div>
    
            <div class="data-flexbox">
            <div class="img-wrapper">
            <img style="max-width:100%" src="./logo.jpg" alt="never mine">
            </div>

            <div class="text-data-container" >`;

                        for (i = 0; i < Object.keys(result_JSON['user_books'][0]).length; i++) {
                            book_display = book_display + `<div class="book-chr-holder">
                            <h3 class="keys">${Object.keys(result_JSON['user_books'][j])[i]}</h3>
                            <h3 class="values">${Object.values(result_JSON['user_books'][j])[i]}</h3>
                            </div>`;
                        }

                        book_display = book_display + `
            <div class='book-chr-holder'>
            <div class="button-holder">
            
            <form class="btn-frm" action='/book_edit' method="GET">
            <input type="text" name="book_id" hidden value="${Object.values(result_JSON['user_books'][j])[0]}">
            <button  type="submit" id="book${j}" class="learn-more new-btn btn-1">
            <span class="circle" aria-hidden="true">
            <span class="icon arrow">
            </span>
            </span>
            <span class="button-text">Edit</span>
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
            else if (Object.keys(result_JSON)[0] == "issued_books") {
                book_tags = '';
                book_display = "";

                if (result_JSON['issued_books'].length == 0) {
                    return alert("No more books found");
                }
                else {
                    for (i = 0; i < result_JSON['issued_books'].length; i++) {
                        if (result_JSON['issued_books'][i]['available_now'] == 0)

                            book_tags = book_tags + '<div class="book-data shadow-box" style="border-color: red ; max-width: 300px;margin:20px auto auto auto;border-width: 1px;border-style: solid; display:flex;flex-direction:column;">';
                        else book_tags = book_tags + '<div class="book-data shadow-box" style="border-color: black ; max-width: 300px;margin:20px auto auto auto;border-width: 1px;border-style: solid; display:flex;flex-direction:column;">';

                        book_tags = book_tags + `<img style="margin: 0 auto 10px auto; max-width: 180px; " src="images/books/${result_JSON['issued_books'][i]['img_id']}">
                                <h3>${Object.values(result_JSON['issued_books'][i])[1]}</h3>
                                <h4>${Object.values(result_JSON['issued_books'][i])[2]}</h4>
                                <h4>${Object.values(result_JSON['issued_books'][i])[8]}</h4>
                                <div class="container">
                                <div class="interior">
                                <a class="btn a-link" href="#open-modal-issued${i}">more details</a>
                                </div>
                                </div>
                                </div>`;
                    }

                    //for each books
                    for (j = 0; j < result_JSON['issued_books'].length; j++) {
                        book_display = book_display + `
            <div class="bg-wrapper " id="open-modal-issued${j}">
            <div class="wrapper" >
            
            <div class="close-holder">
                <a href="#close-book${j}"   title="Close" class="modal-close a-link"><i class="fas fa-times" title="close">close</i></a>
            <a class='close-wrapper' id='close-book${j}' ></a>
                </div>
    
            <div class="data-flexbox">
            <div class="img-wrapper">
            <img style="max-width:100%" src="./logo.jpg" alt="never mine">
            </div>

            <div class="text-data-container" >`;

                        for (i = 0; i < Object.keys(result_JSON['issued_books'][0]).length; i++) {
                            if (i == 5 || i==10 || i == 11)
                            continue;
                         book_display = book_display + `<div class="book-chr-holder">
                <h3 class="keys">${Object.keys(result_JSON['issued_books'][j])[i]}</h3>
                <h3 class="values">${Object.values(result_JSON['issued_books'][j])[i]}</h3>
            </div>`;
                        }

                        book_display = book_display + `
            <div class='book-chr-holder'>
            <div class="button-holder">
            
            <form class="btn-frm" action='/mysql/book_booked' method="GET">
            <input type="text" name="book_id" hidden value="${Object.values(result_JSON['issued_books'][j])[0]}">
            <button  type="submit" id="book${j}" class="learn-more new-btn btn-1">
            <span class="circle" aria-hidden="true">
            <span class="icon arrow">
            </span>
            </span>
            <span class="button-text">Owner Details</span>
            </button>
            </form>
            
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>`;
                    }



                    $("#doner-books").html(book_tags + book_display);

                }
            }
            else if (Object.keys(result_JSON)[0] == "user_noti") {
                var noti_for_issue = "", text = '';
                if (result_JSON['user_noti'] == '{}') {

                    $("#noti_tab").html("\n no new notification");
                }
                else
                    for (i = result_JSON['user_noti'].split("\n").length - 1; i >= 0; i--) {
                        text = text + `<div class="noti-indiv" id="noti_${i}">
                <div class="text-noti-indiv">${result_JSON['user_noti'].split("\n")[i]}</div>
                <a  onclick="Close(noti_${i});" class="close-link"><i class="far fa-times-circle"></i></a>
            </div>`


                    }
                $("#noti_tab").html(text);
            }
        }
    }
    setTimeout(user_data, 100);
    setTimeout(user_data_3, 900);
    setTimeout(user_data_2, 500);

    function user_data_3() {
        xhttp.open("GET", "http://localhost:5400/mysql/user_books?index=0", true);
        xhttp.send();
    }

    function user_data() {
        xhttp.open("GET", "http://localhost:5400/user_noti", true)
        xhttp.send();
    }


    function user_data_2() {
        xhttp.open("GET", "http://localhost:5400/mysql/user_book_issued?index=0", true)
        xhttp.send();
        console.log("send");
    }


    var donated_book_index = 0;
    var issued_book_index = 0;
    //loading next book content
    $("#next").on('click', () => {
        donated_book_index = donated_book_index + 12;
        xhttp.open("GET", "http://localhost:5400/mysql/user_books?index=" + donated_book_index, true);
        xhttp.send();
    });

    $("#previous").on('click', () => {
        if (donated_book_index >= 12) {
            donated_book_index = donated_book_index - 12;
            xhttp.open("GET", "http://localhost:5400/mysql/user_books?index=" + donated_book_index, true);
            xhttp.send();
        }
        else { alert("reached starting index"); }

    });

    $("#next_doner").on('click', () => {
        issued_book_index = issued_book_index + 12;
        xhttp.open("GET", "http://localhost:5400/mysql/user_book_issued?index=" + issued_book_index, true);
        xhttp.send();
    });

    $("#previous_doner").on('click', () => {
        if (issued_book_index >= 12) {
            issued_book_index = issued_book_index - 12;
            xhttp.open("GET", "http://localhost:5400/mysql/user_book_issued?index=" + issued_book_index, true);
            xhttp.send();
        }
        else { alert("reached starting index"); }

    });





})