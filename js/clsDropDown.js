class clsDropDown {
    constructor(menu = [], events = []) {
        this.menu = menu;
        this.div = document.createElement('nav')
        this.div.classList.add("clsDD", "nav", "bg-light")
        
        for (let i = 0; i < this.menu.length; i++) {
            let a = document.createElement('a')
            a.classList.add("nav-link"); // nac-link calss from bootstrap
            a.setAttribute('href', '#');a.innerHTML = menu[i][0]; 
            if (!events == []) {
                if (!events[i][0]== '') {
                a.setAttribute('onclick',events[i][0]);}}
            this.div.append(a);
        }

    }

    Menu() {
        return this.menu;
    }
    // function myFunction() {
    //     document.getElementById("myDropdown").classList.toggle("show");
    //   }
      
    //   // Close the dropdown if the user clicks outside of it
    //   window.onclick = function(event) {
    //     if (!event.target.matches('.dropbtn')) {
    //       var dropdowns = document.getElementsByClassName("dropdown-content");
    //       var i;
    //       for (i = 0; i < dropdowns.length; i++) {
    //         var openDropdown = dropdowns[i];
    //         if (openDropdown.classList.contains('show')) {
    //           openDropdown.classList.remove('show');
    //         }
    //       }
    //     }
    //   }
}

class clsButton {
    constructor(menu = [], events = []) {
        if (menu.length != events.length) {
            console.log("classButton initalized with menu and events of not equal size. Function call skipped")
            return
        }
        this.menu = menu;
        this.menu = events;
        this.div = document.createElement('a'); 
        
        // single button
        if (this.menu.length == 1 ) {
            let attributes = {
                "innerHTML": menu[0],
                "class": ["btn", "bg-light"],
                "href": "#", 
                "onclick": events[0]}
            this._A_SetAttributes(attributes)
        }

        // dropdown button
        if (this.menu.length > 1 ) {
            this.div = document.createElement('div'); this.div.classList.add("dropdown")
        }
    }


// ###############################################################################
// Helper Funcion                                                                #
// ###############################################################################

    _A_SetAttributes(dictAttributes) {
        for (let key in dictAttributes) {
            if (key == "innerHTML") {
                this.div.innerHTML = dictAttributes[key]
                continue
            }
            if (key == "class") { // attributes must be a list
                for (let cls of dictAttributes[key]) {
                    this.div.classList.add(cls)
                }
                continue
            }
           this.div.setAttribute(key, dictAttributes[key])
        }
    }
}