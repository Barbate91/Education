/**
DO NOT RUN UNLESS PREP HAS BEEN COMPLETED:
1. Ensure "CMPv1 Migration" BRs have been imported and activated
2. Disable CMPv1 per KB: https://hi.service-now.com/kb_view.do?sysparm_article=KB0686119
3. Disable/delete CMPv1 Web Services discovery schedules
4. Configure and Run Cloud Discovery on all accounts to populate new tables with data and new CIs are "In Maintenance"
5. Deactivate Cloud Discovery schedules
6. Deactivate event connectors to avoid Alert processing from occurring while script is running

SCRIPT:
1. Activate CMPv1 Migration Script fix script
2. Run Fix Script

POST SCRIPT:
1. Activate event connectors
2. Deactivate "CMPv1 Migration" BRs
3. Activate Cloud Discovery schedules
4. Deactivate fix script
5. Clean up old CMPv1 data not touched by script

NOTES:
- This will only run on the defined tables and CI classes (and the intercept BRs will only work for the configured tables)
- This is just to ensure that all references are updated and to mitigate any contamination during migration where old/new CIs are being incorrectly set for cmdb_ci fields in given tables (e.g: Alert, Incident, Change)
- Remaining old data will need to be cleaned up through normal CI staleness remediation procedures
 
@author jake.armstrong <jake.armstrong@servicenow.com>
*/

gs.info("SNCDEBUG CMPv1 Migration Script STARTED");

// Set some global vars to preserve JS heap
var tables = ['em_alert','incident','change_request'];
var oldCiClasses = 'cmdb_ci_ec2_instance,cmdb_ci_aws_elb,cmdb_ci_aws_asgrp,cmdb_ci_aws_ebs_volume,cmdb_ci_aws_resource';
var newCiClasses = 'cmdb_ci_vm_instance,cmdb_ci_lb_service,cmdb_ci_storage_volume,cmdb_ci_cmp_resource';
var oldCi;
var oldCiClass;
var oldIdentifierValue;
var newClass;
var newCi;
var newSysId;
var grNewCi;
var grOldCi;
var grTableRecords;
var record;

// Iterate tables and update references
gs.info("SNCDEBUG update table references starting...");
tables.forEach(updateReferences);
gs.info("SNCDEBUG update table references completed...");

// Set new CIs to 'Installed' so they can be picked up by new alerts 
gs.info("SNCDEBUG set new Cis to Installed starting...");
var grUpdateStatusForNew = new GlideRecord('cmdb_ci');
grUpdateStatusForNew.addQuery('sys_class_name','IN',newCiClasses);
grUpdateStatusForNew.addQuery('install_status','=','3');
grUpdateStatusForNew.setValue('install_status', '1');
grUpdateStatusForNew.updateMultiple();
gs.info("SNCDEBUG set new Cis to Installed completed...");

// Set old CIs to 'Retired'
gs.info("SNCDEBUG set old Cis to Retired starting...");
var grUpdateStatusForOld = new GlideRecord('cmdb_ci');
grUpdateStatusForOld.addQuery('sys_class_name','IN',oldCiClasses);
grUpdateStatusForOld.addQuery('install_status','=','1');
grUpdateStatusForOld.setValue('install_status', '7');
grUpdateStatusForOld.updateMultiple();
gs.info("SNCDEBUG set old Cis to Retired completed...");
gs.info("SNCDEBUG CMPv1 Migration Script COMPLETE");


function updateReferences(table) {
    // Get our list of applicable records based on Ci classes
    grTableRecords = new GlideRecord(table);
    grTableRecords.addQuery('cmdb_ci.sys_class_name','IN',oldCiClasses);
    grTableRecords.query();

    gs.info("SNCDEBUG iterate records for " + table + " starting...");

    while (grTableRecords.next()) {
        // Assign vars for clarity
        oldCi = grTableRecords.cmdb_ci;
        oldCiClass = grTableRecords.cmdb_ci.sys_class_name;
        record = grTableRecords;

        switch(oldCiClass.toString()) {
            case 'cmdb_ci_ec2_instance': 
                oldIdentifierValue = record.cmdb_ci.object_id;
                newClass = 'cmdb_ci_vm_instance';
                break;
            case 'cmdb_ci_aws_elb':
                oldIdentifierValue = record.cmdb_ci.canonical_hosted_zone_name;
                newClass = 'cmdb_ci_lb_service';
                break;
            case 'cmdb_ci_aws_ebs_volume':
                oldIdentifierValue = record.cmdb_ci.resource_name;
                newClass = 'cmdb_ci_storage_volume';
                break;
            case 'cmdb_ci_aws_asgrp':
                oldIdentifierValue = record.cmdb_ci.volume_id;
                newClass = 'cmdb_ci_cmp_resource';
                break;
            case 'cmdb_ci_aws_resource':
                oldIdentifierValue = record.cmdb_ci.resource_id;
                newClass = 'cmdb_ci_cmp_resource';
                break;
            default: newClass = 'false';
        }

        // Maybe a record was updated with a different Ci class while this ran, if so abort this loop
        if (newClass == 'false') {
            gs.info("SNCDEBUG found an unexpected Ci class, skipping this record: " + record.number);
            continue;
        }

        newCi = findNewCiAndUpdateStatus(newClass,oldIdentifierValue,oldCi,oldCiClass);

        // update reference in table
        if (newCi) {
            grTableRecords.cmdb_ci = newCi;
            grTableRecords.update();
        } else {
            gs.info("SNCDEBUG unable to find replacement for Ci, leaving this alone: " + record.number);
        }
    }
    gs.info("SNCDEBUG iterate records for " + table + " completed...");
}

function findNewCiAndUpdateStatus(ciTable,identifier,oldRecord,oldClass) {
    newSysId;
    grNewCi = new GlideRecord(ciTable);

    if (ciTable == 'cmdb_ci_vm_instance' || ciTable == 'cmdb_ci_cmp_resource' || ciTable == 'cmdb_ci_storage_volume') {
        grNewCi.addQuery('object_id','=',identifier);
    } else {
        grNewCi.addQuery('object_id','CONTAINS',identifier);
    }

    grNewCi.addQuery('install_status','=','3');
    grNewCi.addQuery('sys_class_name','=',ciTable);
    grNewCi.query();

    if(!grNewCi.hasNext())
        return false;
        
    if(grNewCi.getRowCount() > 1)
        gs.info("SNCDEBUG found more than one record to match on Ci: " + oldRecord + " will select first record in list");
       
    // Change new CI from 'In Maintenance' to 'Installed'
    grNewCi.next();
    newSysId = grNewCi.sys_id;
    grNewCi.install_status = '1';
    grNewCi.update();

    // Change old CI from 'Installed' to 'Retired'
    grOldCi = new GlideRecord(oldClass);
    grOldCi.get(oldRecord);
    grOldCi.install_status = '7';
    grOldCi.update();

    // Return new sys_id to update table reference
    gs.info("SNCDEBUG returning new Ci " + newSysId + " for old Ci " + oldRecord);
    return newSysId;  
}