ETY = ".."   // default value for empty cells/headers

class clsData_1x1 {
    constructor(headers=[], data=[]) {
        assert(Array.isArray(headers), "headers is not of type array/list")
        assert(Array.isArray(data), "data is not of type array/list")
        for (let datum of data) {
            assert(Array.isArray(datum), "at least on data row is not of type array/list")
        }
        this.headers =  []
        for (let header of headers) {
            this.headers.push(header)
        }
        this.data =  []
        for (let row of data) {
            let nextrow = []
            for (let cell of row) {
                nextrow.push(cell)
            }
            this.data.push(nextrow)
        }
        this.len = this.data.length
    }

    AddRow(atPosition = -1, newRow = []) {
        assert(atPosition > -2, "atPosition index below -1")
        assert(atPosition < this.len+1, "atPosition above data length")

        if (newRow.length == 0) {
            for (let header of this.headers) {
                newRow.push(ETY)}
        } else {
            assert(newRow.length == this.headers.length, "values length not equal to data length")}

        if (atPosition == -1) {
            this.data.push(newRow)
        } else {
            this.data.splice(atPosition, 0, newRow)
        }
        this.len += 1
    }

    RemoveRow(row = -1) {
        assert(row > -2, "row index below -1")
        assert(row < this.len+1, "row above data length")

        if (row == -1) {
            this.data.pop()
        } else {
            this.data.splice(row, 1)
        }
        this.len -=1
    }

    AddCol(header = "", atPosition = -1, values = []) {
        assert(!this.headers.includes(header), "header already exists")
        assert(atPosition > -2, "atPosition index below -1")
        assert(atPosition < this.headers.length, "atPosition index above headers length")

        if (header == "") {header = ETY}
        if (values.length == 0) {
            for (let i = 0; i < this.len; i++) {
                values.push(ETY)}
        } else {
            assert(values.length == this.len, "values length not equal to data length")}
        
        if (atPosition == -1) {
            this.headers.push(header)
            for (let i = 0; i < this.data.length; i++) {
                this.data[i].push(values[i])}
        } else {
            assert(false)
        }
    }

    RemoveCol(col = -1, colName = "") {
        assert (Number.isInteger(col), "col is not an integer")
        assert(col> -2, "col index below -1")
        assert(col < this.headers.length, "col index above headers length")
        assert(!(col != -1 && colName != ""), "col and colName are both defined. Define only one")
        
        if (col == -1 && colName == "") {
            col = this.headers.length-1
        }
        if (col == -1 && colName != "") {
            col = this.headers.indexOf(colName)
        }

        this.headers.splice(col, 1)


        // this.headers.remove(colName)

        for (let i = 0; i < this.data.length; i++) {
            this.data[i].splice(col,1)
        }
        //     this.data[i] = newRow
        // assert(row > -2, "row index below -1")
        // assert(row < this.len+1, "row above data length")

        // if (row == -1) {
        //     this.data.pop()
        // } else {
        //     this.data.splice(row, 1)
        // }
        // this.len -=1
    }
}



// ################################################################
// test                                                           #
// ################################################################


function test_clsData_1x1() {
    let fname = arguments.callee.name;
    datta = new clsData_1x1(["A"], [["Hallo"], ["Welt"]])

    assertEqualList(datta.headers,["A"], fname)
    assertEqualList(datta.data[0],["Hallo"], fname)
    assertEqualList(datta.data[1],["Welt"], fname)

    datta2 = new clsData_1x1(datta.headers, datta.data)
    datta.headers[0] = "Z"          // This should have no effect.
    datta.data[0] = ["Mario"]       // Datta2 is a complete new data set. No reference
    assertEqualList(datta2.headers,["A"], fname)
    assertEqualList(datta2.data[0],["Hallo"], fname)
    assertEqualList(datta2.data[1],["Welt"], fname)

    // test assertions
    assertCalls = [
        {"a": "B", "ermg": "headers is not of type array/list"},
        {"a": ["B"], "b": "Hallo", "ermg": "data is not of type array/list"},
        {"a": ["B"], "b": ["Hallo"], "ermg": "at least on data row is not of type array/list"},
        
    ]
    var foo = function (a,b,c,d) {new clsData_1x1(a,b,c,d)}
    assertAssertions(foo, assertCalls)
}

function test_clsData_1x1_AddCol() {
    let fname = arguments.callee.name;
    datta = new clsData_1x1(["A"], [["Hallo"], ["Welt"]])
    datta.AddCol("B", -1, ["Meine", "da drausen"])
    assertEqualList(datta.headers,["A", "B"], fname)
    assertEqualList(datta.data[0],["Hallo", "Meine"], fname)
    assertEqualList(datta.data[1],["Welt", "da drausen"], fname)

    // test assertions
    assertCalls = [
        {"a": "B", "b": -1, "c":  ["Meine", "da drausen"], "ermg": "header already exists"},
        {"a": "C", "b": -2, "c":  ["Meine", "da drausen"], "ermg": "atPosition index below -1"},
        {"a": "D", "b": 5, "c":  ["Meine", "da drausen"], "ermg": "atPosition index above headers length"},
        {"a": "E", "b": -1, "c":  ["Meine", "da drausen", "ist schoen"], "ermg": "values length not equal to data length"},
        
    ]
    var foo = function (a,b,c) {datta.AddCol(a,b,c)}
    assertAssertions(foo, assertCalls)
}

