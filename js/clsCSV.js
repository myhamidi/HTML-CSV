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
  }


// ################################################################
// class CSV                                                      #
// ################################################################

class clsCSV {
    constructor(csvtext = "", delimiter = ";", egoname='') {
        this.name = egoname
        this.cellID_highlight = ["", ""]  // (new) interal value, curent Printed
        if (csvtext == "") {
            this.headers = ["col-A"];
            this.data = [["..."]];
            this.len = 1;} 
        else {
            this.ReadCSV(csvtext)}
        this.sum = -1;          // sum = -1 inactive, sum >=0 sum is active
        this.Print()
    }

    ReadCSV(csvtext, delimiter = ";" ) {
        var str = csvtext.replace(new RegExp('\r\n', "g") , '\n')           // '\r\n' is the standard for new line in windows. for ecsv plain \n is used as new line
        str = str.replace(new RegExp('"' + delimiter, "g") , delimiter)     // '"' used to make csv xls readable. Not used here
        str = str.replace(new RegExp(delimiter + '"', "g") , delimiter)     // '"' used to make csv xls readable. Not used here
        this.headers = str.slice(0, str.indexOf("\n")).split(delimiter);
        this.data = [];
        const rows = str.slice(str.indexOf("\n") + 1).split("\n");
        for (let row of rows) {
            if (this._IsValidRow(row)) {
                let tmp = row.split(delimiter)
                this.data.push(tmp)}
        }
    }

    Print( mode = "full") {
        // standard use case
        if (this.name == "") {
            cDivOut.innerHTML = this._AsHTMLTable()
            this._InterfaceJS()
            this._Style("ecsvtable", {"display": "bold"})
            this._Style("escv-sum", {"font-weight": "bold"})
        }
            
            
        //post 
        if (this.cellID_highlight[0] == "") {
            if (this.cellID_highlight[1] != "") {
                document.getElementById(this.cellID_highlight[1]).classList.remove("table-info")}
        } else {
            document.getElementById(this.cellID_highlight[0]).classList.add("table-info")}
        this.cellID_highlight[1] = this.cellID_highlight[0]
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
        this.data.push(newRow)
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
            if (row.classList.contains("escv-sum")) {
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
        // let input = document.createElement('input');
        let input = document.createElement('textarea');input.cols = "50"; input.rows = "5"
        input.id = "ecsv-input"
        input.classList.add("input-large", "form-control")
        div.append(input);
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
          ret += '<th class="ecsvtable col-' + header + '">' + header + '</th>'
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
            ret += '<tr>';
            for (let cell of row) {
                i += 1;
                if (cell.includes("\r")) {
                    cell = cell.replace(new RegExp('\r', "g") , '<br>')  // use \r for in cell new line
                }
                ret += '<td id="R:' + rowidx + 'C:' + i + 'H:' + this.headers[i] + '" class="ecsvtable col-' + this.headers[i] + ' ecsvcell">' + cell + '</td>'
            }
          ret += '</tr>'
        }
        // build sum row
        if (this.sum != -1) {
            var i = -1;
            ret += '<tr class ="escv-sum">';
            for (let cell of this._retSumRow()[0]) {
                i += 1;
                ret += '<td id="R:' + rowidx + 'C:' + i + 'H:' + this.headers[i] + '" class="ecsvtable col-' + this.headers[i] + ' ecsvcell escv-sum">' + cell + '</td>'
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

    _Style(classname, styleDict) {
        var elements = document.getElementsByClassName(classname);
        for (let e of elements) {
            for (const key in styleDict)                // why const ?
            e.style[key] = styleDict[key];
          }
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

    // document elements innerHTML ################################################

    // _innerHTML_Input() {
    //     return '<div class="form-group"> \n\
    //     <a id="idSaveText" class="btn btn-outline-primary my-2 my-sm-0" type="submit" onclick="text_save()"> Save </a>\n\
    //     <textarea class="form-control" rows="5" id="idText"></textarea> \n\
    //     </div>';
    // }

    // document elements highlighting ################################################

    _InterfaceJS() {
        // if searchfilter is used
        if (document.getElementsByClassName("seach-here").length > 0) {
            let Rows = document.getElementsByTagName("tr")
            for (let row of Rows) {
                if (row.classList.contains("escv-sum")) {
                    row.classList.add("search-ignore")}
            }
        }
    }   

    _HighlightCell(divID) {
        if (divID.includes("R:") && divID.includes("C:")) {
            this.cellID_highlight[0] = divID;
        } else {
            this.cellID_highlight[0] = "";}
        this.Print();
    }
}

var ecsv = new clsCSV();