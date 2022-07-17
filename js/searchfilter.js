// ##############################################################################################################
// #                                                                                                            #
// # IDs:                                                                                                       #
// # "mySearch": The input-form, where you can type in search items                                              #
// #                                                                                                            #
// # classes:                                                                                                   #
// # "seach-here": Searchfilter is applied to all children of the DOM element with the "search-here" class      #
// # "search-ignore": Ignores all elements to hide, i. e. this elements will not be filtered. class mus be set  #
// # for rows in tr element                                                                                     #
// #                                                                                                            #
// # Applied to:                                                                                                #                                                                                                            #                                                 #
// # <a href>, <tr>, <p>, class="img-container"                                                                 #
// # makes all items of these types invisible, when they don't contain the text that was searched               #                                                                              
// #                                                                                                            #
// ##############################################################################################################




function mySearchfilter() {
    //Var
    var seach_here = document.getElementsByClassName("seach-here");
    var input = document.getElementById("mySearch");
    var filter = input.value.toUpperCase();

    //Loop through all main divs:
    for (j = 0; j < seach_here.length; j++) {

        let Tags = ["a", "p", "tr"]
        for (tag of Tags) {
            var dom_elements = seach_here[j].getElementsByTagName(tag);
            if (dom_elements.length>0) {
                for (a of dom_elements) {
                    if (a.classList.contains("search-ignore")) {
                        continue
                    }
                    if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
                        a.style.display = "";
                        for (td of a.children) {
                            td.style.display = "";}
                    } 
                    else {
                        a.style.display = "none";
                        for (td of a.children) {
                            td.style.display = "none";}
                    }    
                }
            }
        }

        //Loop through all class="img-container"
        var p_list = seach_here[j].getElementsByClassName("img-container");
        for (i = 0; i < p_list.length; i++) {
            p = p_list[i];
            if (p) {
                if (p.innerHTML.toUpperCase().indexOf(filter) > -1) {
                    p.style.display = "";
                } else {
                    p.style.display = "none";
                }
            }
        }
    }

    // stuff that shall be called 

};