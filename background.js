console.log("Background script running...");

// variables to store gathered information. idea is that when the popup is opened, 
// popup.js asks for these variables and displays them
var cmp = "Unknown";
var requests = [];
var user_actions = [];
var cookies = [];



// message handler
function messageHandler(request, sender, sendResponse) {
    if(request.type == "cmp") {
        console.log("cmp update received");

        // this will be shown in popup
        if(request.cookiefirst_detected) {
            cmp = "Cookiefirst";
        } else {
            cmp = "Unknown";
        }
    }

    // as explained in content_script.js, the user_action part doesn't really work (but it gets
    // logged to the console in content_script.js at least)
    if(request.type == "user_action") {
        console.log("User action:");
        console.log(request.action);
    }

}
chrome.runtime.onMessage.addListener(messageHandler);



// cookie handler. detect changes in browser cookies
function cookieHandler(changeInfo) {
    if(changeInfo.removed) {
        console.log("A cookie was removed");
    } else {
        console.log("A cookie was added!");
        console.log(changeInfo);

        // this will be shown in popup
        cookies.push("Domain: " + changeInfo.cookie.domain + ", name: " + changeInfo.cookie.name + ", cause: " + changeInfo.cause);

        // for visualization purposes, only keep the 5 most recent items
        if(cookies.length > 5) {
            cookies.splice(0,cookies.length-5);
        }
    }
}
chrome.cookies.onChanged.addListener(cookieHandler);


// detecting network requests to and from cookiefirst.com
const url = "*://*.cookiefirst.com/*"

const urls = { urls: ["*://*.cookiefirst.com/*"] };
const param = ['blocking', 'responseHeaders']; // not sure if I need 'blocking' tbh

function handlerReceived(details) {
    console.log("Request received:");
    console.log(details);

    // this will be shown in popup
    requests.push("requestId: " + details.requestId + ", url: <a href='" + details.url + "'>target</a>, originUrl: <a href='" + details.originUrl + "'>origin</a>");

    // for visualization purposes, only keep the 5 most recent items
    if(requests.length > 5) {
        requests.splice(0,requests.length-5);
    }
}

function handlerSent(details) {
    console.log("Request sent:");
    console.log(details);

    // this will be shown in popup
    requests.push("requestId: " + details.requestId + ", url: <a href='" + details.url + "'>target</a>, originUrl: <a href='" + details.originUrl + "'>origin</a>");

    // for visualization purposes, only keep the 5 most recent items
    if(requests.length > 5) {
        requests.splice(0,requests.length-5);
    }
}

chrome.webRequest.onHeadersReceived.addListener(handlerReceived, urls, param);
chrome.webRequest.onSendHeaders.addListener(handlerSent, urls, []);


