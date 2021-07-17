let createMemo = (function () {
    const parser = new DOMParser();

    const imagePath = 'memo/deleteButton/';
    const fileName = '2.png';
    const imageUrl = chrome.runtime.getURL(imagePath + fileName);

    return async function (x, y) {
        const res = await fetch(chrome.runtime.getURL('./memo/memo.html'));
        const text = await res.text();
        const memo = (function () {
            const container = parser.parseFromString(text, 'text/html').querySelector('.sitesmemo');
            const closeButton = container.querySelector('.closebutton');
            container.style.left = x + 'px';
            container.style.top = y + 'px';

            closeButton.style.backgroundImage = `url("${imageUrl}")`;
            return container;
        })();

        setMemoEvents(memo);
        document.body.appendChild(memo);
    }
})();

let setMemoEvents = (function () {
    const START_Z_INDEX = 1000;

    let startX = 0;
    let startY = 0;
    let dragMemo = null;

    let sortzIndex = function (event) {
        const zIndex = this.style.zIndex;
        const memoList = document.getElementsByClassName('sitesmemo');
        for (let i = 0; i < memoList.length; i++) {
            if (zIndex < memoList[i].style.zIndex) memoList[i].style.zIndex--;
        }
        this.style.zIndex = START_Z_INDEX + (memoList.length - 1);
    }
    let move = {
        start: function (event) {
            dragMemo = this.parentNode;
            startX = event.pageX - dragMemo.offsetLeft;
            startY = event.pageY - dragMemo.offsetTop;

            document.addEventListener('mousemove', move.moving);
            document.addEventListener('mouseup', move.stop);
        },
        moving: function (event) {
            const moveToPosX = event.pageX - startX;
            const moveToPosY = event.pageY - startY;

            dragMemo.style.left = (0 <= moveToPosX) ? moveToPosX : 0;
            dragMemo.style.top = (0 <= moveToPosY) ? moveToPosY : 0;
        },
        stop: function (event) {
            document.removeEventListener('mousemove', move.moving);
            document.removeEventListener('mouseup', move.stop);
            dragMemo = null;
        }
    }
    let remove = function (event) {
        this.parentNode.remove();
    }

    return function (memo) {
        const container = memo;
        const closebutton = container.querySelector('.closebutton');
        const titlebar = container.querySelector('.titlebar');

        const index = document.getElementsByClassName('sitesmemo').length;
        memo.style.zIndex = START_Z_INDEX + index;

        container.addEventListener('mousedown', sortzIndex);
        titlebar.addEventListener('mousedown', move.start);
        closebutton.addEventListener('mouseup', remove);
    }
})();

//コンテキストメニュー処理
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    //メモの作成が呼び出された場合、座標指定
    if (message.actionName == 'createMemo') {
        let x;
        let y;
        if (message.x == null) {
            x = window.pageXOffset + (document.documentElement.clientWidth / 2);
            y = window.pageYOffset + (document.documentElement.clientHeight / 2);
        } else {
            x = message.x;
            y = message.y;
        }
        createMemo(x, y);
    }
    sendResponse();
});

//右クリック位置の記録
document.addEventListener('mouseup', (event) => {
    if (event.button == 2) {
        const x = event.pageX;
        const y = event.pageY;

        let message = { actionName: 'setMousePos', x: x, y: y };
        chrome.runtime.sendMessage(message);
    }
});