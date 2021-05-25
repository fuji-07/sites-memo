const MEMO_WIDTH = 150;
const MEMO_HEIGHT = 100;

let x;
let y;


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


function createMemo(pos) {
    //要素の作成
    let container = document.createElement('div');
    container.classList.add('memo-container');

    let titleBar = document.createElement('div');
    titleBar.classList.add('titlebar');


    const imagePath = 'memo/deleteButton.png';
    const imageUrl = chrome.runtime.getURL(imagePath);

    console.log(imageUrl);

    let closeButton = document.createElement('div');
    closeButton.classList.add('closebutton');
    closeButton.style.backgroundImage = `url("${imageUrl}")`;
    // closeButton.innerHTML = '×';

    let textArea = document.createElement('textarea');
    textArea.classList.add('textarea');

    //要素合体
    container.appendChild(titleBar);
    container.appendChild(closeButton);
    container.appendChild(textArea);

    container.style.width = MEMO_WIDTH + 'px';
    container.style.height = MEMO_HEIGHT + 'px';

    container.style.top = pos.Y + 'px';
    container.style.left = pos.X + 'px';

    titleBar.addEventListener('mousedown', mdown);
    textArea.addEventListener('input', resizeMemo);
    closeButton.addEventListener('click', deleteMemo);

    document.body.appendChild(container);
}

function resizeMemo() {
    let container = this.parentNode;

    this.style.height = '0px';
    let scrollHeight = this.scrollHeight;

    this.style.height = scrollHeight + 'px';
    container.style.height = scrollHeight + 50 + 'px';
}

function deleteMemo(event) {
    this.parentNode.remove();
}

function mdown(event) {
    if (event.target.className !== 'closebutton') {
        this.parentNode.classList.add('drag');

        x = event.pageX - this.parentNode.offsetLeft;
        y = event.pageY - this.parentNode.offsetTop;

        window.addEventListener('mousemove', mmove, false);
    }

}

function mmove(event) {

    let drag = document.getElementsByClassName('drag')[0];

    drag.style.top = event.pageY - y + 'px';
    drag.style.left = event.pageX - x + 'px';

    drag.addEventListener('mouseup', mup, false);
    window.addEventListener('mouseleave', mup, false);

}

function mup(event) {
    let drag = document.getElementsByClassName('drag')[0];
    if (drag !== null) {
        window.removeEventListener('mousemove', mmove, false);
        drag.removeEventListener('mouseup', mup, false);
        drag.classList.remove('drag');
    }

}