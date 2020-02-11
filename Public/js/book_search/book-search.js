
$(document).ready(function () {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // var result_JSON = JSON.parse(xhttp.response);
            var book_tags = ''
            var book_display = ''
            result_JSON = JSON.parse(xhttp.response)
            if (Object.keys(result_JSON)[0] == "book_find") {
                if (result_JSON['book_find'] == 0) {
                    alert("no such book");
                }
                else {

                    for (i = 0; i < result_JSON['book_find'].length; i++) {
                        if (result_JSON['book_find'][i]['available_now'] == 0)
                            book_tags = book_tags + '<div class="book-data shadow-box" style="border-color: red;margin:auto; min-width:200px; width:26%; border-width: 1px; border-style: solid;">' +
                                `<img src="./images/logo.png">
                        <h3>${Object.values(result_JSON['book_find'][i])[1]}</h3>
                        <h4>${Object.values(result_JSON['book_find'][i])[2]}</h4>
                        <h4>${Object.values(result_JSON['book_find'][i])[8]}</h4>
                        <div class="container">
                        <div class="interior">
                        <a class="btn a-link" href="#open-modal${i}">more details</a>
                        </div>
                        </div>
                        </div>`;
                        else
                            book_tags = book_tags + '<div class="book-data shadow-box" style="border-color: black ;margin:auto;border-width: 1px;min-width:200px;width:26%;border-style: solid;">' +
                                `<img src="./images/logo.png">
                        <h3>${Object.values(result_JSON['book_find'][i])[1]}</h3>
                        <h4>${Object.values(result_JSON['book_find'][i])[2]}</h4>
                        <h4>${Object.values(result_JSON['book_find'][i])[8]}</h4>
                        <div class="container">
                        <div class="interior">
                        <a class="btn a-link" href="#open-modal${i}">more details</a>
                        </div>
                        </div>
                        </div>
                        `;
                    }
                    book_tags = book_tags + "<button type='button' id='next'>next</button>"

                    //for each books
                    var book_display = '';
                    for (j = 0; j < result_JSON['book_find'].length; j++) {
                        book_display = book_display + `
                    <div class="bg-wrapper">
                    <div class="wrapper" id="open-modal${j}">
                    
                    <div class="close-holder">
                        <a href="#close-book${j}"   title="Close" class="modal-close a-link"><i class="fas fa-times" title="close">close</i></a>
                    <a class='close-wrapper' id='close-book${j}' ></a>
                        </div>
            
                    <div class="data-flexbox">
                    <div class="img-wrapper">
                    <img style="max-width:100%" src="./logo.jpg" alt="never mine">
                    </div>

                    <div class="text-data-container">`;

                        for (i = 0; i < Object.keys(result_JSON['book_find'][0]).length; i++) {
                            book_display = book_display + `<div class="book-chr-holder">
                        <h3 class="keys">${Object.keys(result_JSON['book_find'][j])[i]}</h3>
                        <h3 class="values">${Object.values(result_JSON['book_find'][j])[i]}</h3>
                    </div>`;
                        }

                        book_display = book_display + `
                    <div class='book-chr-holder'>
                    <div class="button-holder">
                    
                    <form class="btn-frm" action='/mysql/book_booked' method="GET">
                    <input type="text" name="book_id" style="display:none" hidden value="${Object.values(result_JSON['book_find'][j])[0]}">
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



                    $("#book-data").html(book_tags);
                    $("body").html($("body").html() + book_display);
                    // console.log(book_display)
                }



            }
        }



        // //for updating range for edition
        // $("#slider").on('change',function () {
        //     $('#value_slider').html($('#slider').val());
        // })
        // $('#value_slider').html($("#slider").val())




    }




    $('#search-book').on('click', () => {
        var json_request = '';
        mam = "&";
        index_ = 0;
        for (p = 0; p < Object.keys($('#frm-book-data').serializeArray()).length; p = p + 1) {
            json_request = json_request + encodeURI($('#frm-book-data').serializeArray()[p]['name']) + "=" + encodeURI($('#frm-book-data').serializeArray()[p]['value']) + mam;
        }
        xhttp.open("POST", "/mysql/advance_search", true);

        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(json_request + "index=0")
        // console.log('sen');

    })



    $('#next').on('click', () => {
        var json_request = '';
        mam = "&";
        console.log(index_);
        index_ = index_ + 12;
        for (p = 0; p < Object.keys($('#frm-book-data').serializeArray()).length; p = p + 1) {
            json_request = json_request + encodeURI($('#frm-book-data').serializeArray()[p]['name']) + "=" + encodeURI($('#frm-book-data').serializeArray()[p]['value']) + mam;
        }
        json_request = json_request + "index=" + index_
        xhttp.open("POST", "/mysql/advance_search", true);

        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(json_request)
        // console.log('sen');

    })

})
