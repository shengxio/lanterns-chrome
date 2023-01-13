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
  let appData = chrome.runtime.getManifest();
  let api_url = "https://d4afdjgzee.execute-api.us-east-1.amazonaws.com"
  let api_key = "MLYVxBi4MD3491nltCeiF47nxrVW8eir9Bb3lG74"
  let base_header = new Headers()

  base_header.append("Content-Type", "application/json");
  base_header.append("x-api-key", api_key);

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
    },
    app_data:appData,
    base_header: base_header
  });


});

// initialize the unser uninstallation event survey.
chrome.runtime.onSuspend.addListener(function() {
  // prompt user to fill in the survey
  chrome.tabs.create({url: "https://forms.gle/4Mwvoc1FXNoUmJQH8"});
});

chrome.runtime.onUpdateAvailable.addListener(function() {
  // Send a message to the popup window to update the UI
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

  // send request to popup and wait for response
  chrome.storage.sync.get(["base_header","api_url","user_id"],function(data){
    let request_json = {
      headers:data.base_header,
    }
    if (request.contentScriptQuery == "getBots") {
      request_json.method = "GET"
  
    } else if (request.contentScriptQuery == "getChats") {
      request_json.method = "GET"
      request.data.user_id = data.user_id
      request_json.body = JSON.stringify(request.data)
      
    } else if (request.contentScriptQuery == "getChatString") {
      request_json.method = "GET"
      request.data.user_id = data.user_id
      request_json.body = JSON.stringify(request.data)  
      
    } else if (request.contentScriptQuery == "postChat") {
      request_json.method = "POST"
      request.data.user_id = data.user_id
      request_json.body = JSON.stringify(request.data)
    } else if(request.contentScriptQuery == "postService"){
      request_json.method = "POST"
      request.data.user_id = data.user_id
      request_json.body = JSON.stringify(request.data)
    }

    let req = new Request(data.api_url,request_json);

    fetch(req)
      .then(response => response.json())
      .then(response => sendResponse(response))
      .catch(error => console.log('Error:', error));

    });
  
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
