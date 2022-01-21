var background = chrome.extension.getBackgroundPage();

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("cmp").innerHTML = "CMP of the current page: " + background.cmp;
    document.getElementById("requests").innerHTML = "- " + background.requests.join(",<br>- ");
    document.getElementById("user_actions").innerHTML = "- " + background.user_actions.join(",<br>- ");
    document.getElementById("cookies").innerHTML = "- " + background.cookies.join(",<br>- ");
});
