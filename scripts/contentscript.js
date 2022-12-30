'use strict';
// bootstrap user active tab startup

let appName = "Lanterns";
let appVersion = "0.1.1";
let appDescription = "Lanterns in-browser";
let botname = "Nancy";
let bot_id = "101";
let sysFontSize = "11px";
let username = "me";
let text_color = {"user":"green","bot":"purple","sys":"grey"};
const appIcon = "bot.png";
const styleDIR = "styles/";

let garbageBin = new Set();

// something here
document.addEventListener('complete', (event) => {
    console.log(`web content readystate: ${document.readyState}`);
});

// this piece of code is for reading the extension storages
chrome.storage.sync.get("", function(items) {
    console.log("storage items:");
    console.log(items);
});

let chatbox_hidden = true;

// initialize the user preferences specified in the options page
init_spec();

// load interface
load_interface();

// update interface
// load interface
// refresh interface?

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
    dragElement(document.getElementById("Lanterns-main-button"));
}

// create the overall iframe for the component
function createOverlay(){
    let overlay = document.createElement("div");
    
    // add a button which opens the chat window
    overlay.id = "Lanterns-overlay";
    overlay.className = "Lanterns-in-browser-component";
    overlay.style.position = "fixed";
    overlay.style.bottom = "100px";
    overlay.style.right = "50px";
    overlay.style.zIndex = "2147483647";

    return overlay;
}

