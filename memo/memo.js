let textarea;
let CLIENT_HEIGHT;
let container;


window.onload = () =>{
    textarea = document.getElementsByClassName('memo-textarea')[0];
    CLIENT_HEIGHT = textarea.clientHeight;
    container = document.getElementsByClassName('memo-container')[0];

    textarea.addEventListener('input',()=>{
        textarea.style.height = CLIENT_HEIGHT + 'px';

        let scrollHeight = textarea.scrollHeight;
        textarea.style.height = scrollHeight + 'px';
        container.style.height = scrollHeight + 50 + 'px';
    });
}