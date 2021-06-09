let rightClickedPos;

//右クリック位置保存
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.actionName == 'setMousePos') {
        rightClickedPos = message.pos;
        console.log(rightClickedPos);
    }
    sendResponse();
});

//コンテキストメニューがクリックされた際の処理
chrome.contextMenus.onClicked.addListener(function (info, tab) {
    const selectedMenu = info.menuItemId;
    switch (selectedMenu) {
        case 'createMemo':
            chrome.tabs.sendMessage(tab.id, { actionName: 'createMemo', pos: rightClickedPos });
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
