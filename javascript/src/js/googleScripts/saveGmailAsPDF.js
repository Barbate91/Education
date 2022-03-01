function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
  .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}


function saveGmailAsPDF(gmailLabel, driveFolder, fileName) {

  Logger.log('Locating emails based on user input...');
  var threads = GmailApp.search("in:" + gmailLabel);

  Logger.log('Proceeding if emails with label are found...');
  if (threads.length > 0) {

    var html = "";

    Logger.log('Locating Google Drive folder based on user input...');
    /* Google Drive folder where the Files would be saved */
    var folders = DriveApp.getFoldersByName(driveFolder);
    var folder = folders.hasNext() ?
        folders.next() : DriveApp.createFolder(driveFolder);

    /* Gmail Label that contains the queue */
    var label = GmailApp.getUserLabelByName(gmailLabel) ?
        GmailApp.getUserLabelByName(gmailLabel) : GmailApp.createLabel(driveFolder);

    Logger.log('Beginning iteration through all matched emails...');
    for (var t=0; t<threads.length; t++) {

      Logger.log('Stripping label from ' + threads[t] + '...');
      threads[t].removeLabel(label);
      Logger.log('Gathering all messages...');
      var msgs = threads[t].getMessages();

      var attachments = [];

      /* Append all the threads in a message in an HTML document */
      Logger.log('Beginning iteration through all messages...');
      for (var m=0; m<msgs.length; m++) {

        Logger.log('Converting message to HTML...');
        var msg = msgs[m];

        html += "From: " + msg.getFrom() + "<br />";
        html += "To: " + msg.getTo() + "<br />";
        html += "Date: " + msg.getDate() + "<br />";
        html += "Subject: " + msg.getSubject() + "<br />";
        html += "<hr />";
        html += msg.getBody().replace(/<img[^>]*>/g,"");
        html += "<hr />";

        var atts = msg.getAttachments();
        Logger.log('Checking for attachments...');
        for (var a=0; a<atts.length; a++) {
          attachments.push(atts[a]);
        }
      }
    }
    /* Save the attachment files and create links in the document's footer */
    if (attachments.length > 0) {
      Logger.log('Attachments found...');
      var footer = "<strong>Attachments:</strong><ul>";
      Logger.log('Creating links to attachments in document footer...');
      for (var z=0; z<attachments.length; z++) {
        var file = folder.createFile(attachments[z]);
        footer += "<li><a href='" + file.getUrl() + "'>" + file.getName() + "</a></li>";
     }
      html += footer + "</ul>";
     }

    /* Convert all emails into a single PDF File */
    Logger.log('Converting from HTML to PDF...');
    var tempFile = DriveApp.createFile("temp.html", html, "text/html");
    folder.createFile(tempFile.getAs("application/pdf")).setName(fileName + ".pdf");
    tempFile.setTrashed(true);
    Logger.log('Success!');
  } else {
    Logger.log('Emails not found!');
    throw new Error("Emails not found!");
  }
}