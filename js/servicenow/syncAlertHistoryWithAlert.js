var grAlert = new GlideRecord("em_alert");
grAlert.addQuery("state","Closed");
grAlert.query();

while (grAlert.next()) {
    var grHistory = new GlideRecord("em_alert_history");
    grHistory.addQuery("alert_sys_id",grAlert.sys_id);
    grHistory.query();

    if (grHistory.hasNext()) {
        while (grHistory.next()) {
            grHistory.vt_end = new GlideDateTime();
            grHistory.state = "Closed";
            grHistory.update();
        }
    } else {
        grAlert.deleteRecord();
    }
}