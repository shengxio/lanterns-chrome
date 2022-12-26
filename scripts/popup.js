// basic interfaces

// upon user click of lanterns icon
$(document).ready(function(){

    // open lanterns options page
    $("#open_options").click(function(){
        chrome.tabs.create({url: "options.html"});
    });

    // open lanterns options page
    $("#open_settings").click(function(){
        chrome.tabs.create({url: "pages/settings.html"});
    });
    // // setup paramters
    // var debug = true;
    // chrome.runtime.connect({name: "popup"});
    // update_ui_variables();

    // // user experience flow:
    // // - prompt user login/register
    // // - password and username submission form
    // // - get user account data
    // // - get local settings
    // // - get global/remote settings
    
    // // state control diagram for the design.
    // // - local event listeners
    // // - remote event listeners
    // // - state machines
    // // - state transitions
    // // - state variables
    
    // // initialize service list
    // let serviceList= getServices();

    // // initialize components event triggers
    // // add collapse event
    // var coll = document.getElementsByClassName("popup-collapsible");
    // var i;

    // // event listener to capture the selected text sent from background script through context menu
    // // need state of the app control diagram?
    // chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    //     if(request.type=="send_to_lamp"){
    //         let input_value = document.getElementById("input_value");
    //         input_value.textContent = request.main_text;
    //         sendResponse({msg: "received"});
    //     }
    // });

    // // updates collapsed events
    // for (i = 0; i < coll.length; i++) {
    //     coll[i].addEventListener("click", function() {
    //         this.classList.toggle("active");
    //         var content = this.nextElementSibling;
    //         if (content.style.display === "block") {
    //         content.style.display = "none";
    //         } else {
    //         content.style.display = "block";
    //         }
    //     });
    // }

    // // initialize storage content
    // chrome.storage.onChanged.addListener(function() {
    //     update_ui_variables()
    // });

    // $("#run_service").click(function(){
    //     // get input from text input
    //     let main_text = $("#input_value").val();
    //     let title = document.getElementById("output_title");
    //     let language = $("#target_language").val();
    //     let service = $("#target_service").val();

    //     title.textContent = service;

    //     chrome.storage.sync.set({
    //         title:service,
    //         main_text:main_text,
    //         language:language
    //     });

    //     let data = {
    //         "text": main_text,
    //         "language": language
    //     }

    //     send_to_lanterns(service,data,"services",function(response){
    //         // output content if successful
    //         if(response.message=="success"){
    //             // assign element to variable
    //             let output = document.getElementById("output_value");
    //             let notify_text = document.getElementById("notify_text");

    //             let response_text = response.data;
    //             response_text = response_text.replace("\n\n", "");
    //             let text_list = response_text.split("\n");

    //             for(var i; i<text_list.length; i++){
    //                 let newDiv = document.createElement("div");
    //                 newDiv.textContent = text_list[i];
    //                 output.innerHTML += newDiv.outerHTML;
    //             }

    //             // output.innerHTML = response.data;
    //             notify_text.textContent = "click on the text to copy AI facts.";
    //         }
    //     });
    // });

    // // open lanterns homepage    
    // $("#open_home_page").click(function(){
    //     chrome.tabs.create({url: "https://lanterns.fun/"});
    // });

    // // open lanterns community
    // $("#open_discord").click(function(){
    //     chrome.tabs.create({url: "https://discord.gg/a2M3A56YmP"});
    // });

    // // open lanterns options page
    // $("#open_options").click(function(){
    //     chrome.tabs.create({url: "options.html"});
    // });

    // // utility functions
    // function sysLog(message){
    //     if (debug) {
    //         console.log(Date.now() + " " + message);
    //     }
    // }

    // // copy output text to clipboard
    // $("#output_value").click(function(){
    //     // copy to clipboard
    //     let output_value = document.getElementById("output_value");
    //     let copyText = output_value.textContent;

    //     navigator.clipboard.writeText(copyText).then(function() {
    //         // notify user
    //         let notification = document.getElementById("notify_text");
    //         notification.textContent = "AI output copied!";
    //     });
    // });

    // // copy output text to input text area
    // $("#send_to_input").click(function(){
    //     let output_value = document.getElementById("output_value");
    //     let input_value = document.getElementById("input_value");
    //     input_value.textContent = output_value.textContent;
    // });

    // // send thumbup feedback to lanterns
    // $("#feedback-thumbup").click(function(){
    //     chrome.storage.sync.get(["partition_key","sort_key"],function(result){
    //         let data = {
    //             "partition_key": result.partition_key,
    //             "sort_key": result.sort_key,
    //             "feedback":"thumbup"
    //         }

    //         send_to_lanterns("",data,"feedbacks",function(response){
    //             // output content if successful
    //             if(response.message=="success"){
                    
    //                 // assign element to variable
    //                 let notification = document.getElementById("notify_text");
    //                 notification.textContent = "Thank you for your feedback!";
    //             }
    //         });
    //     });
    // });

    // // send thumbdown feedback to lanterns
    // $("#feedback-thumbdown").click(function(){
    //     chrome.storage.sync.get(["partition_key","sort_key"],function(result){
    //         let data = {
    //             "partition_key": result.partition_key,
    //             "sort_key": result.sort_key,
    //             "feedback":"thumbdown"
    //         }

    //         send_to_lanterns("",data,"feedbacks",function(response){
    //             // output content if successful
    //             if(response.message=="success"){
                    
    //                 // assign element to variable
    //                 let notification = document.getElementById("notify_text");
    //                 notification.textContent = "Thank you for your feedback!";
    //             }
    //         });
    //     });
    // });

    // // update ui components from storage.
    // function update_ui_variables(){
    //     chrome.storage.sync.get(["main_text",'output_text',"title","fact_n","language"], function(result) {
    //         let input_value = document.getElementById("input_value");
    //         let output_value = document.getElementById("output_value");
    //         let title = document.getElementById("output_title");
    //         let language = document.getElementById("target_language");

    //         input_value.textContent = result.main_text;
    //         output_value.textContent = result.output_text;
    //         title.textContent = result.title;
    //         language.value = result.language;

    //     });
    // }

    // // get services list from lanterns
    // function getServices(){
    //     chrome.storage.sync.get(["lantern_key","lantern_url"],function(result){
    //         let lantern_key = result.lantern_key;
    //         let lantern_url = result.lantern_url;

    //         // setup generic header
    //         let lanternsHeaders = new Headers();
    //         lanternsHeaders.append("Content-Type", "application/json");
    //         lanternsHeaders.append("x-api-key", lantern_key);

    //         // setup request json construct
    //         let request_json = {
    //             method: 'GET',
    //             headers:lanternsHeaders
    //         };

    //         // setup request
    //         let request = new Request(lantern_url+"services",request_json);

    //         // send request to lanterns
    //         fetch(request).then(res => res.json()).then(function(res){
    //             if (res.message=="success"){
    //                 let services = res.data;

    //                 services = services.filter(function(value){
    //                     return  value!="summarize" && 
    //                             value!="translate" &&
    //                             value!="extract_facts" &&
    //                             value!="filter_content";
    //                 });
    //                 console.log(services);
    //                 let service_list = document.getElementById("service_list");
    //                 let service_list_html = "";
    //                 for(let i=0;i<services.length;i++){
    //                     service_list_html += "<option value='"+services[i]+"'>";
    //                 }
    //                 service_list.innerHTML = service_list_html;
    //             }
    //         });
    //     });
    // }

    // // generic api service request
    // function send_to_lanterns(request_type,data,resource,callback){
    //     // get api_key from storage
    //     chrome.storage.sync.get(['lantern_key','lantern_url','user_id'], function(result) {
    //         let lantern_key = result.lantern_key;
    //         let lantern_url = result.lantern_url;
    //         let user_id = result.user_id;
    //         let notify_text = document.getElementById("notify_text");

    //         // inform user that api is working
    //         notify_text.textContent = "working...";

    //         // setup generic header
    //         let lanternsHeaders = new Headers();
    //         lanternsHeaders.append("Content-Type", "application/json");
    //         lanternsHeaders.append("x-api-key", lantern_key);
            
    //         // setup request body
    //         let json_body = {
    //             "request type": request_type,
    //             "user_id": user_id,
    //             "data": data
    //         };

    //         // setup request json construct
    //         let request_json = {
    //             method: 'PUT',
    //             headers:lanternsHeaders,
    //             body: JSON.stringify(json_body)
    //         };

    //         // setup request
    //         let request = new Request(lantern_url+resource,request_json);
        
    //         // send request to lanterns
    //         fetch(request).then(res => res.json()).then(function(res){
    //             if (res.message=="success"){
    //                 // check if the request was a feedback request
    //                 if (request_type!=""){
    //                     // update ui components
    //                     chrome.storage.sync.set({
    //                         output_text:res.data,
    //                         partition_key:res.partition_key,
    //                         sort_key:res.sort_key
    //                     });
    //                     callback({
    //                         message:res.message,
    //                         data:res.data
    //                     });
    //                 }else{
    //                     callback({
    //                         message:res.message
    //                     });
    //                 }
            
    //             } else {
    //                 notify_text.textContent = "Error: " + res.message;

    //                 // check if the request is a feedback request
    //                 if(request_type!=""){
    //                     chrome.storage.sync.set({
    //                         partition_key:res.partition_key,
    //                         sort_key:res.sort_key
    //                     });
    //                 }

    //                 console.log(res);
    //                 callback( {
    //                     message:res.message
    //                 });
    //             }

    //         }).catch(function(error){
    //             notify_text.textContent = "Error: " + error;
    //             console.log(error);
    //             callback( {
    //                 message:error,
    //                 data:"something went wrong...."
    //             });
    //         });
    //     });
    // }
});
