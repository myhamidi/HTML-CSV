function test() {
    test_clsData_1x1() 
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
        ret = assertEqual(a[i],b[i],fname)
        if (ret == -1) {
            return ret}
    }
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
