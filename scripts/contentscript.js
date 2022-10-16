'use strict';
// bootstrap user active tab startup

let appName = "LAMP";
let appVersion = "0.0.1";
let appDescription = "LAMP in-browser";
let botname = "Nancy"
let sysFontSize = "11px";
let username = "me";
let text_color = {"user":"green","bot":"purple","sys":"grey"};
// let last_time = chrome.storage.sync.get("last_timestamp", function(items) {
//     if (items.last_timestamp) {
//         return items.last_timestamp;
//     } else {
//         return new Date();
//     }
// });

const appIcon = "bot.png";

let chatbox_hidden = true;

// let appIconActive = "images/icon-128-active.png";
console.log('chatterbox: content script loaded');
// var scripts = document.getElementsByTagName("script"),
//     src = scripts[scripts.length-1].src;
// console.log(src)

// initialize the user preferences specified in the options page
init_spec();


// load page
let data = claw_page(document.body);

// send to ai to get rating/content
service(data);

// load interface
load_interface();
// read context
read_context();
// update interface
// load interface
// refresh interface?
// 

// what problem does this solve?
// it helps users to check the node and the source of the content in the node and its network first and interact with the user in
// a conversational way.



// initialize the user specified preferences
function init_spec(){
    // maybe add app style here.


    // get the user preferences from the options page
    chrome.storage.sync.get({
        // default values
        // user preferences
        // user preferences
        // user preferences
    }, function(items) {
        // set the user preferences
        // user preferences
        // user preferences
        // user preferences
    });

}

// go through the hierarchy of the page and find the components that are needed
function claw_page(node){
    // I stole this function from here:
	// http://is.gd/mwZp7E
	
	var child, next;
    var neighbours = new Set();

	switch ( node.nodeType )  
	{
		case 1:  // Element
        case 2:  // Attribute
        case 3: // Text node
            if(node.parentElement.tagName.toLowerCase() == "a") {
                // console.log(node.parentElement.tagName.toLowerCase());
                // console.log(node.textContent);
                // console.log(node);
                // neighbours.push(node);
                // console.log(node.parentElement.href);
                neighbours.add(node.parentElement.href);
            }
			break;
        case 4:  // CDATASection
        case 5:  // EntityReference
        case 6:  // Entity
        case 7:  // ProcessingInstruction
        case 8:  // Comment
		case 9:  // Document
        case 10: // DocumentType
		case 11: // Document fragment
			child = node.firstChild;
			while ( child ) 
			{
				next = child.nextSibling;
				claw_page(child);
				child = next;
			}
			return ;
        case 12: // Notation

		
	}
}

// run service
function service(data){
}

// load interface
function load_interface(){
    let overlay = createOverlay();

    // add a button which opens the chat window
    overlay.appendChild(createUIButton());

    // add the chat window
    overlay.appendChild(createChatBox());

    // add the overlay to the page
    document.body.appendChild(overlay);

    // add the dragging functionality for the chat window
    dragElement(document.getElementById("chat-window"));
}

// create the overall iframe for the component
function createOverlay(){
    let overlay = document.createElement("div");
    // overlay.style.display = "none";

    // add a button which opens the chat window
    overlay.id = "lamp-overlay";
    overlay.className = "lamp-in-browser-component";
    overlay.style.position = "fixed";
    overlay.style.bottom = "50px";
    overlay.style.right = "50px";
    overlay.style.zIndex = "848";

    return overlay;
}

// create the ui toggle button
function createUIButton() {
    let button = document.createElement("input");

    button.type = "image";
    button.style.borderRadius = "50%";
    button.style.width = "50px";
    button.style.height = "50px";
    button.style.bottom = "100px";
    button.style.right = "50px";
    button.style.cursor = "pointer";
    button.style.boxShadow = "0px 0px 5px 0px rgba(0,0,0,0.75)";
    button.style.zIndex = "2147483647";

    button.className = "content-overlay-button";
    button.title = "Open "+appName;

    button.src = chrome.runtime.getURL(appIcon);
    button.addEventListener("click", function() {
        // console.log("button clicked ");
        toggleElement(document.getElementById("chat-window"));
    }, false);
    
    button.addEventListener("mouseover", function() {
        // light up the button
        button.style.boxShadow = "0px 0px 10px 0px rgba(0,0,0,0.75)";
    }, false);

    button.addEventListener("mouseout", function() {
        // dim the button
        button.style.boxShadow = "0px 0px 5px 0px rgba(0,0,0,0.75)";
    }, false);

    button.addEventListener("mousedown", function() {
        // move the icon
        button.style.boxShadow = "0px 0px 5px 0px rgba(0,0,0,0.75)";
    }, false);

    button.addEventListener("mouseup", function() {
        // release the icon
    }, false);

    return button;
}

