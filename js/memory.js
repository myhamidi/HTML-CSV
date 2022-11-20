// test
import { shuffle } from "./memory_basis"

class clsCard {
    constructor (name = "", position = "") {
        this.show = "back" // or "front" or solved
        this.name = name
        this.position = position // some position str syntax
    }
}


class clsMemory {
    constructor() {
        this.state = "off"
        this.elementsUnique = null // unique list of elemenets the memory is made of
        this.elements = null // elements on table in order of their appearance
        this.elementsState = null // "back", "front", "solved", parallel array to elements

    }

    ping() {
        console.log("clsMemory Ping")
    }

    memorytext (listElements) {
        let test = shuffle(listElements)
        this.elementsUnique = listElements
        let memlist = listElements.concat(listElements)
        // shuffle array (Fisher-Yates algorithm)
        for (let i = memlist.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const tmp = memlist[i];
            memlist[i] = memlist[j];
            memlist[j] = tmp;
        }
        this.elements = []
        let counter = 0
        for (let mem of memlist) {
            counter += 1
            let newCard = new clsCard(mem, counter)
            this.elements.push(newCard)
        }
        // this.elements = memlist
        this.elementsState = []
        for (let e of this.elements) {
            this.elementsState.push("back")
        }
        let ret = "A;B;C;D;E;F\n"
        counter = 0
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


    Click (divID) {
        if (this.state == "on") {
            if (divID.includes("R:")) {
                let cardContent = document.getElementById(divID).innerHTML
                console.log(cardContent)
                this._changeState(divID)
                this._checkPair()
            }
        }
    }

    _changeState(divID) {
        this.elementsState[this._idx(divID)] = "front"
    }

    _checkPair() {
        let n = this.elementsState.count("front")       // count is a prototype defined in basis.js No standard javascript
        //MOHi
    }

    _idx(divID) {
        if (divID.includes("R:")) {
            let R = RetStringBetween(divID, "R:", "C:")
            let C = RetStringBetween(divID, "C:", "H:")
            let H = RetStringBetween(divID, "H:", "")
            return 6*parseInt(R) + parseInt(C)
        }
        return -1
    }

}