// create the ui toggle button
function createUIButton() {
    let button = document.createElement("input");

    button.type = "image";
    button.style.borderRadius = "50%";
    button.style.width = "50px";
    button.style.height = "50px";
    button.style.cursor = "pointer";
    button.style.boxShadow = "0px 0px 5px 0px rgba(0,0,0,0.75)";
    button.style.zIndex = "2147483647";

    button.className = "content-overlay-button";
    button.title = "Open "+appName;
    button.id = "Lanterns-main-button";

    button.src = chrome.runtime.getURL(appIcon);
    button.addEventListener("click", function() {
        // toggle the chat window
        toggleElement(document.getElementById("chat-window"));
        
        // scrape the page text
        let textPanel = createTextPanel();
        document.body.appendChild(textPanel);

        // scrape the page title
        let title_element = document.getElementsByTagName("title");
        if(title_element.length > 0){
            let title = title_element[0].innerHTML;
            console.log(title);
        }

        // scrape the page url
        let linkPanel = createLinkPanel();
        document.body.appendChild(linkPanel);    

    }, false);

    // add mouse right click event listener
    button.addEventListener("contextmenu", function(event) {
        // prevent the default context menu
        event.preventDefault();
        // toggle the chat window
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
            windowBody.appendChild(createTimestamp());
            windowBody.appendChild(createChatMessage(text, text_color["user"],"right"));
            
            let bot_msg_box = createChatMessage("thinking...", text_color["bot"],"left")
            send_to_lanterns(botname,text,bot_msg_box,update_element);
            
            windowBody.appendChild(bot_msg_box);
            
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

// create a panel for collected links
function createLinkPanel(){
    // scrape the node for links
    let collectedLinks = new Set();

    function dfsGetLinks(node) 
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
                    dfsGetLinks(child);
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
                    collectedLinks.add(linkObj);
                }
                break;
        }
    }

    dfsGetLinks(document.body);
    console.log(collectedLinks);

    // create a panel for collected links
    let linkPanel = document.createElement("div");
    linkPanel.id = "lanterns-link-panel";
    linkPanel.className = "lanterns-link-panel";
    linkPanel.style.display = "none";
    linkPanel.style.position = "fixed";
    linkPanel.style.bottom = "0px";
    linkPanel.style.right = "0px";
    linkPanel.style.width = "300px";
    linkPanel.style.height = "200px";
    linkPanel.style.borderRadius = "10px";
    linkPanel.style.zIndex = "2147483640";
    linkPanel.style.backgroundColor = "white";
    linkPanel.style.color = "black";
    linkPanel.style.boxShadow = "0px 0px 5px 0px rgba(0,0,0,0.75)";
    linkPanel.style.overflowY = "auto";
    linkPanel.style.padding = "10px";
    linkPanel.style.fontSize = sysFontSize;
    linkPanel.hidden = false;

    let linkPanelHeader = document.createElement("div");
    linkPanelHeader.id = "lanterns-link-panel-header";
    linkPanelHeader.className = "lanterns-link-panel-header";
    
    let linkPanelHeaderTitle = document.createElement("div");
    linkPanelHeaderTitle.id = "lanterns-link-panel-header-title";
    linkPanelHeaderTitle.className = "lanterns-link-panel-header-title";
    linkPanelHeaderTitle.style.display = "inline-block";
    linkPanelHeaderTitle.style.width = "80%";
    linkPanelHeaderTitle.style.height = "100%";
    linkPanelHeaderTitle.style.borderRadius = "10px";
    linkPanelHeaderTitle.style.zIndex = "2147483647";
    linkPanelHeaderTitle.style.textAlign = "center";
    linkPanelHeaderTitle.style.verticalAlign = "middle";
    linkPanelHeaderTitle.style.lineHeight = "30px";
    linkPanelHeaderTitle.style.fontSize = sysFontSize;
    linkPanelHeaderTitle.innerHTML = "Collected Links";

    let linkPanelHeaderCloseButton = document.createElement("button");
    linkPanelHeaderCloseButton.id = "lanterns-link-panel-header-close-button";
    linkPanelHeaderCloseButton.className = "lanterns-link-panel-header-close-button";
    linkPanelHeaderCloseButton.style.display = "inline-block";
    linkPanelHeaderCloseButton.style.width = "20%";
    linkPanelHeaderCloseButton.style.height = "100%";
    linkPanelHeaderCloseButton.style.borderRadius = "10px";
    linkPanelHeaderCloseButton.style.zIndex = "2147483647";
    linkPanelHeaderCloseButton.style.textAlign = "center";
    linkPanelHeaderCloseButton.style.verticalAlign = "middle";
    linkPanelHeaderCloseButton.style.lineHeight = "30px";
    linkPanelHeaderCloseButton.style.fontSize = sysFontSize;
    linkPanelHeaderCloseButton.style.backgroundColor = "orange";
    linkPanelHeaderCloseButton.style.color = "white";
    linkPanelHeaderCloseButton.style.border = "none";
    linkPanelHeaderCloseButton.style.boxShadow = "0px 0px 0px 0px rgba(0,0,0,0)";
    linkPanelHeaderCloseButton.innerHTML = "Close";
    linkPanelHeaderCloseButton.addEventListener("click", function() {
        linkPanel.style.display = "none";
    }
    , false);

    linkPanelHeaderCloseButton.addEventListener("mousedown", function() {
        linkPanelHeaderCloseButton.style.backgroundColor = "silver";
        linkPanelHeaderCloseButton.style.color = "orange";
    }
    , false);

    linkPanelHeaderCloseButton.addEventListener("mouseup", function() {
        linkPanelHeaderCloseButton.style.backgroundColor = "orange";
        linkPanelHeaderCloseButton.style.color = "white";
    }
    , false);

    linkPanelHeaderCloseButton.addEventListener("mouseover", function() {
        linkPanelHeaderCloseButton.style.boxShadow = "0px 0px 5px 0px rgba(0,0,0,0.75)";
    }
    , false);

    linkPanelHeaderCloseButton.addEventListener("mouseout", function() {
        linkPanelHeaderCloseButton.style.boxShadow = "0px 0px 0px 0px rgba(0,0,0,0)";
    }
    , false);

    linkPanelHeader.appendChild(linkPanelHeaderTitle);
    linkPanelHeader.appendChild(linkPanelHeaderCloseButton);
    linkPanel.appendChild(linkPanelHeader);

    // add the links to the panel
    for (let i = 0; i < collectedLinks.size; i++) {
        if (collectedLinks[i]) {
            let link = document.createElement("a");
            link.id = "lanterns-link-" + i;
            link.className = "lanterns-link";
            link.style.display = "block";
            link.style.width = "100%";
            link.style.height = "30px";
            link.style.borderRadius = "10px";
            link.style.zIndex = "2147483647";
            link.style.textAlign = "center";
            link.style.verticalAlign = "middle";
            link.style.lineHeight = "30px";
            link.style.fontSize = sysFontSize;
            link.style.backgroundColor = "orange";
            link.style.color = "white";
            link.style.border = "none";
            link.style.boxShadow = "0px 0px 0px 0px rgba(0,0,0,0)";
            link.style.marginBottom = "5px";
            link.href = collectedLinks[i]["link"];
            link.innerHTML = collectedLinks[i]["text"];
            link.target = "_blank";
            link.addEventListener("mousedown", function() {
                link.style.backgroundColor = "silver";
                link.style.color = "orange";
            }
            , false);
            link.addEventListener("mouseup", function() {
                link.style.backgroundColor = "orange";
                link.style.color = "white";
            }
            , false);
            link.addEventListener("mouseover", function() {
                link.style.boxShadow = "0px 0px 5px 0px rgba(0,0,0,0.75)";
            }
            , false);
            link.addEventListener("mouseout", function() {
                link.style.boxShadow = "0px 0px 0px 0px rgba(0,0,0,0)";
            }
            , false);
            linkPanel.appendChild(link);
        }
    }

    return linkPanel;
}


