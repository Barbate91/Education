// Set our RegEx
var re = /: (.+[\s\S])/g;

// Initialize MID array
var arrMid = new Array();
// Initialize Method array
var arrMethod = new Array();

// Set dAgo value to determine how far to reach back in the logs. Default 30.
var dAgo = 30;

// Get unique subscriptions and locations with errors
var grInputParams = new GlideRecord("sn_capi_api_trail");
grInputParams.addQuery('sys_created_on','>=',gs.daysAgo(dAgo));
grInputParams.addQuery('route_status','error');
grInputParams.query();

// Get list of MIDs
var grCAPI = new GlideAggregate("sn_capi_api_trail");
grCAPI.addQuery('sys_created_on','>=',gs.daysAgo(dAgo));
grCAPI.addQuery('route_status','error');
grCAPI.addAggregate('count');
grCAPI.orderByAggregate('count');
grCAPI.groupBy('mid_name');
grCAPI.query();

gs.info("### Getting MID error counts... ###")
gs.info("Count  MID");
gs.info("-----  ---");

while (grCAPI.next()) {
    // List MID with total/error counts
    var midCount = grCAPI.getAggregate('count');
    
    gs.info(midCount + '   ' + grCAPI.mid_name);
    
    arrMid.push(grCAPI.mid_name+''); // Need to cast to string otherwise it overwrites previous array data for some reason
}

// Get list of Methods with errors per MID
arrMid.forEach(function(midName){    
    // Find Methods per MID with errors
    var grMethod = new GlideAggregate("sn_capi_api_trail");
    grMethod.addQuery('sys_created_on','>=',gs.daysAgo(dAgo));
    grMethod.addQuery('route_status','error');
    grMethod.addQuery('mid_name',midName);
    grMethod.addAggregate('count');
    grMethod.orderByAggregate('count');
    grMethod.groupBy('method_name');
    grMethod.query();

    gs.info("### " + midName + " --- Getting Methods with errors... ###");
    gs.info("Count  Method");
    gs.info("-----  ------");

    while (grMethod.next()) {
        // List methods with error counts
        var methodCount = grMethod.getAggregate('count');

        gs.info(methodCount + '     ' + grMethod.method_name);

        arrMethod.push(grMethod.method_name);
    }
});
