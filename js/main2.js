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
    ecsv.Click(event.srcElement.id)

    }

function Event_Click_memory(event) {
    memory_click(event, ecsv, MEM)
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
const DD = new clsDropDown();
const MEM = new clsMemory();

(function () {
    
    window.addEventListener('click', Event_Click)
    // window.addEventListener('mousedown', () => {
    //     mousedownTime = new Date().getTime();
    //     MouseDown();
    //     })
    // window.addEventListener('dblclick', Event_DBClick)
    // window.addEventListener('keydown', Event_KeyDown)
    // window.addEventListener('mouseover', MouseOver)
    divSearch.addEventListener('keyup', SeachKeyUp)
    DD.AddDropDownToDiv(document.getElementById("nav-Variants"), "variants", ["memory"], ['SiteFeature_Memory()'])
})();

// ################################################################
// Show Hide stuff                                                #
// ################################################################

function DowpDown_ShowHide() {
    let elements = document.getElementsByClassName("dropdown-menu")
    for (let element of elements) {
        if (element.style.display != "block" ) {
            element.style.display = "block";
        }
        else {
            element.style.display = "none"; 
        }
        
    }
}


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

// ###############################################################################
// Site Features                                                                 #
// ###############################################################################

function SiteFeature_Memory() {
    let memorytext = "A;B;C\n1;2;3"
    memorytext = MEM.memorytext(["Haus","Hase","Hund","Himmel","Hummel","Hand","Hose"])
    MEM.css()
    ecsv.mode = "memory"
    ecsv.ReadCSV(memorytext);
    ecsv.Print();
    window.removeEventListener('click', Event_Click)
    window.removeEventListener('dblclick', Event_DBClick)
    window.removeEventListener('keydown', Event_KeyDown)
    window.addEventListener('click', Event_Click_memory)

}