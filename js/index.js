
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
var AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });
ddb = new AWS.DynamoDB({});
var tempArr = [];
var sharedCalenderArray = [];
var tempUserArr = [];
const { app, BrowserWindow, getCurrentWindow } = require('electron').remote;
var fs = require('fs');
var eventArr = [];
var sharedCals = [];
var sharedCalenderArrayTemp;
var firstDayOfWeek;
var lastDayOfWeek;
var isEditing = false;
var eventID = 0; // want to load this value
var userID = 0;
var runningID = 0;
var username = "";
var configArr = [];
var shared = false;
var currentTableKey = 0;


// Adjust this number depending on table entry representation
// (pixel height of table slot)
const TIMEBLOCKSIZE = 60;

function handleLogin() {
    username = localStorage.getItem('user');
    if(username == null){
        username = document.getElementById("username").value;
    }else{
        localStorage.removeItem('user')
    }
    
    //console.log(username);
    document.getElementById("login").style.display = "none";
    document.getElementById("hidecontainer").style.display = "contents";
    document.getElementById('cal2').addEventListener("click", function (e) {
        var target = e.target;
        console.log(target);
        if (target.nodeName === "DIV" && target.className === "event") {
            editEvent(target.firstElementChild.innerText);
        }
    });
    loadEvents();
};

function editEvent(eventIDNo) {
    isEditing = true;
    let eventObj;
    var i;
    for (i = 0; i < eventArr.length; i++) {
        if (eventIDNo == eventArr[i].eID) {
            eventObj = eventArr[i];
            break;
        }
    }
    localStorage.setItem("eventObj", JSON.stringify(eventObj));
    currentLength = eventArr.length;
    var j;
    localStorage.setItem("eventsArr", JSON.stringify(eventArr));
    //console.log("before event created");
    newEvent();
    emptyTable();

    var k;
    for (k = 0; k < eventArr.length; k++) {
        var element = eventArr[k];
        //console.log(element);
        addEventToCalendar(element);
    }

}

function deleteEvent(eventIDNo) {

    if (!eventArr.length) {
        eventArr = JSON.parse(localStorage.getItem("eventsArr"));
    }
    /*
    console.dir("ARRAY BEFORE DELETE: ");
    console.dir(eventArr);
    */
    //console.log(eventIDNo);
    for (i = 0; i < eventArr.length; i++) {
        if (eventIDNo == eventArr[i].eID) {
            eventArr.splice(i, 1);
            break;
        }
    }
    /*
    console.dir("ARRAY AFTER DELETE: ");
    console.dir(eventArr);
    */
    saveEvents();
    if (!Array.isArray(eventArr) || !eventArr.length) {
        localStorage.setItem("eventsArr", "empty");
    }
    else {
        localStorage.setItem("eventsArr", JSON.stringify(eventArr));
    }

}

function startHeader() {
    localStorage.clear();
    firstDayOfWeek = startOfWeek(startOfToday());
    lastDayOfWeek = endOfWeek(startOfToday());
    updateHeaders(firstDayOfWeek);
}

function getMonthAsString(month) {
    if (month == 0) {
        return "January";
    }
    else if (month == 1) {
        return "February";
    }
    else if (month == 2) {
        return "March";
    }
    else if (month == 3) {
        return "April";
    }
    else if (month == 4) {
        return "May";
    }
    else if (month == 5) {
        return "June";
    }
    else if (month == 6) {
        return "July";
    }
    else if (month == 7) {
        return "August";
    }
    else if (month == 8) {
        return "September";
    }
    else if (month == 9) {
        return "October";
    }
    else if (month == 10) {
        return "November";
    }
    else if (month == 11) {
        return "December";
    }
    return "trash";
}

function updateHeaders(weekStart) {
    var tab = document.getElementById('myTable');
    var datePtr = weekStart;
    document.getElementById('month').textContent = getMonthAsString(getMonth(datePtr));
    document.getElementById('myBody').scrollTop = 800;
    cellArray = tab.rows[0].cells;
    var i;
    for (i = 1; i < cellArray.length; i++) {
        cellArray[i].innerHTML = cellArray[i].innerHTML.trim();
        var substr = cellArray[i].innerHTML.substring(0, cellArray[i].innerHTML.lastIndexOf('\n'));
        if (substr.replace(/\s/g, "") != "") {
            cellArray[i].innerHTML = substr;
            cellArray[i].innerHTML += `\n<div class="date">` + getDate(datePtr) + `</div>`;
        }
        else {
            cellArray[i].innerHTML += `\n<div class="date">` + getDate(datePtr) + `</div>`;
        }

        datePtr = addDays(datePtr, 1);

    }
}