// create a panel for collected text
function createTextPanel(){
    let collectedText = new Set();

    // get the collected text
    function dfsGetText(node) 
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
                    dfsGetText(child);
                    child = next;
                }
                break;
    
            case 3: // Text node
                if(node.parentElement.tagName.toLowerCase() == "p") {
                    let text = node.textContent;
                    let textObj = {
                        "text": text
                    }
                    collectedText.add(textObj);
                }
                break;
        }
    }

    // scrape the text from the current page
    dfsGetText(document.body);
    console.log(collectedText);

    // create the panel
    let textPanel = document.createElement("div");
    textPanel.id = "lanterns-text-panel";
    textPanel.className = "lanterns-text-panel";
    textPanel.style.display = "none";
    textPanel.style.position = "fixed";
    textPanel.style.top = "0px";
    textPanel.style.left = "0px";
    textPanel.style.width = "100%";
    textPanel.style.height = "100%";
    textPanel.style.zIndex = "2147483647";
    textPanel.style.backgroundColor = "rgba(0,0,0,0.5)";
    textPanel.style.textAlign = "center";
    textPanel.style.verticalAlign = "middle";
    textPanel.style.lineHeight = "30px";
    textPanel.style.fontSize = sysFontSize;
    textPanel.style.color = "white";
    textPanel.style.border = "none";
    textPanel.style.boxShadow = "0px 0px 0px 0px rgba(0,0,0,0)";
    
    // create the header
    let textPanelHeader = document.createElement("div");
    textPanelHeader.id = "lanterns-text-panel-header";
    textPanelHeader.className = "lanterns-text-panel-header";
    textPanelHeader.style.display = "block";
    textPanelHeader.style.width = "100%";
    textPanelHeader.style.height = "30px";
    textPanelHeader.style.borderRadius = "10px";
    textPanelHeader.style.zIndex = "2147483647";
    textPanelHeader.style.textAlign = "center";
    textPanelHeader.style.verticalAlign = "middle";
    textPanelHeader.style.lineHeight = "30px";
    textPanelHeader.style.fontSize = sysFontSize;
    textPanelHeader.style.backgroundColor = "orange";
    textPanelHeader.style.color = "white";
    textPanelHeader.style.border = "none";
    textPanelHeader.style.boxShadow = "0px 0px 0px 0px rgba(0,0,0,0)";
    textPanelHeader.style.marginBottom = "5px";


    let textPanelHeaderTitle = document.createElement("div");
    textPanelHeaderTitle.id = "lanterns-text-panel-header-title";
    textPanelHeaderTitle.className = "lanterns-text-panel-header-title";
    textPanelHeaderTitle.style.display = "inline-block";
    textPanelHeaderTitle.style.width = "calc(100% - 30px)";
    textPanelHeaderTitle.style.height = "30px";
    textPanelHeaderTitle.style.borderRadius = "10px";
    textPanelHeaderTitle.style.zIndex = "2147483647";
    textPanelHeaderTitle.style.textAlign = "center";
    textPanelHeaderTitle.style.verticalAlign = "middle";
    textPanelHeaderTitle.style.lineHeight = "30px";
    textPanelHeaderTitle.style.fontSize = sysFontSize;
    textPanelHeaderTitle.style.backgroundColor = "orange";
    textPanelHeaderTitle.style.color = "white";
    textPanelHeaderTitle.style.border = "none";
    textPanelHeaderTitle.style.boxShadow = "0px 0px 0px 0px rgba(0,0,0,0)";
    textPanelHeaderTitle.style.marginBottom = "5px";
    textPanelHeaderTitle.innerHTML = "Collected Text";
    textPanelHeader.appendChild(textPanelHeaderTitle);

    let textPanelHeaderClose = document.createElement("div");
    textPanelHeaderClose.id = "lanterns-text-panel-header-close";
    textPanelHeaderClose.className = "lanterns-text-panel-header-close";
    textPanelHeaderClose.style.display = "inline-block";
    textPanelHeaderClose.style.width = "30px";
    textPanelHeaderClose.style.height = "30px";
    textPanelHeaderClose.style.borderRadius = "10px";
    textPanelHeaderClose.style.zIndex = "2147483647";
    textPanelHeaderClose.style.textAlign = "center";
    textPanelHeaderClose.style.verticalAlign = "middle";
    textPanelHeaderClose.style.lineHeight = "30px";
    textPanelHeaderClose.style.fontSize = sysFontSize;
    textPanelHeaderClose.style.backgroundColor = "orange";
    textPanelHeaderClose.style.color = "white";
    textPanelHeaderClose.style.border = "none";
    textPanelHeaderClose.style.boxShadow = "0px 0px 0px 0px rgba(0,0,0,0)";
    textPanelHeaderClose.style.marginBottom = "5px";
    textPanelHeaderClose.innerHTML = "X";
    textPanelHeaderClose.addEventListener("click", function(){
        textPanel.style.display = "none";
    });
    
    textPanelHeader.appendChild(textPanelHeaderClose);
    textPanel.appendChild(textPanelHeader);

    // create the body
    let textPanelBody = document.createElement("div");
    textPanelBody.id = "lanterns-text-panel-body";
    textPanelBody.className = "lanterns-text-panel-body";
    textPanelBody.style.display = "block";
    textPanelBody.style.width = "100%";
    textPanelBody.style.height = "calc(100% - 30px)";
    textPanelBody.style.borderRadius = "10px";
    textPanelBody.style.zIndex = "2147483647";
    textPanelBody.style.textAlign = "center";
    textPanelBody.style.verticalAlign = "middle";
    textPanelBody.style.lineHeight = "30px";
    textPanelBody.style.fontSize = sysFontSize;
    textPanelBody.style.backgroundColor = "white";
    textPanelBody.style.color = "black";
    textPanelBody.style.border = "none";
    textPanelBody.style.boxShadow = "0px 0px 0px 0px rgba(0,0,0,0)";
    textPanelBody.style.marginBottom = "5px";
    textPanelBody.style.overflowY = "scroll";
    textPanel.appendChild(textPanelBody);

    // create the footer
    let textPanelFooter = document.createElement("div");
    textPanelFooter.id = "lanterns-text-panel-footer";
    textPanelFooter.className = "lanterns-text-panel-footer";
    textPanelFooter.style.display = "block";
    textPanelFooter.style.width = "100%";
    textPanelFooter.style.height = "30px";
    textPanelFooter.style.borderRadius = "10px";
    textPanelFooter.style.zIndex = "2147483647";
    textPanelFooter.style.textAlign = "center";
    textPanelFooter.style.verticalAlign = "middle";
    textPanelFooter.style.lineHeight = "30px";
    textPanelFooter.style.fontSize = sysFontSize;
    textPanelFooter.style.backgroundColor = "orange";
    textPanelFooter.style.color = "white";
    textPanelFooter.style.border = "none";
    textPanelFooter.style.boxShadow = "0px 0px 0px 0px rgba(0,0,0,0)";
    textPanelFooter.style.marginBottom = "5px";
    textPanel.appendChild(textPanelFooter);

    
    for (let i = 0; i < collectedText.size; i++) {
        if(collectedText[i]){
            let textPanelBodyText = document.createElement("div");
            textPanelBodyText.id = "lanterns-text-panel-body-text-" + i;
            textPanelBodyText.className = "lanterns-text-panel-body-text";
            textPanelBodyText.style.display = "block";
            textPanelBodyText.style.width = "100%";
            textPanelBodyText.style.height = "auto";
            textPanelBodyText.style.borderRadius = "10px";
            textPanelBodyText.style.zIndex = "2147483647";
            textPanelBodyText.style.textAlign = "left";
            textPanelBodyText.style.verticalAlign = "middle";
            textPanelBodyText.style.lineHeight = "30px";
            textPanelBodyText.style.fontSize = sysFontSize;
            textPanelBodyText.style.backgroundColor = "white";
            textPanelBodyText.style.color = "black";
            textPanelBodyText.style.border = "none";
            textPanelBodyText.style.boxShadow = "0px 0px 0px 0px rgba(0,0,0,0)";
            textPanelBodyText.style.marginBottom = "5px";
            textPanelBodyText.innerHTML = collectedText[i];
            textPanelBody.appendChild(textPanelBodyText);
        }
    }
    return textPanel;
}

