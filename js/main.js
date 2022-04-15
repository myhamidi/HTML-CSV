// new

a= 1
const myForm1 = document.getElementById("forminput1");
const csvFile1 = document.getElementById("csvFile1");
const myForm2 = document.getElementById("forminput2");
const csvFile2 = document.getElementById("csvFile2");
var csvText1 = "";
var csvText2 = "";

csvFile1.onchange = () => {
  ReadFile(csvFile1.files[0])
}

function ReadFile (file) {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      
      csvText1 = reader.result;
    }, false);

    reader.readAsText(file);
  }