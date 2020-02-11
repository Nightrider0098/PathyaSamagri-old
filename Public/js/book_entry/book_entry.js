
$(document).ready(() => {
    var suggestion_list = "";
    const valid_sub = ['maths', 'english', 'science', 'physics', 'chemistry', 'biology', 'communication', 'mechinacal', 'electronics', 'electrical', 'civil'];

    for (i = 0; i < valid_sub.length; i++) {

        suggestion_list = suggestion_list.concat(`<option value="${valid_sub[i]}">`)
        // suggestion_list = suggestion_list.concat(Object.values(result_JSON)[0][i]);
    }

    $("#subjects").html(suggestion_list)

})

function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
  $(document).ready(function() {
    $('#uuid_p').text(guid());
  })

const uniq_id = guid()

  $("#img_id").val(uniq_id)
  $("#data_img_id").val(uniq_id)
  

function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#book_image')
                    .attr('src', e.target.result)
                    .width(180)
                    .height(270);
            };

            reader.readAsDataURL(input.files[0]);
        }
    }




