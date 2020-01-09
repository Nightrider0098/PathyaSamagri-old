if(document.domain=="localhost")
{
document.getElementById("link-to-signup").setAttribute("href",`http://${document.domain}:5400/signup`);
document.getElementById("login-form").setAttribute("action",`http://${document.domain}:5400/mysql/api/login/user`);
}
else
{
    document.getElementById("link-to-signup").setAttribute("href",`https://${document.domain}/signup`);
    document.getElementById("login-form").setAttribute("action",`https://${document.domain}/mysql/api/login/user`);
    

}