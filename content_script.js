console.log("Content script running...");

// handlers for message sending
function handleResponse(message) {
}

function handleError(error) {
    console.log(error);
}


// detect user clicks
// it is not possible to send the click target through the message, and I wasn't sure how to get
// it into the popup otherwise. Would have to implement the logic to analyze the target here
// and then only send the "result" in some suitable format to 'background.js'.
function clickHandler(e) {

    console.log(e);
    
    var send = browser.runtime.sendMessage({type: "user_action", action: e});
    send.then(handleResponse, handleError);
}
document.body.addEventListener('click', clickHandler, true);


// match tags that contain the word 'cookiefirst'
// I tried to add rules to exclude strings like '<p>cookiefirst is a company</p>' 
// or '<p>do you agree that company x < cookiefirst? </p>',
// so that really only tags containing the word cookiefirst are matched.
// This could definetely be further improved to remove more cases of unwanted matches
const cookiefirst_in_tag = "(<[^>]*cookiefirst[^<]*>)";

// there would definetely be more/better indicators

// the following to expressions should match links that are shown in the cookie popup, 
// linking to the privacy policy and information of cookiefirst.
// but they didn't really work (most websites don't display links to cookiefirst's legal notices etc.
// So I left them away
const cookiefirst_link1 = '(<a[^>]*href="https:\/\/cookiefirst\.com\/legal\/cookie-declaration\/"[^<]*>)';
const cookiefirst_link2 = '(<a[^>]*href="https:\/\/cookiefirst\.com\/info-about-cookie-consent\/"[^<]*>)';

const regex = new RegExp(cookiefirst_in_tag, "gi");

const text = document.getElementsByTagName('html')[0].innerHTML;


// simple approach: just check whether the regex matches => cookiefirst detected
const m = text.match(regex);

var its_cookiefirst = m !== null;
if(its_cookiefirst) {   
    console.log("Cookiefirst detected!");
} else {
    console.log("Cookiefirst is not the CMP for this website!");
}

// this could definetely be improved, for example in combination with background.js where we 
// can see requests to/from sites like consent.cookiefirst.com or static.cookiefirst.com


// added functionality to send detected cmp to background.js
var send = browser.runtime.sendMessage({type: "cmp", cookiefirst_detected: its_cookiefirst});
send.then(handleResponse, handleError);



