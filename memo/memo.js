var memo;
window.onload = function () {
    memo = document.getElementsByClassName("memo-textarea")[0]
}
memo.addEventListener("keypress", onKeyDown);
// memo.addEventListener("blur",onBlur)

function onKeyDown(e) {
    console.log(memo)
    if (e.keyCode !== 13) {
        return false;
    }
    memo.parentElement.style.height = memo.scrollHeight + "px";
    // memo.style.height = memo.scrollHeight + "px";
}

    // function onBlur
