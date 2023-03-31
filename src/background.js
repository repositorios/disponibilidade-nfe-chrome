/**
 * Monitora a disponibilidade de emissão da Nota Fiscal Eletrônica
 * Copyright (C) 2019  Renato Tavares <dr.renatotavares@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 * 
*/

"use strict";

chrome.browserAction.setBadgeText({text:"NF-e"});

chrome.runtime.setUninstallURL("https://www.sistemaeorbis.com.br");

chrome.runtime.onInstalled.addListener(function(details) {
    
    chrome.storage.sync.set({enableAlert: "N", alertInterval: "30", states: []});

    if(details.reason == "install") {
        chrome.runtime.openOptionsPage();
    
    } else if(details.reason == "update") {
        //call a function to handle an update
    }
});

chrome.alarms.create("60min", {
    delayInMinutes: 1,
    periodInMinutes: 60
});

chrome.alarms.create("30min", {
    delayInMinutes: 1,
    periodInMinutes: 30
});

chrome.alarms.create("15min", {
    delayInMinutes: 1,
    periodInMinutes: 15
});

chrome.alarms.create("10min", {
    delayInMinutes: 1,
    periodInMinutes: 10
});

chrome.alarms.create("5min", {
    delayInMinutes: 1,
    periodInMinutes: 5
});

chrome.alarms.create("1min", {
    delayInMinutes: 1,
    periodInMinutes: 1
});

chrome.alarms.onAlarm.addListener(function(alarm) {

    let syncObj = {
        enableAlert: "N",
        alertInterval: "30",
        states: []
    };

    chrome.storage.sync.get(syncObj, function(items) {
        
        switch(alarm.name) {
            case "60min":
                if (items.alertInterval == "60") checkServiceStatusForAlerts();
                break;

            case "30min":
                if (items.alertInterval == "30") checkServiceStatusForAlerts();
                break;

            case "15min":
                if (items.alertInterval == "15") checkServiceStatusForAlerts();
                break;

            case "10min":
                if (items.alertInterval == "10") checkServiceStatusForAlerts();
                break;

            case "5min":
                if (items.alertInterval == "5") checkServiceStatusForAlerts();
                break;

            case "1min":
                updateBadgeBackgroundColor();
                break;
        }
    });
});

function checkServiceStatusForAlerts() {

    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://nfe.dados.in/disponibilidade-nfe.json");
    xhr.onreadystatechange = function() {

        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                let obj = JSON.parse(xhr.responseText);
               
                for (let rows of obj.status) {
                    
                    let unstable = 0;
                    let off = 0;

                    for (let i = 0; i < rows.length; i++) {

                        if (rows[i] == "UNSTABLE") {
                            unstable++;
                        } else if (rows[i] == "OFF") {
                            off++;
                        } 
                    }

                    if (unstable > 0 && off <= 0) {
                        sendErrorAlert(rows[0], "UNSTABLE");
                    } else if (off > 0) {
                        sendErrorAlert(rows[0], "OFF");
                    }
                }
            }
        }
    }

    xhr.send();
}
 
function updateBadgeBackgroundColor() {

    let unstable = 0;
    let off = 0;
    let on = 0;

    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://nfe.dados.in/disponibilidade-nfe.json");
    
    xhr.onreadystatechange = function() {

        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                
                let obj = JSON.parse(xhr.responseText);

                for (let rows of obj.status) {
                    for (let i = 0; i < rows.length; i++) {

                        if (rows[i] == "UNSTABLE") {
                            unstable++;
                        }
                        else if (rows[i] == "OFF") {
                            off++;
                        } else {
                            on++;
                        }
                    }
                }

                if (off > 0) {
                    chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});
                    return;
                } else if (unstable > 0 && off <= 0) { 
                    chrome.browserAction.setBadgeBackgroundColor({color: [238, 210, 2, 255]});
                    return;
                } else if (on > 0 && unstable <= 0 && off <= 0) {
                    chrome.browserAction.setBadgeBackgroundColor({color: [122, 186, 122, 255]});
                    return;
                }
            }
        }
    }

    xhr.send();
}

function sendErrorAlert(state, cause="OFF") {

    let msg = "";

    if (cause == "OFF") {
        msg = "falhas";
    } else if (cause == "UNSTABLE"){
        msg = "instabilidade";
    }

    let syncObj = {
        enableAlert: "N",
        states: []
    };

    chrome.storage.sync.get(syncObj, function(items) {
        
        if (items.enableAlert == "S" && items.states.includes(state)) {
            chrome.notifications.create({
                type:     "basic",
                iconUrl:  "images/nfe128.png",
                title:    "Alerta na emissão de NF-e",
                message:  "A emissão de NF-e no estado de "+ state +" pode apresentar "+ msg +". Fique atento!",
                buttons: [
                    {title: "Tudo bem!"}
                ],
                priority: 0
            });
        }
    });
}
