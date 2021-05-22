let textarea;
let clientHeight;
let container;

window.onload = () =>{
    textarea = document.getElementsByClassName('memo-textarea')[0];
    clientHeight = textarea.clientHeight;
    container = document.getElementsByClassName('memo-container')[0];

    textarea.addEventListener('input',()=>{
        textarea.style.height = clientHeight + 'px';

        let scrollHeight = textarea.scrollHeight;
        textarea.style.height = scrollHeight + 'px';
        container.style.height = scrollHeight + 50 + 'px';
    });
}