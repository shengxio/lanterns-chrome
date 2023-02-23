// to do:
    // change the layout to a left and right style with left to open the chat and right to delete the chat
    // add the click event to open the chat
    // fix the backend of the delete chat function
    // wire the create chat function to open the chat and generate the chat id.

    
$(document).ready(function(){
    console.log("chats.js loaded")
    // initialize variables
    var appComponents = {}

    // get bot name from url params
    let urlParams = new URLSearchParams(window.location.search);
    let botName = urlParams.get("bot");  

    chrome.storage.sync.get(["app_data","api_key","api_url","user_id","bots"],function(result){
        appComponents["info"] = result.app_data;
        appComponents["api_key"] = result.api_key;
        appComponents["api_url"] = result.api_url;
        appComponents["user_id"] = result.user_id;

        // add create new chat button
        $("#chat-list-title").text(botName + " (0)")

        // create chat entries
        getChats(botName);

    });

    // get the list of chats
    function getChats(bot_id){
        console.log("getting chats for "+bot_id)
        // send message to the background script to get the list of chats


        chrome.runtime.sendMessage({
            contentScriptQuery: "getChats",
            bot_id: bot_id,
            api_key: appComponents.api_key,
            api_url: appComponents.api_url,
            user_id: appComponents.user_id,
            resource: "chats"
        }, function(response) {
            if(response){
                let chatListTitle = document.getElementById("chat-list-title");
                console.log(response);

                if(chatListTitle && response.chats){
                    chatListTitle.textContent = botName + " ("+Object.keys(response.chats).length+")";
                } else if (chatListTitle){
                    chatListTitle.textContent = botName + " (0)";
                }
                createChatsList(botName,response);
            }else{
                console.log("no response");
            }
        });
    }

    $("#button-new-chat").click(function(){
        // send message to content script to create new chat
        console.log("creating new chat")
        let chatList = document.getElementById("chat-list");

        chrome.runtime.sendMessage({
            contentScriptQuery: "addChat",
            bot_id: botName,
            user_id: appComponents.user_id,
            api_key: appComponents.api_key,
            api_url: appComponents.api_url,
            resource: "chats",
            data: {
                title: "New Chat"
            }
        }, function(response) {
            if(response){
                console.log(response);
                chatList?.appendChild(createChat("New Chat",response.chat_id));
            }else{
                console.log("no response");
            }
        }); 
    });

    $("#button-back").click(function(){
        window.history.back();
    });

    // create panel entry
    function createChat(title,id){

        console.log("creating chat entry for "+title)
        let entry = document.createElement("div");
        entry.id = id;
        entry.className = "list-chat";

        let chatItem = document.createElement("div");
        chatItem.className = "chat-item";
        chatItem.textContent = title;
        chatItem.onclick = function(){

            (async () => {
                console.log(chatItem.textContent + " clicked")
                // send message to content script to open chat
                const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
                if(tab.id){
                    await chrome.tabs.sendMessage(tab.id,{
                        contentScriptQuery: "openChat",
                        bot_id: botName,
                        title: chatItem.textContent,
                        chat_id: id
                    });
                }else{
                    console.log("no tab id")
                }
                
            })();
        }

        // add a delete button to the entry and float it to the right
        let deleteButton = document.createElement("img");
        deleteButton.src = "../images/delete.png";
        deleteButton.className = "list-entry-delete-button";
        deleteButton.onclick = function(){
            console.log("delete button clicked for "+title)
            // send message to content script to delete chat
            chrome.runtime.sendMessage({
                contentScriptQuery: "deleteChat",
                bot_id: botName,
                user_id: appComponents.user_id,
                api_key: appComponents.api_key,
                api_url: appComponents.api_url,
                resource: "chats",
                data:{
                    "chat_id":id
                }
            }, function(response) {
                if(response){
                    console.log(response);
                    if(response.message == "success"){
                        entry.remove();
                    }
                    
                }else{
                    console.log("no response");
                }
            });
        }

        // add an edit button to the entry and float it to the right
        let editButton = document.createElement("img");
        editButton.src = "../images/edit.png";
        editButton.className = "list-entry-edit-button";
        editButton.onclick = function(){
            console.log("edit button clicked for "+title)
            let new_title = prompt("Enter new title for chat",title);
            if(new_title == null || new_title == ""){
                return;
            }
            // send message to content script to update chat title
            chrome.runtime.sendMessage({
                contentScriptQuery: "updateChat",
                api_key: appComponents.api_key,
                api_url: appComponents.api_url,
                user_id: appComponents.user_id,
                bot_id: botName,
                resource: "chats",
                data: {
                    "item":{
                        id:id,
                        title: new_title
                    }
                }
            }, function(response) {
                if(response){
                    console.log(response);
                    if(response.message == "success"){
                        chatItem.textContent = new_title;
                    }else{
                        console.log("error updating chat title. See response:" + response);
                    }
                }else{
                    console.log("no response");
                }
            });
        }

        entry.appendChild(chatItem);
        entry.appendChild(deleteButton);
        entry.appendChild(editButton);

        return entry;
    }

    function createChatsList(botName,response){
        let chatList = document.getElementById("chat-list");    
    
        for (const chat_id in response.chats){
            let chat_title = response.chats[chat_id];
    
            if(!document.getElementById(chat_id)){
                let bodyEntry = createChat(chat_title,chat_id);
        
                chatList?.appendChild(bodyEntry);
            }
        }
    }

});