document.addEventListener("DOMContentLoaded", function() {
    makeRequest();
})

function makeRequest() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "http://134.209.210.149/disponibilidade-nfe.json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                let obj = JSON.parse(xhr.responseText);
                createTable(obj.status);
            }
        }
    }

    xhr.send();
}

function createTable(obj) {
    let table =  document.getElementById("table");

    for (let i = 0; i < obj.length; i++) {
        let row = table.insertRow(-1);

        for (let j = 0; j < obj[i].length; j++) {
            let cell = row.insertCell(j);
            cell.innerHTML =  chooseStatusIcon(obj[i][j]);
        }
    }
}

function chooseStatusIcon(str) {
    switch (str) {
        case "ON":
        return "<img src=\"images/verde.png\">";
        break;
        case "OFF":
        return "<img src=\"images/vermelho.png\">";
        break;
        case "UNSTABLE":
        return "<img src=\"images/amarelo.png\">";
        break;
        default:
        return str;
    }
}
