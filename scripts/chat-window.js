$(document).ready(function(){
    console.log("chat-window.js loaded")
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

    // initialize variables
    var appComponents = {}

    // get key app components from storage
    chrome.storage.sync.get(["app_data","api_key","api_url","user_id"],function(result){
        appComponents["info"] = result.app_data;
        appComponents["api_key"] = result.api_key;
        appComponents["api_url"] = result.api_url;
        appComponents["user_id"] = result.user_id;

        initQueue();
    });
    

    // get the queue
    function initQueue(){
        console.log("getting queue for "+botName+" and "+chatId+"");
        // get queue by sending message to background.js
        chrome.runtime.sendMessage({
            contentScriptQuery: "getQueue",
            queue_id: chatId,
            bot_id: botName,
            api_key: appComponents.api_key,
            api_url: appComponents.api_url,
            user_id: appComponents.user_id,
            resource: "queues"
        }, function(response){
            console.log(response);
            
            if ("queue" in response){
                // create the received queue
                let messages = sortQueue(response.queue);
                if(chatMessageContainer){
                    chatMessageContainer.textContent = "";
                }

                // add messages to chat window ** may need preprocess to format the messages so we can get reformated message pairs
                for (const timestamp in messages){
                    let messageContainer = formateMessage(timestamp, messages[timestamp]); // going to remove this line here
                    chatMessageContainer?.appendChild(messageContainer);// ** have to think about how to add the user and bot messages in pairs.
                }
                if(chatMessageContainer){
                    chatMessageContainer.scrollTop = chatMessageContainer.scrollHeight - chatMessageContainer.clientHeight;
                }
                
            }
            
        });
    }

    // format the message based on the text
    function formateMessage(timestamp, text){
        // create message container
        let messageContainer = document.createElement("div");
        messageContainer.classList.add("message-container");
        messageContainer.id = "message-container"+timestamp;

        // create message text
        let messageText = document.createElement("div");
        messageText.id = timestamp;

        // add delete button
        let deleteButton = document.createElement("img");
        deleteButton.classList.add("message-control-button");
        deleteButton.classList.add("delete-button");
        deleteButton.src = "../images/delete.png";
        deleteButton.alt = "Delete Message";

        // add event listener to delete button
        deleteButton.addEventListener("click", function(){
            // send message to background.js
            chrome.runtime.sendMessage({
                contentScriptQuery: "deleteMessage",
                queue_id: chatId,
                bot_id: botName,
                api_key: appComponents.api_key,
                api_url: appComponents.api_url,
                user_id: appComponents.user_id,
                remove: [timestamp],
                resource: "queues"
            }, function(response){
                if (response.message == "success"){
                    // delete the element
                    if(messageContainer){
                        messageContainer.parentElement?.removeChild(messageContainer);
                    }
                }
            });
        });

        // if message start with You: then it is a user message
        if (text.startsWith("You:")){
            // deleteButton.style.left = "10%";

            messageText.classList.add("user-message-text");
            messageText.textContent = dropMessageHead(text);

            // messageContainer.appendChild(deleteButton);
            messageContainer.appendChild(messageText);
            
        } else {
            // add regenerate button
            let regenerateButton = document.createElement("img");
            regenerateButton.classList.add("message-control-button");
            regenerateButton.classList.add("regenerate-button");
            regenerateButton.src = "../images/refresh.png";
            regenerateButton.alt = "Regenerate Message";

            // add event listener to regenerate button
        regenerateButton.addEventListener("click", function(){
            // prompt user for continue
            let confirm = window.confirm("Regenerate the message will remove the last generated message. Do you want to continue?");

            if (confirm){
                // change the text of the message to "thinking again..."
                messageText.textContent = "Thinking again...";

                // send message to background.js
                chrome.runtime.sendMessage({
                    contentScriptQuery: "updateMessage",
                    queue_id: chatId,
                    bot_id: botName,
                    api_key: appComponents.api_key,
                    api_url: appComponents.api_url,
                    user_id: appComponents.user_id,
                    timestamp: timestamp,
                    resource: "queues"
                }, function(response){
                    if("text" in response){
                        // trim the beginning of the string at : and space
                        // update bot message

                        messageText.textContent = dropMessageHead(response.text);
                        messageText.id = response.timestamp.toString();
                    }else{
                        // update bot message
                        messageText.textContent = "Sorry, I am a bit overwhelmed at this moment, please try later...";
                        console.log(response);
                    }
        
                });
            } else {
                return;
            }
        });

            // add message text
            messageText.classList.add("bot-message-text");
            messageText.textContent = dropMessageHead(text);

            // deleteButton.style.float = "left";
            
            regenerateButton.style.float = "left";
            messageContainer.appendChild(messageText);
            // messageContainer.appendChild(deleteButton);
            messageContainer.appendChild(regenerateButton);

        }

        return messageContainer;
    }

    // add event listener to send button
    $("#chat-input-button").click(function(){
        let text = "You: "+$("#chat-input-text").val();
        let timestamp = Date.now();
        $('#chat-input-text').val('');

        // add message to queue
        let userMessage = formateMessage(timestamp, text);
        userMessage.classList.add("user-message-container");
        userMessage.id = timestamp.toString();

        // create bot message holder
        let botMessage = formateMessage("lanterns-msg-temp", "(thinking...)");
        botMessage.classList.add("bot-message-container");

        if(chatMessageContainer){
            chatMessageContainer.appendChild(userMessage);
            chatMessageContainer.appendChild(botMessage);
            chatMessageContainer.scrollTop = chatMessageContainer.scrollHeight - chatMessageContainer.clientHeight;
        }

        // send message to background.js
        chrome.runtime.sendMessage({
            contentScriptQuery: "addMessage",
            queue_id: chatId,
            bot_id: botName,
            api_key: appComponents.api_key,
            api_url: appComponents.api_url,
            user_id: appComponents.user_id,
            text: text,
            timestamp: timestamp.toString(),
            resource: "queues"
        }, function(response){
            if("text" in response){
                // trim the beginning of the string at : and space
                // update bot message
                botMessage.textContent = dropMessageHead(response.text);
                botMessage.id = response.timestamp.toString();
            }else{
                // update bot message
                botMessage.textContent = "Sorry, I am a bit overwhelmed at this moment, please try later...";
                botMessage.id = response.timestamp.toString();
            }

            if(chatMessageContainer){
                chatMessageContainer.scrollTop = chatMessageContainer.scrollHeight - chatMessageContainer.clientHeight;
            }
        });

        
    });

    // add event listener to input textarea enter key
    $("#chat-input-text").keypress(function(e){
        if (e.which == 13){
            $("#chat-input-button").click();
            e.preventDefault();
        }
    });

    // add event listener to delete button

    // add event listener to regenerate button
});

function sortQueue(queue){
    let sortedQueue = Object.keys(queue).sort().reduce(
        (obj, key) => { 
          obj[key] = queue[key]; 
          return obj;
        }, 
        {}
      );
    return sortedQueue;
}

function dropMessageHead(text){
    let index = text.indexOf(":");
    let message = text;

    if (index > -1){
        message = text.substring(index+2);
    }
    return message;
}