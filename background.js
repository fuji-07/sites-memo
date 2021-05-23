let rightClickedPos;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.actionName == 'setMousePos') {
        rightClickedPos = message.pos;
        console.log(rightClickedPos);
    }
    sendResponse();
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    const selectedMenu = info.menuItemId;

    switch (selectedMenu) {
        case 'createMemo':
            chrome.tabs.sendMessage(tab.id, { actionName: 'createMemo' });
            break;
    }
});


chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        title: 'メモを作成',
        contexts: ['all'],
        id: 'createMemo'
    });
});
