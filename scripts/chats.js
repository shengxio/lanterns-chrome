
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
            // user_id: appComponents.user_id,
            user_id: "test",
            resource: "chats"
        }, function(response) {
            if(response){
                let chatListTitle = document.getElementById("chat-list-title");

                if(chatListTitle){
                    chatListTitle.textContent = botName + " ("+Object.keys(response.chats).length+")";
                }
                
                createChatsList(botName,response);
                
            }else{
                console.log("no response");
            }
        });
    }

    $("#button-new-chat").click(function(){
        // send message to content script to create new chat
        chrome.runtime.sendMessage({
            contentScriptQuery: "createChat",
            bot_id: botName
        }, function(response) {
            if(response){
                console.log(response);
            }
        });
        
    });

    $("#button-back").click(function(){
        window.history.back();
    });
});

function createChatsList(botName,response){
    let chatList = document.getElementById("chat-list");    

    for (const chat_id in response.chats){
        let chat_title = response.chats[chat_id];

        if(!document.getElementById(chat_id)){
            let bodyEntry = createChat(chat_title,chat_id);
    
            bodyEntry.onclick = function(){
                console.log(chat_title + " clicked")
                // send message to content script to open chat
                chrome.runtime.sendMessage({
                    contentScriptQuery: "openChat",
                    bot_id: botName,
                    chat_id: chat_id
                }, function(response) {
                    if(response){
                        console.log(response);
                    }
                });
            }

            chatList?.appendChild(bodyEntry);
        }
    }
}



// create panel entry
function createChat(title,id){
    // to do:
    // change the layout to a left and right style with left to open the chat and right to delete the chat
    // add the click event to open the chat
    // fix the backend of the delete chat function
    // wire the create chat function to open the chat and generate the chat id.
    console.log("creating chat entry for "+title)
    let entry = document.createElement("div");
    entry.id = id;
    entry.className = "list-entry";
    entry.textContent = title;

    // add a delete button to the entry and float it to the right
    let deleteButton = document.createElement("img");
    deleteButton.src = "../images/delete.png";
    deleteButton.className = "list-entry-delete-button";
    deleteButton.onclick = function(){
        console.log("delete button clicked for "+title)
        // send message to content script to delete chat
        chrome.runtime.sendMessage({
            contentScriptQuery: "deleteChat",
            chat_id: id
        }, function(response) {
            if(response){
                console.log(response);
            }
        });
    }

    // let entryText = document.createElement("div");
    // entryText.className = "list-entry-description";
    // entryText.textContent = title;

    // entry.appendChild(entryText);
    entry.appendChild(deleteButton);

    return entry;
}

