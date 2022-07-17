// ################################################################
// Index.html and main.js                                         #
// ################################################################

// <input id="File" accept=".csv"/>                 # input element where csv is loaded
const divFile = document.getElementById("File");

// <div id="ecsvDivOut" style="height: 90vh">       # output element where csv data is printed
const cDivOut = document.getElementById("ecsvDivOut");


// ################################################################
// File Reader to load CSV file                                   #
// ################################################################

divFile.addEventListener('change', ReadFile)
const cReader = new FileReader();
function ReadFile () {
    cReader.readAsText(divFile.files[0]);
    cReader.addEventListener("loadend", _ResultToCSV);
  }
function _ResultToCSV() {
    ecsv.ReadCSV(cReader.result);
    ecsv.Print();
    ecsv.ToggleLink();
  }

// ################################################################
// class CSV                                                      #
// ################################################################

class clsCSVLayout {
    constructor() {
        this.InputIsActive = false
    }
}


// ################################################################
// class CSV                                                      #
// ################################################################

class clsCSV {
    constructor(csvtext = "", delimiter = ";", egoname='') {
        this.name = egoname
        this.cellID_highlight = ["", ""]  // interal value: Cell that is currently in edit mode
        this.row_highlight = ["", ""] // internal value: Row thatis currently selected
        this.layout = new clsCSVLayout()
        if (csvtext == "") {
            this.headers = ["col-A"];
            this.data = [["..."]];
            this.len = 1;} 
        else {
            this.ReadCSV(csvtext)}
        this.sum = -1;          // sum = -1 inactive, sum >=0 sum is active
        // Styles
        this.Print()
        this._Style_DOM()
    }

    ReadCSV(csvtext, delimiter = ";" ) {
        var str = csvtext.replace(new RegExp('\r\n', "g") , '\n')           // '\r\n' is the standard for new line in windows. for ecsv plain \n is used as new line
        str = str.replace(new RegExp('"' + delimiter, "g") , delimiter)     // '"' used to make csv xls readable. Not used here
        str = str.replace(new RegExp(delimiter + '"', "g") , delimiter)     // '"' used to make csv xls readable. Not used here
        this.headers = str.slice(0, str.indexOf("\n")).split(delimiter);
        if (!this.headers.includes("No.")) {
            this.VirtualCol_No = true
            this.headers.splice(0,0,"No.")
        } else {
            this.VirtualCol_No = false
        }
        this.data = [];
        const rows = str.slice(str.indexOf("\n") + 1).split("\n");
        this.len = 0;
        for (let row of rows) {
            if (this._IsValidRow(row)) {
                if (this.VirtualCol_No) {
                    row = String(this.len+1) + delimiter + row
                }
                let tmp = row.split(delimiter)
                this.data.push(tmp)
                this.len +=1}
        }
    }

    Print( mode = "full") {
        // standard use case
        if (this.name == "") {
            cDivOut.innerHTML = this._AsHTMLTable()
        }
            
            
        //post: Apply highlithing for cells
        if (this.cellID_highlight[0] == "") {
            if (this.cellID_highlight[1] != "") {
                document.getElementById(this.cellID_highlight[1]).classList.remove("table-info")}
        } else {
            document.getElementById(this.cellID_highlight[0]).classList.add("table-info")}
        this.cellID_highlight[1] = this.cellID_highlight[0]
         
        //post: Apply highlithing for rows
        if (this.row_highlight[0] == "") {
            if (this.row_highlight[1] != "") {
                document.getElementById(this.row_highlight[1]).classList.remove("table-info")}
        } else {
            document.getElementById(this.row_highlight[0]).classList.add("table-info")}
        this.row_highlight[1] = this.row_highlight[0]

        mainClassHandler()
    }

    AddCol() {
        this.headers.push("..")
        for (let i = 0; i < this.data.length; i++) {
            this.data[i].push("..")}
        this.Print();
        }  

    AddRow() {
        let newRow = [];
        for (let i = 0; i < this.headers.length; i++) {
            newRow.push('..')}
        if (this.row_highlight[0] == "") {
            this.data.push(newRow)
        }
        else {
            let row = parseInt(RetStringBetween(this.row_highlight[0], "row:", "!"))
            this.data.splice(row+1, 0, newRow);
            // this.data.insertBefore(row, newRow)
        }
        
        this.Print();
    }

    Edit(divID) {
        this._HighlightCell(divID);
        this._CreateInputField(divID)
        this._CreateSaveSVG(divID)
        this._CreateRevertX(divID)
        

        this.DontDisplayValue(this.cellID_highlight[0]);
        
        document.getElementById("ecsv-input").focus();
        document.getElementById("ecsv-input").select();
        document.getElementById("ecsv-input").value = this._Data_GetHighlightValue();
    }

