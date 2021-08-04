/*
MIT License
Copyright (c) 2021 S.Fujii, K.Baba, M.Nogi
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
 * @author S.Fujii, K.Baba, M.Nogi
 * ┌───────────────────────────┐
 * │　　     OCSへGo！！        │
 * └───────────────────────────┘
 *  　　　　ヽ(＾ω＾)ﾉ
 *  　　　　　(　へ )
 *  　 　　　　く
 * @version 1.0.0
 */

/** 定数 */
const START_Z_INDEX = 1000;

/** メモを作成しサイトに張り付ける関数
 * 
 * @param {Number} x 張り付けるx座標
 * @param {Number} y 張り付けるy座標
 */
let createMemo = function () {
    const parser = new DOMParser();

    const imagePath = 'memo/deleteButton/';
    const fileName = '2.png';
    const imageUrl = chrome.runtime.getURL(imagePath + fileName);

    /**
     * @param {Number} x 張り付けるx座標
     * @param {Number} y 張り付けるy座標
     */
    return async function (x, y) {
        const res = await fetch(chrome.runtime.getURL('./memo/memo.html'));
        const text = await res.text();
        const memo = (function () {
            const container = parser.parseFromString(text, 'text/html').querySelector('.sitesmemo');
            const closeButton = container.querySelector('.closebutton');
            const textArea = container.querySelector('.textarea');

            const index = document.getElementsByClassName('sitesmemo').length;

            container.style.zIndex = START_Z_INDEX + index;
            container.style.left = x + 'px';
            container.style.top = y + 'px';
            closeButton.style.backgroundImage = `url("${imageUrl}")`;

            if (textArea) {
                textArea.spellcheck = false;
            }
            
            return container;
        })();

        setMemoEvents(memo);
        document.body.appendChild(memo);
    }
}();

/** メモのイベントを登録する関数
 * @param {Element} memo メモ要素
 */
let setMemoEvents = function () {
    /** メモの重なりを調整する関数
     * 
     * @param {Event} event DOMイベント
     */
    let sortzIndex = function (event) {
        const zIndex = this.style.zIndex;
        const memoList = document.getElementsByClassName('sitesmemo');
        for (let i = 0; i < memoList.length; i++) {
            if (zIndex < memoList[i].style.zIndex) memoList[i].style.zIndex--;
        }
        this.style.zIndex = START_Z_INDEX + (memoList.length - 1);
    }

    /** メモの移動に関係する関数群
     */
    let move = function () {
        let startX = 0;
        let startY = 0;
        let dragMemo = null;

        return {
            /** 移動を開始する関数
             * @param {Event} event DOMイベント
             */
            start: function (event) {
                dragMemo = this.parentNode;
                startX = event.pageX - dragMemo.offsetLeft;
                startY = event.pageY - dragMemo.offsetTop;

                document.addEventListener('mousemove', move.moving);
                document.addEventListener('mouseup', move.stop);
            },
            /** 移動中呼び出される関数
             * @param {Event} event DOMイベント
             */
            moving: function (event) {
                const moveToPosX = event.pageX - startX;
                const moveToPosY = event.pageY - startY;

                if (0 <= moveToPosX) {
                    dragMemo.style.left = moveToPosX;
                } else {
                    dragMemo.style.left = 0;
                }

                if (0 <= moveToPosY) {
                    dragMemo.style.top = moveToPosY;
                } else {
                    dragMemo.style.top = 0;
                }
            },
            /** 移動を終了する関数
             * @param {Event} event DOMイベント
             */
            stop: function (event) {
                document.removeEventListener('mousemove', move.moving);
                document.removeEventListener('mouseup', move.stop);
                dragMemo = null;
            }
        }
    }();

    /** メモを削除する関数
     * @param {Event} event DOMイベント
     */
    let remove = function (event) {
        this.parentNode.remove();
    }

    /**
     *  @param {Element} memo メモ要素
     */
    return function (memo) {
        const container = memo;
        container.addEventListener('mousedown', sortzIndex);

        const titlebar = container.querySelector('.titlebar');
        titlebar.addEventListener('mousedown', move.start);

        const closebutton = container.querySelector('.closebutton');
        closebutton.addEventListener('mouseup', remove);
    }
}();

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