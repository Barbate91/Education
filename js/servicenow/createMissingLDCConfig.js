
/* 
* Background script to automatically create missing cmp_discovery_ldc_config records
* Doesn't create discovery schedules, only creates missing LDC config records
* Schedules must contain the name of the service account (e.g: the default cloud schedule naming format)
* Doesn't create LDC specific records, creates records for all LDCs. Specifc LDC schedules must be created using the Cloud Discovery wizard
*/
var nameSA;
var sidSA;
var sidSched;
var nameSched;

var cloudSA = new GlideRecord("cmdb_ci_cloud_service_account");
cloudSA.query();

while (cloudSA.next()) {
    // Save service account name and sys_id for finding relevant schedules and creating new config records
    nameSA = cloudSA.name;
    sidSA = cloudSA.sys_id;

    var cloudDiscoSched = new GlideRecord("discovery_schedule");
    cloudDiscoSched.addQuery("discover","Cloud Resources");
    cloudDiscoSched.addQuery("name","CONTAINS",nameSA); // This only works if schedules have the default name which contains the SA name
    cloudDiscoSched.query();

    while (cloudDiscoSched.next()) {
        var cloudDiscoConfig = new GlideRecord("cmp_discovery_ldc_config");
        sidSched = cloudDiscoSched.getUniqueValue();
        nameSched = cloudDiscoSched.name;

        // If we don't have a config record for a given schedule we need to create one
        if (!(cloudDiscoConfig.get("discovery_schedule",sidSched))) { 
            cloudDiscoConfig.initialize();
            cloudDiscoConfig.setValue("discovery_schedule",nameSched);
            cloudDiscoConfig.setValue("service_account",sidSched);
            cloudDiscoConfig.insert();
        }
    }
}

