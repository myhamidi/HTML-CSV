// ################################################################
// HTML elements and Globals                                      #
// ################################################################
// searchfilter
const divSearch = document.getElementById("mySearch");

// document elements status (to be made obsolete. covered via clsCSV.cellID_highlight)
var divID_high = "";


// ################################################################
// Event: click                                                   #
// ################################################################
var timer = 0;

const Event_Click = (event) => {
    //funtion inside timer is called 200 ms after. ..unless it is killed by DBClick
    if (event.detail === 1) {
        timer = setTimeout(() => {
            if (event.srcElement.id == "ecsv-input" || event.srcElement.id == ecsv.cellID_highlight[0]){
                // do nothing
                return}
            // ecsv.UnEdit();
            console.log("C")
            }, 200)
        }
    }

const Event_DBClick = (event) => {
    // kill timer of (sinlg) click
    clearTimeout(timer);
    if (event.srcElement.id.includes("R:") && event.srcElement.id.includes("C:")) {
        ecsv.Edit(event.srcElement.id);
        return;} 
  }

// ################################################################
// Event: loading file                                            #
// ################################################################

function SeachKeyUp() {
    mySearchfilter();
    ecsv._Sum_Refresh();
}
  
// ################################################################
// OnLoad: Event Listeners + main                                 #
// ################################################################

(function () {
    window.addEventListener('click', Event_Click)
    window.addEventListener('dblclick', Event_DBClick)
    divSearch.addEventListener('keyup', SeachKeyUp)
})();


// ###############################################################################
// Save / Download                                                               #
// ###############################################################################

function _download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);
    pom.style.display = 'none';
    document.body.appendChild(pom);
    pom.click();
    document.body.removeChild(pom);
}

function download_saveAll() {
    alert("funtion not yet implemented")
}

function download_saveData() {
    let filename = divFile.value.split("\\").slice(-1)[0]
    let text = ecsv._AsCSV()
    _download(filename, text)
}

function download_saveConfig() {
    alert("funtion not yet implemented")
}



