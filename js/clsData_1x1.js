class clsData_1x1 {
    constructor(header=[], data=[]) {
        this.headers = header
        this.data = data
        this.len = this.data.length
    }

    AddRow(newRow = "", atPosition = -1) {
        if (newRow == "") {
            newRow = []
            for (let header of this.headers) {
                newRow.push("")}
        }
        assertEqual(newRow.length == this.headers.length)
        if (atPosition == -1) {
            this.data.push(newRow)
            this.len +=1
        }
    }

    AddCol(header = "..", atPosition = -1, values = []) {
        assert(!this.headers.includes(header))
        assert(atPosition > -2)
        assert(atPosition < this.headers.length)
        if (values.length == 0) {
            for (let i = 0; i < this.len; i++) {
                values.push("..")}
        } else {
            assert(values.length == this.len)}
        
        if (atPosition == -1) {
            this.headers.push(header)
            for (let i = 0; i < this.data.length; i++) {
                this.data[i].push(values[i])}
        } else {
            assert(false)
        }

        // this.Print();
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

function test_clsData_1x1_Add() {
    let fname = arguments.callee.name;
    datta = new clsData_1x1(["A"], [["Hallo"], ["Welt"]])
    datta.AddCol("B", -1, ["Meine", "da drausen"])
    assertEqualList(datta.headers,["A", "B"], fname)
    assertEqualList(datta.data[0],["Hallo", "Meine"], fname)
    assertEqualList(datta.data[1],["Welt", "da drausen"], fname)
}