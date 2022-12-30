class clsData_1x1 {
    constructor(header=[], data=[]) {
        this.headers = header
        this.data = data
        this.len = this.data.length
        
        this.emptyDefaut = ".."
    }

    AddRow(atPosition = -1, newRow = []) {
        let ETY = this.emptyDefaut
        if (newRow.length == 0) {
            for (let header of this.headers) {
                newRow.push(ETY)}
        } else {
            assert(newRow.length == this.headers.length, "values length not equal to data length")}

        if (atPosition == -1) {
            this.data.push(newRow)
            this.len += 1
        } else {
            assert(false)
        }
    }

    AddCol(header = "", atPosition = -1, values = []) {
        assert(!this.headers.includes(header), "header already exists")
        assert(atPosition > -2, "atPosition index below -1")
        assert(atPosition < this.headers.length, "atPosition index above headers length")
        let ETY = this.emptyDefaut
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
        {"col": "B", "pos": -1, "vals":  ["Meine", "da drausen"], "ermg": "header already exists"},
        {"col": "C", "pos": -2, "vals":  ["Meine", "da drausen"], "ermg": "atPosition index below -1"},
        {"col": "D", "pos": 5, "vals":  ["Meine", "da drausen"], "ermg": "atPosition index above headers length"},
        {"col": "E", "pos": -1, "vals":  ["Meine", "da drausen", "ist schoen"], "ermg": "values length not equal to data length"},
        
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


    // test assertions
    assertCalls = [
        {"pos": -1, "vals":  ["Super", "Mario", "Land"], "ermg": "values length not equal to data length"},
    ]
    var foo = function (a,b) {datta.AddRow(a,b)}
    assertAssertions(foo, assertCalls)
}
