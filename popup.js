window.onload = function () {
    let createMemoButton = document.getElementById('creatememo');
    createMemoButton.addEventListener('click', { actionName: 'createMemo', handleEvent: sendMessageToContent });
};

function sendMessageToContent(event) {
    let message = { actionName: this.actionName };
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message);
    });
};