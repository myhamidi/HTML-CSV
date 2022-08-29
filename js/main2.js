// ################################################################
// Events                                                         #
// ################################################################
const Click = (event) => {
    if (ecsv.mode == "memory") {
        memory_click(event, ecsv, MEM)
    }
    ecsv.Click(event.srcElement.id)
    }

const MouseOver = (event) => {
    ecsv.MouseOver(event)
    }

const KeyUp = (event) => {
        SS.mySearchfilter();
        ecsv._Sum_Refresh();
    }


// ################################################################
// Init                                                           #
// ################################################################

const ecsv = new clsCSV();
const SS = new clsSiteSearch();
const DD = new clsDropDown();
const MEM = new clsMemory();


(function () {
    window.addEventListener('click', Click)
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
    let memorytext = "A;B;C\n1;2;3"
    memorytext = MEM.memorytext(["Haus","Hase","Hund","Himmel","Hummel","Hand","Hose"])
    MEM.css()
    ecsv.mode = "memory"
    ecsv.ReadCSV(memorytext);
    ecsv.Print();
    window.removeEventListener('click', Event_Click)
    window.addEventListener('click', Event_Click_memory)

}