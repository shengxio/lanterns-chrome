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
            $("#saved_api_key").text(result.lantern_key);
        }else{
            $("#saved_api_key").text("no saved latnerns_key");
        }
    });

    // save user entered api_key
    $("#save_api_key").click(function(){
        var key_value = $("#api_key").val();
        chrome.storage.sync.set({
            lantern_key:key_value
        },function (){
            $("#saved_api_key").text(key_value);
        });
    });

    // copy user entered api_key
    $("#saved_api_key").click(function(){
        var copyText = $("#saved_api_key").val();
        navigator.clipboard.writeText(copyText).then(function() {
            $("#notification_api_key").text("key copied");
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