    UnEdit(divID) {
        this._HighlightCell("");
        this._RemoveInputField()
    }

    // called via onlcick by input element
    // by clicking on the save button, also the windowclick event is called, which will call Unedit
    SaveEdit() {
        this._Data_SaveValue()
        this.Print()
    }

    DontDisplayValue(divID) {
        // document.getElementById(divID).innerHTML = "<input" + RetStringOutside(document.getElementById(divID).innerHTML, "", "<input") 
        document.getElementById(divID).innerHTML = "<textarea" + RetStringOutside(document.getElementById(divID).innerHTML, "", "<textarea") 
    }

    Feature_Sum() {
        if (this.sum == -1) {
            this._SumCalculate()}
        else {
            this.sum = -1;}
        this.Print()
    }

    _Sum_Refresh() {
        this._SumCalculate()
        let Rows = document.getElementsByTagName("tr")
        for (let row of Rows) {
            if (row.classList.contains("ecsv-sum")) {
                let oldVal = RetStringBetween(row.innerHTML, "Sum: ", ".")
                row.innerHTML = row.innerHTML.replace("Sum: " + oldVal + ".", "Sum: " + this.sum + ".")
            }
        }
    }

    _SumCalculate(colname = "value") {
        var cells = document.getElementsByClassName("ecsvcell col-" + colname);
        let sum = 0;
        for (let cell of cells) {
            if (cell.innerHTML.includes("Sum: ")) {
                continue}
            if (typeof(Number(cell.innerHTML)) == "number" && cell.style.display != "none") {
                sum +=  Number(cell.innerHTML)
            }
          }
        this.sum = sum;
    }

    _CreateInputField(divID) {
        let oldinput  = document.getElementById("ecsv-input");
        if (oldinput != undefined) {
            oldinput.remove();}

        let div = document.getElementById(divID);
        let input = document.createElement('textarea'); input.cols = "50"
        // ; input.rows = "5"
        input.id = "ecsv-input"
        input.classList.add("input-large", "form-control")
        div.append(input);
        this.InputFiled_AutoHeight();
        this.layout.InputIsActive = true;
    }



    _CreateRevertX(divID) {
        let div = document.getElementById(divID);
        let a = document.createElement('a');
        a.id = "ecsv-input-revert"
        a.href = "#"
        a.setAttribute('onclick', 'ecsv.UnEdit()');
        a.innerHTML = ' X '
        div.append(a);
    }

    _CreateSaveSVG(divID) {
        let div = document.getElementById(divID);
        let a = document.createElement('a');
        a.id = "ecsv-input-save"
        a.href = "#"
        a.setAttribute('onclick', 'ecsv.SaveEdit()');
        a.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-save m-2" viewBox="0 0 16 16"> \
        <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 \
        3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z"/> \
        </svg>'
        div.append(a);
    }

    _RemoveInputField() {
        let oldinput  = document.getElementById("ecsv-input");
        let oldinputSave  = document.getElementById("ecsv-input-save");
        if (oldinput != undefined) {
            oldinput.remove();
            oldinputSave.remove();}
        this.layout.InputIsActive = false;
    }

    _Data_SaveValue(){
        let raw = this.cellID_highlight[0]
        let row = parseInt(RetStringBetween(raw,"R:", "C:"))
        let col = parseInt(RetStringBetween(raw,"C:", "H:"))
        let value = document.getElementById("ecsv-input").value;

        if (value.includes("\n")) {
            value = value.replace(new RegExp("\n", "g") , "\r")
        }
        this.data[row][col] = value;
    }

    _Data_GetHighlightValue(){
        let raw = this.cellID_highlight[0]
        let row = parseInt(RetStringBetween(raw,"R:", "C:"))
        let col = parseInt(RetStringBetween(raw,"C:", "H:"))
        return this.data[row][col]
    }

    _IsValidRow(row) {
      if (row == "") {
        return false}
      return true;
    }

    _IsConfigRow(dataRow) {
        let ret = true
        if (dataRow.length == this.headers.length && Array.isArray(dataRow)) {
            for (let item of dataRow) {
                if (item.substring(0,11) != "ecsvConfig:") {
                    ret = false}
            } 
        } else {
            ret = false}
        return ret;
    }

    InitConfig() {
        // display
        for (let i = 0; i < this.config.length; i++) {
            if (this.config[i] == "d-none") {
                this._Table_ToggleCol("col-" + this.headers[i])
            }
        }
    }

    _retSumRow(sumcolName = "value") {
        let ret = [];
        for (let col of this.headers) {
            if (col == sumcolName) {
                ret.push("Sum: " + this.sum + ".")
            } else {
                ret.push("")
            }
        }
        return [ret]
    }

