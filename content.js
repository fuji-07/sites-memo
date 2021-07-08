/*
MIT License

Copyright (c) 2021 M.Nogi, S.Fujii, K.Baba

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/** 
 * @fileOverview メモを作成する関数を記述したファイルです。
 * 
 * @author M.Nogi, S.Fujii, K.Baba
 * ┌───────────────────────────┐
 * │　　     OCSへGo！！        │
 * └───────────────────────────┘
 *  　　　　ヽ(＾ω＾)ﾉ
 *  　　　　　(　へ )
 *  　 　　　　く
 * @version 1.0.0
 */

const MEMO_WIDTH = 150;
const MEMO_HEIGHT = 150;

const parser = new DOMParser();
const observer = new ResizeObserver((entries) => {
    resizeMemo(entries[0].target);
});

/** メモを作成しサイトに張り付ける関数
 * @param  {{ X: Number, Y: Number }} pos 張り付ける座標
 */
function createMemo(pos) {
    // ボタンの種類
    const imagePath = 'memo/deleteButton/';
    const imageName = '2.png';
    const imageUrl = chrome.runtime.getURL(imagePath + imageName);

    fetch(chrome.runtime.getURL('./memo/memo.html'))
        .then(response => response.text())
        .then((data) => {
            const memo = parser.parseFromString(data, 'text/html').querySelector('.memo-container');
            const closeButton = memo.querySelector('.closebutton');
            memo.style.top = pos.Y + 'px';
            memo.style.left = pos.X + 'px';

            closeButton.style.backgroundImage = `url("${imageUrl}")`;
            document.body.appendChild(memo);
            setMemoActions(memo);
        });
}

/** メモのイベントを登録する関数
 * @param  {Element} memo メモ要素
 */
function setMemoActions(memo) {
    const titleBar = memo.querySelector('.titlebar');
    const textArea = memo.querySelector('.textarea');
    const closeButton = memo.querySelector('.closebutton');

    titleBar.addEventListener('mousedown', startMoveMemo);
    closeButton.addEventListener('click', deleteMemo);

    textArea.addEventListener('input', resizeMemo);
    observer.observe(memo);
}

/** メモの大きさを自動調整する関数
 * @param  {Event | Element} arg 呼び出し元イベント又はメモのコンテナ要素
 */
function resizeMemo(arg) {
    let container;
    let textArea;
    if (arg instanceof Event) {
        container = this.parentNode;
        textArea = this;
    } else if (arg instanceof Element) {
        container = arg;
        textArea = arg.querySelector('.textarea');
    } else {
        console.log('unexpected case!!! :-)');
        return;
    }

    textArea.style.height = '0px';
    const scrollHeight = textArea.scrollHeight;

    textArea.style.height = scrollHeight + 'px';
    container.style.height = scrollHeight + 50 + 'px';
}

function deleteMemo() {
    this.parentNode.remove();
}


let startX;
let startY;
let dragElement;

/** メモの移動を開始する関数
 * @param  {Event} event 呼び出し元イベント
 */
function startMoveMemo(event) {
    if (event.target.className !== 'closebutton') {
        dragElement = this.parentNode;

        const elements = document.getElementsByClassName('memo-container');
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.zIndex = 1000;
        }
        dragElement.style.zIndex = Number(dragElement.style.zIndex) + 10;

        startX = event.pageX - dragElement.offsetLeft;
        startY = event.pageY - dragElement.offsetTop;

        document.addEventListener('mousemove', moveMemo, false);
        document.addEventListener('mouseup', stopMoveMemo, false);
    }
}

/** メモを移動させる関数
 * @param  {Event} event 呼び出し元イベント
 */
function moveMemo(event) {
    const moveToPosX = event.pageX - startX;
    const moveToPosY = event.pageY - startY;

    if (0 <= moveToPosY) {
        dragElement.style.top = event.pageY - startY + 'px';
    } else {
        dragElement.style.top = '0px';
    }

    if (0 <= moveToPosX) {
        dragElement.style.left = event.pageX - startX + 'px';
    } else {
        dragElement.style.left = '0px';
    }
}

/** メモの移動を終了する関数
 * @param  {Event} event 呼び出し元のイベント
 */
function stopMoveMemo(event) {
    if (dragElement !== null) {
        document.removeEventListener('mousemove', moveMemo, false);
        document.removeEventListener('mouseup', stopMoveMemo, false);
        dragElement = null;
    }
}


//コンテキストメニュー処理
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