// create the chat window
function createChatBox(){
    let window = document.createElement("div");
    window.id = "chat-window";
    window.className = "chat-window";
    window.style.position = "absolute";
    window.style.width = "300px";
    window.style.height = "400px";
    window.style.bottom = "50px";
    window.style.right = "0px";
    window.style.zIndex = "90";
    window.style.boxShadow = "0px 0px 0px 0px rgba(0,0,0,0)";
    window.style.backgroundColor = "transparent";
    window.hidden = chatbox_hidden;

    let windowHeader = document.createElement("div");
    windowHeader.className = "chat-window-header";
    windowHeader.id = "chat-window-header";
    windowHeader.style.top = "0px";
    windowHeader.style.display = "block";
    windowHeader.style.borderRadius = "10px";
    windowHeader.style.height = "20px";
    windowHeader.style.zIndex = "91";
    windowHeader.style.cursor = "move";
    windowHeader.style.boxShadow = "0px 0px 5px 0px rgba(0,0,0,0.75)";
    windowHeader.style.backgroundColor = "orange";
    windowHeader.style.color = "white";

    let windowHeaderTitle = document.createElement("span");
    windowHeaderTitle.className = "chat-window-header-title";
    windowHeaderTitle.id = "chat-window-header-title";
    windowHeaderTitle.style.position = "absolute";
    windowHeaderTitle.style.left = "10px";
    windowHeaderTitle.style.top = "0px";
    windowHeaderTitle.style.display = "inline";
    windowHeaderTitle.style.height = "15px";
    windowHeaderTitle.style.zIndex = "92";
    windowHeaderTitle.style.cursor = "move";
    windowHeaderTitle.style.fontSize = sysFontSize;

    let windowHeaderTitleText = document.createTextNode(botname);
    windowHeaderTitle.appendChild(windowHeaderTitleText);

    let windowHeaderClose = document.createElement("span");
    windowHeaderClose.className = "chat-window-header-close";
    windowHeaderClose.id = "chat-window-header-close";
    windowHeaderClose.style.position = "absolute";
    windowHeaderClose.style.right = "10px";
    windowHeaderClose.style.top = "0px";
    windowHeaderClose.style.display = "inline";
    windowHeaderClose.style.height = "15px";
    windowHeaderClose.style.zIndex = "92";
    windowHeaderClose.style.cursor = "pointer";
    windowHeaderClose.style.fontSize = sysFontSize;

    let windowHeaderCloseText = document.createTextNode("X");
    windowHeaderClose.appendChild(windowHeaderCloseText);

    windowHeader.appendChild(windowHeaderTitle);
    windowHeader.appendChild(windowHeaderClose);

    windowHeaderClose.addEventListener("click", function() {
        toggleElement(document.getElementById("chat-window"));
    }, false);

    let windowBody = document.createElement("div");
    windowBody.className = "chat-window-body";
    windowBody.style.display = "block";
    windowBody.style.padding = "10px";
    windowBody.style.top = "50px";
    windowBody.style.height = "200px";
    windowBody.style.width = "100%";
    windowBody.style.borderRadius = "10px";
    windowBody.style.overflowY = "auto";

    // windowBody.style.flexDirection = "column-reverse";
    windowBody.style.zIndex = "91";
    windowBody.style.backgroundColor = "#f1f1f1";
    windowBody.style.color = "black";
    windowBody.style.boxShadow = "0px 0px 5px 0px rgba(0,0,0,0.75)";

    let scrollAnchor = document.createElement("div");
    scrollAnchor.id = "scroll-anchor";
    scrollAnchor.style.position = "relative";
    scrollAnchor.style.bottom = "0px";
    scrollAnchor.style.overflowAnchor = "auto";
    scrollAnchor.style.height = "1px";
    
    // windowBody.appendChild(scrollAnchor);

    let textArea = document.createElement("textarea");
    textArea.id = "chat-textarea";
    textArea.className = "chat-textarea";
    textArea.style.display = "block";
    textArea.style.padding = "10px";
    textArea.style.width = "100%";
    textArea.style.height = "80px";
    textArea.style.borderRadius = "10px";
    textArea.style.zIndex = "92";
    textArea.style.backgroundColor = "white";
    textArea.style.color = "black";
    // console.log(textArea.style)

    let chatButton = document.createElement("button");
    chatButton.id = "chat-button";
    chatButton.className = "chat-button";
    chatButton.style.display = "block";
    chatButton.style.width = "60px";
    chatButton.style.height = "30px";
    chatButton.style.textAlign = "center";
    chatButton.style.verticalAlign = "middle";
    chatButton.style.zIndex = "93";
    chatButton.style.borderRadius = "10px";
    chatButton.style.backgroundColor = "orange";
    chatButton.style.color = "white";
    chatButton.style.cursor = "pointer";
    chatButton.style.fontSize = sysFontSize;
    chatButton.innerHTML = "Send";

    textArea.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            chatButton.click();
        }
    });

    textArea.addEventListener("focus", function() {
        textArea.style.boxShadow = "0px 0px 5px 0px rgba(0,0,0,0.75)";
    }, false);

    textArea.addEventListener("blur", function() {
        textArea.style.boxShadow = "0px 0px 0px 0px rgba(0,0,0,0)";
    }, false);

    textArea.addEventListener("mouseover", function() {
        textArea.style.boxShadow = "0px 0px 5px 0px rgba(0,0,0,0.75)";
    }, false);

    textArea.addEventListener("mouseout", function() {
        textArea.style.boxShadow = "0px 0px 0px 0px rgba(0,0,0,0)";
    }, false);

    chatButton.addEventListener("click", function() {
        console.log("chat button clicked");
        let text = textArea.value;
        if(text.length > 0){
            // let timeReturn = createTimestamp(last_time);

            windowBody.appendChild(createTimestamp());
            // last_time = timeReturn.last_timestamp;
            windowBody.appendChild(createChatMessage(text, text_color["user"],"right"));
            // let response = send_to_lanterns(botname,text,)
            // let response = send_openai(text);
            // console.log(response)
            windowBody.appendChild(createChatMessage("Hello you!", text_color["bot"],"left"));
            // windowBody.appendChild(createChatMessage("Nancy: "+response, text_color["bot"],"left"));
            
        }
        textArea.value = "";
    }, false);

    chatButton.addEventListener("mousedown", function() {
        chatButton.style.backgroundColor = "silver";
        chatButton.style.color = "orange";
    }, false);

    chatButton.addEventListener("mouseup", function() {
        chatButton.style.backgroundColor = "orange";
        chatButton.style.color = "white";
    }, false);

    chatButton.addEventListener("mouseover", function() {
        chatButton.style.boxShadow = "0px 0px 5px 0px rgba(0,0,0,0.75)";
    }, false);

    chatButton.addEventListener("mouseout", function() {
        chatButton.style.boxShadow = "0px 0px 0px 0px rgba(0,0,0,0)";
    }, false);

    window.appendChild(windowHeader);
    window.appendChild(windowBody);
    window.appendChild(textArea);
    window.appendChild(chatButton);
    
    return window
}

