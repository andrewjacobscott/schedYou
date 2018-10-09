
  // Initializations
  var startOfWeek = require('date-fns/start_of_week');
  var endOfWeek = require('date-fns/end_of_week');
  var startOfToday = require('date-fns/start_of_today');
  var startOfTomorrow = require('date-fns/start_of_tomorrow');
  var getDate = require('date-fns/get_date');
  var compareAsc = require('date-fns/compare_asc');
  var parse = require('date-fns/parse');
  var minDiff = require('date-fns/difference_in_minutes');
  const {app, BrowserWindow, getCurrentWindow } = require('electron').remote;
  var eventArr = [];
  var firstDayOfWeek = startOfWeek(startOfToday());
  var lastDayOfWeek = endOfWeek(startOfToday());
  // Adjust this number depending on table entry representation
  const TIMEBLOCKSIZE = 60; 


  // Handles button pressing
  oldWindow = getCurrentWindow();
  document.getElementById('myTable').addEventListener("click", function(e) {
      var x = e.target;
      if(x.nodeName === "TD" && x.className != "hour" && x.textContent == "") {
        newWindow = new BrowserWindow({width: 1000, height: 600});
        newWindow.loadFile('button.html');

        let eName;
        let eDesc;
        let time;
        let eventObj;
        newWindow.on('hide', () => {
          eventObj = {
            eName:  localStorage.getItem("name"),
            eDesc:  localStorage.getItem("desc"),
            //eLength:  localStorage.getItem("length")
            eStartDate: parse(localStorage.getItem("startDate") + 'T' +localStorage.getItem("start")),
            eEndDate: parse(localStorage.getItem("endDate") + 'T' + localStorage.getItem("end")),
            eID: localStorage.getItem("eventID")
          };
          eventArr.push(eventObj);
          

          var length = minDiff(eventObj.eEndDate, eventObj.eStartDate);
          
          /*
          var test = JSON.stringify(eventObj.eStartDate);
          var testObj = JSON.parse(test);
          console.log(eventObj.eStartDate);
          console.log(eventObj.eEndDate);
          console.log(test);
          console.log(testObj);
          console.log(eventArr);
          */

          console.log("name: ", eventObj.eName, " desc: ", eventObj.eDesc);
          newWindow.close();
          newWindow = null;
          addEventToCalendar(x,length, eventObj.eName, eventObj.eDesc);
        });
      }
  });
  // Compare the two dates and return 1 if the first 
  // date is after the second, -1 if the first date 
  // is before the second or 0 if dates are equal.
  function isEventInCalendar(eventObj) {
    if (compareAsc(eventObj.eStartDate, firstDayOfWeek) < 0
        || compareAsc(eventObj.eStartDate, lastDayOfWeek) > 0) {
        // leave off end checks to allow starting in the week to be ended
        //|| compareAsc(eventObj.eEndDate, firstDayOfWeek) < 0
        //|| compareAsc(eventObj.eEndDate, lastDayOfWeek) > 0) {
        return false;
    }
    else {
      return true;
    }
  }
  /*
  Can sort dates with this function.
  var result = [
    new Date(1995, 6, 2),
    new Date(1987, 1, 11),
    new Date(1989, 6, 10)
  ].sort(compareAsc)
  */

  function findEventInCalendar(eventObj) {
    if (isEventInCalendar(eventObj)) {
      var index;
      var datePtr = firstDayOfWeek;
      for ( i = 0; i < 7; i++) {
        if (isSameDay(eventObj, datePtr)) {
          return i; // index in day of week (0 is sunday,1 monday etc.)
        }
        else {
          datePtr = startOfTomorrow(datePtr);
        }
      }
      console.log("something went wrong, in calendar but not found");
    }
    return -1; // not in calendar
  }

  function addEventToCalendar(eventObj) {
    var dayFound = findEventInCalendar(eventObj);
    if (dayFound === -1) {
      return;
    }
    var length = minDiff(eventObj.eEndDate, eventObj.eStartDate);
    var myTable = document.getElementById('myTable');
    var startPoint = minDiff(eventObj.eStartDate, startOfToday(eventObj.eStartDate));
    startPoint = startPoint/TIMEBLOCKSIZE + 1; // currently minutes, swapping to 1/4 hours
    // Adjust
    for(i=startPoint; i < startPoint+(length/TIMEBLOCKSIZE); i++) {
      cells = myTable.rows[i].cells;
      if (cells[0].className == "hour") {
        cells[col+1].innerHTML = name;
        cells[col+1].className = "fill";
      }
      else {
        cells[col].innerHTML = name;
        cells[col].className = "fill";
      }

    }
  }
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