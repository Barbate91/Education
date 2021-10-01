var ConnectorQueue = Class.create();
ConnectorQueue.prototype = {
	PROBE_NAME:"Third Party Connector Probe",
	PARAM_PREFIX:"__con_param__",
	initialize: function() {
	},
	
	dequeueAndProcess: function(){
		try {
			var grQueue = new GlideRecord("em_connector_update_queue");
			grQueue.addQuery("state", "pending");
			grQueue.orderBy("sys_updated_on");
			grQueue.setLimit(gs.getProperty('evt_mgmt.max_update_source_records', 1000));
			grQueue.query();
			
			var connectorManager = new SNC.ConnectorManager();
			var connectors = JSON.parse(connectorManager.getBiDirectionalConnectorsInstance());
            var map = {};
            
            // CS4538938 - Initialize moid array for later use
            var moids = [];

			while(grQueue.next()){
				grQueue.state = "processing";
				grQueue.update();
				var sourceInstance = grQueue.getValue("source_instance");
				if (!connectors[sourceInstance]) {
					//the alert source instance is not defined to work as bi-directional connector
					grQueue.state = "failed";
					grQueue.update();
					continue;
				}
				var alertIdentifier = connectors[sourceInstance].alertIdentifier;
				
				var grAlert = new GlideRecord("em_alert");
				grAlert.get(grQueue.getValue("alert"));
				var alertId = grAlert.getValue(alertIdentifier);
				
                var jsonFields = JSON.parse(grQueue.getValue("fields_json"));
                
                // CS4538938 - Grab MonitoringObjectId if SCOM closing Alert
                if (grQueue.source === 'SCOM') {
                    for (var i = 0; i < jsonFields.length; i++) {
                        var alert = jsonFields[i];
                        
                        if (alert.fieldName == 'state' && alert.oldValue == 'Open' && alert.newValue == 'Closed') {
                            var addInfo = grAlert.getValue("additional_info");
                            var jsonInfo = JSON.parse(addInfo);
                            moids.push({"alertId":alertId,"moid":jsonInfo.MonitoringObjectId});
                        }
                    }
                }

				var currentRecord = {"key":alertId,"value":jsonFields};
				if (!map[sourceInstance]) {
					map[sourceInstance] = [];
				}
				map[sourceInstance].push(currentRecord);
				
			}
			for (var currentInstance in map) {
				var ciGr =  new GlideRecord('em_connector_instance');
				ciGr.addQuery('name', currentInstance);
				ciGr.query();
				if (ciGr.next()) {
					//send to each connector instance the list of alerts that have been changed
					var eccOutputId = this.writeToECC(ciGr, JSON.stringify(map[currentInstance]));
					if (!eccOutputId) //could not write succesfully to ecc queue
						continue;
					gs.log("sending " + map[currentInstance].length + " alerts to " + currentInstance);
					
					var queueGr = new GlideRecord('em_connector_update_queue');
					queueGr.addQuery("source_instance", currentInstance);
					queueGr.addQuery("state", "processing");
					queueGr.setValue("ecc_queue_id", eccOutputId);
					queueGr.updateMultiple();
					
				}
			}
		} catch(e) {
			gs.logError("ConnectorQueue script include failed: " + e);
		}
		
	},
	
	writeToECC:function(ciGr, alerts){
		var conUtil = new ConnectorUtil();
		var agentName = conUtil.findAgent(ciGr);
		if (gs.nil(agentName)) {
			gs.log("[ConnectorQueue] Can not continue without a mid server");
			ciGr.setValue('last_bi_directional_status','Error');
			ciGr.setValue('last_error_message', "Can not execute without a mid server.");
			var now = new GlideDateTime();
			ciGr.setValue('last_run_time', now);
			ciGr.update();
			var gr = new GlideRecord("em_connector_update_queue");
			gr.addQuery("source_instance", ciGr.getValue("name"));
			gr.addQuery("state", "processing");
			gr.setValue("state", "failed");
			gr.updateMultiple();
			return;
		}
		var probe = SncProbe.get(this.PROBE_NAME);
		probe.setSource(ciGr.name);
		probe.setEccPriority("0"); //Interactive ecc priority
		probe.addParameter('connector', ciGr.sys_id);
		probe.addParameter('connector_name', ciGr.name);
		var scriptName = ciGr.connector_definition.javascript_to_run.name;
		
		probe.addParameter('script', scriptName);
		probe.addParameter('credential_id', ciGr.credential.sys_id);
		probe.addParameter('host', ciGr.host);
		
		// add connecter instance parameters
		var paramsGr = GlideRecord('em_connector_instance_value');
		paramsGr.addQuery('connector_instance', ciGr.sys_id);
		paramsGr.query();
		while(paramsGr.next()) {
			probe.addParameter(this.PARAM_PREFIX + paramsGr.name,  paramsGr.value);
		}
		
		probe.addParameter('update_source', true);
        probe.addParameter(this.PARAM_PREFIX + 'alerts', alerts);
        
        // CS4538938 - Add moids to ConnectorProbe
        if (moids) {
            moids = JSON.stringify(moids);
            probe.addParameter(this.PARAM_PREFIX + 'moids', moids);
        }

		return probe.create(agentName);
		
	},
	
	updateSourceAndQueue:function(connectorId, lastStatus, eccId, lastError, actionPerformed){
		var ciGr =  new GlideRecord('em_connector_instance');
		if (!ciGr.get(connectorId)) {
			gs.log('Could not find connector instance ' + connectorId);
			return;
		}
		var connectorName = ciGr.getValue("name");
		
		var status;
		if (lastStatus == "SUCCESS") {
			lastStatus = "Success";
			status = "complete";
		} else {
			lastStatus = "Error";
			status = "failed";
		}
		if (actionPerformed == 'true'){
			ciGr.setValue('last_bi_directional_status', lastStatus);
			if (lastStatus != "Success"){
				lastError = "BI-DIRECTIONAL\n-------------------------------------------------------------\n" + lastError;
			} else {
				lastError = "";
			}
			var lastErrorUtil = new LastErrorUtils();
			lastErrorUtil.updateErrorMsg(ciGr, "bi-directional", lastError);
			ciGr.update();
		}
		var gr =  new GlideRecord('em_connector_update_queue');
		gr.addQuery("source_instance", connectorName);
		gr.addQuery("state", "processing");
		gr.addQuery("ecc_queue_id", eccId);
		gr.setValue("state", status);
		gr.updateMultiple();
		
		gs.log("done updating the connector instance and the queue");
		
	},
	
	type: 'ConnectorQueue'
};

ConnectorQueue.get = function(){
	return new ConnectorQueue();
};