/**
 * Monitora a disponibilidade de emissão da Nota Fiscal Eletrônica
 * Copyright (C) 2023  Renato Tavares <dr.renatotavares@gmail.com>
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

document.addEventListener("DOMContentLoaded", function() {
    
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://nfe.dados.in/disponibilidade-nfe.json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                let obj = JSON.parse(xhr.responseText);
                createTable(obj.status);
            }
        }
    }

    xhr.send();
});

function createTable(obj) {

    let states = {
        "AM" :"Amazonas",
        "BA" :"Bahia",
        "CE" :"Ceará",
        "GO" :"Goiás",
        "MG" :"Minas Gerais",
        "MS" :"Mato Grosso do Sul",
        "MT" :"Mato Grosso",
        "PE" :"Pernambuco",
        "PR" :"Paraná",
        "RS" :"Rio Grande do Sul",
        "SP" :"São Paulo",
        "SVAN" :"Sefaz Virtual do Ambiente Nacional: MA, PA",
        "SVRS" :"Sefaz Virtual do RS",
        "SVC-AN" :"Sefaz Virtual de Contingência Ambiente Nacional: AC, AL, AP, DF, ES, MG, PB, PI, RJ, RN, RO, RR, RS, SC, SE, SP, TO",
        "SVC-RS" :"Sefaz Virtual de Contingência Rio Grande do Sul: AM, BA, CE, GO, MA, MS, MT, PA, PE, PR"
    };

    let table =  document.getElementById("table");

    for (let i = 0; i < obj.length; i++) {
        let row = table.insertRow(-1);

        for (let j = 0; j < obj[i].length; j++) {
            let cell = row.insertCell(j);

            if (j == 0) {
                let abbr = document.createElement("ABBR");
                abbr.setAttribute("title", states[obj[i][0]]);
                abbr.append(chooseStatusIcon(obj[i][j]));
                cell.append(abbr)
            } else {
                cell.append(chooseStatusIcon(obj[i][j]));
            }
        }
    }
}

function chooseStatusIcon(str) {
    let img = new Image();
    
    switch (str) {
        case "ON":
            img.alt = "Verde";
            img.src = "images/verde.png";
            return img;
            break;
        
        case "OFF":
            img.alt = "Vermelho";
            img.src = "images/vermelho.png";
            return img;
            break;
        
        case "UNSTABLE":
            img.alt = "Amarelo";
            img.src = "images/amarelo.png";
            return img;
            break;
        
        default:
            return str;
    }
}
