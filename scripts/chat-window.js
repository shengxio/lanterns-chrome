$(document).ready(function(){
    console.log("chat-window.js loaded")

    // initialize variables
    var appComponents = {}
    
    // get bot name and chat id from url params
    let urlParams = new URLSearchParams(window.location.search);
    let botName = urlParams.get("bot_id");
    let chatId = urlParams.get("chat_id");
    console.log("bot name: "+botName)
    console.log("chat id: "+chatId)

    let chatMessageContainer = document.getElementById("chat-message-container");
    if (chatMessageContainer){
        chatMessageContainer.textContent = "Loading your chat messages with "+botName+"...";
    }
});