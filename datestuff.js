// datestuff.js

// function that returns an array of the dates of next week based upon the
// current week's dates
function getNextWeekDates(){
	var curWeekDates = [-1, -1, -1, -1, -1, -1, -1];
	var nextWeekDates = [-1, -1, -1, -1, -1, -1, -1];
	var i;
	var curMonth = 0;
	curWeekDates[0] = parseInt(document.getElementById("sunday").textContent);
	curWeekDates[1] = parseInt(document.getElementById("monday").textContent);
	curWeekDates[2] = parseInt(document.getElementById("tuesday").textContent);
	curWeekDates[3] = parseInt(document.getElementById("wednesday").textContent);
	curWeekDates[4] = parseInt(document.getElementById("thursday").textContent);
	curWeekDates[5] = parseInt(document.getElementById("friday").textContent);
	curWeekDates[6] = parseInt(document.getElementById("saturday").textContent);
	
	if(curMonth == 1){
		for(i = 0; i < 7; i++){
			nextWeekDates[i] = (curWeekDates[i] + 7) % 28;
			if(nextWeekDates[i] == 0){
				nextWeekDates[i] = 28;
			}
		}
	}
	else if(curMonth == 3 || curMonth == 5 || curMonth == 8 || curMonth == 10){
		for(i = 0; i < 7; i++){
			nextWeekDates[i] = (curWeekDates[i] + 7) % 30;
			if(nextWeekDates[i] == 0){
				nextWeekDates[i] = 30;
			}
		}
	}
	else{
		for(i = 0; i < 7; i++){
			nextWeekDates[i] = (curWeekDates[i] + 7) % 31;
			if(nextWeekDates[i] == 0){
				nextWeekDates[i] = 31;
			}
		}
	}
	
	document.getElementById("sunday").textContent = nextWeekDates[0];
	document.getElementById("monday").textContent = nextWeekDates[1];
	document.getElementById("tuesday").textContent = nextWeekDates[2];
	document.getElementById("wednesday").textContent = nextWeekDates[3];
	document.getElementById("thursday").textContent = nextWeekDates[4];
	document.getElementById("friday").textContent = nextWeekDates[5];
	document.getElementById("saturday").textContent = nextWeekDates[6];
}

// function that returns the month of next week given current month
// and the dates of current week
function getNextWeekMonth(){
	
	var curWeekDates = [-1, -1, -1, -1, -1, -1, -1];
	var i;
	var curMonth = 0;
	curWeekDates[0] = parseInt(document.getElementById("sunday").textContent);
	curWeekDates[1] = parseInt(document.getElementById("monday").textContent);
	curWeekDates[2] = parseInt(document.getElementById("tuesday").textContent);
	curWeekDates[3] = parseInt(document.getElementById("wednesday").textContent);
	curWeekDates[4] = parseInt(document.getElementById("thursday").textContent);
	curWeekDates[5] = parseInt(document.getElementById("friday").textContent);
	curWeekDates[6] = parseInt(document.getElementById("saturday").textContent);
	//curMonth = parseInt(document.getElementById("month").textContent);
	
	if(curMonth == 1){
		// if currently february
		if(curWeekDates[6] >= 22){
			curMonth = curMonth + 1;
		}
	}
	else if(curMonth == 3 || curMonth == 5 || curMonth == 8 || curMonth == 10){
		// if current month has 30 days
		if(curWeekDates[6] >= 24){
			curMonth = curMonth + 1;
		}
	}
	else{
		// current month has 31 days
		if(curWeekDates[6] >= 24){
			curMonth = (curMonth + 1) % 12;
		}
	}
	
	//document.getElementById("month").textContent = curMonth;
	
}

// function that returns the year of next week given the current year,
// current month, and current week dates.  Will stay the same unless
// old month was December and next week's month is january
function getNextWeekYear(){
	
	var curWeekDates = [-1, -1, -1, -1, -1, -1, -1];
	var i;
	var curMonth = 0;
	var curYear = 0;
	curWeekDates[0] = parseInt(document.getElementById("sunday").textContent);
	curWeekDates[1] = parseInt(document.getElementById("monday").textContent);
	curWeekDates[2] = parseInt(document.getElementById("tuesday").textContent);
	curWeekDates[3] = parseInt(document.getElementById("wednesday").textContent);
	curWeekDates[4] = parseInt(document.getElementById("thursday").textContent);
	curWeekDates[5] = parseInt(document.getElementById("friday").textContent);
	curWeekDates[6] = parseInt(document.getElementById("saturday").textContent);
	//curMonth = parseInt(document.getElementById("month").textContent);
	//curYear = parseInt(document.getElementById("year").textContent);
	
	if(curMonth == 11){
		// it is december
		if(curWeekDates[6] >= 24){
			// this saturday is at least the 24th
			// so next week is new year
			curYear = curYear++;
		}
	}
	
	//document.getElementById("year").textContent = curYear;
}

