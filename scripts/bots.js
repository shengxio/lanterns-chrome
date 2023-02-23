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
                if(!document.getElementById(bot.name)){
                    let bodyEntry = createbot(bot.name,bot.description);
                    bodyEntry.id = bot.name;
            
                    bodyEntry.onclick = function(){
                        console.log(bot.name + " clicked")
                        
                        // open chats page
                        window.open("../pages/chats.html?bot="+bot.name,"_self");
                    }
                    botList?.appendChild(bodyEntry);
                }
            });
        }
    });
       
});


// create panel entry
function createbot(name,description){
    console.log("creating bot entry for "+name)
    let entry = document.createElement("li");
    entry.className = "list-entry";

    let left = document.createElement("div");
    left.className = "list-entry-left";

    let entryIcon = document.createElement("img");
    entryIcon.className = "list-entry-icon";
    entryIcon.src = "../images/"+name+".png";

    left.appendChild(entryIcon);

    let right = document.createElement("div");
    right.className = "list-entry-right";

    let entryTitle = document.createElement("div");
    entryTitle.className = "list-entry-title";
    entryTitle.textContent = name;

    let entryDescription = document.createElement("span");
    entryDescription.className = "list-entry-description";
    entryDescription.textContent = description;

    right.appendChild(entryTitle);
    // right.appendChild(entryDescription);

    entry.appendChild(left);
    entry.appendChild(right);
    entry.appendChild(entryDescription);
    // addDescriptionEvents(entry,description);

    return entry;

}

// a function which adds mouseover and mouseout events to the list entries to create and remove the description
// function addDescriptionEvents(entry,description){
//     entry.onmouseover = function(){
//         let descriptionDiv = document.createElement("div");
//         descriptionDiv.className = "list-entry-description";
//         descriptionDiv.textContent = description;
//         descriptionDiv.id = "description";
//         entry.appendChild(descriptionDiv);
//     }
//     entry.onmouseout = function(){
//         let descriptionDiv = document.getElementById("description");
//         descriptionDiv?.remove();
//     }
// }
