chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message == 'createMemo') {
        createMemo();
    }
});

function createMemo() {
    document.body.append("memo");
}