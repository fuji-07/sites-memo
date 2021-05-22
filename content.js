chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message == 'createMemo') {
        createMemo();
    }
    sendResponse();
});

function createMemo() {
    let memo = _createMemo();
    document.body.appendChild(memo);
}

function resizeMemo() {
    let container = this.parentNode;

    this.style.height = '0px';
    let scrollHeight = this.scrollHeight;

    this.style.height = scrollHeight + 'px';
    container.style.height = scrollHeight + 50 + 'px';
}

function deleteMemo() {
    this.parentNode.parentNode.remove();
}

function _createMemo() {

    //要素の作成
    let container = document.createElement('div');
    container.classList.add('memo-container');

    let titleBar = document.createElement('div');
    titleBar.classList.add('memo-titlebar');

    let closeButton = document.createElement('input');
    closeButton.classList.add('closebutton')
    closeButton.type = 'button';
    closeButton.value = '×';

    let textArea = document.createElement('textarea');
    textArea.classList.add('memo-textarea');

    //要素合体
    titleBar.appendChild(closeButton);
    container.appendChild(titleBar);
    container.appendChild(textArea);

    textArea.addEventListener('input', resizeMemo);
    closeButton.addEventListener('click', deleteMemo);

    return container;
}