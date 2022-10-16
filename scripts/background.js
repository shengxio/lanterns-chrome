'use strict';

// status check for if the popup is open.
var popup_open = false;
chrome.runtime.onConnect.addListener(function(port) {
    if (port.name == 'popup') {
        popup_open = true;
        port.onDisconnect.addListener(function() {
            popup_open = false;
        });
    }
});

// initialization on chrome extension install
chrome.runtime.onInstalled.addListener(function() {
  // initialize user_id and lanterns api endpoint url
  let user_id = makeid(15);
  chrome.storage.sync.set({
    user_id:user_id,
    lantern_url:"https://lpbebayffa.execute-api.us-east-1.amazonaws.com/alpha-seed/",
    lantern_key:"qQjDWgIqSL2fP401hdJJd3Y4caK19iZ930VhTkND",
    title:"Response section:",
    last_timestamp: new Date()
  });

  // initialize the context menu item send to lamp
  // let contextMenuItem = {
  //   "id":"send_to_lamp",
  //   "title": "send to lamp",
  //   "contexts": ["selection"]
  // };
  // chrome.contextMenus.create(contextMenuItem);
  // chrome.contextMenus.onClicked.addListener(onClickHandler);
});

// initialize the unser uninstallation event survey.
chrome.runtime.onSuspend.addListener(function() {
  // prompt user to fill in the survey
  // chrome.tabs.create({url: "https://discord.gg/a2M3A56YmP"});
});

chrome.runtime.onUpdateAvailable.addListener(function() {
  // prompt user to update application.
  // prompt user for update to the latest application version.
});

// chrome context menu click handler
chrome.contextMenus.onClicked.addListener(onClickHandler);
// context menu click handler
function onClickHandler(clickData) {
  chrome.storage.sync.set({main_text:clickData.selectionText});

  // if popup is open, send text to lamp
  if (popup_open) {
    chrome.runtime.sendMessage({
      type:"send_to_lamp",
      main_text:clickData.selectionText
    }, function(response) {
    });
  }  
}

// generate random user_id
function makeid(length) {
  let result           = '';
  let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
 }
 return result;
}
