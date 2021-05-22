window.onload = function () {
    let createMemoButton = document.getElementById('creatememo');
    createMemoButton.addEventListener('click', { message: 'createMemo', handleEvent: sendMessageToContent });
};

function sendMessageToContent(event) {
    let message = this.message;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { message: message }, function (res) { return });
    });
};