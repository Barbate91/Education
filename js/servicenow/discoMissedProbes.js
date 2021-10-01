// Author: jake.armstrong
var discoId = "[INSERT DISCOVERY STATUS SYS_ID HERE]";
var counter = 0;
var discoStatus = new GlideRecord('discovery_status');
discoStatus.get(discoId);

var discoEcc = new GlideRecord('ecc_queue');
discoEcc.addQuery('agent_correlator','=',discoId);
discoEcc.addQuery('queue','output');
discoEcc.addQuery('state','processed');
discoEcc.addQuery('source','!=','cancel_discovery');
discoEcc.query();

while (discoEcc.next()) {
    var discoEccInput = new GlideRecord('ecc_queue');
    discoEccInput.addQuery('agent_correlator','=',discoId);
    discoEccInput.addQuery('queue','input');
    discoEccInput.addQuery('response_to','=',discoEcc.getUniqueValue());
    discoEccInput.query();

    if (!(discoEccInput.hasNext())) {
        gs.info("SNCDEBUG input not found for output record: " + discoEcc.getUniqueValue());
        counter++;
    }
}

gs.info("SNCDEBUG Discovery Status analysis complete, total records with missing input: " + counter);