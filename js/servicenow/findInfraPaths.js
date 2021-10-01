// For given hosts, find if they have any infra paths in a given service
var query = 'host_id.nameSTARTSWITHSCCXNPEs01^ORhost_id.nameSTARTSWITHSCCXNPEs02^ORhost_id.nameSTARTSWITHSCCXNETs01^ORhost_id.nameSTARTSWITHSCCXNETs02';
var service = 'Mobile Banking - Production';

var grIPA = new GlideRecord('sa_infra_path_assoc');
grIPA.addEncodedQuery(query);
grIPA.query();

var path = '';
var grR2IP;

var target = '';
var grSCA;

while (grIPA.next()) {
    path = grIPA.path_id;

    grR2IP = new GlideRecord('sa_rel_to_infra_path');
    grR2IP.addQuery('path_id',path);
    grR2IP.query();

    while (grR2IP.next()) {
        target = grR2IP.target_ci;   

        grSCA = new GlideRecord('svc_ci_assoc');
        grSCA.addQuery('ci_id',target);
        grSCA.addQuery('service_id.name','=',service);
        grSCA.query();

        while (grSCA.next()) {
            gs.info('SNCDEBUG Found path for: ' + grIPA.host_id.name + ' in ' + service + ' to ' + grR2IP.source_ci.name);
        }
    }
}