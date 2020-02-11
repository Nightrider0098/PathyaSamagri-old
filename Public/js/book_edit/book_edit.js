$(document).ready(() => {
    var suggestion_list = "";
    const valid_sub = ['maths', 'english', 'science', 'physics', 'chemistry', 'biology', 'communication', 'mechinacal', 'electronics', 'electrical', 'civil'];

    for (i = 0; i < valid_sub.length; i++) {

        suggestion_list = suggestion_list.concat(`<option value="${valid_sub[i]}">`)
        // suggestion_list = suggestion_list.concat(Object.values(result_JSON)[0][i]);
    }

    $("#subjects").html(suggestion_list)

})
