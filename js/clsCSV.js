const ID_DIVOUT = "ecsvDivOut"
// const cDivOut = document.getElementById("ecsvDivOut");

// ################################################################
// class UserInput                                                #
// ################################################################

class clsUserInput {
    constructor() {
        this.LeftDown = false
        this.RightDown = false
        this.n_down = false
    }
}


// ################################################################
// class CSV Layout                                               #
// ################################################################

class clsCSVLayout {
    constructor() {
        this.cellIDs_highlight = [["", ""], ["", ""]]   // cells that shall be hgihlighted. fist value is the internal value. Second value is representing the current state of the  site. The secondvalue will be changed by Print()
        this.row_highlight = ["", ""]                   //Row that is currently selected. First is targeted value, second is currently displayed value and can only be changed by Print()
        this.col_highlight = ["", ""]    
        this.div_input = null                           // current text area for user input
    }

    ApplyHighlightToSite () {
        for (let row of this.row_highlight) {
            if (row == ID_DIVOUT) {
                row = ""}
        }
        //Highlithing Cells
        for (let cell of this.cellIDs_highlight) {
            if (cell[0] == "" && cell[1] != "") {
                document.getElementById(cell[1]).classList.remove("table-info")}
            if (cell[0] != "" && cell[1] == "") {
                document.getElementById(cell[0]).classList.add("table-info")}
            cell[1] = cell[0]
        }

         
        //Highlithing Rows
        if (this.row_highlight[0] == "") {
            if (this.row_highlight[1] != "") {
                document.getElementById(this.row_highlight[1]).classList.remove("table-info")}
        } else {
            document.getElementById(this.row_highlight[0]).classList.add("table-info")}
        this.row_highlight[1] = this.row_highlight[0]

        //Highlithing Cols
        if (this.col_highlight[0] == "") {
            if (this.col_highlight[1] != "") {
                var colcells = document.getElementsByClassName("ecsvcell " + this.col_highlight[1]);
                for (let colcell of colcells) {
                    colcell.classList.remove("table-info")}}
        } else {
            var colcells = document.getElementsByClassName(this.col_highlight[0]);
            for (let colcell of colcells) {
                colcell.classList.add("table-info")}
        this.col_highlight[1] = this.col_highlight[0]
        }
    }

    InputIsActive() {
        if (this.cellIDs_highlight[0][1] == "") {
            return false}
        else {
            return true}
    }

    GetDiv_InputCell() {
        if (this.cellIDs_highlight[0][0] != "") {
            return document.getElementById(this.cellIDs_highlight[0][0]);
        }
    }

    Unhighlight_All() {
        for (let cellID_highlight of this.cellIDs_highlight) {
            cellID_highlight[0] = ""
        }
        this.row_highlight[0] = ""
        this.col_highlight[0] = ""
    }

    HighlightRow(divID) {
        // if row is not higlichted, then highlight row
        if (divID.includes("row:") || divID.includes("R:")) {
            this.row_highlight[0] = this.GetRowID(divID)
        }
        
        // else if row is already highlighted then edit mode
    }

    HighlightCol(colClass) {
        // if row is not higlichted, then highlight row
        if (colClass.includes("col-")) {
            this.col_highlight[0] = colClass
        }
        
        // else if row is already highlighted then edit mode
    }

    GetRowID(divID) {
        return "row:" + RetStringBetween(divID, "R:", "C:") + "!"
    }

    _IDIsInsideTable(divID) {
        if (divID.includes("R:") && divID.includes("C:") ||
            divID.includes("header-")|| divID.includes("tag-")|| divID.includes("-input")) {
            return true
        }
        return false
    }

    _IDIsButton(divID) {
        if (divID.includes("btn")) {
            return true
        }
        return false
    }

    _IDIsInsideHeader(divID) {
        if (divID.includes("header-")) {
            return true
        }
        return false
    }

    _IDIsInput(divID) {
        if (divID.includes("-input")) {
            return true
        }
        return false
    }

    _IDIsOutsideTable(divID) {
        return !this._IDIsInsideTable(divID)
    }


    DowpDown_ShowHide(className) {
        let elements = document.getElementsByClassName("dropdown-menu " + className)
        for (let element of elements) {
            if (element.style.display != "block" ) {
                element.style.display = "block";
            }
            else {
                element.style.display = "none"; 
            }
            
        }
    }
}


// ################################################################
// class CSV                                                      #
// ################################################################

// <div id="ecsvDivOut" style="height: 90vh">       # output element where csv data is printed


