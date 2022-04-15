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
  main()
}

function ReadFile (file, no) {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      eval("csvText" + no + " = reader.result;")
    }, false);
    reader.addEventListener("loadend", main);
    reader.readAsText(file);
    console.log("print1: " + csvText1);
  }

class myCSV {
  constructor(csvtext, delimiter = ";") {
    var str = csvtext.replace(new RegExp('\r\n', "g") , '\n')
    this.headers = str.slice(0, str.indexOf("\n")).split(delimiter);
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");
    a = 1
  }


}

function main() {
  csv = new myCSV(csvText1)
  console.log("print2: " + csvText1)
}