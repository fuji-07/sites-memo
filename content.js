let draggableElements;
let x;
let y;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message == 'createMemo') {
        createMemo();
    }
});

function createMemo() {
    let div = document.createElement('div');
    div.classList.add('draggable');
    div.style.width = '100px';
    div.style.height = '100px';
    div.style.backgroundColor = 'red';
    div.style.position = 'absolute';
    div.style.top = '0px';
    div.style.left = '0px';
    div.style.zIndex = '9999';

    document.body.append(div);
    initDraggableElements();
}

function initDraggableElements() {
    draggableElements = document.getElementsByClassName('draggable');

    for (let i = 0; i < draggableElements.length; i++) {
        draggableElements[i].addEventListener('mousedown', mdown, false);
    }
}

function mdown(event) {
    this.classList.add('drag');

    x = event.pageX - this.offsetLeft;
    y = event.pageY - this.offsetTop;

    document.body.addEventListener('mousemove', mmove, false);
}

function mmove(event) {

    var drag = document.getElementsByClassName('drag')[0];

    drag.style.top = event.pageY - y + 'px';
    drag.style.left = event.pageX - x + 'px';

    drag.addEventListener('mouseup', mup, false);
    document.body.addEventListener('mouseleave', mup, false);

}

function mup(event) {
    var drag = document.getElementsByClassName('drag')[0];
    if (typeof drag !== "undefined") {
        document.body.removeEventListener('mousemove', mmove, false);
        drag.removeEventListener('mouseup', mup, false);
        drag.classList.remove('drag');
    }

}