function emptyTable() {
    var body = document.getElementById('myBody');
    //console.dir(body);
    var rows = body.rows;
    for (i = 0; i < body.rows.length; i++) {
        var cells = body.rows[i].cells;
        for (j = 1; j < cells.length; j++) {
            cells[j].innerHTML = "<td>&nbsp;</td>";
        }
    }
}

function newWeek(rightOrLeft) {
    emptyTable();

    // if 1, forward a week.
    // if -1, backward a week.
    if (rightOrLeft === 1) {
        firstDayOfWeek = addDays(firstDayOfWeek, 7);
        lastDayOfWeek = addDays(lastDayOfWeek, 7);
    }
    else {
        firstDayOfWeek = subDays(firstDayOfWeek, 7);
        lastDayOfWeek = subDays(lastDayOfWeek, 7);
    }
    updateHeaders(firstDayOfWeek);
    //console.log(eventArr);
    var k;
    for (k = 0; k < eventArr.length; k++) {
        var element = eventArr[k];
        //console.log(element);
        addEventToCalendar(element);
    }
}

function getEventID() {
    console.log("currEID" + eventID);
    return eventID++;
}

function loadArray() {
    var str = localStorage.getItem("eventsArr");
    var x = null;
    //console.dir("WHAT STRING: " + str);
    if (str != null && str != "" && str != "empty") {
        x = JSON.parse(str);
    }
    if (str == "empty") {
        eventArr = [];
    }
    else {
        //console.dir(x);
        if (x != null) {
            //console.dir("UPDATE ARR: ");
            eventArr = x;
        }
    }
}

// Handles button pressing
function newEvent() {
    const { BrowserWindow } = require('electron').remote;
    newWindow = new BrowserWindow({ width: 1000, height: 600 });
    newWindow.loadFile('assets/button.html');


    let eventObj;
    newWindow.on('hide', () => {
        ++eventID;
        eventObj = {
            eName: localStorage.getItem("name"),
            eDesc: localStorage.getItem("desc"),
            //eLength:  localStorage.getItem("length")
            eStartDate: parse(localStorage.getItem("startDate") + 'T' + localStorage.getItem("start")),
            eEndDate: parse(localStorage.getItem("endDate") + 'T' + localStorage.getItem("end")),
            eID: eventID
        };
        loadArray();
        eventArr.push(eventObj);
        saveEvents();
        localStorage.setItem("eventsArr", JSON.stringify(eventArr));
        /*
        console.log(localStorage.getItem("startDate") + 'T' +localStorage.getItem("start"));
        console.log(parse(localStorage.getItem("startDate") + 'T' +localStorage.getItem("start")));
        var test = JSON.stringify(eventObj.eStartDate);
        var testObj = JSON.parse(test);

        //console.log(eventObj.eStartDate);
        //console.log(eventObj.eEndDate);
        console.log(test);
        console.log(testObj);
        console.dir(eventArr);
        */

        //console.log("name: ", eventObj.eName, " desc: ", eventObj.eDesc);
        newWindow.close();
        newWindow = null;
        if (!isEditing) {
            emptyTable();
            var k;
            for (k = 0; k < eventArr.length; k++) {
                var element = eventArr[k];
                addEventToCalendar(element);
            }
        }



        //addEventToCalendar(eventObj);
    });
    if (isEditing) {
        newWindow.on('close', () => {
            loadArray();
            saveEvents();
            localStorage.setItem("eventsArr", JSON.stringify(eventArr));
            isEditing = false;
            emptyTable();

            var k;
            for (k = 0; k < eventArr.length; k++) {
                var element = eventArr[k];
                //console.log(element);
                addEventToCalendar(element);
            }
        });

    }

}

/*  Compare the two dates and return 1 if the first
    date is after the second, -1 if the first date
    is before the second or 0 if dates are equal. */