// function that returns an array of the dates of last week based upon the
// current week's dates
function getLastWeekDates(){
	var curWeekDates = [-1, -1, -1, -1, -1, -1, -1];
	var lastWeekDates = [-1, -1, -1, -1, -1, -1, -1];
	var i;
	var curMonth = 0;
	curWeekDates[0] = parseInt(document.getElementById("sunday").textContent);
	curWeekDates[1] = parseInt(document.getElementById("monday").textContent);
	curWeekDates[2] = parseInt(document.getElementById("tuesday").textContent);
	curWeekDates[3] = parseInt(document.getElementById("wednesday").textContent);
	curWeekDates[4] = parseInt(document.getElementById("thursday").textContent);
	curWeekDates[5] = parseInt(document.getElementById("friday").textContent);
	curWeekDates[6] = parseInt(document.getElementById("saturday").textContent);
	//curMonth = parseInt(document.getElementById("month").textContent);
	
	if(curWeekDates[6] >= 14){
		// if saturday is at least 14th, then last week is all on this month
		for(i = 0; i < 7; i++){
			lastWeekDates[i] = curWeekDates[i] - 7;
		}
	}
	else if(curWeekDates[6] >= 7){
		// this week is curMonth, last week is prevMonth
		if(curMonth == 2){
			// if going back to feb
			for(i = 0; i < 7; i++){
				lastWeekDates[i] = (curWeekDates[i] + 28 - 7) % 28;
			}
			if(lastWeekDates[i] == 0){
				lastWeekDates[i] = 28;
			}
		}
		else if(curMonth == 4 || curMonth == 6 || curMonth == 9 || curMonth == 11){
			// going to a month with 30 days
			for(i = 0; i < 7; i++){
				lastWeekDates[i] = (curWeekDates[i] + 30 - 7) % 30;
			}
			if(lastWeekDates[i] == 0){
				lastWeekDates[i] = 30;
			}
		}
		else{
			// going to a month with 31 days
			for(i = 0; i < 7; i++){
				lastWeekDates[i] = (curWeekDates[i] + 31 - 7) % 31;
			}
			if(lastWeekDates[i] == 0){
				lastWeekDates[i] = 31;
			}
		}
	}
	else{
		// this week and last week both curMonth
		if(curMonth == 1){
			// staying in feb
			for(i = 0; i < 7; i++){
				lastWeekDates[i] = (curWeekDates[i] + 28 - 7) % 28;
			}
			if(lastWeekDates[i] == 0){
				lastWeekDates[i] = 28;
			}
		}
		else if(curMonth == 3 || curMonth == 5 || curMonth == 8 || curMonth == 10){
			// staying in month with 30 days
			for(i = 0; i < 7; i++){
				lastWeekDates[i] = (curWeekDates[i] + 30 - 7) % 30;
			}
			if(lastWeekDates[i] == 0){
				lastWeekDates[i] = 30;
			}
		}
		else{
			// staying in a month with 31 days
			for(i = 0; i < 7; i++){
				lastWeekDates[i] = (curWeekDates[i] + 31 - 7) % 31;
			}
			if(lastWeekDates[i] == 0){
				lastWeekDates[i] = 31;
			}
		}
	}
	
	document.getElementById("sunday").textContent = lastWeekDates[0];
	document.getElementById("monday").textContent = lastWeekDates[1];
	document.getElementById("tuesday").textContent = lastWeekDates[2];
	document.getElementById("wednesday").textContent = lastWeekDates[3];
	document.getElementById("thursday").textContent = lastWeekDates[4];
	document.getElementById("friday").textContent = lastWeekDates[5];
	document.getElementById("saturday").textContent = lastWeekDates[6];
}

