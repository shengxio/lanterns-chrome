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
  let appData = chrome.runtime.getManifest();
  let api_url = "https://d4afdjgzee.execute-api.us-east-1.amazonaws.com/v1"
  let api_key = "MLYVxBi4MD3491nltCeiF47nxrVW8eir9Bb3lG74"
  
  chrome.storage.sync.set({
    user_id:user_id,
    api_url:api_url,
    api_key:api_key,
    title:"Response section:",
    last_timestamp: new Date(),
    memory: {
      "links": new Set(),
      "images": [],
      "videos": [],
      "text": new Set(),
      "title": ""
    } 
  });

  // initialize the context menu item send to lamp
  let contextMenuItem = {
    "id":"summarize_post",
    "title": "summarie post",
    "contexts": ["selection"]
  };
  chrome.contextMenus.create(contextMenuItem);
  chrome.contextMenus.onClicked.addListener(onClickHandler);
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
      type:"summarize_post",
      main_text:clickData.selectionText
    }, function(response) {
    });
  }  
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // standard element communication respondence
  // send request to popup and wait for response
  if (request.contentScriptQuery == "contentPostData") {
    
    let headers = new Headers()
    headers.append("Content-Type", "application/json");
    headers.append("x-api-key", request.key);

    let request_json = {
      method: request.type,
      headers:headers,
      body: JSON.stringify(request.data)
    };

    let req = new Request(request.url,request_json);
    console.log(request)
    console.log(req);
    fetch(req)
      .then(response => response.json())
      .then(response => sendResponse(response))
      .catch(error => console.log('Error:', error));
    
  return true;
  }
});

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