function isEventInCalendar(eventObj) {
    if (compareAsc(parse(eventObj.eStartDate), firstDayOfWeek) < 0
        || compareAsc(parse(eventObj.eStartDate), lastDayOfWeek) > 0) {
        // leave off end checks to allow starting in the week to be ended
        //|| compareAsc(eventObj.eEndDate, firstDayOfWeek) < 0
        //|| compareAsc(eventObj.eEndDate, lastDayOfWeek) > 0) {
        return false;
    }
    else {
        return true;
    }
}

function findEventInCalendar(eventObj) {
    if (isEventInCalendar(eventObj)) {
        var index;
        var datePtr = firstDayOfWeek;
        for (i = 0; i < 7; i++) {
            if (isSameDay(parse(eventObj.eStartDate), datePtr)) {
                return i; // index in day of week (0 is sunday,1 monday etc.)
            }
            else {
                datePtr = addDays(datePtr, 1);
            }
        }
        console.log("something went wrong, in calendar but not found");
        console.dir(datePtr);
        console.dir(eventObj);
    }
    return -1; // not in calendar
}

function addEventToCalendar(eventObj) {
    var dayFound = findEventInCalendar(eventObj);
    if (dayFound === -1) {
        return;
    }
    var localStart = parse(eventObj.eStartDate);
    var localEnd = parse(eventObj.eEndDate);

    var length = minDiff(localEnd, localStart);
    var myBody = document.getElementById('myBody');
    var startPoint = minDiff(localStart, startOfDay(localStart));
    var diff = length / TIMEBLOCKSIZE;
    //console.log("Difference: " + diff);
    // 1 offset to avoid first row of table. (header)
    startPoint = Math.floor(startPoint / TIMEBLOCKSIZE) + 1; // currently minutes, swapping to hours
    //console.log("Start: " + startPoint);

    var column = dayFound + 1; //offset from leftmost col.
    var i;
    var startMins = getMinutes(localStart);
    var endMins = getMinutes(localEnd);
    if (startMins < 10) {
        startMins = "0" + startMins;
    }
    if (endMins < 10) {
        endMins = "0" + endMins;
    }
    var tab = document.getElementById('myTable');
    var heightBox = diff * 100;
    var eventBlock;
    var found = false;
    for (i = startPoint; i < startPoint + Math.floor((length / TIMEBLOCKSIZE)); i++) {
        if (!found) {
            tab.rows[i].cells[column].textContent = eventObj.eName;
            tab.rows[i].cells[column].innerHTML = `<div class="event" title=` + eventObj.eName + ` data-index=""
        style="height:`+ heightBox + `px" nodeValue=` + eventObj.eID + `>
        <p class="hidden">`+ eventObj.eID + `</p>
        <div class="start-time"><strong>` + getHours(localStart) + ":" + startMins + `</strong></div>
        <div class="description">` + eventObj.eDesc + `</div>
        <div class="end-time"><strong>` + getHours(localEnd) + ":" + endMins + `</strong></div>
        </div>`;

            tab.rows[i].cells[column].id = "definer";
            tab.rows[i].cells[column].value = eventObj.eID;
            //console.dir(tab.rows[i].cells[column]);
            found = true;
        }
        else {
            tab.rows[i].cells[column].id = "covered";
        }
        //eventBlock.id = "";
        //break;
        //tab.rows[i].cells[column].className = "fill";
    }
}

function loadEvents() {
    var obj;
    //load events from AWS
    getUser();

    fs.readFile('config.json', 'utf8', function (err, data) {
        if (err) console.log(err);
        else {
            try {
                console.log(data);
                obj = JSON.parse(data);
                console.log(obj);
                if (Object.keys(data).length == 0) {
                    return;
                }
                eventID = parseInt(obj.eventID);
                runningID = parseInt(obj.runningID);
                console.log("EVENTID: " + eventID + " RUNNINGID: " + runningID);
            } catch{
                //console.log("nothing to load");
            }
        }
    });
    //eventID = localStorage.getItem("eventIDcount");
}

function saveEvents() {
    //send new Event array to AWS
    if (shared == false) {
        sendEvents();
    } else {
        sendSharedEvents();
    }
    fs.truncate('config.json', 0, function () { });
    console.dir(eventID);
    configArr = { eventID, runningID };
    fs.writeFile('config.json', JSON.stringify(configArr), function (err) {
        if (err) throw err;
    });
}

