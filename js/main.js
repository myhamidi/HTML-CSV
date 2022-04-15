// new

a= 1
const myForm1 = document.getElementById("forminput1");
const csvFile1 = document.getElementById("csvFile1");
const myForm2 = document.getElementById("forminput2");
const csvFile2 = document.getElementById("csvFile2");
var csvText1 = "";
var csvText2 = "";

csvFile1.onchange = () => {
  ReadFile(csvFile1.files[0], 1)
}

csvFile2.onchange = () => {
  ReadFile(csvFile2.files[0], 2)
}

function ReadFile (file, no) {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      
      eval("csvText" + no + " = reader.result;")
    }, false);

    reader.readAsText(file);
  }