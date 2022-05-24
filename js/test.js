var d = document.createElement('div');

function CreateTestArea () {
    d.classList.add("border","p-3")
    d.innerHTML = "<b>Test Results:</b><br/>"
    
}


function test_passed(fname) {
    d.innerHTML += '<br/>\nOK ' + fname;
    console.log('OK ' + fname)
}

function test_failed(fname) {
    d.innerHTML += '<br/>\n<font color="red">Failed ' + fname + '</font>';
    console.log('Failed ' + fname)
}



class clsTest {

    test_loadForms() {
        name = "LoadForms"
        var res = myForm1 == undefined || myForm2 == undefined
        if (res) {
            test_failed(name)}
        else {
            test_passed(name)}
    }

    test_CSVFile() {
        name = "CSVFile"
        var res = csvFile1 == undefined || csvFile2 == undefined
        if (res) {
            test_failed(name)}
        else {
            test_passed(name)}
    }

    test_LoadCSV1() {
        name = "LoadCSV 1"
        var res = csvText1 != "" || csvText2 != ""
        if (res) {
            test_passed(name)}
        else {
            test_failed(name)}
    }

    test_LoadCSV2() {
        name = "LoadCSV 2"
        var test_csv = new myCSV(csvText1)
        var assert = IsEqual_List(test_csv.headers, ["Stadt", "Land", "Fluss"])
        if (assert) {
            test_passed(name)}
        else {
            test_failed(name)}
    }

        test_LoadCSV() {
            this.test_LoadCSV1()
            this.test_LoadCSV2()
        }
};



test = new clsTest();


(function () {
    CreateTestArea ()
    // test.test_loadForms()
    // test.test_CSVFile()
    // test.test_LoadCSV()
})();


// ###############################################################################
// Basis                                                                         #
// ###############################################################################

(function test_RetStringBetween () {
    // Test Case 1
    let text = "FirstSecondThird)"
    if (RetStringBetween(text, "First", "Third") == "Second") {
        test_passed(arguments.callee.name)} 
    else {
        test_failed(arguments.callee.name)}
})();

(function test2() {
    test_failed(arguments.callee.name)
})();


(function () {
    let Footer = document.getElementById("Footer")
    Footer.append(d)
})();


