/*
 * PURPOSE: To retrieve data from Audio Schedule spreadsheet and use that information
 *          to create Google Calendar events. These events will generate notifications
 *          to remind people that they are scheduled for service audio.
 */

function updateCalendar() {

  /***
   *** SCRIPT VARIABLES
   ***/
  // Date configurations
  var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
                   ];
  var d = new Date();
  var monthName = monthNames[d.getMonth()];
  var rangeName = monthName;

  // Declare contact information in object array
  // TO DO: Research how to abstract contact info. GMail seems to identify people by email address. No "contact" or username to query against.
  var crew = {

    };

  // Set variables for current month's spreadsheet and retrieve data
  var spreadsheetId = 'id';
  var valuesSheet = Sheets.Spreadsheets.Values.get(spreadsheetId, monthName).values; // Nested array of spreadsheet values
  Logger.log("Spreadsheet values: " + valuesSheet);

  // Set variable for Audio calendar ID
  var calendarId = "id";

  /***
   *** PREPARE EVENT INFORMATION
   ***/
  // Continue if data is found in spreadsheet
  if (valuesSheet) {
    Logger.log("Found Values"); // Confirm data was found

    // For every 4 rows, starting on 2nd row (because of spreadsheet formatting)
    for (var x = 1; x < valuesSheet.length; x += 4) {
      // For each column in that row, starting on 2nd row (because of spreadsheet formatting)
      for (var y = 1; y < valuesSheet[0].length; y++) {
      Logger.log("DATA FOR: [" + x + "][" + y + "]");

        // Set first value for this loop
        var dDay = valuesSheet[x][y];
        // Use dDay to check to see if there is any data in this row/column, skip if none
        if (dDay) {

          // Assign spreadsheet data for later use
          var dTime = valuesSheet [0][y];
          var dEndTime = ((parseInt(dTime.substring(0,2),10)+2)+dTime.slice(-6));
          var dTimeMin = "00:00:00"; // Because Google is stupid
          var dTimeMax = "23:59:59"; // Because Google is stupid

          var tech = valuesSheet[x+1][0];
          var techPerson = valuesSheet[x+1][y];

          var techAss = valuesSheet[x+2][0];
          var techAssPerson = valuesSheet[x+2][y];

          var mics = valuesSheet[x+3][0];
          var micsPerson = valuesSheet[x+3][y];

          var personArray = [techPerson, techAssPerson, micsPerson];
          var emailArray = {}; // Need to do some goofy shit to assign variables with a looping function

          // Configure calendar event details
          var event = {
            'summary': 'test',
            'location': 'test',
            'description': tech + ": " + techPerson + "\n" + techAss + ": " + techAssPerson + "\n" + mics + ": " + micsPerson,
            'end': {
            'dateTime': dDay + "T" + dEndTime,
            'timeZone': 'America/Los_Angeles'
            },
            'start': {
            'dateTime': dDay + "T" + dTime,
            'timeZone': 'America/Los_Angeles'
            },
            'attendees': []
          };

          // Populate emailArray wtih scheduled people to receive notifications, then attach
          // as attendees to the event details if it isn't N/A
          for (var i = 0; i < personArray.length; i++) {
            if (!(personArray[i] == "N/A")) {
              emailArray[personArray[i] + "Email"] = crew[personArray[i]].email;
              event.attendees[i] =  {'email' : emailArray[personArray[i] + "Email"]};
            };

            // Get list of audio events on the date/time being referenced, should only be 1, if any.
            var getAudioEventsByDay = Calendar.Events.list(calendarId, {
              'q': "test",
              'timeMin': dDay + "T" + dTimeMin + "-08:00",
              'timeMax': dDay + "T" + dTimeMax + "-08:00"
            });
          };

          /***
           *** CREATE/UPDATE/DELETE EVENTS
           ***/
          // Function to return Boolean based on if a person is scheduled
            function isArrayNA(person) {
              return (person == "N/A");
            };

          // If calendar event already exists, we need to update it
          if (!(getAudioEventsByDay.items == "")) {
            Logger.log("Event was found");

            // Save event ID for updating/removing events
            var audioEventId = getAudioEventsByDay.items[0]["id"];
            Logger.log("audioEventId: " + audioEventId);

            // Grab list of current event attendees from Calendar
            var audioEventAttendees = getAudioEventsByDay.items[0]["attendees"];
            var keysAudioEventAttendees = Object.keys(audioEventAttendees);
            var valuesAudioEventAttendees = keysAudioEventAttendees.map(function(v) { return audioEventAttendees[v]["email"]; });
            var sValuesAudioEventAttendees = JSON.stringify(valuesAudioEventAttendees);
            Logger.log("String of current event attendees: " + sValuesAudioEventAttendees);

            // Convert list of updated attendees email values to string
            var keysAttendeesArray = Object.keys(event.attendees);
            var valuesAttendeesArray = keysAttendeesArray.map(function(v) { return event.attendees[v]["email"]; });
            var sValuesAttendeesArray = JSON.stringify(valuesAttendeesArray);
            Logger.log("String of attendees email array: " + sValuesAttendeesArray);

            // If every position isn't "N/A" (meaning there is someone scheduled for an event) then update event
            // OR if there is a difference between people scheduled in spreadsheet and attendees then update event
            if (!(personArray.every(isArrayNA) || sValuesAudioEventAttendees == sValuesAttendeesArray)) {
              Logger.log("There has been a change and this event needs to be updated");
              Calendar.Events.update(event, calendarId, audioEventId);
              Logger.log("Event updated");

              // If everything is "N/A", delete that event (event was updated in spreadsheet to not have anyone scheduled)
              } else if (personArray.every(isArrayNA)) {
                Logger.log("Spreadsheet updated to have no one scheduled, removing event");
                Calendar.Events.remove(calendarId, audioEventId);
                Logger.log("Event deleted");

                // Otherwise do nothing
                } else {
                Logger.log("No changes necessary");
            }

          // Otherwise create new event
          } else {

            // If there is a value that isn't "N/A" (meaning there is someone scheduled for an event) then create new event
            if (!(personArray.every(isArrayNA))) {
              Logger.log("People are scheduled for audio but event is missing");
              Calendar.Events.insert(event, calendarId);
              Logger.log("Created new event");
              } else {
                Logger.log("No one scheduled for this day, skipping event creation");
            }
          }
        }
      }
    }
  }
}



