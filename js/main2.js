
// const myForm1 = document.getElementById("forminput1");
// const myForm2 = document.getElementById("forminput2");
// var csvText1 = "";
// var csvText2 = ""; 
// EASY CSV

// ################################################################
// HTML elements and Globals                                      #
// ################################################################
const reader = new FileReader();

// document elements that are in html
const ecsvFile = document.getElementById("ecsvFile");
// const ecsvDivConfig = document.getElementById("configuration");
const ecsvDivInput = document.getElementById("input");
const ecsvDivOut = document.getElementById("ecsvDivOut");

// document elements created by clsCSV
var tableDiv = document.createElement('div');

// document elements

var activeCSV = 0;

// document elements status
var divID_high = "";

// eCSV variables
var eText = ""; // value in input element

const windowClick = (event) => {
    console.log(event.srcElement.id);
    if (event.srcElement.id.includes("R:") && event.srcElement.id.includes("C:")) {
        ecsv.Edit(event.srcElement.id);
        return;} 
    if (event.srcElement.id == "ecsv-input"){
        // do nothing
        return}
    ecsv.UnEdit();
  }

// ################################################################
// Events when loading site                                       #
// ################################################################

(function () {
    window.addEventListener('click', windowClick)
})();

// ################################################################
// Event when loading file                                        #
// ################################################################

function ReadFile (file) {
    // reader.addEventListener("load", Load);
    reader.addEventListener("loadend", CreateNewECSV);
    reader.readAsText(file);
  }

function CreateNewECSV() {
    ecsv = new clsCSV(reader.result);
    window.addEventListener('click', windowClick)
    ecsv.print();
    ecsv.InitConfig();
    // eval("ecsv" + activeCSV + " = new clsCSV(reader.result)") case formultiple
  }

function Load() {
    // things that shall happen when reader is loaded
  }



ecsvFile.onchange = () => {
    activeCSV = 1;
    ReadFile(ecsvFile.files[0])
    }
  
// ################################################################
// class definition                                               #
// ################################################################



// ###############################################################################
// Load and Save                                                                 #
// ###############################################################################

function _download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    pom.style.display = 'none';
    document.body.appendChild(pom);

    pom.click();

    document.body.removeChild(pom);
}

function download_saveAll() {
    let filename = ecsvFile.value.split("\\").slice(-1)[0]
    let text = ecsv._AsCSV()
    text += ecsv._ConfigAsCSVRow()
    _download(filename, text)
}

function download_saveData() {
    let filename = ecsvFile.value.split("\\").slice(-1)[0]
    let text = ecsv._AsCSV()
    _download(filename, text)
}

function download_saveConfig() {
    alert("funtion not yet implemented")
}

function text_save() {
    let newText = document.getElementById("idText").value;
    let row = RetStringBetween(divID_high,"R:", "C:");
    let col = RetStringBetween(divID_high,"C:", "H:");
    ecsv.data[row][col] = newText;
    let divH = document.getElementById(divID_high).innerText = newText;
}

function new_row() {
    let newRow = [];
    for (i = 0; i < ecsv.headers.length; i++) {
        newRow.push('');
    }
    ecsv.data.push(newRow)
    ecsvDivOut.innerHTML = ecsv._AsHTMLTable()
}



