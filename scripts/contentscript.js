'use strict';
// bootstrap user active tab startup

let username = "me";
let text_color = {"user":"green","bot":"purple","sys":"grey"};

const appIcon = "../images/logo_128.png";
const styleDIR = "../styles/content.css";

var appComponents = {
    "button": appButton(),
    "main-menu": createMainMenu(),
    "chat-menu": createChatMenu(),
    "chat-window": createChatWindow(),
}

main();

function main(){
    // initialize the user preferences specified in the options page
    init_spec();

    // load interface
    load_interface();


}

// main app stream ends here.

// initialize the user specified preferences
function init_spec(){
    // maybe add app style here.
    addStyle(styleDIR);

    // get the user preferences from the options page
    chrome.storage.sync.get("app_data", function(data) {
        appComponents["info"] = data.app_data;
    });
}

// load interface
function load_interface(){

    document.body.appendChild(appComponents["main-menu"]);
    document.body.appendChild(appComponents["button"]);
    
    console.log("Lanterns loaded.")
    
}

// create the an image button
function appButton() {
    let button = document.createElement("img");

    button.src = chrome.runtime.getURL(appIcon);
    button.id = "Lanterns-app-button";
    button.className = "app-button";
    button.title = "Open Lanterns";    

    button.addEventListener("click", function() {
        // toggle the main panel
        let main = document.getElementById("lanterns-main-menu");
        if(main){
            main.style.display = (main.style.display == "none") ? "block" : "none";
            console.log("Lanterns main menu toggled.");
        }
        console.log("clicked Lanterns app button.")

    }, false);

    button = dragElement(button);

    return button;
    
}

// add app style content here
function addStyle(fileDIR){
    let style = document.createElement("link");
    style.rel = "stylesheet";
    style.type = "text/css";
    style.href = chrome.runtime.getURL(fileDIR);
    document.head.appendChild(style);
}


/* Reader environment extrapolation functions
The following function extrapolate the environment of the reader includes
- links
- images
- videos
- text
- audios
*/

// get all content from the page
function getContent(){
    
    let links = new Set();
    let images = new Set();
    let videos = new Set();
    let text = new Set();
    let audios = new Set();

    function dfs(node) 
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
                    dfs(child);
                    child = next;
                }
                break;

            case 3: // Text node
                if(node.parentElement.tagName.toLowerCase() == "a") {
                    let link = node.parentElement.href;
                    let text = node.parentElement.innerText;
                    let linkObj = {
                        "link": link,
                        "text": text
                    }
                    links.add(linkObj);
                } else if(node.parentElement.tagName.toLowerCase() == "img") {
                    let image = node.parentElement.src;
                    images.add(image);
                } else if(node.parentElement.tagName.toLowerCase() == "video") {
                    let video = node.parentElement.src;
                    videos.add(video);
                } else if(node.parentElement.tagName.toLowerCase() == "audio") {
                    let audio = node.parentElement.src;
                    audios.add(audio);
                } else if(node.parentElement.tagName.toLowerCase() == "p") {
                    let text = node.parentElement.innerText;
                    text.add(text);
                }
                break;
        }
    }

    dfs(document.body);
    let memory ={
        "links": links,
        "images": images,
        "videos": videos,
        "text": text,
        "audios": audios
    }
    console.log(memory);
    setToStorage("memory",memory);

    return memory;
}

/* UI functions 
the following functions are used to manipulate the UI elements
+ toggle element on and off
+ toggle element audio/video mute

+ update video/audio elements to mute
    - update all video/audio elements to mute
+ update element can be highlighted and selected when mouse over
+ update element to be dragged
+ update element style

+ create custom context menu

*/

// toggle the chat window
function toggleElement(element){
    if(element){
        element.style.display = (element.style.display == "none") ? "block" : "none";
    }
}

// toggle an audio/video element
function toggleMute(element){
    if(element.muted){
        element.pause();
        element.muted = false;
    } else {
        element.play();
        element.muted = true;
    }
}

// mute an audio/video element
function mute(element){
    element.pause();
    element.muted = true;
}

// mute all audio/video elements
function muteAll(){
    document.querySelectorAll("video").forEach(v => mute(v));
    document.querySelectorAll("audio").forEach(a => mute(a));
}

// update element to be highlighted and selected when mouse over
function updateElementHighlight(element){
    element.onmouseover = function() {
        element.style.border = "2px solid #000000";
        element.style.borderRadius = "5px";
    }
    element.onmouseout = function() {
        element.style.border = "none";
    }
    return element;
}

