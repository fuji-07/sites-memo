const MEMO_WIDTH = 150;
const MEMO_HEIGHT = 100;


chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.actionName == 'createMemo') {
        let pos;
        if (message.pos == null) {
            let centerX = window.pageXOffset + (document.documentElement.clientWidth / 2) - (MEMO_WIDTH / 2);
            let centerY = window.pageYOffset + (document.documentElement.clientHeight / 2) - (MEMO_HEIGHT / 2);
            pos = { X: centerX, Y: centerY };
        } else {
            pos = message.pos;
        }
        createMemo(pos);
    }
    sendResponse();
});

document.addEventListener('mouseup', (event) => {
    if (event.button == 2) {
        let pos = { X: event.pageX, Y: event.pageY };
        let message = { actionName: 'setMousePos', pos: pos };
        chrome.runtime.sendMessage(message);
    }
});


function createMemo(pos) {
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

    container.style.width = MEMO_WIDTH + 'px';
    container.style.height = MEMO_HEIGHT + 'px';

    container.style.top = pos.Y + 'px';
    container.style.left = pos.X + 'px';

    document.body.appendChild(container);
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