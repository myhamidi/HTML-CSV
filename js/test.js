function test() {
    test_clsData_1x1() 
    test_clsData_1x1_Add()
}


// ################################################################
// test basis functions                                           #
// ################################################################

function test_passed(fname) {
    console.log('OK ' + fname)
    return 0
}

function test_failed(fname) {
    console.log('Failed ' + fname)
    return -1
}

function assertEqual(a,b,fname) {
    if (a == b) {
        return test_passed(fname)} 
    else {
        return test_failed(fname)}
}

function assertEqualList(a,b,fname) {
    if (!(Array.isArray(a) && Array.isArray(a))) {
        return test_failed(fname)}
    if (!(a.length == b.length)) {
        return test_failed(fname)}
    for (let i = 0; i< a.length; i++) {
        if (a[i] != b[i]) {
            return test_failed(fname)}}
    return test_passed(fname)
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


function assertAssertions(foo, assertCalls) {
    for (let aC of assertCalls) {
        assertFlag = false
        try {
            // datta.AddCol(aC["col"], aC["pos"], aC["vals"]) // header already exists
            foo(aC["col"], aC["pos"], aC["vals"])
        } catch (error) {
            assertFlag = true
            assert(error.message == aC["ermg"], "assertion message was '" + error.message + "' instead of '" + aC["ermg"] + "'")
        } finally {
            assert(assertFlag, "no assertion error was thrown")
        }
    }
}