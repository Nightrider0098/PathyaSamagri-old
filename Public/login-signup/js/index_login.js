function check_pass() {
if(document.getElementById("re_pass").value.length)
    if (document.getElementById("re_pass").value !== document.getElementById("password").value) {
        document.getElementById("re-pass-error").setAttribute("style", "visibility:visible;");

    }
    else {

        document.getElementById("re-pass-error").setAttribute("style", "visibility:hidden;");

    }
}

document.getElementById("register-form").setAttribute("action",`https://${document.domain}/5400/mongoose/signup`);

function submit_btn()
{
    if(document.getElementById("re_pass").value.length)
    if(document.getElementById("re_pass").value == document.getElementById("password").value)
    if(document.getElementById("agree-term").checked)
    {document.getElementById("signup").setAttribute("class","form-submit");
    document.getElementById("signup").type = "submit";
    document.getElementById("signup").click();
}


}