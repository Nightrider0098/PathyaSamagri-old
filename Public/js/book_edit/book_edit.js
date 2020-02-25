$(document).ready(() => {
    var suggestion_list = "";
    const valid_sub = ['Maths', 'English', 'Science', 'Physics', 'Chemistry', 'Computer','Biology', 'Communication', 'Mechinacal', 'Electronics', 'Electrical', 'Civil','Chemical',"Stationery"];
  
    for (i = 0; i < valid_sub.length; i++) {

        suggestion_list = suggestion_list.concat(`<option value="${valid_sub[i]}">`)
        // suggestion_list = suggestion_list.concat(Object.values(result_JSON)[0][i]);
    }

    $("#subjects").html(suggestion_list)

})
