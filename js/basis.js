// ###############################################################################
// Basis                                                                         #
// ###############################################################################


function RetStringBetween(text, fromStr, toStr = "") {
    /**
     * Returns the String between two  strings.
     * "" / empty strings are interpreted as open end / take rest of string
     * strings not found in text are interpreted as "" / empty strings
     * 
     */
    // var idx1 = text.indexOf(fromStr);
    // if (idx1 == -1) {fromStr=""}
    // idx1 = text.indexOf(fromStr);
    // var idx2 = text.indexOf(toStr, fromIndex = idx1);
    // if (idx2 == -1) {toStr=""}
    // var idx2 = text.indexOf(toStr, fromIndex = idx1);

    var [idx1, idx2, len1, len2] = _RetIdxFromTextInString(text, fromStr, toStr)

    if (idx2 > idx1) {
        return text.substring(idx1+len1, idx2);}
    else {
        return text.substring(idx1+len1)}
}

function RetStringOutside(text, fromStr, toStr) {
    /**
     * Returns the String except the text between two  strings.
     * "" / empty strings are interpreted as "remove rest of string"
     * strings not found in text are interpreted as "" / empty strings (=identical behaviour)
     * 
     */

    var [idx1, idx2, len1, len2] = _RetIdxFromTextInString(text, fromStr, toStr)

    if (idx2 > idx1) {
        return text.substring(0, idx1) + text.substring(idx2 + len2)}
    else {
        return text.substring(0, idx1)}
}

function _RetIdxFromTextInString(text, strA, strB){
    var idx1 = text.indexOf(strA);
    if (idx1 == -1) {strA=""}
    idx1 = text.indexOf(strA);
    var idx2 = text.indexOf(strB, fromIndex = idx1);
    if (idx2 == -1) {strB=""}
    var idx2 = text.indexOf(strB, fromIndex = idx1);
    l1 = strA.length
    l2 = strB.length
    return [idx1, idx2, l1, l2]
}