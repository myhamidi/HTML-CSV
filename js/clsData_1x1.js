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
}


function test_clsData_1x1() {
    let fname = arguments.callee.name;
    datta = new clsData_1x1(["A"], [["Hallo"], ["Welt"]])

    assertEqualList(datta.header,["A"], fname)
    assertEqualList(datta.data[0],["Hallo"], fname)
    assertEqualList(datta.data[1],["Welt"], fname)
}