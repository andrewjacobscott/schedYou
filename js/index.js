<script>

  const {app, BrowserWindow, getCurrentWindow } = require('electron').remote;

  oldWindow = getCurrentWindow();
  function newEvent(){
        newWindow.loadFile('button.html');
        /*
        x.textContent = "Hello";
        */
        console.log("List item ", e.target.textContent, " was clicked!");
        let eName;
        let eDesc;
        let time;
        let length;
        newWindow.on('hide', () => {
          eName = localStorage.getItem("name");
          eDesc = localStorage.getItem("desc");
          //time = localStorage.getItem("time");
          length = localStorage.getItem("length");
          console.log("name: ", eName, " desc: ", eDesc);
          newWindow.close();
          newWindow = null;
          addEventToCalendar(x,length, eName, eDesc);
        })


      }

  function addEventToCalendar(start,length, name, desc) {
    var i,j,k;
    var row;
    var col;
    var found = false;
    var myTable = document.getElementById('myTable');
    var cells;

    row = start.parentNode.rowIndex;
    console.log(row);
    console.log(myTable.rows[row].cells.length);
    if (myTable.rows[row].cells.length == 8) {
      col = start.cellIndex-1;
    }
    else {
      col = start.cellIndex;
    }


    for(i=row; i < row+(length*4); i++) {
      cells = myTable.rows[i].cells;
      if (cells[0].className == "hour") {
        cells[col+1].textContent = name;
        cells[col+1].className = "fill";
      }
      else {
        cells[col].textContent = name;
        cells[col].className = "fill";
      }

    }
  }

  function removeEventFromCalender(start, event){
    var i,j, k, rows, col, cells;
    var name;
    var found = false;

    var tab = document.querySelector('table');
    var rowsArray;

    rows = document.querySelectorAll('tr');
    rowsArray = Array.from(rows);

    const rowIndex = rowsArray.findIndex(row => row.contains(event.target));
    const columns = Array.from(rowsArray[rowIndex].querySelectorAll('td'));
    const columnIndex = columns.findIndex(column => column == event.target);
    console.log(rowIndex, columnIndex)

    name = tab.rows[rowIndex].cells[columnIndex].textContent

    console.log("Name: " + name);
    var currentCell = name;
    i = rowIndex;
    j = columnIndex;
    while(currentCell === name){
      tab.rows[i].cells[j].className = "remove";
      tab.rows[i].cells[j].textContent = "";
      j = columnIndex;
      i++;
      currentCell = tab.rows[i].cells[j].textContent;
      console.log(currentCell);
      //check right column
      if(currentCell != name) {
        j = columnIndex + 1;
        currentCell = tab.rows[i].cells[j].textContent;
      }
      //check left column
      if(currentCell != name) {
        j = columnIndex - 1;
        currentCell = tab.rows[i].cells[j].textContent;
      }

    }
  }
</script>
