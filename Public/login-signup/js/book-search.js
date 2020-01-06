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



$("#data_display").append(table);

            console.log(table);
        }
    };
    $("button").click(function () {
        var data = $("#search-book-title").val();

        xhttp.open("GET", "http://localhost:5400/mongoose/book-search?title=" + data, true);
        xhttp.send();
    });
});







// function generate_table() {
//     // get the reference for the body
//     var body = document.getElementsById("div-table-detail");

//     // creates a <table> element and a <tbody> element
//     var tbl = document.createElement("table");
//     var tblBody = document.createElement("tbody");
//     tbl.setAttribute("id", "table-detail");
//     // creating all cells

//     for (var i = 0; i < 2; i++) {
//         // creates a table row
//         var row = document.createElement("tr");

//         for (var j = 0; j < 2; j++) {
//             // Create a <td> element and a text node, make the text
//             // node the contents of the <td>, and put the <td> at
//             // the end of the table row
//             var cell = document.createElement("td");
//             var cellText = document.createTextNode("cell in row " + i + ", column " + j);
//             cell.appendChild(cellText);
//             row.appendChild(cell);
//         }

//         // add the row to the end of the table body
//         tblBody.appendChild(row);
//     }

//     // put the <tbody> in the <table>
//     tbl.appendChild(tblBody);
//     // appends <table> into <body>
//     body.appendChild(tbl);
//     // sets the border attribute of tbl to 2;
//     tbl.setAttribute("border", "2");
// }