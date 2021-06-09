const MEMO_WIDTH = 150;
const MEMO_HEIGHT = 150;

const parser = new DOMParser();

function createMemo(pos) {
    // ボタンの種類
    const imagePath = 'memo/deleteButton/';
    const imageName = '2.png';
    const imageUrl = chrome.runtime.getURL(imagePath + imageName);

    fetch(chrome.runtime.getURL('./memo/memo.html'))
        .then(response => response.text())
        .then((data) => {
            const memo = parser.parseFromString(data, 'text/html').getElementsByClassName('memo-container')[0];
            document.body.appendChild(memo);
            return memo;
        })
        .then((memo) => {
            const titleBar = memo.getElementsByClassName('titlebar')[0];
            const textArea = memo.getElementsByClassName('textarea')[0];
            const closeButton = memo.getElementsByClassName('closebutton')[0];

            memo.style.top = pos.Y + 'px';
            memo.style.left = pos.X + 'px';
            closeButton.style.backgroundImage = `url("${imageUrl}")`;

            titleBar.addEventListener('mousedown', moveMemo);
            textArea.addEventListener('input', resizeMemo);
            closeButton.addEventListener('click', deleteMemo);
        });
}

function resizeMemo() {
    const container = this.parentNode;

    this.style.height = '0px';
    const scrollHeight = this.scrollHeight;

    this.style.height = scrollHeight + 'px';
    container.style.height = scrollHeight + 50 + 'px';
}

function deleteMemo(event) {
    this.parentNode.remove();
}


let x;
let y;
let dragElement;
function moveMemo(event) {
    if (event.target.className !== 'closebutton') {
        dragElement = this.parentNode;

        const elements = document.getElementsByClassName('memo-container');
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.zIndex = 1000;
        }
        dragElement.style.zIndex = Number(dragElement.style.zIndex) + 10;

        x = event.pageX - dragElement.offsetLeft;
        y = event.pageY - dragElement.offsetTop;

        document.addEventListener('mousemove', mmove, false);
        document.addEventListener('mouseup', mup, false);
    }
}

function mmove(event) {
    const moveToPosX = event.pageX - x;
    const moveToPosY = event.pageY - y;

    if (0 <= moveToPosY) {
        dragElement.style.top = event.pageY - y + 'px';
    } else {
        dragElement.style.top = '0px';
    }

    if (0 <= moveToPosX) {
        dragElement.style.left = event.pageX - x + 'px';
    } else {
        dragElement.style.left = '0px';
    }
}

function mup(event) {
    if (dragElement !== null) {
        document.removeEventListener('mousemove', mmove, false);
        document.removeEventListener('mouseup', mup, false);
        dragElement = null;
    }
}



chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    //メモの作成が呼び出された場合、座標指定
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

//右クリック位置の記録
document.addEventListener('mouseup', (event) => {
    if (event.button == 2) {
        let pos = { X: event.pageX, Y: event.pageY };
        let message = { actionName: 'setMousePos', pos: pos };
        chrome.runtime.sendMessage(message);
    }
});
