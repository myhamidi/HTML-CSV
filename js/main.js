// new

a= 1
const myForm1 = document.getElementById("forminput1");
const csvFile1 = document.getElementById("csvFile1");
const myForm2 = document.getElementById("forminput2");
const csvFile2 = document.getElementById("csvFile2");

// csvFile.onchange = () => {
//     const selectedFile = csvFile.files[0];
//     const reader = new FileReader();

//     reader.onload = function (e) {
//       const text = e.target.result;
//       var_data = csvToListofDict(text);
//       for (i=0;i<var_data.length;i++) {
//         var_data[i]["Tags"] = RetListFromString(var_data[i]["Tags"]);
//       }
//       main_datahandler();
//     };
//     reader.readAsText(selectedFile);
//   }