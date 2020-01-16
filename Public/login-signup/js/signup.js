function check_pass() {
if(document.getElementById("re_pass").value.length)
    if (document.getElementById("re_pass").value !== document.getElementById("password").value) {
        document.getElementById("re-pass-error").setAttribute("style", "visibility:visible;");

    }
    else {

        document.getElementById("re-pass-error").setAttribute("style", "visibility:hidden;");

    }
}


if(document.domain=="localhost")
{
document.getElementById("link-to-login").setAttribute("href",`http://${document.domain}:5400/login`);
var link_login =  `http://${document.domain}:5400/mysql/api/login/new_user`;
}
else
{
    document.getElementById("link-to-login").setAttribute("href",`http://${document.domain}/signup`);
    var link_login =  `http://${document.domain}/mysql/api/login/new_user`;
    

}




function submit_btn()
{
    if(document.getElementById("re_pass").value.length)
    if(document.getElementById("re_pass").value == document.getElementById("password").value)
    if(document.getElementById("agree-term").checked)
    {document.getElementById("signup").setAttribute("class","form-submit");
    document.getElementById("signup").type = "submit";
    document.getElementById("register-form").setAttribute("action",link_login);
}


}