// create timestamp for the chat
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
    
    // let years = date.getFullYear().toString();
    // let months = getTimeConverter(date.getMonth()+1)
    // let days = getTimeConverter(date.getDate())
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

    // return {timestamp, date}
    return timestamp
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
}

function updateText(element, text){
    element.innerHTML = text;
}

function post_data(apiURL,apiKey, data,element,callback){
    // send data to lanterns api
    chrome.runtime.sendMessage(
        {
            contentScriptQuery: "contentPostData"
            , data: data
            , url: apiURL
            , key: apiKey
            , type: "POST"
        }, function (response) {
            if (response != undefined && response != "") {
                console.log(response);
                callback(element,response.text);
            }
            else {
                console.log(response);
            }
        });
}

function update_element(element, text){
    element.getElementsByTagName("p")[0].innerHTML = text;
}

/* lanterns api interaction functions
+ chat request
+ service requests
*/

// old chat api request
function send_to_lanterns(bot_name,text,bot_msg_box,callback){
    // get api_key from storage
    chrome.storage.sync.get(['lantern_key','lantern_url','user_id'], function(result) {
        let lantern_key = result.lantern_key;
        let lantern_url = result.lantern_url+"/v1/bots";
        let user_id = result.user_id;
        
        // setup request body
        let data = {
            "botname": bot_name,
            "bot_id": bot_id,
            "text": text,
            "user_id": user_id,
            "rev": appVersion,
            "timestamp": new Date().toISOString(),
            "request":"chat"
        };
        // send request through background script
        post_data(lantern_url,lantern_key,data,bot_msg_box,callback);
    });
}