// function send_to_server(text){
//     let data = {
//         "text": text,
//         "user": user,
//         "room": room
//     }
//     fetch("chat", data);

//     return response
// }

// function createTimestamp(last_timestamp){
function createTimestamp(){
    let timestamp = document.createElement("div");
    timestamp.className = "chat-timestamp";
    timestamp.style.display = "block";
    timestamp.style.width = "100%";
    timestamp.style.height = "20px";
    timestamp.style.zIndex = "92";
    timestamp.style.fontSize = sysFontSize;
    timestamp.style.textAlign = "center";
    timestamp.style.color = "grey";

    let date = new Date();
    
    
    let years = date.getFullYear().toString();
    let months = getTimeConverter(date.getMonth()+1)
    let days = getTimeConverter(date.getDate())
    let hours = getTimeConverter(date.getHours());
    let minutes = getTimeConverter(date.getMinutes());
    let seconds = getTimeConverter(date.getSeconds());

    // // check if last message was sent today
    // if(last_timestamp.getDate() == date.getDate() && last_timestamp.getMonth() == date.getMonth() && last_timestamp.getFullYear() == date.getFullYear()){
    //     var date_string = hours + ":" + minutes + ":" + seconds;
    // } else {
    //     var date_string = years + "-" + months + "-" + days + " " + hours + ":" + minutes + ":" + seconds;
    // }

    var date_string = hours + ":" + minutes + ":" + seconds;

    let timestampText = document.createTextNode(date_string);
    timestamp.appendChild(timestampText);

    return {timestamp, date}
}

