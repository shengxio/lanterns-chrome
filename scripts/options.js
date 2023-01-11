'use strict';

$(document).ready(function(){
    // Options script starts
    // setup variables
    var debug = true;
    var saved_api_key = document.getElementById("saved_api_key");
    var notification_api_key = document.getElementById("notification_api_key");

    // initialize components event triggers
    chrome.storage.sync.get(['user_id'],function(result){
        let user_id_field = document.getElementById("user_id");
        if (typeof user_id_field !== 'undefined'){
            user_id_field.textContent = result.user_id;
        }
    });

    // get api_key and api_url from storage
    chrome.storage.sync.get(['lantern_key'], function(result) {
        if(typeof result.lantern_key !== 'undefined'){
            saved_api_key.textContent = result.lantern_key;
        }else{
            saved_api_key.textContent = "no saved latnerns_key";
        }
    });

    // save user entered api_key
    $("#save_api_key").click(function(){
        var key_value = $("#api_key").val();
        chrome.storage.sync.set({
            lantern_key:key_value
        },function (){
            saved_api_key.textContent = key_value;
        });
    });

    // save user entered api_key
    $("#saved_api_key").click(function(){
        var copyText = saved_api_key.textContent;
        navigator.clipboard.writeText(copyText).then(function() {
            notification_api_key.textContent = "key copied";
        });        
    });

    // utility functions
    function sysLog(message){
        if (debug) {
            console.log(Date.now() + " " + message);
        }
    }

    $("#button-back").click(function(){
        // window.open("popup.html","_self");
        window.history.back();
    });
});
