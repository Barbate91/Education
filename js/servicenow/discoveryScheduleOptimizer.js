/*
 * DiscoveryScheduleOptimizer
 *
 * Get the monthly average duration for all Discovery Schedules in our GlideRecord query and sort by longest average duration.
 * Then space the run times for each Discovery Schedule according to an "off peak" start time in order to minimize Discovery load on the
 * instance and stagger based on average run times.
 *
 * If desired, this will also set the max run time equal to the average duration. The idea being that once a client's schedules are spaced out
 * that their average run duration will go down, meaning that the schedules shouldn't take as long to complete. 
 *
 * This is also an iterative process, where the optimizer should be run again at a later date to account for the now lower average run duration 
 * and to reorganize the schedules accordingly.
 *
 * Note that this will loop schedule run times and may overlap depending on the avg durations. For example, if you have 36 daily schedules
 * that avg 1 hour each, it will not be 24/36 for the run times. It would be 1 schedule for each hour until 24 hours, and then another schedule 
 * for each hour (24 schedules between 18:00-06:00, 12 schedules between 06:00-18:00).
 *
 * Example input parameters:
 * var timezone = "US/Pacific"; -- A valid Java timezone ID
 * var offPeakHour = "1970-01-01 18:00"; -- YYYY-MM-DD doesn't matter, but we need this format for conversions
 * var encodedQuery = "disco_run_type!=on_demand^ORdisco_run_type=NULL"; -- Unsupported schedule types are gracefully ignored
 * var maxRun = true; -- False doesn't reset max run time and will ignore existing run times
 *
 * TODO: Evaluate supporting other schedule types (daily/weekly/monthly currently supported)
 * TODO: Add additional error handling and notify user in form instead of syslog
 *
 * @author jake.armstrong
 */

function DiscoveryScheduleOptimizer(timezone,offPeakHour,maxRun,encodedQuery) {
	
	// Compile our GlideRecord query
	var schedules = new GlideRecord("discovery_schedule");
	schedules.addEncodedQuery(encodedQuery);
	schedules.query();
	
	// Checking to see if we get any hits from that query
	if (schedules) {
		optimize(schedules);
	} else {
		gs.error("DiscoveryScheduleOptimizer: No schedules found");
	}
	
	function optimize(schedules) {
		// Needed to set custom timezone and get offset value in ms
		var tz = Packages.java.util.TimeZone.getTimeZone(timezone);		
		// Evac if invalid
		if (!tz) {
			gs.log("DiscoveryScheduleOptimizer: Invalid timezone");
			return;
		}		
		var tzgt = new GlideDateTime();
		tzgt.setTZ(tz);
		var tzOffSet = tzgt.getTZOffset();
		// Also need the Daylights Savings Time offset
		var dstOffSet = tzgt.getDSTOffset();
		
		// Convert time object to milliseconds
		var msOffPeak = new GlideDateTime(offPeakHour).getNumericValue();
		// Evac if invalid
		if (!msOffPeak) {
			gs.log("DiscoveryScheduleOptimizer: Invalid time format");
			return;
		}
		
		// Separate time incrementations for different schedule types
		var startTime = msOffPeak;
		var dStartTime = msOffPeak;
		var wStartTime = msOffPeak;
		var mStartTime = msOffPeak;
		
		var dayOfWeek = 5; // Optimize around weekend
		var numLoopWeek = 0; // Since we don't have any easy way increment
		
		var dayOfMonth = 1;
		var daysInMonth = new GlideDateTime().getDaysInMonthUTC(); // For assigning run_dayofmonth
		
		// Start duration calcs and sort
		var sortedSched = getAvgDuration(schedules);
		
		// Iterate through our now sorted schedules
		for (var i=0; i<sortedSched.length; i++) {
			// Need to re-retrieve the GlideRecord
			var schedGr = new GlideRecord("discovery_schedule");
			schedGr.get(sortedSched[i][0]);
			var runType = schedGr.run_type;
			
			// Don't need to do anything fancy for daily
			// Increment next schedule run_time on average run time of
			// previous schedule
			if (runType == "daily") {
				startTime = dStartTime;
				dStartTime += sortedSched[i][1];
			}
			// Increment times only after we've looped the entire week
			else if (runType == "weekly") {
				startTime = wStartTime;
				dayOfWeek++;
				if (dayOfWeek == 5 && numLoopWeek > 0) {
					wStartTime += sortedSched[i-7][1];
				}
				if (dayOfWeek > 7) {
					dayOfWeek = 1;
					numLoopWeek++;
				}
				schedGr.setValue("run_dayofweek",dayOfWeek.toString());
			}
			// Similar to weekly, but monthly
			else if (runType == "monthly") {
				startTime = mStartTime;
				dayOfMonth++;
				if (dayOfMonth > daysInMonth) {
					dayOfMonth = 1;
					mStartTime += sortedSched[i-daysInMonth][1];
				}
				schedGr.setValue("run_dayofmonth",dayOfMonth.toString());
			}
			// Else the run_type isn't supported
			else {
				return;
			}
			
			// Set the new run_time with the specified timezone
			// Subtract tzOffSet because we need to set time in UTC to have a custom timezone
			var runTime = new GlideTime((startTime - tzOffSet + dstOffSet)); 
			schedGr.setValue("run_time",runTime);
			
			// Set max run time if desired
			if (maxRun) {
				var maxTime = new GlideTime(sortedSched[i][1]);
				schedGr.setValue("max_run",maxTime);
			}
			
			schedGr.update();
		}
	}
	
	function getAvgDuration(schedules) {
		var schedAvgDur = [];
		while (schedules.next()) {
			// Get all the scans for a given schedule from past 30 days
			var statusGr = new GlideAggregate("discovery_status");
			statusGr.addQuery("sys_created_on",">",gs.daysAgo(30));
			statusGr.addQuery("dscheduler","=",schedules.getUniqueValue());
			statusGr.query();
			
			if (statusGr) {
				// Get the average duration of a schedule's discovery scans
				// and push to new array as sysID => duration key-pair
				var duration = 0;
				while (statusGr.next()) {
					duration += new GlideDateTime(statusGr.duration).getNumericValue();
				}
				var durationAvg = (duration / statusGr.getRowCount());
				if (durationAvg > 0) {
					schedAvgDur.push([schedules.getUniqueValue(), durationAvg]);
				}
			}
		}
		return sortByDuration(schedAvgDur);
	}
	
	function sortByDuration(arr) {
		// Sort by longest average duration
		arr.sort(function(a,b) {
			return b[1]-a[1];
		});
		return arr;
	}
	gs.info("DiscoveryScheduleOptimizer: Optimization complete");
}