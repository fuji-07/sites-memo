let createMemoButton;

window.onload = function () {
    createMemoButton = document.getElementById('creatememo');
    createMemoButton.addEventListener('click', createMemo);
};

function createMemo() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { message: 'createMemo' }, function (res) { });
    });
}