

var memo = document.getElementById("contents");
if(memo != null){

    memo.addEventListener("keypress",onKeyDown)

    function onKeyDown(e){
        if (e.keyCode !== 13 ){
            return false;
        }
        memo.style.height = memo.scrollHeight + "px";
    }


}