function getTimeConverter(num){
    var num_string = "";
    if (num < 10) {
        num_string = "0" + num.toString();
    }
    else{
        num_string = num.toString();
    }

    return num_string
}

function createChatMessage(text,color,location){
    let message = document.createElement("div");
    message.className = "chat-message";
    message.style.display = "block";
    message.style.textAlign = location;
    message.style.width = "100%";
    message.style.zIndex = "91";
    message.style.backgroundColor = "transparent";

    let messageText = document.createElement("p");
    messageText.className = "chat-message-text";
    messageText.style.display = "inline";
    messageText.style.padding = "10px";
    messageText.style.margin = "10px";
    messageText.style.top = "0px";
    messageText.style.padding = "0px";
    messageText.style.fontSize = sysFontSize;
    messageText.style.fontWeight = "bold";
    messageText.style.color = color;
    // messageText.style.backgroundColor = "orange";
    // messageText.style.borderRadius = "10px";
    // messageText.style.boxShadow = "0px 0px 5px 0px rgba(0,0,0,0.75)";
    messageText.style.cursor = "pointer";
    messageText.style.textAlign = location;
    messageText.style.width = "auto";
    messageText.style.maxWidth = "80%";
    messageText.style.wordWrap = "break-word";
    messageText.style.whiteSpace = "pre-wrap";
    messageText.style.wordBreak = "break-word";
    messageText.style.overflowWrap = "break-word";
    messageText.style.overflow = "hidden";
    messageText.style.textOverflow = "ellipsis";
    messageText.style.lineHeight = "1.5em";
    messageText.style.height = "auto";
    messageText.style.minHeight = "20px";
    // messageText.innerHTML = user + ": ";
    
    let messageTextText = document.createTextNode(text);
    messageText.appendChild(messageTextText);
    
    message.appendChild(messageText);
    return message;
}

function openChatBox(){
    alert("open chat box");
    chatbox_hidden = false;
}

function closeChatBox(){
    alert("close chat box");
    chatbox_hidden = true;
    // window.hidden = true;
    // console.log("chat window status: "+window.hidden);
}

// read context
function read_context(){
    let neighbours = new Set();
    claw_page(document.body,neighbours);
    console.log("neighbour nodes");
    console.log(neighbours);
}

// where we get all the information on this node.
function walk(node,neighbours)
{
	// I stole this function from here:
	// http://is.gd/mwZp7E
	
	var child, next;

	switch ( node.nodeType )  
	{
		case 1:  // Element
		case 9:  // Document
		case 11: // Document fragment
			child = node.firstChild;
			while ( child ) 
			{
				next = child.nextSibling;
				walk(child,neighbours);
				child = next;
			}
			return ;

		case 3: // Text node
            if(node.parentElement.tagName.toLowerCase() == "a") {
                // console.log(node.parentElement.tagName.toLowerCase());
                // console.log(node.textContent);
                // console.log(node);
                // neighbours.push(node);
                // console.log(node.parentElement.href);
                neighbours.add(node.parentElement.href);
            }
			break;
	}
}

