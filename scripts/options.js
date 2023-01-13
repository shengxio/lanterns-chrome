'use strict';

$(document).ready(function(){
    // Options script starts
    // get app version number from manifest
    let app_data = chrome.runtime.getManifest();
    $("#version").text(app_data.version);

    // initialize components event triggers
    chrome.storage.sync.get(['user_id'],function(result){
        $("#user_id").text(result.user_id);
    });

    // get api_key and api_url from storage
    chrome.storage.sync.get(['lantern_key'], function(result) {
        if(typeof result.lantern_key !== 'undefined'){
            $("#masked_api_key").text(maskKey(result.lantern_key));
        }else{
            $("#masked_api_key").text("no saved latnerns_key");
        }
    });

    // save user entered api_key
    $("#save_api_key").click(function(){
        var key_value = $("#api_key").val();
        chrome.storage.sync.set({
            lantern_key:key_value
        },function (){
            $("#masked_api_key").text(maskKey(key_value));
        });
    });

    // copy user entered api_key
    $("#masked_api_key").click(function(){
        chrome.storage.sync.get(['lantern_key'], function(result) {
            
            if(typeof result.lantern_key !== 'undefined'){
                navigator.clipboard.writeText(result.key).then(function() {
                    showNotification("api key copied to clipboard");
                });
            }else{
                showNotification("no saved api key");
            }
        });       
    });

    // utility functions
    // function sysLog(message){
    //     if (debug) {
    //         console.log(Date.now() + " " + message);
    //     }
    // }

    $("#button-back").click(function(){
        window.history.back();
    });
});

// a function to mask the api key
function maskKey(key){
    var masked_key = key.substring(0,4) + "*".repeat(key.length-8) + key.substring(key.length-4,key.length);
    return masked_key;
}

// briefly add a notification overlay at the top of the page for 3 seconds
function showNotification(message){
    let notification = document.createElement("div");
    notification.id = "notification";
    notification.className = "popup-notification";
    notification.textContent = message;
    
    // $("#notification").append(text);
    $("#options-header").append(notification);

    setTimeout(function(){
        $("#notification").remove();
    },2500);
}