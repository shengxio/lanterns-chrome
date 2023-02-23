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

                for (const timestamp in messages){
                    let messageContainer = formateMessage(timestamp, messages[timestamp]);
                    chatMessageContainer?.appendChild(messageContainer);
                }
                if(chatMessageContainer){
                    chatMessageContainer.scrollTop = chatMessageContainer.scrollHeight - chatMessageContainer.clientHeight;
                }
                
            }
            
        });
    }


    

    // format the received message
    function formateMessage(timestamp, message){
        let messageContainer = document.createElement("div");
        messageContainer.id = timestamp;
        
        let messageText = document.createElement("div");
        messageText.textContent = message;

        // if message start with You: then it is a user message
        if (message.startsWith("You:")){
            messageContainer.classList.add("user-message-container");
            messageText.classList.add("user-message-text");
        } else {
            messageContainer.classList.add("bot-message-container");
            messageText.classList.add("bot-message-text");
        }

        let messageTime = document.createElement("div");
        messageTime.classList.add("message-time");
        messageTime.textContent = message.time;

        // messageContainer.appendChild(messageText);
        // messageContainer.appendChild(messageTime);

        // return messageContainer;
        return messageText;
    }

    // display the queue in body

    // add event listener to send button

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