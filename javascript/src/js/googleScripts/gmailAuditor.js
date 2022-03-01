/* An automatic Gmail Auditor that will go through company email.
 * It will notify via email with subject headers for any emails from
 * clients in the past 8 hours that have not been responded to. */

function gmailAudit() {
  /* Retrieve list of applicable email threads based on gmail search query */
  var threadList = Gmail.Users.Threads.list(userId='me', {
    q: "{emails} newer_than:1d"
  });

  /* Create current Datetime object */
  var currentDate = new Date();

  /* Create array to hold valid Subject headers after iteration */
  var missedEmailSubjects = [];

  /* For each thread */
  for (var i=0; i < threadList.threads.length; i++) {

    /* Retrieve thread ID */
    var getThreadId = threadList.threads[i].id;

    /* Retrieve thread metadata */
    var getThreadMessages = Gmail.Users.Threads.get(userId='me', id=getThreadId, {
      format: "metadata",
      metadataHeaders: ["From","Subject","Date"]
    });

    /* Store last message in thread */
    var getLatestMessage = getThreadMessages.messages.pop();

    /* Sort and store message headers */
    var getLatestHeaders = getLatestMessage.payload.headers.sort();

    /* Convert 'Date' metadata into Javascript */
    var lastEmailDate = new Date(getLatestHeaders[0].value);

    /* Store 'From' Metadata */
    var fromString = getLatestHeaders[1].value;

    /* Store 'Subject' Metadata */
    var subjectString = getLatestHeaders[2].value;

    /* If email is from the past 8 hours */
    if (currentDate - lastEmailDate < 28800000) {
      /* If email was not 'Sent' from internal distribution list */
      if (!(fromString.indexOf("email@email.com") > -1 ) || (fromString.indexOf("email@email.com") > -1)) {
        /* Create human readable time since last email response */
        var hoursLastEmail = ((currentDate - lastEmailDate)/(3600000)).toFixed(2);

        /* Then add 'Subject' metadata to list of missed emails along with hours since last response */
        missedEmailSubjects.push(hoursLastEmail + " Hours Since Last Response - " + subjectString);
      }
    }
  }
  /* Format email content for readability */
  var formattedEmail = missedEmailSubjects.join("\n");

  /* Create email content and encode with base64 */
  var encodedEmail = Utilities.base64Encode(
    "From: email@email.com\r\n" +
    "To: email@email.com\r\n" +
    "Subject: Gmail Auditor\r\n\r\n" +
    "Below is a list of email subjects that may need a response. While the primary purpose of this audit is to make sure that emails from clients " +
    "are not missed, this audit will still flag emails that might come from personal email@email.com email addresses or other false positives. " +
    "To clear emails from appearing in the audit again just reply to the flagged thread with the supportcenter distro to the supportcenter distro " +
    "with something like 'This has been handled':\r\n\n" +
    formattedEmail
    ).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  /* Email send function */
  function sendMessage(raw) {
    var message = Gmail.newMessage();
    message.raw = raw;
    var sentMsg = Gmail.Users.Messages.send(message, 'me');
    return sentMsg.id;
  }
  /* Send email */
  sendMessage(encodedEmail);
}