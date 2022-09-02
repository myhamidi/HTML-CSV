// ################################################################
// Events                                                         #
// ################################################################
var mousedownTime;
var mouseupTime;

const MouseDown = (event) => {
    mousedownTime = new Date().getTime();
}

const MouseUp = (event) => { 
    mouseupTime = new Date().getTime();
    console.log(mouseupTime-mousedownTime)
    // things that shall only happen at click events (quick mouseclick)
    if (mouseupTime-mousedownTime<300) {
        ecsv.Click(event.srcElement.id)
        MEM.Click(event.srcElement.id)
    }
    //things that shall onlyhappen at long clickevents
    else {

    }

    //things that shall alwayshappen, independenthow long the click lasts

}

const MouseOver = (event) => {
    ecsv.MouseOver(event)
    }

const KeyUp = (event) => {
        SS.mySearchfilter();
        ecsv._Sum_Refresh();
        ecsv.InputFiled_AutoHeight();
    }


// ################################################################
// Init                                                           #
// ################################################################

const ecsv = new clsCSV();
const SS = new clsSiteSearch();
const DD = new clsDropDown();
const MEM = new clsMemory();


(function () {
    window.addEventListener('mousedown', MouseDown)   // equivalent to click (with empty mouse down)
    window.addEventListener('mouseup', MouseUp)
    window.addEventListener('keyup', KeyUp)

    SS.ignore = ["ecsv-sum","dropdown-item"]

    DD.AddDropDownToDiv(document.getElementById("nav-Variants"), "variants", ["memory"], ['SiteFeature_Memory()'])
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
// Site Features                                                                 #
// ###############################################################################

function SiteFeature_Memory() {
    let memorytext = MEM.memorytext(["Haus","Hase","Hund","Himmel","Hummel","Hand","Hose"])
    MEM.css()
    ecsv.mode = "memory"
    MEM.state = "on"
    ecsv.ReadCSV(memorytext);
    ecsv.Print();
}