// Make the DIV element draggagle - borrowed from https://www.w3schools.com/howto/howto_js_draggable.asp
function dragElement(element) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  let targetElement = document.getElementById(element.className + "-header")
  if (targetElement) {
    /* if present, the header is where you move the DIV from:*/
    targetElement.onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    element.onmousedown = dragMouseDown;
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
    element.style.top = (element.offsetTop - pos2) + "px";
    element.style.left = (element.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
  return element
}

// create a standard panel with header, body and footer
function createMainMenu(){
    let body = document.createElement("div");    

    // getBots().then(bots => {
    //     let botList = document.createElement("div");
    //     botList.className = "app-panel-body";
    //     botList.id = "bot-list";
    //     bots.forEach(bot => {
    //         let botElement = document.createElement("div");
    //         botElement.className = "bot-element";
    //         botElement.textContent = bot.name;
    //         botElement.onclick = function(){
    //             // toggleElement(panel);
    //             toggleElement(document.getElementById("lanterns-chat-window"));
    //         }
    //         botList.appendChild(botElement);
    //     });
    //     panel.appendChild(botList);
    // });

    let mainMenu = createPanel("main menu",body,"");
    mainMenu.id = "lanterns-main-menu";

    return mainMenu;
}

// create a standard panel with header, body and footer
function createPanel(title,body,footer){
    // create the panel
    let panel = document.createElement("div");
    panel.className = "app-panel";

    // create the panel header
    let panelHeader = document.createElement("div");
    panelHeader.id = title + "-header";
    panelHeader.className = "app-panel-header";
    panelHeader.textContent = title;

    let panelHeaderCloseButton = document.createElement("button");
    panelHeaderCloseButton.id = title + "-close-button";
    panelHeaderCloseButton.className = "app-panel-header-button";
    panelHeaderCloseButton.innerHTML = "X";
    
    panelHeaderCloseButton.addEventListener("click",function(){
        toggleElement(panel);
    });
    
    let headerDivider = document.createElement("div");
    headerDivider.id = title + "-header-divider";
    headerDivider.className = "app-divider";

    panelHeader.appendChild(panelHeaderCloseButton);
    panelHeader.appendChild(headerDivider);
    panelHeader.addEventListener("mousedown", function(e){
        dragElement(panel);
    });

    panel.appendChild(panelHeader);

    // create the panel body
    let panelBody = document.createElement("div");
    panelBody.id = title + "-body";
    panelBody.className = "app-panel-body";
    panelBody.appendChild(body);
    panel.appendChild(panelBody);

    let footerDivider = document.createElement("div");
    footerDivider.className = "app-divider";

    // create the panel footer
    let panelFooter = document.createElement("div");
    panelFooter.id = title + "-footer";
    panelFooter.className = "app-panel-footer";
    panelFooter.appendChild(footerDivider);
    panelFooter.textContent = footer;
    panel.appendChild(panelFooter);

    return panel;
}

// create a chat menu
function createChatMenu(bot_id){
    let body = document.createElement("div");    

    let chatMenu = createPanel(bot_id,body,"");
    chatMenu.id = "chat-menu";

    return chatMenu;
}

function createChatWindow(chat_title){
    let body = document.createElement("div");    

    let chatWindow = createPanel(chat_title,body,"");
    chatWindow.id = "chat-window";

    return chatWindow;
}
    
    

/* Storage functions
the following functions are used to get and set variables in the storage

+ getFromStorage(key)
+ setToStorage(key,value)

*/

// get variable from the storage
function getFromStorage(key){
    chrome.storage.sync.get([key], function(result) {
        return result[key];
    });
}

// set variable in the storage to value
function setToStorage(key,value){
    chrome.storage.sync.set({[key]: value}, function() {
        console.log('Value is set to ' + value);
    });
}

// the following functions are used to communicate with
// background.js to send and receive content from api endpoint

// get the list of bots
function getBots(){
    // send message to the background script to get the list of bots
    chrome.runtime.sendMessage({type: "getBots"}, function(response) {
        if(response){
            console.log(response);
            return response;
        }else{
            console.log("no response");
            return null;
        }
    });
}

// get the list of services
function getServices(){
    // send message to the background script to get the list of services
    chrome.runtime.sendMessage({contentScriptQuery: "getServices"}, function(response) {
        if(response){
            console.log(response);
            return response;
        }else{
            console.log("no response");
            return null;
        }
    });
}

// get the list of chats
function getChats(bot_id){
    // send message to the background script to get the list of chats
    chrome.runtime.sendMessage({
        contentScriptQuery: "getChats",
        bot_id: bot_id,
    }, function(response) {
        if(response){
            console.log(response);
            return response;
        }else{
            console.log("no response");
            return null;
        }
    });
}

// get the chat history
function getChatString(chat_id){
    // send message to the background script to get the chat history
    chrome.runtime.sendMessage({contentScriptQuery: "getChatString", chat_id: chat_id}, function(response) {
        if(response){
            console.log(response);
            return response;
        }else{
            console.log("no response");
            return null;
        }
    });
}

// send chat message
function postChat(chat_id, message){
    // send message to the background script to send a chat message
    chrome.runtime.sendMessage({contentScriptQuery: "postChat", chat_id:chat_id, message: message}, function(response) {
        if(response){
            console.log(response);
            return response;
        }else{
            console.log("no response");
            return null;
        }
    });
}

// send service
function postService(service_id,content){
    // send content to the background script to send a service
    chrome.runtime.sendMessage({contentScriptQuery: "postService", service_id:service_id, content: content}, function(response) {
        if(response){
            console.log(response);
            return response;
        }else{
            console.log("no response");
            return null;
        }
    });
}