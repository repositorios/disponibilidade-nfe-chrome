"use strict";

document.getElementById("save").addEventListener("click", function() {

    let checked = document.querySelectorAll("[name='states']:checked");
    let enableAlert = document.getElementById("alerts").value;
    let statesToAlert = [];

    for (let x of checked) {
        statesToAlert.push(x.value);
    }

    chrome.storage.sync.set({
        enableAlert: enableAlert,
        states: statesToAlert
    }, function() {
        var status = document.getElementById("status");
        status.textContent = "Opções salvas com sucesso!";
        setTimeout(function() {
            status.textContent = "";
        }, 5000);
    });
});

document.addEventListener("DOMContentLoaded", function() {
    chrome.storage.sync.get({
        enableAlert: "N",
        states: []
    }, function(items) {
        document.getElementById("alerts").value = items.enableAlert;

        for (let check of items.states) {
            document.getElementById(check).checked = true;
        }
    });
});

document.getElementById("clear").addEventListener("click", function() {
    chrome.storage.sync.clear();
    alert("Todos os dados limpos");
    document.location.reload(true);
});
