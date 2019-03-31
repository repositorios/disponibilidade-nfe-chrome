
"use strict";

chrome.browserAction.setBadgeText({text:"NF-e"});
chrome.runtime.setUninstallURL("https://www.sistemaeorbis.com.br");
chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        chrome.tabs.create({url: "options.html"});
    }else if(details.reason == "update"){
        //call a function to handle an update
    }
});

clearErrorAlert();

chrome.alarms.create("5min", {
    delayInMinutes: 10,
    periodInMinutes: 10
});

chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name === "5min") {
        makeRequest();
    }
});

function makeRequest() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "http://134.209.210.149/disponibilidade-nfe.json");
    xhr.onreadystatechange = function() {

        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                let obj = JSON.parse(xhr.responseText);
                checkOfflineService(obj.status);
            }
        }
    }

    xhr.send();
}

function checkOfflineService(allStatus) {
    let hadError = false;

    for (let rows of allStatus) {
        for (let i = 0; i < rows.length; i++) {
            if (rows[i] == "OFF" || rows[i] == "UNSTABLE") {
                hadError = true;


                chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });

                chrome.storage.sync.get({
                    enableAlert: "N",
                    states: []
                }, function(items) {
                    if (items.enableAlert == "S" && items.states.includes(rows[0])) {
                        errorAlert([rows[0]]);
                    }
                });
            }
        }
    }

    if (!hadError) {
        clearErrorAlert();
    }
}

function errorAlert(state) {
    chrome.notifications.create({
        type:     "basic",
        iconUrl:  "images/nfe128.png",
        title:    "Alerta na emissão de NF-e",
        message:  "A emissão de NF-e no estado de "+ state +" pode apresentar falhas. Fique atento!",
        buttons: [
            {title: "Tudo bem!"}
        ],
        priority: 0});
}

function clearErrorAlert() {
    chrome.browserAction.setBadgeBackgroundColor({ color: [122, 186, 122, 255] });
}
