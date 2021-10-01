/* Programmatically create split discovery schedules based on a master account
 * author: jake.armstrong
 * TODO: VM IP Schedule
 * TODO: Specified LDCs
 */

// Modify params as desired except for ldcs. 'Master' is a mandatory param that needs to be filled out
var params = {
    'master':'[INSERT MASTER ACCOUNT SYSID]',
    'run_type':'daily',
    'ldcs':'', //Does not support specified LDCs
    'max_run':'1970-01-01 05:00:00',
    'batch_size':100
}

var counter = 0;
var count = 0;
var count_batch = 0;

function createSchedules(params) {
    var accounts = [];
    accounts.push(params.master);

    var grMembers = new GlideRecord('cmdb_ci_cloud_service_account');
    grMembers.addQuery('parent_account',params.master);
    grMembers.query();

    while (grMembers.next()) {
        accounts.push(grMembers.getValue('sys_id'));
    }
    count = accounts.length - 1;
    gs.info("Count: " + count);

    while (counter <= count) {
        var grSchedule = new GlideRecord('discovery_schedule');
        grSchedule.initialize();
        grSchedule.setValue('discover','Cloud Resources');
        grSchedule.setValue('active',true);
        grSchedule.setValue('disco_run_type',params.run_type);
        grSchedule.setValue('max_run',params.max_run);
        grSchedule.setValue('name','Cloud Service Account - ' + params.master + ' - Batch: ' + Math.floor(counter/params.batch_size));
        grSchedule.insert();

        count_batch = 0;
        while (count_batch < params.batch_size) {
            if (counter <= count) {
                if (params.ldcs === '') {
                    gs.info("Account: " + accounts[counter]);
                    var grConfig = new GlideRecord('cmp_discovery_ldc_config');
                    grConfig.initialize();
                    grConfig.setValue('discovery_schedule',grSchedule.getValue('sys_id'));
                    grConfig.setValue('service_account',accounts[counter]);
                    grConfig.insert();
                    count_batch++;
                    counter++;
                } else if (Array.isArray(params.ldcs)) {
                    params.ldcs.forEach(function(ldc){
                        var grConfig = new GlideRecord('cmp_discovery_ldc_config');
                        grConfig.initialize();
                        grConfig.setValue('discovery_schedule',grSchedule.getValue('sys_id'));
                        grConfig.setValue('service_account',accounts[counter]);
                        grConfig.setValue('ldc',ldc);
                        grConfig.insert();
                    });
                    count_batch++;
                    counter++;
                } else {
                    gs.info("INVALID FORMAT FOR LDCS");
                    break;
                }
            } else {
                gs.info("REACHED END OF ACCOUNTS");
                break;
            }
        }
    }
}

createSchedules(params);