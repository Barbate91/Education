// Flags all open alerts for impact recalculation


var alertGr = new GlideRecord("em_alert_history"); 
alertGr.addQuery("vt_end",">", "2021-02-22 00:00:00");
alertGr.addQuery("state","!=", "Closed");
alertGr.query(); 
gs.log("ResetImpactOnServices: Going to update " + alertGr.getRowCount() + " alerts"); 
var count = 0; 
var alertsList = [];

// for every alert from history find it's corresponding alert and "touch it" 
while (alertGr.next()) {

   // do it in groups of 100
  alertsList.push(alertGr.getValue("number"));

   count++;
  if (count == 100) {

   var alert = new GlideRecord("em_alert"); 
   alert.addQuery("number","IN", alertsList)
   alert.query(); 
      while (alert.next()){
        // "touch" alert so it will be recomputed
        alert.setForceUpdate(true); 
        alert.setWorkflow(false); 
        alert.update(); 
     }
     gs.log("ResetImpactOnServices: updated " + alertsList ); 

     alertsList = [];
     count=0;
   }
}

// "touch" remained alert so it will be recomputed
var alert = new GlideRecord("em_alert"); 
   alert.addQuery("number","IN", alertsList)
   alert.query(); 
      while (alert.next()){
     alert.setForceUpdate(true); 
     alert.setWorkflow(false); 
     alert.update(); 
     }
     gs.log("ResetImpactOnServices: updated " + alertsList ); 