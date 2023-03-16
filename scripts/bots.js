// upon user click of lanterns icon
$(document).ready(function(){
    // get app version number from manifest
    // initialize components event triggers
    console.log("bots.js loaded")
    var appComponents = {}
    let botList = document.getElementById("bot-list");

    chrome.storage.sync.get(["app_data","api_key","api_url","user_id","bots"],function(result){
        appComponents["info"] = result.app_data;
        appComponents["api_key"] = result.api_key;
        appComponents["api_url"] = result.api_url;
        appComponents["user_id"] = result.user_id;
        appComponents["bots"] = result.bots;

        if(botList){
            appComponents["bots"].forEach(bot => {
                if(!document.getElementById(bot.id)){
                    let bodyEntry = createbot(bot);
                    bodyEntry.id = bot.id;
            
                    bodyEntry.onclick = function(){
                        console.log(bot.id + " clicked")
                        
                        // open chats page
                        window.open("../pages/chats.html?bot="+bot.id,"_self");
                    }
                    botList?.appendChild(bodyEntry);
                }
            });
        }
    });

    // open request bot page in new tab after user clicks on request bot button
    $("#button-request-bot").click(function(){
        window.open("https://forms.gle/F5uc7FzBRqZrZ5r5A");
    });
       
});


// create panel entry
function createbot(bot){
    console.log("creating bot entry for "+bot.id)
    let entry = document.createElement("li");
    entry.className = "list-entry";

    let left = document.createElement("div");
    left.className = "list-entry-left";

    let entryIcon = document.createElement("img");
    entryIcon.className = "list-entry-icon";
    entryIcon.src = bot.avatar;

    left.appendChild(entryIcon);

    let right = document.createElement("div");
    right.className = "list-entry-right";

    let entryTitle = document.createElement("div");
    entryTitle.className = "list-entry-title";
    entryTitle.textContent = bot.id;

    let entryDescription = document.createElement("span");
    entryDescription.className = "list-entry-description";
    entryDescription.textContent = bot.description;

    // let 

    right.appendChild(entryTitle);
    // right.appendChild(entryDescription);

    entry.appendChild(left);
    entry.appendChild(right);
    entry.appendChild(entryDescription);

    return entry;

}

function truncateDescription(description,limit=70){
    if(description.length > limit){
        return description.substring(0,limit)+"...";
    }
    return description;
}