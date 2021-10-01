/** 
 * CAPI Trail Analyzer
 * 
 * The purpose of this script is to have an "at a glance" overview of which Service Accounts, Regions, and
 * specific API calls are generating errors in order to help narrow down investigation scope.
 * 
 * */ 

 /** 
  * OUTLINE
  * 
  * Parse subscription, location, and method from CAPI errors
  * Store uniques in JSON object
  * Make GlideAggregate calls based on JSON object iteration
  * Apply counts to JSON object
  * Assemble count outputs for Service Accounts affected, Regions affected, Methods affected, and then Service Account/Region/Method combinations
  * 
  * Due to difficulty in manipulating JSON objects, looks like we need to do it all in one go.
  */

  /**
   * EXAMPLE
   * 
   * capiObj.push({
   *    'subscription':id,
   *    'count':subCount,
   *    'location': [{
   *        'name':loc,
   *        'count':locCount,
   *        'methods': [{
   *            'name':method,
   *            'count':methodCount
   *            }]
   *        }]
   *    });
   * 
   * 
   */

 // Set based on Cloud Discovery cadence to narrow down number of analyzed log records
 var daysAgo = -7;

 // Set our RegEx
 var re = /: (.+[\s\S])/g;

 var capiObj = {};

 // Get our list of CAPI trails with errors
 var grCAPI = new GlideRecord("sn_capi_api_trail");
 grCAPI.addQuery('created','>=',gs.daysAgo(daysAgo));
 grCAPI.addQuery('route_status','=','error');
 grCAPI.query();

 while (grCAPI.next()) { 
     var inputParams = grCAPI.input_parameters;
     var match = re.exec(inputParams);
     var grSubId = match[1];

     // Get 2nd match with regex lastIndex
     match = re.exec(inputParams);
     var grLocation = match[1];

     // Save method name
     var grMethod = grCAPI.method_name;




 }

 // Show only service accounts with errors


 // Show only regions with errors

 // Show only methods with errors

 // Show location/subscription/method error list
 gs.info("Location Subscription Method Count Error");
 gs.info("-------- ------------ ------ ----- -----");
