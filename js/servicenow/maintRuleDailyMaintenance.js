// Example custom maintenance rule for excluding CIs from alert processing
// during designated timeframes (daily maintenance)

var result = [];

//Your code goes here, this is an example of setting CIs in maintenance

// Get the CI(s)
var ci = new GlideRecord('cmdb_ci');

ci.addQuery('u_alert_group','2');
ci.addQuery('u_verified', 'true');
ci.addQuery('operational_status', '1');

ci.query();

// Get current date/time so we can build the date format
var cdt = new GlideDateTime();

// Not on Saturday or Sunday
if ((cdt.getDayOfWeek() == 6) || (cdt.getDayOfWeek() == 7))
    return JSON.stringify(result);

var date = cdt.getDate();
if (cdt.isDST()) {
    var sgt = new GlideDateTime(date + " 11:00:00");
    var egt = new GlideDateTime(date + " 23:00:00");
} else {
    var sgt = new GlideDateTime(date + " 12:00:00");
    var egt = new GlideDateTime(date + " 24:00:00");
}

while (ci.next()) {
    // Set the CI ID
    var cid = ci.sys_id;


    // if the current time is between the start and end times add the CI to the result array
    if ((cdt.compareTo(sgt)==1) && (cdt.compareTo(egt)==-1)) {
        //result = [cid + ""];
        result.push(cid +''); //The array should be a string array, make sure to add strings
    }
}


//Make sure to create a string representation of the array
return JSON.stringify(result);