// test
class clsMemory {
    constructor() {
        this.elementsUnique = null // unique list of elemenets the memory is made of
        this.elements = null // elements on table in order of their appearance
        this.elementsState = null // "back", "front", "solved", parallel array to elements


    }

    ping() {
        console.log("clsMemory Ping")
    }

    memorytext (listElements) {
        this.elementsUnique = listElements
        let memlist = listElements.concat(listElements)
        // shuffle array (Fisher-Yates algorithm)
        for (let i = memlist.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const tmp = memlist[i];
            memlist[i] = memlist[j];
            memlist[j] = tmp;
        }
        this.elements = memlist
        this.elementsState = []
        for (let e of this.elements) {
            this.elementsState.push("back")
        }
        let ret = "A;B;C;D;E;F\n"
        let counter = 0
        for (let element of memlist) {
            if (counter < 5) {
                counter += 1
                ret += element + ";"
            }
            else if (counter == 5) {
                counter += 1
                ret += element
            }
            else {
                counter = 1
                ret += "\n" + element + ";"
            }
        }
        return ret
    }

    css() {
        let head = document.getElementsByTagName("head")[0]
        head.innerHTML += '<link rel="stylesheet" type="text/css" href="features/memory/css/memory.css">'
    }

            // if ((event.srcElement.id == "ecsv-input" || event.srcElement.id == ecsv.cellID_highlight[0]) && event.srcElement.id != ""){
            //     // do nothing
            //     return}
            // // ecsv.UnEdit();
            // else if (event.srcElement.id.includes("tag-")){
            //     ecsv._ToggleTagColor(event.srcElement.id)
            //     return
            // }
            // else if (event.srcElement.id.includes("R:"))
            // {
            //     rowID = "row:"+RetStringBetween(event.srcElement.id, "R:", "C:") +"!"
            //     ecsv._HighlightRow(rowID)
            // }
            // else {
            //     ecsv._HighlightCell("")
            //     ecsv._HighlightRow("")
            // }
            // console.log(event.srcElement.id)

}


function memory_click (event, objCSV, objMemory) {
    if (event.srcElement.id.includes("R:")) {
        let cardContent = document.getElementById(event.srcElement.id).innerHTML
        console.log(cardContent)
        objMemory.elementsState[_returnIdx(event.srcElement.id)] = "front"
        objCSV._HighlightCell(event.srcElement.id)
    }
}

function  _returnIdx(cellID) {
    return 12
}