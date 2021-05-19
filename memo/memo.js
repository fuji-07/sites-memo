var memo = document.getElementsByClassName("memo-textarea")[0];
if(memo != null){

    memo.addEventListener("keypress",onKeyDown);
    // memo.addEventListener("blur",onBlur)

    function onKeyDown(e){
        if (e.keyCode !== 13 ){
            return false;
        }
        memo.parentElement.style.height = memo.scrollHeight + "px";
        // memo.style.height = memo.scrollHeight + "px";
    }

    // function onBlur

}