//clear saved data
function clearData() {
    fs.truncate('data.json', 0, function () { console.log('done clearing file') });
    deleteFromAWS();
    fs.truncate('config.json', 0, function () { console.log('done clearing config') });
}

function sendEvents() {
    var params = {
        TableName: 'Users',
        Key: {
            'UserID': { N: username.hashCode().toString() }
        },
        UpdateExpression: "set EventArray = :r",
        ExpressionAttributeValues: {
            ":r": { S: JSON.stringify(eventArr) },
        }
    }
    ddb.updateItem(params, function (err, data) {
        if (err) console.log(err);
    });
}

//switched to using a hashcode for a userid
async function addUser() {
    var params = {
        TableName: 'Users',
        Item: {
            'UserID': { N: username.hashCode().toString() },
            'Username': { S: username },
            'EventArray': { S: JSON.stringify(eventArr) },
            'SharedCal': { S: JSON.stringify(sharedCals) },
        }
    }
    userID = runningID++;
    ddb.putItem(params, function (err, data) {
        if (err) console.log(err);
    });
}

async function getUser() {
    await AWSRequest();
    getEvents();
}

async function getEvents() {
    //set up parameters to read table events
    await getSharedCalendars();
    tempArr.forEach(element => {
        console.log(element);
        eventArr.push(element);
        addEventToCalendar(element);
    });
}

/* get all the user's shared calender IDs */
async function getSharedCalendars() {
    localStorage.removeItem("SharedCal");
    var param = {
        TableName: 'Users',
        Key: {
            'UserID': { N: username.hashCode().toString() },
        },
        ProjectionExpression: 'SharedCal'
    };
    let promise = new Promise((resolve, reject) => {
        ddb.getItem(param, function (err, data) {
            if (err) {
                console.log("Error", err);
            } else {
                if (data.Item == undefined) {
                    console.log("THIS USER HAS NO DATA");
                    resolve(1);
                }
                else {
                    sharedCalenderArray = JSON.parse(data.Item.SharedCal.S);
                    resolve(1);
                }

            }
        });
    });
    let result = await promise;
    var count = 0;
    sharedCalenderArray.forEach(async function (num) {
        await getSharedCalendars1(num, count);
        count++;
    });
    localStorage.setItem("SharedCal", JSON.stringify(sharedCalenderArray));
}

/* get all Shared Calender names for select option */
async function getSharedCalendars1(item, c) {
    var params = {
        TableName: 'SharedTable',
        Key: {
            'Table Key': { N: item.toString() },
        }
    };

    let promise = new Promise((resolve, reject) => {
        ddb.getItem(params, function (err, data) {
            if (err) {
                console.log("Unable to read item: " + "\n" + JSON.stringify(err, undefined, 2));
            } else {
                var x = document.getElementById("selCal")
                var option = document.createElement("option");
                option.text = data.Item.CalName.S;
                option.id = c
                x.add(option);
                resolve(1);
            }
        });
    })
    let re = await promise;
}

async function AWSRequest() {
    var param = {
        TableName: 'Users',
        Key: {
            'UserID': { N: username.hashCode().toString() },
        },
        ProjectionExpression: 'EventArray'
    };
    console.log("USER ID TO SEARCH: " + username.hashCode());
    let promise = new Promise((resolve, reject) => {
        ddb.getItem(param, function (err, data) {
            if (err) {
                console.log("Error", err);
            } else {
                if (data.Item == undefined) {
                    console.log("THIS USER HAS NO DATA");
                    addUser();
                    resolve(1);
                }
                else {
                    tempArr = JSON.parse(data.Item.EventArray.S);
                    console.dir(tempArr);
                    resolve(1);
                }

            }
        });
    });
    let result = await promise;
}

async function AWSRequestUser(user) {
    var param = {
        TableName: 'Users',
        Key: {
            'UserID': { N: user.toString() },
        },
        ProjectionExpression: 'SharedCal'
    };
    let promise = new Promise((resolve, reject) => {
        ddb.getItem(param, function (err, data) {
            if (err) {
                console.log("Error", err);
            } else {
                tempArr = JSON.parse(data.Item.SharedCal.S);
                console.log(data)
                resolve(data.Item.SharedCal);
            }
        });
    });
    let result = await promise;
    return result;
}

