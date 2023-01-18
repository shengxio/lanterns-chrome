// basic interfaces

// upon user click of lanterns icon
$(document).ready(function(){
    // get app version number from manifest
    let app_data = chrome.runtime.getManifest();
    $("#version").text(app_data.version);
    // initialize components event triggers
    chrome.storage.sync.get(['user_id'],function(result){
        $("#user_id").text(result.user_id);
        console.log(result.user_id);
    });

    // get api server status
    
    
    // open lanterns options page
    $("#open_options").click(function(){
        window.open("./pages/options.html","_self");
    });

    // open lanterns feedback page (google form)
    $("#open_feedback").click(function(){
        window.open("https://forms.gle/X8KqwR9Qcaw21rLw7");
    });

    // open lanterns discord community
    $("#join_community").click(function(){
        // open discord community invite link in new tabs
        window.open("https://discord.gg/VZzaVqBB9J");
    });

    // open lanterns updates and frequently asked questions page
    $("#open_updates").click(function(){
        window.open("https://www.lanterns.fun");

    });

    
});

// get server status
function getStatus(){
    $.ajax({
        url: "https://api.lanterns.fun/status",
        type: "GET",
        success: function(data){

            // turn server_status componet green if server is up
            if(data.status == "up"){
                $("#server_status").css("color","green");
            }
            // turn server_status componet red if server is down
            else{
                $("#server_status").css("color","red");
            }

            console.log(data);
            $("#server_status").text(data.status);
        },
        error: function(error){
            console.log(error);
        }
    });
}