// chat api request
function send_chat_request(bot_name,text,bot_msg_box,callback){
    // get api_key from storage
    chrome.storage.sync.get(['lantern_key','lantern_url','user_id'], function(result) {
        let lantern_key = result.lantern_key;
        let lantern_url = result.lantern_url+"/v1/bots";
        let user_id = result.user_id;
        
        // setup request body
        let data = {
            "botname": bot_name,
            "bot_id": bot_id,
            "text": text,
            "user_id": user_id,
            "rev": appVersion,
            "timestamp": new Date().toISOString(),
            "request":"chat"
        };
        // send request through background script
        post_data(lantern_url,lantern_key,data,bot_msg_box,callback);
    });
}

// get the list of bots from lanterns
function get_bots(callback){
    chrome.storage.sync.get(['lantern_key','lantern_url','user_id'], function(result) {
        let lantern_key = result.lantern_key;
        let lantern_url = result.lantern_url+"/v1/bots";
        let user_id = result.user_id;
        
        // setup request body
        let data = {
            "user_id": user_id,
            "rev": appVersion,
            "request":"get bots"
        };
        // send request through background script
        post_data(lantern_url,lantern_key,data,callback);
    });
}

// get the list of services from lanterns
function get_services(callback){
    chrome.storage.sync.get(['lantern_key','lantern_url','user_id'], function(result) {
        let lantern_key = result.lantern_key;
        let lantern_url = result.lantern_url+"/v1/bots";
        let user_id = result.user_id;
        
        // setup request body
        let data = {
            "user_id": user_id,
            "rev": appVersion,
            "request":"get services"
        };
        // send request through background script
        post_data(lantern_url,lantern_key,data,callback);
    });
}