class clsCSV {
    constructor({csvtext = "", delimiter = ";", egoname = ''}) {
        this.name = egoname
        
        this.layout = new clsCSVLayout()
        this.userinput = new clsUserInput()
        if (csvtext == "") {
            this.headers = ["col-A"];
            this.data = [["..."]];
            this.len = 1;} 
        else {
            this.ReadCSV(csvtext)}
        this.sum = -1;          // sum = -1 inactive, sum >=0 sum is active
        // Styles
        this.mode = "standard"
        this.printMode = 'full'
        this.filterTags = []
        this.Print()
    }

    ReadCSV(csvtext, delimiter = ";" ) {
        var str = csvtext.replace(new RegExp('\r\n', "g") , '\n')           // '\r\n' is the standard for new line in windows. for clsCSV plain \n is used as new line
        str = str.replace(new RegExp('"' + delimiter, "g") , delimiter)     // '"' used to make csv xls readable. Not used here
        str = str.replace(new RegExp(delimiter + '"', "g") , delimiter)     // '"' used to make csv xls readable. Not used here
        this.headers = str.slice(0, str.indexOf("\n")).split(delimiter);
        if (!this.headers.includes("No.") && this.mode == "standard") {
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

    Print() {   // or filtered
        // standard use case
        var cDivOut = document.getElementById(ID_DIVOUT);
        if (this.printMode == 'full') {
            cDivOut.innerHTML = this._AsHTMLTable()
        } else {
            cDivOut.innerHTML = this._AsHTMLTable(this._RetFilteredRowsIndexList())
        }
        
        if (this.mode == "memory") {
            let TDs = document.getElementsByTagName("td")
            for (let td of TDs) {
                td.classList.add("memory-card", "memory-center")
            }
            let THs = document.getElementsByTagName("th")
            for (let th of THs) {
                th.classList.add("memory-center")
            }
        }
            
        this.layout.ApplyHighlightToSite()
    }

    _RetFilteredRowsIndexList() {
        let ret = []
        let j = this.headers.indexOf("Tags")
        if (this.filterTags.length == 0) {
            for (let i = 0; i < this.len; i++) {
                ret.push(i)}
            return ret
        }
        for (let i = 0; i < this.len; i++) {
            for (let k = 0; k < this.filterTags.length; k++) {
                if (this.data[i][j].includes(this.filterTags[k])) {
                    ret.push(i)
                    break
                }
            }
        }
        return ret
    }

    Filter() {
        let flag = false
        for (let row of this.rows_visible) {
            for(let key in filter) {let val= filter[key]
                if (val.contains()) {

                }
                
                if (flag) {
    
                }
              }
        }

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

        this._AddRow_insert(newRow)
        this.Print();
    }

    AddRowCopy() {
        let newRow = [];
        let row = parseInt(RetStringBetween(this.layout.row_highlight[0], "row:", "!"))
        for (let i = 0; i < this.headers.length; i++) {
            newRow.push(this.data[row][i])}

        this._AddRow_insert(newRow)
        this.Print();
    }

    _AddRow_insert (newRow) {
        if (this.layout.row_highlight[0] == "") {
            this.data.push(newRow)
            // this.layout.rows_visible.push('visible')
            this.len += 1
            this.data[this.len-1][0] = this.len}
        else { //add rowbelow selected row
            let row = parseInt(RetStringBetween(this.layout.row_highlight[0], "row:", "!"))
            this.data.splice(row+1, 0, newRow);
            // this.layout.rows_visible.splice(row+1, 0, 'visible')
            this.len += 1
            // Update Numbering
            for (let i = row;i< this.len-1;i++) {
                this.data[i+1][0] = i + 2}
            }
    }

    Edit(divID) {
        this._HighlightCell(divID);
        this._CreateInputField(divID)
        this._svgAppend_Save(divID)
        this._CreateRevertX(divID)
        this._CreateName(divID)
        

        this.DontDisplayValue(this.layout.cellIDs_highlight[0][0]);
        
        document.getElementById(this.name + "-input").focus();
        document.getElementById(this.name + "-input").select();
        document.getElementById(this.name + "-input").value = this._Data_GetHighlightValue();
    }

    Click(divID) {
        if (this.mode == "standard") {
            if (divID == "") {
                return }

            if (this.layout._IDIsOutsideTable(divID)) {
                if (this.layout._IDIsButton(divID)) {
                    return
                } else {
                    this.layout.Unhighlight_All()
                    this.Print()
                    return
                }
            }

            if (this.layout._IDIsInput(divID)) {
                return}

            if (divID.includes("tag-")) {
                let tag = RetStringBetween(divID,"tag-","")
                this._toggle_TagFilter(tag)
                this._ToggleTagColor(divID)
            }

            if (divID.includes("header-")) {
                this.layout.Unhighlight_All()
                let tag = RetStringBetween(divID,"header-","")
                this.layout.col_highlight[0] = "col-" + tag
                this.Print()
                return
            }
            

            // when row is already clicked then bring cell in edit mode
            let rowID = this.layout.GetRowID(divID)
            if (rowID == this.layout.row_highlight[0]) {
                this.Edit(divID) // no Print here, as Print would result in a read only representattion of the current data
            } else {
                // else highlight (new) row
                this.layout.Unhighlight_All()
                this.layout.HighlightRow(divID)
                this.Print()
            }
        }

        
    }

    UnEdit(divID) {
        this.layout.cellIDs_highlight[0][0] = ""
        this.Print()
    }

    SaveEdit() {
        this._SaveCellValueToData()
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
            if (row.classList.contains("csv-sum")) {
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
        let oldinput  = document.getElementById(this.name + "-input");
        if (oldinput != undefined) {
            oldinput.remove();}

        let div = document.getElementById(divID);
        let input = document.createElement('textarea'); input.cols = "50"
        // ; input.rows = "5"
        input.id = this.name + "-input"
        input.classList.add("input-large", "form-control")
        div.append(input);
        this.InputFiled_AutoHeight();
        this.layout.div_input = input;
    }

    _CreateRevertX(divID) {
        let div = document.getElementById(divID);
        let a = document.createElement('a');
        a.href = "#"
        a.setAttribute('onclick', this.name + '.UnEdit()');
        a.innerHTML = ' X '
        a.style.margin = '5pt'
        div.append(a);
    }

    _CreateName(divID) {
        let div = document.getElementById(divID);
        let a = document.createElement('a');
        a.href = "#"
        a.setAttribute('onclick', this.name + '._Prefill_Input("[NAME:]")');
        a.innerHTML = ' [Name:] '
        a.style.margin = '5pt'
        div.append(a);
    }

    _Prefill_Input(text) {
        if (text == "[NAME:]") {
            document.getElementById(this.name + '-input').value += '[NAME:]'
        }
        
    }

    _SaveCellValueToData(){
        let raw = this.layout.cellIDs_highlight[0][0]
        let row = parseInt(RetStringBetween(raw,"R:", "C:"))
        let col = parseInt(RetStringBetween(raw,"C:", "H:"))
        let value = document.getElementById(this.name + "-input").value;

        if (value.includes("\n")) {
            value = value.replace(new RegExp("\n", "g") , "\r")
        }

        for (let i = 0; i< 100;i++) {
            if (value.indexOf("[NAME:")!=-1) {
                let name = RetStringBetween(value,"[NAME:", "]")
                let url = this._RetURL(name)
                let rpl = '<a href="' + url + '">' + name + '</a>'
                value = value.replace("[NAME:" + name + "]" , rpl)
            }
        }
        this.data[row][col] = value;
    }

    _RetURL(name) {
        let iName = this.headers.indexOf("name")
        let iURL = this.headers.indexOf("url")
        for (let i = 0; i< this.len;i++) {
            if (this.data[i][iName] == name) {
                return this.data[i][iURL] 
            }
        }
        return ""
    }

    _Data_GetHighlightValue(){
        let raw = this.layout.cellIDs_highlight[0][0]
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

    _AsHTMLTable(listRowsIdx = null) {
        // when null, then all indexes
        if (listRowsIdx == null) {
            listRowsIdx = []
            for (var i = 0; i <this.len; i++) {
                listRowsIdx.push(i)
            }
        }
        // table-col-width:
        let colwidth = {
            "No.": 'style="width:2%"',
            "name": 'style="width:15%"',
            "description": 'style="width:38%"',
            "url": 'style="width:20%"',
            "value": 'style="width:5%"',  
            "Tags": 'style="width:10%"',            
        }
        // table
        let ret = '<table class="table">';
        //header body
        ret += '<thead><tr>'
        // headers
        for (let header of this.headers) {
            if (header == "Tags") {
                ret += '<th id = "header-' + header + '" class="ecsvtable col-' + header + '" '+ colwidth[header] +'>' + header
                ret += " " + this._svgText_ArrowDown()
                ret += this.AddTagMenu()
                ret += '</th>'}
            else {
                ret += '<th id = "header-' + header + '" class="ecsvtable col-' + header + '" ' + colwidth[header] +'>' + header + '</th>'}
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
            if (listRowsIdx.includes(rowidx)) {
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
        }
        // build sum row
        if (this.sum != -1) {
            var i = -1;
            ret += '<tr class ="csv-sum">';
            for (let cell of this._retSumRow()[0]) {
                i += 1;
                ret += '<td id="R:' + rowidx + 'C:' + i + 'H:' + this.headers[i] + '" class="ecsvtable col-' + this.headers[i] + ' ecsvcell csv-sum">' + cell + '</td>'
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
                if (String(cell).includes("\r")) {
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

    _toggle_TagFilter(tag) {
        if (this.filterTags == null) {
            this.filterTags = []}
        if (this.filterTags.includes(tag)) {
            let idx = this.filterTags.indexOf(tag);
            this.filterTags.splice(idx, 1)
        } else {
            this.filterTags.push(tag)
        }

        if (this.filterTags.length == 0) {
            this.printMode = 'full' }
        else {
            this.printMode = '' }
  
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
            this.layout.cellIDs_highlight[0][0] = divID;
            this.layout.row_highlight[0] = "";
        } else {
            this.layout.cellIDs_highlight[0][0] = "";}
        this.Print();
    }

    _HighlightRow(divID) {
        if (divID.includes("row:")) {
            this.layout.row_highlight[0] = divID;
            this.layout.cellIDs_highlight[0][0] = "";
        } else {
            this.layout.row_highlight[0] = "";}
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
        let row = parseInt(RetStringBetween(this.layout.row_highlight[0], "row:", "!"))
        if (row < this.len) {
            let tmp = this.data[row];
            this.data[row] = this.data[row+1];
            this.data[row+1] = tmp;
            this.layout.row_highlight[0] = "row:" + String(parseInt(row) + 1) + "!"
            this.data[row][0] = parseInt(this.data[row][0])-1
            this.data[row+1][0] = parseInt(this.data[row+1][0])+1
            this.Print();
        }

    }

    Row_Up() {
        let row = parseInt(RetStringBetween(this.layout.row_highlight[0], "row:", "!"))
        if (row > 0) {
            let tmp = this.data[row];
            this.data[row] = this.data[row-1];
            this.data[row-1] = tmp;
            this.layout.row_highlight[0] = "row:" + String(parseInt(row) - 1) + "!"
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
        let ret = '<div class="dropdown-menu Tags">'
        for (let tag of tags) {
            if (this.filterTags.includes(tag)) {
                ret += '<a id="tag-' + tag + '" class="dropdown-item bg-info" href="#">' + tag + '</a>'
            } else {
                ret += '<a id="tag-' + tag + '" class="dropdown-item" href="#">' + tag + '</a>'
            }
            
        }
        return ret
    }

    _svgAppend_Save(divID) {
        let div = document.getElementById(divID);
        let a = document.createElement('a');
        a.href = "#"
        a.setAttribute('onclick', this.name + '.SaveEdit()');
        a.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-save m-2" viewBox="0 0 16 16"> \
        <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 \
        3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z"/> \
        </svg>'
        div.append(a);
    }

    _svgText_ArrowDown(){
        let para = "ecsv.layout.DowpDown_ShowHide('Tags')"
        let param = '"' + para + '"'
        return '<a href="#" onclick=' + param + '>\
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-square" viewBox="0 0 16 16">\
        <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0\
         0 1-2 2H2a2 2 0 0 1-2-2V2zm8.5 2.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>\
      </svg></a>'
    }

// ################################################################
// Events                                         #
// ################################################################

    ButtonClick(event){
        // "ESC"
        if (event.isComposing || event.keyCode === 27) {
            this.layout.Unhighlight_All();
            this.Print();
        }
        console.log(event.keyCode)
        if (this.layout.InputIsActive() == false){
            // "w"
            if (event.isComposing || event.keyCode === 87) {
                this.Row_Up();}
            // "s"
            if (event.isComposing || event.keyCode === 83) {
                this.Row_Down();}
            // "a"
            if (event.isComposing || event.keyCode === 65) {
                this.AddRow();}
            // "c"
            if (event.isComposing || event.keyCode === 67) {
                this.AddRowCopy();}
        }
        if (this.layout.InputIsActive()){
            if (this.userinput.LeftDown) {
                //
            }
        }
        console.log(event.keyCode)
    }

    InputFiled_AutoHeight(event) {
        let element = document.getElementById(this.name + "-input")
        if (element == undefined) {
            return 
        }
        element.style.height = (element.scrollHeight)+"px";
    }

    MouseOver(event) {
        console.log("Mouse over " + event.srcElement.id)
    }
}

