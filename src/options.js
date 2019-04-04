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

document.getElementById("save").addEventListener("click", function() {

    let checked = document.querySelectorAll("[name='states']:checked");
    let enableAlert = document.getElementById("alerts").value;
    let alertInterval = document.getElementById("interval").value;
    let statesToAlert = [];

    for (let x of checked) {
        statesToAlert.push(x.value);
    }

    let syncObj = {
        enableAlert: enableAlert,
        alertInterval: alertInterval,
        states: statesToAlert
    };

    chrome.storage.sync.set(syncObj, function() {
        var status = document.getElementById("status");
        status.textContent = "Opções salvas com sucesso!";
        
        setTimeout(function(){ status.textContent = "";}, 5000);
    });
});

document.addEventListener("DOMContentLoaded", function() {
    
    let syncObj = {
        enableAlert: "N",
        alertInterval: "30",
        states: []
    };

    chrome.storage.sync.get(syncObj, function(items) {
        document.getElementById("alerts").value = items.enableAlert;
        document.getElementById("interval").value = items.alertInterval;

        for (let check of items.states) {
            document.getElementById(check).checked = true;
        }
    });
});

document.getElementById("clear").addEventListener("click", function() {

    var con = confirm("Todos os dados serão limpos. Continuar?");
  
    if (con == true) {
        chrome.storage.sync.clear();
        alert("Configurações limpas com sucesso.");
        document.location.reload(true);
    } 
});
