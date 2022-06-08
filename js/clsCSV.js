const cDivOut = document.getElementById("ecsvDivOut");

class clsCSV {
    constructor(csvtext = "", delimiter = ";", egoname='') {
        this.egoname = egoname
        this.cellID_highlight = ["", ""]  // (new) interal value, curent printed
        if (csvtext == "") {
            this.headers = ["col-A"];
            this.data = [["..."]];
            this.len = 1;  
        } else {
        // GetCSV Data
            var str = csvtext.replace(new RegExp('\r\n', "g") , '\n')
            this.headers = str.slice(0, str.indexOf("\n")).split(delimiter);
            this.data = [];
            this.config = [];
            const rows = str.slice(str.indexOf("\n") + 1).split("\n");
            for (let row of rows) {
                if (this._IsValidRow(row)) {
                    let tmp = row.split(delimiter)
                    this.data.push(tmp)}
            }

            // if (this._IsConfigRow(this.data.slice(-1)[0])) {
            //     let configECSV = this.data.slice(-1)[0]
            //     for (let i = 0; i< configECSV.length; i++) {
            //         configECSV[i] = RetStringBetween(configECSV[i], "ecsvConfig:")
            //         this.config.push(configECSV[i])
            //         }
            //     this.data.pop()
            // } else {
            //     for (let i = 0; i< this.headers.length; i++) {
            //         this.config.push("ecsvConfig:d-tablecell")
            //         }
            // }


        }
        if (!cDivOut.innerHTML.includes('<table')) {
            if (!csvtext == "") {
                //Add DropDown
                let nLeft = document.getElementById("navLeft")
                let dd = new clsDropDown([["Col"]], [['ecsv.AddCol()']])
                nLeft.append(dd.div)
                }
            //Print CSV
            this.print();
        }
        // Add Config and Table Div
        // tableDiv.id = "ecsv-Table"
    }

    print( mode = "full") {
        if (this.egoname == "") {
        // ecsvDivConfig.innerHTML += this._Table_ConfigDispalay()
        // ecsvDivConfig.innerHTML += this._Table_ConfigLink()
        // ecsvDivConfidivIDg.innerHTML += this._Table_ConfigImg()
        // ecsvDivInput.innerHTML += this._innerHTML_Input()
        cDivOut.innerHTML = this._AsHTMLTable()
        this._Style_Add_Display("ecsvtable", "table-cell")}
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
        this.print();
        }  

    AddRow() {
        let newRow = [];
        for (let i = 0; i < this.headers.length; i++) {
            newRow.push('..')}
        this.data.push(newRow)
        this.print();
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
        this.print()
    }

    DontDisplayValue(divID) {
        document.getElementById(divID).innerHTML = "<input" + RetStringOutside(document.getElementById(divID).innerHTML, "", "<input") 
    }

    _CreateInputField(divID) {
        let oldinput  = document.getElementById("ecsv-input");
        if (oldinput != undefined) {
            oldinput.remove();}

        let div = document.getElementById(divID);
        let input = document.createElement('input');
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
        for (let row of this.data) {
            rowidx += 1;
            var i = -1;
            ret += '<tr>';
            for (let cell of row) {
                i += 1;
                ret += '<td id="R:' + rowidx + 'C:' + i + 'H:' + this.headers[i] + '" class="ecsvtable col-' + this.headers[i] + ' ecsvcell">' + cell + '</td>'
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

    _Style_Add_Display(classname, style) {
      var elements = document.getElementsByClassName(classname);
      for (let e of elements) {
          e.style.display = style;
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



    _HighlightCell(divID) {
        if (divID.includes("R:") && divID.includes("C:")) {
            this.cellID_highlight[0] = divID;
        } else {
            this.cellID_highlight[0] = "";}
        this.print();
    }
}

var ecsv = new clsCSV();