function test_clsData_1x1_AddRow() {
    let fname = arguments.callee.name;
    datta = new clsData_1x1(["A"], [["Hallo"], ["Welt"]])
    datta.AddRow()
    assertEqual(datta.len, 3, fname)
    assertEqualList(datta.data,[["Hallo"], ["Welt"], [".."]], fname)
    datta = new clsData_1x1(["A", "B"], [["Hallo", "Welt"], ["Super", "Mario"]])
    datta.AddRow()
    assertEqual(datta.len, 3, fname)
    assertEqualList(datta.data,[["Hallo", "Welt"], ["Super", "Mario"], ["..", ".."]], fname)
    datta.AddRow(1)
    assertEqual(datta.len, 4, fname)
    assertEqualList(datta.data,[["Hallo", "Welt"], ["..", ".."], ["Super", "Mario"], ["..", ".."]], fname)
    datta.AddRow(4, ["Munich", "Oktoberfest"])
    assertEqual(datta.len, 5, fname)
    assertEqualList(datta.data,[["Hallo", "Welt"], ["..", ".."], ["Super", "Mario"], ["..", ".."], ["Munich", "Oktoberfest"]], fname)

    // test assertions
    assertCalls = [
        {"a": -1, "b":  ["Super", "Mario", "Land"], "ermg": "values length not equal to data length"},
        {"a": -2, "b":  ["Super", "Mario"], "ermg": "atPosition index below -1"},
        {"a": 6, "b":  ["Super", "Mario"], "ermg": "atPosition above data length"},
    ]
    var foo = function (a,b) {datta.AddRow(a,b)}
    assertAssertions(foo, assertCalls)
}

function test_clsData_1x1_RemoveRow() {
    let fname = arguments.callee.name;
    datta = new clsData_1x1(["A", "B"], [["Hallo", "Welt"], ["Super", "Mario"], ["Munich", "Oktoberfest"]])
    datta.RemoveRow()
    assertEqualList(datta.data,[["Hallo", "Welt"], ["Super", "Mario"]], fname)
    assertEqual(datta.len, 2, fname)

    datta = new clsData_1x1(["A", "B"], [["Hallo", "Welt"], ["Super", "Mario"], ["Munich", "Oktoberfest"]])
    datta.RemoveRow(0)
    assertEqualList(datta.data,[["Super", "Mario"], ["Munich", "Oktoberfest"]], fname)
    assertEqual(datta.len, 2, fname)

    // test assertions
    assertCalls = [
        {"a": -2,  "ermg": "row index below -1"},
        {"a": 5,  "ermg": "row above data length"}
    ]
    var foo = function (a,b) {datta.RemoveRow(a,b)}
    assertAssertions(foo, assertCalls)
}

function test_clsData_1x1_RemoveCol() {
    let fname = arguments.callee.name;
    datta = new clsData_1x1(["A", "B", "C"], [["Hallo", "Welt", "drausen"], ["Super", "Mario", "Land"], ["Munich", "Oktoberfest", "Beer"]])
    datta.RemoveCol()
    assertEqualList(datta.headers, ["A", "B"], fname)
    assertEqualList(datta.data,[["Hallo", "Welt"], ["Super", "Mario"], ["Munich", "Oktoberfest"]], fname)

    datta = new clsData_1x1(["A", "B", "C"], [["Hallo", "Welt", "drausen"], ["Super", "Mario", "Land"], ["Munich", "Oktoberfest", "Beer"]])
    datta.RemoveCol(1)
    assertEqualList(datta.headers, ["A", "C"], fname)
    assertEqualList(datta.data,[["Hallo", "drausen"], ["Super", "Land"], ["Munich", "Beer"]], fname)

    datta = new clsData_1x1(["A", "B", "C"], [["Hallo", "Welt", "drausen"], ["Super", "Mario", "Land"], ["Munich", "Oktoberfest", "Beer"]])
    datta.RemoveCol(-1, "A")
    assertEqualList(datta.headers, ["B", "C"], fname)
    assertEqualList(datta.data,[["Welt", "drausen"], ["Mario", "Land"], ["Oktoberfest", "Beer"]], fname)

    // test assertions
    assertCalls = [
        {"a": -2, "ermg": "col index below -1"},
        {"a": 5, "ermg": "col index above headers length"},
        {"a": "col", "ermg": "col is not an integer"},
        {"a": 1, "b": "B", "ermg": "col and colName are both defined. Define only one"},
    ]
    var foo = function (a,b) {datta.RemoveCol(a,b)}
    assertAssertions(foo, assertCalls)
}