// service api request
function send_service_request(service_name,text,callback){
    chrome.storage.sync.get(['lantern_key','lantern_url','user_id'], function(result) {
        let lantern_key = result.lantern_key;
        let lantern_url = result.lantern_url+"/v1/bots";
        let user_id = result.user_id;
        
        // setup request body
        let data = {
            "service_name": service_name,
            "text":text,
            "user_id": user_id,
            "rev": appVersion,
            "request":"service"
        };
        // send request through background script
        post_data(lantern_url,lantern_key,data,callback);
    });
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
        element.hidden = !element.hidden;
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
  let targetElement = document.getElementById(element.id + "-header")
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
}


// create a panel which holds the element in the panel body
function createPanel(elements){
    let panel = document.createElement("div");
    panel.classList.add("panel");
    panel.classList.add("panel-default");
    panel.classList.add("lantern-panel");
    panel.id = "lantern-panel";
    panel.style.position = "fixed";
    panel.style.top = "0px";
    panel.style.right = "0px";
    panel.style.zIndex = "2147483640";
    panel.style.borderRadius = "10px";
    panel.style.backgroundColor = "white";
    panel.style.boxShadow = "0px 0px 5px 0px rgba(0,0,0,0.75)";
    panel.style.color = "black";
    panel.style.overflowY = "auto";
    panel.style.padding = "10px";
    panel.style.fontSize = sysFontSize;
    panel.hidden = false;



    let panelHeader = document.createElement("div");
    panelHeader.classList.add("panel-heading");
    panelHeader.id = "lantern-panel-header";
    panelHeader.style.display = "block";
    panelHeader.style.width = "100%";
    panelHeader.style.height = "30px";
    panelHeader.style.borderRadius = "10px";
    panelHeader.style.zIndex = "2147483647";


    let panelTitle = document.createElement("h3");
    panelTitle.classList.add("panel-title");
    panelTitle.innerText = "Lantern";
    panelTitle.style.display = "inline-block";
    panelTitle.style.width = "80%";
    panelTitle.style.height = "100%";
    panelTitle.style.borderRadius = "10px";
    panelTitle.style.zIndex = "2147483647";
    panelTitle.style.textAlign = "center";
    panelTitle.style.verticalAlign = "middle";
    panelTitle.style.lineHeight = "30px";
    panelTitle.style.fontSize = sysFontSize;
    panelTitle.innerHTML = "Collected Links";
    panelHeader.appendChild(panelTitle);
    panel.appendChild(panelHeader);

    let panelBody = document.createElement("div");
    panelBody.classList.add("panel-body");
    panelBody.id = "lantern-panel-body";
    panelBody.appendChild(elements);
    panel.appendChild(panelBody);

    let panelHeaderCloseButton = document.createElement("button");
    panelHeaderCloseButton.classList.add("close");
    panelHeaderCloseButton.id = "lantern-panel-header-close-button";
    panelHeaderCloseButton.innerHTML = "X";
    
    panelHeaderCloseButton.style.display = "inline-block";
    panelHeaderCloseButton.style.width = "20%";
    panelHeaderCloseButton.style.height = "100%";
    panelHeaderCloseButton.style.borderRadius = "10px";
    panelHeaderCloseButton.style.zIndex = "2147483647";
    panelHeaderCloseButton.style.textAlign = "center";
    panelHeaderCloseButton.style.verticalAlign = "middle";
    panelHeaderCloseButton.style.lineHeight = "30px";
    panelHeaderCloseButton.style.fontSize = sysFontSize;
    panelHeaderCloseButton.style.backgroundColor = "orange";
    panelHeaderCloseButton.style.color = "white";
    panelHeaderCloseButton.style.border = "none";
    panelHeaderCloseButton.style.boxShadow = "0px 0px 0px 0px rgba(0,0,0,0)";
    panelHeaderCloseButton.onclick = function(){
        toggleElement(panel);
    }
    panelHeader.appendChild(panelHeaderCloseButton);

    return panel;
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
