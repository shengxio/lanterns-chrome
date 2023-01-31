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
    },
    app_data:appData
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
  let header = new Headers();
  header.append("Content-Type", "application/json");
  header.append("x-api-key", request.api_key);

  let request_json = {
    headers:header
  }
  let url = request.api_url +"/"+ request.resource

  if (request.contentScriptQuery == "getBots") { // tested
    request_json.method = "GET"

  } else if(request.contentScriptQuery == "getServices") { // tested
    request_json.method = "GET"
    
  } else if(request.contentScriptQuery == "postService"){
    request_json.method = "POST"
    request.data.user_id = request.user_id
    request_json.body = JSON.stringify(request.data);

  } else if (request.contentScriptQuery == "getChats") { // tested
    request_json.method = "GET"
    url = url+ "?" + new URLSearchParams({
      user_id: request.user_id,
      bot_id: request.bot_id
    });
    
  } else if (request.contentScriptQuery == "addChat") { // tested
    request_json.method = "POST"
    url = url+ "?" + new URLSearchParams({
      user_id: request.user_id,
      bot_id: request.bot_id,
    });
    request_json.body = JSON.stringify(request.data);

  } else if (request.contentScriptQuery == "deleteChat") {
    request_json.method = "DELETE"
    url = url+ "?" + new URLSearchParams({
      user_id: request.user_id,
      bot_id: request.bot_id,
    });
    request_json.body = JSON.stringify(request.data);
  
  } else if (request.contentScriptQuery == "updateChat") {
    console.log("update chat:" + request.data);
    request_json.method = "PUT"
    url = url+ "?" + new URLSearchParams({
      user_id: request.user_id,
      bot_id: request.bot_id
    });
    request_json.body = JSON.stringify(request.data);
    

  }  else if (request.contentScriptQuery == "getQueue") {
    request_json.method = "GET"
    url = url+ "?" + new URLSearchParams({
      chat_id: request.chat_id
    });
    request_json.body = JSON.stringify(request.data);

  }

  console.log(request_json);
  console.log(url)

  let req = new Request(url,request_json);

  (async() =>{
    await fetch(req)
      .then(response => response.json()) 
      .then(function(response){
        sendResponse(response);
      })
      .catch(error => console.log('Error:', error,error.message));
  })();
  return true;  // important! do not delete! this is what makes the sending end wait for asynchronous response

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