    _AsHTMLTable() {
        // table
        let ret = '<table class="table">';
        //header body
        ret += '<thead><tr>'
        // headers
        for (let header of this.headers) {
            if (header == "Tags") {
                ret += '<th id = "tagheader" class="ecsv-ddTags ecsvtable col-' + header + '">' + header
                ret += this.AddTagMenu()
                ret += '</th>'}
            else {
                ret += '<th class="ecsvtable col-' + header + '">' + header + '</th>'}
            }
        // header body end 
        ret += '</tr></thead>'
        //row body
        ret += '<tbody>'
        //rows
        var rowidx = -1;
        // build data table
        for (let row of this.data) {
            rowidx += 1;
            var i = -1;
            ret += '<tr id="row:' + rowidx + '!">';
            for (let cell of row) {
                i += 1;
                if (String(cell).includes("\r")) {
                    cell = cell.replace(new RegExp('\r', "g") , '<br>')  // use \r for in cell new line
                }
                ret += '<td id="R:' + rowidx + 'C:' + i + 'H:' + this.headers[i] + '" class="ecsvtable col-' + this.headers[i] + ' ecsvcell">' + cell + '</td>'
            }
          ret += '</tr>'
        }
        // build sum row
        if (this.sum != -1) {
            var i = -1;
            ret += '<tr class ="ecsv-sum">';
            for (let cell of this._retSumRow()[0]) {
                i += 1;
                ret += '<td id="R:' + rowidx + 'C:' + i + 'H:' + this.headers[i] + '" class="ecsvtable col-' + this.headers[i] + ' ecsvcell ecsv-sum">' + cell + '</td>'
            }
            ret += '</tr>'
        }
        // row body end
        ret += '</tbody>'
        // table end
        ret += '</table>'

        return ret;
    }

    _AsCSV(sep = ";") {
        let ret = '';
        // headers
        for (let header of this.headers) {
            ret += header + ';'}
        ret = ret.slice(0, -1)
        ret += "\n"
        //rows
        for (let row of this.data) {
            for (let cell of row) {
                if (cell.includes("\r")) {
                    // make mult-line readable for xls
                    cell = '"' + cell + '"'
                    cell = cell.replace(new RegExp('\n', "g") , '\r')  // use \r for in cell new line
                }
                ret += cell + ';'}
            ret = ret.slice(0, -1) // remove last seperator. open: length of seperator
            ret += "\n"
        }
        return ret;
  }

    _ConfigAsCSVRow(sep = ";") {
        let ret = '';
        //row
        for (let cell of this.config) {
            ret += cell + ';'}
        ret = ret.slice(0, -1)// remove last seperator. open: length of seperator
        ret += "\n"
        return ret;
    }

    _Table_ConfigDispalay() {
      let ret = 'Show/Hide: ';
      for (let header of this.headers) {
        let strr = "ecsv1._Table_ToggleCol('col-" + header + "')"
        ret += '<a id="configheader-' + header + '" href="#" onclick="' + strr + '">' + header + '</a>' + ' . '}
      return ret + "<br/>";
    }

    _Table_ConfigLink() {
      let ret = 'Link: ';
      for (let header of this.headers) {
        let strr = "ecsv1._Table_ToggleLink('col-" + header + "')"
        ret += '<a id="configlink-' + header + '" href="#" onclick="' + strr + '">' + header + '</a>' + ' . '}
      return ret + "<br/>";
    }

    _Table_ConfigImg() {
      let ret = 'Image: ';
      for (let header of this.headers) {
        let strr = "ecsv1._Table_ToggleImg('col-" + header + "')"
        ret += '<a id="configimg-' + header + '" href="#" onclick="' + strr + '">' + header + '</a>' + ' . '}
      return ret + "<br/>";
    }

    _Table_ToggleCol(colname) {
        var cells = document.getElementsByClassName(colname);
        let idx = this.headers.indexOf(RetStringBetween(colname, "col-"))
        for (let cell of cells) {
            if (cell.style.display === "table-cell") {
                this.config[idx] = "ecsvConfig:d-none"
                cell.style.display = "none";
            } else {
                this.config[idx] = "ecsvConfig:d-tablecell"
                cell.style.display = "table-cell";
            }
        }
    }

    ToggleLink(colname = "url") {
      var cells = document.getElementsByClassName("ecsvcell col-" + colname);
      for (let cell of cells) {
          cell.innerHTML = this._InnerHTML_ToggleToLink(cell);
        }

    }

    _Table_ToggleImg(colname) {
      var cells = document.getElementsByClassName("ecsvcell " + colname);
      for (let cell of cells) {
          cell.innerHTML = this._InnerHTML_ToggleToLImg(cell);
        }
    }
    
