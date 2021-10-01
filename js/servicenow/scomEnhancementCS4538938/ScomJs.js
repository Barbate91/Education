var ScomJS = Class.create();

var SCRIPT_LOCATION = 'Powershell';
var SCRIPT_NAME = 'Invoke-UpdateAlert';
var METRIC_SCRIPT_NAME = 'FetchMetricData';
var POWERSHELL_EXTENSION = '.ps1';
var FileSystem = Packages.com.service_now.mid.services.FileSystem;
var SUCCESS = Packages.com.service_now.mid.probe.tpcon.OperationStatusType.SUCCESS;
var FAILURE = Packages.com.service_now.mid.probe.tpcon.OperationStatusType.FAILURE;
var StringUtil = Packages.com.glide.util.StringUtil;

var errorMessage = "";
var useWindowsAuthentication = false;

// there is a limit of command line length - 8191 characters, therefore json can include ~62 alerts at most
var MAXIMUM_ALERTS = 50;

ScomJS.prototype = Object.extendsObject(AProbe, {
	updateSource : function() {
		
		ms.log("SCOM Bi-directional: Updating the source");
		var pathToScript = FileSystem.get().getScript(SCRIPT_LOCATION).getAbsolutePath() + "\\" + SCRIPT_NAME + POWERSHELL_EXTENSION;
		ms.log("PATH: " + pathToScript);
		var version = this.getParamValue("scom_version", "2007");
		if (version == "2016")
			version = "2012";
		
		var jsonStr = this.probe.getAdditionalParameter("alerts");
        ms.log("JSON: " + jsonStr);

        // CS4538938 - Retrieve moids for SCOM closing alerts
        // Should return null if there were no moids (per JavascriptConnectorProbe.java). Might need try block.
        var moids = this.probe.getAdditionalParameter("moids");
        if (!moids)
            moids = '';

		var pathToDll = FileSystem.get().getHomeDir() + "";
		jsonStr = jsonStr + '';
		var objJSON = JSON.parse(jsonStr);
		var command = '';
		var argument = '';
		var jsonRes = '';
		var username =  this.probe.getParameter("username");
		var password =  this.probe.getParameter("password");
		var host =  this.probe.getParameter("host");
		var result = false;
		var retVal = {};
		var use_windows_authentication_str = this.probe.getAdditionalParameter("login_with_windows_authentication");
		if(StringUtil.notNil(use_windows_authentication_str) && use_windows_authentication_str == "true") {
			useWindowsAuthentication = true;
		}
		
		password = this.escapeString(password + "");
		username = this.escapeString(username + "");
		
		retVal = this.checkForPowershellVersion();
	    if(retVal != null) {
		   return retVal;
	    }
		
		retVal = {};
		
		if (objJSON == null){
			this.addError("Received json is empty");
			retVal['status']  = "" + FAILURE.toString();
			retVal['error_message'] = errorMessage;
			return retVal;
		}
		var alertsToSend = [];
		var alertId = 0;
		for (var i = 0; i < objJSON.length; ++i) {
			var alert = objJSON[i];
			for (var j = 0; j <  alert.value.length; ++j) {
				if (alert.value[j].fieldName === 'incident' || alert.value[j].fieldName === 'remote_task_id'){
					command = 'ticket_id';
					argument = alert.value[j].newValue;
				}
				if (alert.value[j].fieldName === 'state' && (alert.value[j].oldValue === 'Open' || alert.value[j].oldValue === 'Reopen') && alert.value[j].newValue === 'Closed'){
					command = 'close';
				}
				if (alert.value[j].fieldName === 'state' && alert.value[j].oldValue === 'Closed' && (alert.value[j].newValue === 'Open' || alert.value[j].newValue === 'Reopen')){
					command = 'open';
				}
				if (command != ''){
					this.probe.setParameter("action_performed", "true");
					alertsToSend[alertId] = {};
					alertsToSend[alertId].id = alert.key;
					alertsToSend[alertId].command = command;
					alertsToSend[alertId].ticket_id = argument;	
					command = '';
					argument = '';
					alertId++;
					if (alertId == MAXIMUM_ALERTS){
						jsonRes = JSON.stringify(alertsToSend);
						result = this.sendAlerts(jsonRes, pathToScript, username, password, host, pathToDll, version, moids);
						if (result == false){
							retVal['status']  = "" + FAILURE.toString();
							retVal['error_message'] = errorMessage;
							return retVal;	
						}
						alertsToSend = [];
						alertId = 0;
					}
				}
			}
		}
		if (alertId < MAXIMUM_ALERTS && alertsToSend.length > 0){
			jsonRes = JSON.stringify(alertsToSend);
			result = this.sendAlerts(jsonRes, pathToScript, username, password, host, pathToDll, version);
			if (result == false){
				retVal['status']  = "" + FAILURE.toString();
				retVal['error_message'] = errorMessage;
				return retVal;	
			}
		}
		retVal['status']  = "" + SUCCESS.toString();
		return retVal;
	},
	sendAlerts : function(jsonAlerts, pathToScript, username, password, host, pathToDll, version, moids){ // CS4538938 - Adding moids
		jsonAlerts = jsonAlerts.replace( /\"/g, "\\\""); 
        ms.log(jsonAlerts);
        
        // CS4538938 - Sanitize
        if (moids)
            moids = moids.replace( /\"/g, "\\\"");
		
		pathToScript = pathToScript.replaceAll(" ", '` ');
		pathToDll = pathToDll.replaceAll(" ", '` ');
		if(useWindowsAuthentication) {
			username = "user";
			password = "password";
		}
        
        // CS4538938 - Adding moids
		var commandToRun = "powershell -executionpolicy unrestricted -noninteractive -command \"& { . " + pathToScript + "; " + SCRIPT_NAME + " " + useWindowsAuthentication + " " + username + " " + password + " " + host + " " + "\"" + pathToDll + "\"" + " " + version + " '" + jsonAlerts + "' '" + moids + "' }\"";
		var commandToPrint = "powershell -executionpolicy unrestricted -noninteractive -command \"& { . " + pathToScript + "; " + SCRIPT_NAME + " " +  useWindowsAuthentication +  " ***** ***** " + host + " " + pathToDll + " " + version + " '" + jsonAlerts + "' '" + moids + "' }\"";
		ms.log("COMMAND: " + commandToPrint);

		var commandRetVal = EventManagementUtil.get().runCommand(commandToRun);
		var errorMessageToReturn = commandRetVal['error'] + "";
		if (StringUtil.notNil(errorMessageToReturn) && errorMessageToReturn != 'undefined') {
			ms.log("SCOM Bi-directional: STATUS ERROR: " + errorMessageToReturn);
			this.addError(errorMessageToReturn);
			return false;
		}
		ms.log("SCOM Bi-directional: STATUS: SUCCESS");
				
		return true;
	},
	
	
  retrieveKpi: function() {
	var retval = MetricCollector.get(this.probe).retrieveKpi();
	return retval;
  },
	
	
	
	addError : function(message){
		if (errorMessage === "")
			errorMessage = message;
		else
			errorMessage += "\n" + message;
		ms.log(message);
	},
	
	escapeString : function(stringToEscape) {
		var escapedString = "";
		for(var i = 0; i < stringToEscape.length; i++) {
		  var re = new RegExp("[^A-Za-z0-9]");
          if(re.test(stringToEscape[i]))
			 escapedString += "`" +stringToEscape[i];
		  else
		   escapedString += stringToEscape[i];
		}
		
		return escapedString;
	},
	
	getParamValue: function (paramName, defaultValue) {
		var param = this.probe.getAdditionalParameter(paramName);
		if (StringUtil.nil(param))
			param = defaultValue;
		return param;
	},
	type: "ScomJS"
	
});