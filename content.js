chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.actionName == 'createMemo') {
        createMemo();
    }
    sendResponse();
});

document.addEventListener('mouseup', (event) => {
    if (event.button == 2) {
        let pos = { clientX: event.clientX, clientY: event.clientY };
        let message = { actionName: 'setMousePos', pos: pos };
        chrome.runtime.sendMessage(message);
    }
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