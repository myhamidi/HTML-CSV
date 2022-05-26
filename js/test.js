var d = document.createElement('div');

function CreateTestArea () {
    d.classList.add("border","p-3")
    d.innerHTML = "<b>Test Results:</b><br/>"
    
}

function test_passed(fname) {
    if (!d.innerHTML.includes('OK ' + fname)) {
        d.innerHTML += '<br/>\nOK ' + fname;}
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
        if (!FullText.includes(includesArray[i])) {
            flag = false;}
        }
    if (flag) {           
        test_passed(fname)} 
    else {
        test_failed(fname)}
}

function NassertIncludesArray(FullText,includesArray,fname) {
    let flag = true;
    for (let i = 0; i< includesArray.length; i++){  
        if (FullText.includes(includesArray[i])) {
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
// Tests cls CSV                                                                 #
// ###############################################################################
var std_csv_text = "Stadt;Land;Fluss\nMunich;Germany;Isar";

(function test_classCSV_Init () {
    let fname = arguments.callee.name;
    // Test Case 1 
    let csv = new clsCSV("",";",'test');
    assertEqual("...", csv.data[0][0], fname);
    assertEqual(1, csv.len, fname);
    assertEqual(String(["col-A"]), String(csv.headers), fname);
})();

(function test_classCSV_AddCol () {
    let fname = arguments.callee.name;
    // Test Case 1 
    let csv = new clsCSV(std_csv_text,';','test');
    csv.AddCol()
    assertEqual(String(["Stadt","Land","Fluss", ".."]), String(csv.headers), fname);
    assertEqual(String(["Munich","Germany","Isar", ".."]), String(csv.data[0]), fname);
})();

(function test_classCSV_AddRow () {
    let fname = arguments.callee.name;
    // Test Case 1 
    let csv = new clsCSV(std_csv_text,';','test');
    csv.AddRow()
    assertEqual(String(["Munich","Germany","Isar"]), String(csv.data[0]), fname);
    assertEqual(String(["..","..",".."]), String(csv.data[1]), fname);
})();

(function test_classCSV_Edit () {
    let fname = arguments.callee.name;
    // Test Case 1 
    let csv = new clsCSV(std_csv_text,';','test');
    csv.Edit("R:0C:0H:col-A") // id = "R:0C:0H:col-A" of default new table
    let ParentOfInput = document.getElementById("R:0C:0H:col-A")
    assertIncludesArray(ParentOfInput.innerHTML, ['<input id="ecsv-input">','<a id="ecsv-input-save" href="#"'], fname);
    assertIncludesArray(String(ParentOfInput.classList), ['table-info'], fname);
    csv.UnEdit()
    NassertIncludesArray(ParentOfInput.innerHTML, ['<input id="ecsv-input">', '<a id="ecsv-input-save" href="#"'], fname);
    NassertIncludesArray(String(ParentOfInput.classList), ['table-info'], fname);
})();

(function test_classCSV_SaveEdit () {
    let fname = arguments.callee.name;
    // Test Case 1 
    let csv = new clsCSV('',';','test');
    let tmp_id = "R:0C:0H:col-A"
    // simulate user mouse and keybord input
    let tmp1 = csv.cellID_highlight; csv.cellID_highlight[0] = tmp_id // id of highlighted cell
    csv._CreateInputField(tmp_id) // actually does not belong there, but not relevant for the test
    csv._CreateSaveSVG(tmp_id) // actually does not belong there, but not relevant for the test
    document.getElementById("ecsv-input").value = "test value" // simulation of user input
    // simluate user click onsave button
    csv.SaveEdit()
    csv.UnEdit()
    // Expected Result
    assertEqual(csv.data[0][0], "test value", fname)
    //reset
    csv.data[0][0] = ""
    assertEqual(Check_csv_reset(csv), true, fname)

})();

function Check_csv_reset(csvObj) {
    if (String(csvObj.headers) != "col-A" || csvObj.headers[0] != "col-A") {
        return false
    }
    if (csvObj.len !=1 || csvObj.data.length !=1)  {
        return false
    }
    for (i = 0; i<csvObj.data.length;i++) {
        for (j = 0; j<csvObj.headers.length;j++) {
            if (csvObj.data[i][j] != "") {
                return false}
        }
    }
    if (document.getElementById("ecsv-input")!= null || document.getElementById("ecsv-input-save")!= null){
        return false}
    return true
}

// ###############################################################################
// Tests cls DropDown                                                            #
// ###############################################################################

(function test_classDropDown_Init () {
    let fname = arguments.callee.name;
    // Test Case 1 
    menu = [["File", "Sub1", "Sub2"], ["Edit", "SubEdit1", "SubEdit2"], ["Tools"]]
    events = [['(function () {alert("Hello!");})();', '', ''], ['', ', '], ['']]
    let dd = new clsDropDown(menu, events)
    assertEqual(String(menu), String(dd.Menu()), fname);
    // Test Case 2 (HTML)
    d.append(dd.div);
    let tStr = ['<a class="nav-link" href="#" onclick="(function () {alert(',
                '();">File</a>',
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


