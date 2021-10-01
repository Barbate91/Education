var grCred = new GlideRecord("discovery_credentials");
grCred.query();

while (grCred.next()) {
    var grCredClass = grCred.sys_class_name;
    var grCredTpp = new GlideRecord(grCredClass);
    if (grCredTpp.get(grCred.sys_id)) {
        gs.info("Found TPP Cred: " + grCred.name);
    } else {
        gs.info("Deleted orphaned TPP Cred: " + grCred.name);
        grCred.deleteRecord();
    }
}