// function that returns the month of last week given current month
// and the dates of current week
function getLastWeekMonth(){
	
	var curWeekDates = [-1, -1, -1, -1, -1, -1, -1];
	var curMonth = 0;
	curWeekDates[0] = parseInt(document.getElementById("sunday").textContent);
	curWeekDates[1] = parseInt(document.getElementById("monday").textContent);
	curWeekDates[2] = parseInt(document.getElementById("tuesday").textContent);
	curWeekDates[3] = parseInt(document.getElementById("wednesday").textContent);
	curWeekDates[4] = parseInt(document.getElementById("thursday").textContent);
	curWeekDates[5] = parseInt(document.getElementById("friday").textContent);
	curWeekDates[6] = parseInt(document.getElementById("saturday").textContent);
	//curMonth = parseInt(document.getElementById("month").textContent);
	
	
	if(curWeekDates[0] <= 7){
		curMonth = (curMonth - 1 + 12) % 12;
	}
	else{
		curMonth = curMonth;
	}
	
	//document.getElementById("month").textContent = curMonth;
}

function getLastWeekYear(){
	var curWeekDates = [-1, -1, -1, -1, -1, -1, -1];
	var curMonth = 0;
	var curYear = 0;
	curWeekDates[0] = parseInt(document.getElementById("sunday").textContent);
	curWeekDates[1] = parseInt(document.getElementById("monday").textContent);
	curWeekDates[2] = parseInt(document.getElementById("tuesday").textContent);
	curWeekDates[3] = parseInt(document.getElementById("wednesday").textContent);
	curWeekDates[4] = parseInt(document.getElementById("thursday").textContent);
	curWeekDates[5] = parseInt(document.getElementById("friday").textContent);
	curWeekDates[6] = parseInt(document.getElementById("saturday").textContent);
	//curMonth = parseInt(document.getElementById("month").textContent);
	//curYear = parseInt(document.getElementById("year").textContent);
	
	if(curMonth == 0){
		// it is january
		if(curWeekDates[0] <= 7){
			curYear = curYear--;
		}
	}
	
	//document.getElementById("year").textContent = curYear;
}






 var days_in_month = [
	[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
	[31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
 ];
 
 // returns if leap year
function isLeapYear(year) {
	return !(year % 400) || ((year % 100) && !(year % 4));
}
 
function totalLeapDays(day, month, year) {
	var total = (year / 4);	// initial estimate
	if (isLeapYear(year)){
		total -= 1;	// leap day is accounted for in days_in_month 
	}
	if (year > 1752) {
		// Delete the inappropriate leap centuries
		// then add back in every 4th leap century 
		total -= ((year / 100) - (1752 / 100));
		total += ((year / 400) - (1752 / 400));
	}
	return total;
 }

// returns which day of the week a date lands on given
// a month, day of month, and year
function dayOfWeek(day, month, year) {
	var	absolute_day = 0;
	var	leap, i;


	/* Initial estimate of the total number of days */
	absolute_day += ((year-1) * 365);
	absolute_day += totalLeapDays(day, month, year);
	if(isLeapYear(year)){
		leap = 1;
	}
	else{
		leap = 0;
	}
	for (i = 0; i < month; i++){
		absolute_day += days_in_month[leap][i];
	}
	absolute_day += day;
	/* If the target is after the calendar switchover, add in the */
	/* number of days that were deleted from Sep 1752 by the */
	/* calendar changeover */
	if (year > 1752) {
		absolute_day -= 11;
	} 
	else if (year == 1752 && month > 8 || (month == 8 && day >= 2)) {
		/* Also make that adjustment for the part of 1752 */
		/* after September 3, when the calendar change happened */
		absolute_day -= 11;
	}
	/* Take it mod 7 to find out the day of the week. Add 6 to */
	/* force the first day of the week to be Sunday. */
	return (6 + absolute_day) % 7;
 }

var year = 2020;
var month = 8;
var day = 31;

alert(isLeapYear(year));
alert(Math.round(dayOfWeek(day, month, year)));



/*
function getPrevDay(date){
	let curDay = date.getDay();
	var retDay = (curDay - 1) % 7;
	return retDay
}

function getNextDay(date){
	let curDay = date.getDay();
	var retDay = (curDay + 1) % 7;
	return retDay;
}

function getDayAsString(day){
	if(day == 0){
		return "Sunday";
	}
	else if(day == 1){
		return "Monday";
	}
	else if(day == 2){
		return "Tuesday";
	}
	else if(day == 3){
		return "Wednesday";
	}
	else if(day == 4){
		return "Thursday";
	}
	else if(day == 5){
		return "Friday";
	}
	else if(day == 6){
		return "Saturday";
	}
}

*/







	