//search for books with title

$(document).ready(function () {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        
        if (this.readyState == 4 && this.status == 200) {
            if (xhttp.response == "[]") {
                alert("no book found");
            }
            else {
                var result_JSON = JSON.parse(xhttp.response);
            }
            var table="<table>";
            table+="<tr>";
            
            for(j=0;j<Object.values(result_JSON[0]).length;j++)
            {
                table += "<th>";
table+=Object.keys(result_JSON[0])[j];
                table += "</th>";


            }
table+="</tr>";            

            for(i = 0;i<result_JSON.length;i++)
            {
                table = table + "<tr>";
                

                for(j=1;j<Object.values(result_JSON[i]).length;j++)
                {
                    table += "<td>";
table+=Object.values(result_JSON[i])[j];
                    table += "</td>";
                }
                
table+="</tr>";


            }
table += "</table>";



$("#data_display").html(table);

            console.log(table);
        }
    };
    $("button").click(function () {
        var data = $("#search-book-title").val();

        xhttp.open("GET", "http://localhost:5400/mysql/api/book?title=" + data, true);
        xhttp.send();
    });
});