// generic api service request
function send_to_lanterns(bot_name,data,resource,callback){
    // get api_key from storage
    chrome.storage.sync.get(['lantern_key','lantern_url','user_id'], function(result) {
        let lantern_key = result.lantern_key;
        let lantern_url = result.lantern_url;
        let user_id = result.user_id;
        // let notify_text = document.getElementById("notify_text");

        // inform user that api is working
        // notify_text.textContent = "working...";

        // setup generic header
        let lanternsHeaders = new Headers();
        lanternsHeaders.append("Content-Type", "application/json");
        lanternsHeaders.append("x-api-key", lantern_key);
        
        // setup request body
        let json_body = {
            "request type": bot_name,
            "user_id": user_id,
            "data": data
        };

        // setup request json construct
        let request_json = {
            method: 'PUT',
            headers:lanternsHeaders,
            body: JSON.stringify(json_body)
        };

        // setup request
        let request = new Request(lantern_url+resource,request_json);
    
        // send request to lanterns
        fetch(request).then(res => res.json()).then(function(res){
            if (res.message=="success"){
                // check if the request was a feedback request
                if (request_type!=""){
                    // update ui components
                    chrome.storage.sync.set({
                        output_text:res.data,
                        partition_key:res.partition_key,
                        sort_key:res.sort_key
                    });
                    callback({
                        message:res.message,
                        data:res.data
                    });
                }else{
                    callback({
                        message:res.message
                    });
                }
        
            } else {
                // notify_text.textContent = "Error: " + res.message;

                // check if the request is a feedback request
                if(request_type!=""){
                    chrome.storage.sync.set({
                        partition_key:res.partition_key,
                        sort_key:res.sort_key
                    });
                }

                console.log(res);
                callback( {
                    message:res.message
                });
            }

        }).catch(function(error){
            // notify_text.textContent = "Error: " + error;
            console.log(error);
            callback( {
                message:error,
                data:"something went wrong...."
            });
        });
    });
}

// function send_openai(text){
//     let data = {
//         "text": text
//     };
//     send_to_lanterns("openai",data,"/openai",function(res){
//         console.log(res);
//     });
// }
//     prefix = "Q: ";
// }

// some utility functions for in page video and audio control
function toggleMute(element){
    if(element.muted){
        element.pause();
        element.muted = false;
    } else {
        element.play();
        element.muted = true;
    }
    
}

function mute(element){
    element.pause();
    element.muted = true;
}

function muteAll(){
    document.querySelectorAll("video").forEach(v => mute(v));
    document.querySelectorAll("audio").forEach(a => mute(a));
}

// Get page title and return the element
function getTitle(){
    const title = document.createElement('h1');
    let titleContainer = document.createElement('div');
    
    title.className = "content-overlay-title";
    // if(document.head.getElementsByTagName("title")[0].textContent != null){
    //     titleContainer.innerText = document.head.getElementsByTagName("title")[0].textContent;
    // }
    
    // title.appendChild(titleContainer);

    return title;
}

// Get page title and return the element
function getDateTime(){
    let dateTime = document.createElement('div');
    let dateTimeContainer = document.createElement('div');
    
    dateTime.className = "content-overlay-datetime";
    dateTimeContainer.innerText = document.getElementsByTagName("time")[0].dateTime;
    dateTime.appendChild(dateTimeContainer);

    return dateTime;
}

// Get page title and return the element
function getAuthor(){
    let author = document.createElement('div');
    let authorContainer = document.createElement('div');
    
    author.className = "content-overlay-author";
    // authorContainer.innerText = document.body.getElementsByClassName("author")[0].textContent;
    // author.appendChild(authorContainer);

    return author;
}

// Get page title and return the element
function getContent(){
    let content = document.createElement('h1');
    let contents = document.body.getElementsByTagName("article")[0].innerHTML;
    
    // for(let i=0; i<contents.getElementsByTagName("p").length; i++){
    //     let contentContainer = document.createElement('div');
    
    //     content.className = "content-overlay-content";
    //     contentContainer.innerText = contents.getElementsByTagName("p")[i].textContent;
    //     content.appendChild(contentContainer);
    // }

    return content;
}

// UI functions 

// toggle the chat window
function toggleElement(element){
    if(element){
        element.hidden = !element.hidden;
    }
}

// Make the DIV element draggagle - borrowed from https://www.w3schools.com/howto/howto_js_draggable.asp
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  let targetElement = document.getElementById(elmnt.id + "-header")
  if (targetElement) {
    /* if present, the header is where you move the DIV from:*/
    targetElement.onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}