function deleteFromAWS() {
    var params = {
        TableName: 'Users',
        Key: {
            'UserID': { N: username.hashCode().toString() },
        }
    }
    ddb.deleteItem(params, function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Successfully deleted data from AWS", data);
        }
    })
    var params2 = {
        TableName: 'UserKeys',
        Key: {
            'username': { S: username },
        }
    }
    ddb.deleteItem(params2, function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Successfully deleted data from AWS", data);
        }
    })
}

function createSharedCalendar() {
    const path = require('path')
    localStorage.setItem("userName", username);
    const modalPath = path.join('file://', __dirname, 'assets/shared.html')
    let win = new BrowserWindow({ width: 600, height: 600 })
    win.on('close', function () {
        win = null
        OnCloseShareCalendar()
    })
    win.loadURL(modalPath)
    win.show()
}

function OnCloseShareCalendar() {
    users = JSON.parse(localStorage.getItem("shareUsers"))
    if (users == null) return;
    console.log(users)

    var tableID = 0;
    users.forEach(function (u) {
        tableID += u.hashCode()
    })
    var tempEventArray = [];
    var params = {
        TableName: 'SharedTable',
        Item: {
            'Table Key': { N: tableID.toString() },
            'CalName': { S: localStorage.getItem("calShareName") },
            'Users of this calendar': { S: JSON.stringify(users) },
            'Calendar': { S: JSON.stringify(tempEventArray) }
        }
    }
    ddb.putItem(params, function (err, data) {
        if (err) console.log(err);
    });

    localStorage.removeItem("shareUsers");
    localStorage.removeItem("calShareName");

    /* for each user we iterate thru and add the shared calendar ID to their Account */
    users.forEach(async function (user) {
        var a = [];
        tempArr = [];
        await AWSRequestUser(user.hashCode());
        console.log(tempArr)
        tempArr.push(tableID);
        var params = {
            TableName: 'Users',
            Key: {
                'UserID': { N: user.hashCode().toString() }
            },
            UpdateExpression: "set SharedCal = :r",
            ExpressionAttributeValues: {
                ":r": { S: JSON.stringify(tempArr) },
            }
        }
        ddb.updateItem(params, function (err, data) {
            if (err) console.log(err);
        });
        tempArr = []
    })

}

String.prototype.hashCode = function () {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

function changeCalendar(s) {
    var x = ""
    var x = s[s.selectedIndex].value;
    var i = s[s.selectedIndex].id;
    eventArr = [];
    console.log(i);
    emptyTable();
    if (x === "default") {
        shared = false;
        getUserSwap();
    } else {
        var sharedCalenderArray = JSON.parse(localStorage.getItem("SharedCal"));
        let ev = sharedCalenderArray[i];
        loadSharedEvents(ev);
    }
}

async function loadSharedEvents(calName) {
    tempArr = [];
    await AWSRequestShared(calName);
    tempArr.forEach(element => {
        console.log(element);
        eventArr.push(element);
        addEventToCalendar(element);
    });

}

async function AWSRequestShared(cal) {
    currentTableKey = cal;
    shared = true;
    var param = {
        TableName: 'SharedTable',
        Key: {
            'Table Key': { N: cal.toString() },
        },
    };
    let promise = new Promise((resolve, reject) => {
        ddb.getItem(param, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                if (data.Item == undefined) {
                    console.log("THIS USER HAS NO DATA");
                    resolve(1);
                }
                else {
                    tempArr = JSON.parse(data.Item.Calendar.S);
                    resolve(1);
                }

            }
        });
    });
    let result = await promise;
}

function sendSharedEvents() {
    console.log("This is a shared Calendar updating:  " + currentTableKey)
    var params = {
        TableName: 'SharedTable',
        Key: {
            'Table Key': { N: currentTableKey.toString() },
        },
        UpdateExpression: "set Calendar = :r",
        ExpressionAttributeValues: {
            ":r": { S: JSON.stringify(eventArr) },
        }
    }
    ddb.updateItem(params, function (err, data) {
        if (err) console.log(err);
    });
}

async function getUserSwap() {
    await AWSRequest();
    tempArr.forEach(element => {
        console.log(element);
        eventArr.push(element);
        addEventToCalendar(element);
    });
}


