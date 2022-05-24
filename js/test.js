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

function assertEqual(a,b,fname) {
    if (a == b) {
        test_passed(fname)} 
    else {
        test_failed(fname)}
}

function assertIncludesArray(FullText,includesArray,fname) {
    let flag = true;
    for (let i = 0; i< includesArray.length; i++){  
        flag = true;
        if (!FullText.includes(includesArray[i])) {
            flag = false;}
        }
    if (flag) {           
        test_passed(fname)} 
    else {
        test_failed(fname)}
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
// Tests cls DropDown                                                            #
// ###############################################################################

(function test_classDropDown_Init () {
    let fname = arguments.callee.name;
    // Test Case 1 
    menu = [["File", "Sub1", "Sub2"], ["Edit", "SubEdit1", "SubEdit2"], ["Tools"]]
    let dd = new clsDropDown(menu)
    assertEqual(String(menu), String(dd.Menu()), fname);
    // Test Case 2 (HTML)
    d.append(dd.div);
    let tStr = ['<a class="nav-link" href="#">File</a>',
                '<a class="nav-link" href="#">Edit</a>',
                '<a class="nav-link" href="#">Tools</a>'];
    assertIncludesArray(d.innerHTML, tStr, fname)
})();


// ###############################################################################
// Tests Basis                                                                   #
// ###############################################################################

(function test_RetStringBetween () {
    let fname = arguments.callee.name;
    // Test Case 1 
    assertEqual(RetStringBetween("FirstSecondThird", "First", "Third"), "Second", fname);
    // Test Case 2
    assertEqual(RetStringBetween("FirstSecondThird", "", "Third"), "FirstSecond", fname);
    // Test Case 3
    assertEqual(RetStringBetween("FirstSecondThird", "First", ""), "SecondThird", fname);
    // Test Case 4 (FromString not in text)
    assertEqual(RetStringBetween("FirstSecondThird", "XYZ", "Third"), "FirstSecond", fname);
    // Test Case 5 (ToStrnot in text)
    assertEqual(RetStringBetween("FirstSecondThird", "First", "XYZ"), "SecondThird", fname);
})();

(function test_RetStringOutside() {
    let fname = arguments.callee.name;
    // Test Case 1
    assertEqual(RetStringOutside("HelloFirstSecondThird World", "First", "Third"), "Hello World", fname);
    // Test Case 2
    assertEqual(RetStringOutside("HelloFirstSecondThird World", "", "Third"), " World", fname);
    // Test Case 3
    assertEqual(RetStringOutside("HelloFirstSecondThird World", "First", ""), "Hello", fname);
    // Test Case 4 (FromString not in text)
    assertEqual(RetStringOutside("HelloFirstSecondThird World", "XYZ", "Third"), " World", fname);
    // Test Case 5 (ToStrnot in text)
    assertEqual(RetStringOutside("HelloFirstSecondThird World", "First", "XYZ"), "Hello", fname);
})();


// ###############################################################################
// Append Results to Footer                                                      #
// ###############################################################################

(function () {
    let Footer = document.getElementById("Footer")
    Footer.append(d)
})();

(function () {
    let Footer = document.getElementById("Footer")
    Footer.append(d)
})();


