chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request == "myAction") {
        hogehoge();
    }
}); 

function hogehoge() {
    console.log("hogehoge");
}