
  // Initializations
  var startOfWeek = require('date-fns/start_of_week');
  var endOfWeek = require('date-fns/end_of_week');
  var startOfToday = require('date-fns/start_of_today');
  var startOfTomorrow = require('date-fns/start_of_tomorrow');
  var isSameDay = require('date-fns/is_same_day');
  var getDate = require('date-fns/get_date');
  var getMonth = require('date-fns/get_month');
  var startOfDay = require('date-fns/start_of_day');
  var addDays = require('date-fns/add_days');
  var subDays = require('date-fns/sub_days');
  var compareAsc = require('date-fns/compare_asc');
  var parse = require('date-fns/parse');
  var getHours = require('date-fns/get_hours');
  var getMinutes = require('date-fns/get_minutes');
  var minDiff = require('date-fns/difference_in_minutes');
  const {app, BrowserWindow, getCurrentWindow } = require('electron').remote;
  var eventArr = [];
  var firstDayOfWeek;
  var lastDayOfWeek;
  var eventID = 0; // want to load this value
  // Adjust this number depending on table entry representation
  const TIMEBLOCKSIZE = 60;

  function startHeader() {
    firstDayOfWeek = startOfWeek(startOfToday());
    lastDayOfWeek = endOfWeek(startOfToday());
    updateHeaders(firstDayOfWeek);
  }
  
  function getMonthAsString(month){
	  if(month == 0){
		  return "January";
	  }
	  else if(month == 1){
		  return "February";
	  }
	  else if(month == 2){
		  return "March";
	  }
	  else if(month == 3){
		  return "April";
	  }
	  else if(month == 4){
		  return "May";
	  }
	  else if(month == 5){
		  return "June";
	  }
	  else if(month == 6){
		  return "July";
	  }
	  else if(month == 7){
		  return "August";
	  }
	  else if(month == 8){
		  return "September";
	  }
	  else if(month == 9){
		  return "October";
	  }
	  else if(month == 10){
		  return "November";
	  }
	  else if(month == 11){
		  return "December";
	  }
	  return "trash";
  }
	  

  function updateHeaders(weekStart) {
    var tab = document.getElementById('myTable');
    var datePtr = weekStart;
	document.getElementById('month').textContent = getMonthAsString(getMonth(datePtr));
    document.getElementById('myBody').scrollTop = 800;
    console.dir(tab);
    /*
    console.log(tab.rows);
    */
    cellArray = tab.rows[0].cells;
    var i;
    for (i = 1; i < cellArray.length; i++) {
      //console.dir(cellArray[i]);
      cellArray[i].innerHTML = cellArray[i].innerHTML.trim();
      var substr = cellArray[i].innerHTML.substring(0,cellArray[i].innerHTML.lastIndexOf('\n'));
      if (substr.replace(/\s/g, "") != "") {
        cellArray[i].innerHTML = substr;
        cellArray[i].innerHTML+= `\n<div class="date">` + getDate(datePtr) + `</div>`;
      }
      else {
        cellArray[i].innerHTML += `\n<div class="date">` + getDate(datePtr) + `</div>`;
      }

      datePtr = addDays(datePtr,1);

    }
  }



  function newWeek(rightOrLeft) {
    var body = document.getElementById('myBody');
    //console.dir(body);
    var rows = body.rows;
    var i,j;
    for (i = 0; i < body.rows.length; i++) {
      var cells = body.rows[i].cells;
      for (j = 1; j < cells.length; j++) {
        cells[j].innerHTML = "<td>&nbsp;</td>";
      }
    }
    //body.innerHTML = "";
    //console.log(body);
     // if 1, forward a week.
     // if -1, backward a week.
     if (rightOrLeft === 1) {
       firstDayOfWeek = addDays(firstDayOfWeek,7);
       lastDayOfWeek = addDays(lastDayOfWeek,7);
     }
     else {
       firstDayOfWeek = subDays(firstDayOfWeek,7);
       lastDayOfWeek = subDays(lastDayOfWeek,7);
     }
     updateHeaders(firstDayOfWeek);
     //console.log(eventArr);
     var k;
     for (k = 0; k < eventArr.length; k++) {
       var element = eventArr[k];
       console.log(element);
       addEventToCalendar(element);
     }
  }
  function getEventID() {
    return eventID++;
  }
  // Handles button pressing
  function newEvent(){
      newWindow = new BrowserWindow({width: 1000, height: 600});
      newWindow.loadFile('assets/button.html');

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

        //console.log(localStorage.getItem("startDate") + 'T' +localStorage.getItem("start"));
        var length = minDiff(eventObj.eEndDate, eventObj.eStartDate);


        var test = JSON.stringify(eventObj.eStartDate);
        var testObj = JSON.parse(test);
        /*
        console.log(eventObj.eStartDate);
        console.log(eventObj.eEndDate);
        console.log(test);
        console.log(testObj);
        console.log(eventArr);
        */

        //console.log("name: ", eventObj.eName, " desc: ", eventObj.eDesc);
        newWindow.close();
        newWindow = null;
        addEventToCalendar(eventObj);
    });
  }
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
        if (isSameDay(eventObj.eStartDate, datePtr)) {
          return i; // index in day of week (0 is sunday,1 monday etc.)
        }
        else {
          datePtr = addDays(datePtr,1);
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
    var myBody = document.getElementById('myBody');
    var startPoint = minDiff(eventObj.eStartDate, startOfDay(eventObj.eStartDate));
    var diff = length/TIMEBLOCKSIZE;
    //console.log("Difference: " + diff);
    // 1 offset to avoid first row of table. (header)
    startPoint = Math.floor(startPoint/TIMEBLOCKSIZE) + 1; // currently minutes, swapping to hours
    //console.log("Start: " + startPoint);

    var column = dayFound + 1; //offset from leftmost col.
    var i;
    var startMins = getMinutes(eventObj.eStartDate);
    var endMins = getMinutes(eventObj.eEndDate);
    if (startMins < 10) {
      startMins = "0" + startMins;
    }
    if (endMins < 10) {
      endMins = "0" + endMins;
    }
    var tab = document.getElementById('myTable');
    var heightBox = diff * 98;
    var eventBlock;
    for(i=startPoint; i < startPoint+Math.floor((length/TIMEBLOCKSIZE)); i++) {
      tab.rows[i].cells[column].textContent = eventObj.eName;
      tab.rows[i].cells[column].innerHTML = `<div class="event" title=` + eventObj.eName + ` data-index=""
      style="height:`+heightBox+`px">
      <div class="start-time"><strong>` + getHours(eventObj.eStartDate) + ":" + startMins + `</strong></div>
      <div class="description">` + eventObj.eDesc+ `</div>
      <div class="end-time"><strong>` + getHours(eventObj.eEndDate) + ":" + endMins + `</strong></div>
      </div>`;

      //eventBlock.id = "";
      break;
      //tab.rows[i].cells[column].className = "fill";
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
