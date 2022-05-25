class clsDropDown {
    constructor(menu = [], events = []) {
        this.menu = menu;
        this.div = document.createElement('nav')
        this.div.classList.add("clsDD", "nav", "bg-light" )
        
        for (let i = 0; i < this.menu.length; i++) {
            let a = document.createElement('a')
            a.classList.add("nav-link");
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