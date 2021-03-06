// ################################################################
// HTML elements and Globals                                      #
// ################################################################
// searchfilter
const divSearch = document.getElementById("mySearch");

// document elements status (to be made obsolete. covered via clsCSV.cellID_highlight)
var divID_high = "";

// ################################################################
// Event: mouse click                                             #
// ################################################################
var timer = 0;
var mousedownTime;

const Event_Click = (event) => {
    //funtion inside timer is called 200 ms after. ..unless it is killed by DBClick
    let mouseupTime = new Date().getTime();
    ecsv.userinput.LeftDown = false
    if (event.detail === 1 && mouseupTime - mousedownTime < 200) {
        timer = setTimeout(() => {
            if (event.srcElement.id == ecsv.layout.cellID_highlight[0]) {
                let div = ecsv.layout.GetDiv_InputCell()
                div.innerHTML += "<br/> [NAME:]"

                console.log("Yes")
            }
            if ((event.srcElement.id == "ecsv-input" || event.srcElement.id == ecsv.layout.cellID_highlight[0]) && event.srcElement.id != ""){
                // do nothing
                return}
            // ecsv.UnEdit();
            else if (event.srcElement.id.includes("tag-")){
                ecsv._ToggleTagColor(event.srcElement.id)
                return
            }
            else if (event.srcElement.id.includes("R:"))
            {
                rowID = "row:"+RetStringBetween(event.srcElement.id, "R:", "C:") +"!"
                ecsv._HighlightRow(rowID)
            }
            else {
                ecsv._HighlightCell("")
                ecsv._HighlightRow("")
            }
            console.log(event.srcElement.id)
            }, 200)
        }
    }

const Event_DBClick = (event) => {
    // kill timer of (sinlge) click
    clearTimeout(timer);
    if (event.srcElement.id.includes("R:") && event.srcElement.id.includes("C:")) {
        ecsv.Edit(event.srcElement.id);
        return;} 
  }

// ################################################################
// CSV Events                                                     #
// ################################################################

const Event_KeyDown = (event) => {
    ecsv.ButtonClick(event)
    ecsv.InputFiled_AutoHeight()
}

const MouseOver = (event) => {
    ecsv.MouseOver(event)
}

const MouseDown = (event) => {
    ecsv.userinput.LeftDown = true
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

const ecsv = new clsCSV();

(function () {
    
    window.addEventListener('click', Event_Click)
    window.addEventListener('mousedown', () => {
        mousedownTime = new Date().getTime();
        MouseDown();
        })
    window.addEventListener('dblclick', Event_DBClick)
    window.addEventListener('keydown', Event_KeyDown)
    window.addEventListener('mouseover', MouseOver)
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


// ###############################################################################
// Add/Remove Classes                                                            #
// ###############################################################################

function mainClassHandler() {
    // if searchfilter is used: never filter out the sum row
    if (document.getElementsByClassName("seach-here").length > 0) {
        // let Rows = document.getElementsByTagName("tr") + document.getElementsByTagName("a") //actually all kind of elements, not only rows
        // for (let row of Rows) {
        //     if (row.classList.contains("ecsv-sum") || row.classList.contains("dropdown-item")) {
        //         row.classList.add("search-ignore")}
        // }

        let elementsD = [document.getElementsByClassName("ecsv-sum"),document.getElementsByClassName("dropdown-item")]
        for (elements of elementsD) {
            for (let e of elements) {
                if (!e.classList.contains("search-ignore")) {
                    e.classList.add("search-ignore")
                }
            }
        }
    }

}