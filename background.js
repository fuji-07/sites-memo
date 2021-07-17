let x;
let y;

//右クリック位置保存
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.actionName == 'setMousePos') {
        x = message.x;
        y = message.y;
    }
    sendResponse();
});

//コンテキストメニューがクリックされた際の処理
chrome.contextMenus.onClicked.addListener(function (info, tab) {
    const selectedMenu = info.menuItemId;
    switch (selectedMenu) {
        case 'createMemo':
            chrome.tabs.sendMessage(tab.id, { actionName: 'createMemo', x: x, y: y });
            break;
    }
});

//コンテキストメニューの作成
chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        title: 'メモを作成',
        contexts: ['all'],
        id: 'createMemo'
    });
});