    _ToggleTagColor(tagHeaderID) {
        let EgoStyle = "bg-info"
        let element = document.getElementById(tagHeaderID)
        // create JS list
        let classListe = []
        for (let e of element.classList) {
            classListe.push(e)
        }
        if (classListe.includes(EgoStyle)) {
            element.classList.remove(EgoStyle)}
        else {
            element.classList.add(EgoStyle)}
    }

    _Style(classname, styleDict) {
        var elements = document.getElementsByClassName(classname);
        for (let e of elements) {
            for (const key in styleDict)                // why const ?
            e.style[key] = styleDict[key];
          }
      }

    _Style_DOM() {
        let styletext = '\
        #tagheader:hover .dropdown-menu {display: block;}\
        .ecsv-sum {font-weight: bold;}\
        textarea {resize: none;overflow: hidden;min-height: 50px; max-height: 500px;}\
        '
        let style = document.createElement('style');
        style.innerHTML = styletext
        document.head.appendChild(style);
    }

    _InnerHTML_ToggleToLink(cell) {
        if (cell.innerHTML.includes("<a href=")){
            return cell.innerText}
        else {
            return '<a href="' + cell.innerText +'" target = "#">' + cell.innerText + '</a>'}
    }

    _InnerHTML_ToggleToLImg(cell) {
      if (cell.innerHTML.includes("<img src=")){
          return cell.innerHTML.slice(cell.innerHTML.indexOf('src="')+5,cell.innerHTML.indexOf('"></a>'))}
      else {
          return '<a href="' + cell.innerText +'"><img src="' + cell.innerText + '" height="80"></a>'}
    }

    _HighlightCell(divID) {
        if (divID.includes("R:") && divID.includes("C:")) {
            this.cellID_highlight[0] = divID;
        } else {
            this.cellID_highlight[0] = "";}
        this.Print();
    }

    _HighlightRow(divID) {
        if (divID.includes("row:")) {
            this.row_highlight[0] = divID;
        } else {
            this.row_highlight[0] = "";}
        this.Print();
    }

    _GetTags() {
        let tmp = []
        if (this.headers.includes("Tags")) {
            let idx = this.headers.indexOf("Tags")
            for (let row of this.data) {
                if (row.length > idx-1) {
                    let tags = RetStringBetween(row[idx], "[", "]")
                    tags = tags.replace(new RegExp(', ', "g") , ',') 
                    let tmptmp = tags.split(",")
                    for (let tmp3 of tmptmp) {
                        if (!tmp.includes(tmp3)) {
                            tmp.push(tmp3)
                        }
                    }
                }
            }
        }
        tmp.sort()  
        return tmp
    }

    Row_Down() {
        let row = parseInt(RetStringBetween(this.row_highlight[0], "row:", "!"))
        if (row < this.len) {
            let tmp = this.data[row];
            this.data[row] = this.data[row+1];
            this.data[row+1] = tmp;
            this.row_highlight[0] = "row:" + String(parseInt(row) + 1) + "!"
            this.data[row][0] = parseInt(this.data[row][0])-1
            this.data[row+1][0] = parseInt(this.data[row+1][0])+1
            this.Print();
        }

    }

    Row_Up() {
        let row = parseInt(RetStringBetween(this.row_highlight[0], "row:", "!"))
        if (row > 0) {
            let tmp = this.data[row];
            this.data[row] = this.data[row-1];
            this.data[row-1] = tmp;
            this.row_highlight[0] = "row:" + String(parseInt(row) - 1) + "!"
            this.data[row][0] = parseInt(this.data[row][0])+1
            this.data[row-1][0] = parseInt(this.data[row-1][0])-1
            this.Print();
        }
    }

// ################################################################
// Add HTML Elements                                              #
// ################################################################

    AddTagMenu(){
        let tags = this._GetTags()
        let ret = '<div class="dropdown-menu">'
        for (let tag of tags) {
            ret += '<a id="tag-' + tag + '" class="dropdown-item" href="#">' + tag + '</a>'
        }
        return ret
    }

// ################################################################
// Event: button click                                            #
// ################################################################

    ButtonClick(event){
        if (this.layout.InputIsActive == false){
            if (event.isComposing || event.keyCode === 87) {
                this.Row_Up();
            }
            // if "s" is pressed
            if (event.isComposing || event.keyCode === 83) {
                this.Row_Down();
            }
        }
        // console.log(event.keyCode)
    }

    InputFiled_AutoHeight(event) {
        let element = document.getElementById("ecsv-input")
        if (element == undefined) {
            return 
        }
        element.style.height = (element.scrollHeight)+"px";
    }

    MouseOver(event) {
        console.log("Mouse over " + event.srcElement.id)
    }
}

// const ecsv = new clsCSV();

