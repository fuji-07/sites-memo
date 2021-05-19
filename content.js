let draggableElements;
let x;
let y;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message == 'createMemo') {
        createMemo();
    }
});

function createMemo() {
    let container = document.createElement('div');
    container.classList.add('memo-container');

    let title = document.createElement('div');
    title.classList.add('memo-title');

    let closebutton = document.createElement('input');
    closebutton.classList.add('closebutton');
    closebutton.type = 'button';
    closebutton.value = '×';

    let textarea = document.createElement('textarea');
    textarea.classList.add('memo-textarea');

    title.appendChild(closebutton);

    container.appendChild(title);
    container.appendChild(textarea);

    document.body.append(container);
    initDraggableElements();
}

function initDraggableElements() {
    draggableElements = document.getElementsByClassName('memo-container');

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