var ipArr = ["10.226.75.39","10.226.75.55","64.101.208.138","10.226.75.46","10.115.230.50","10.226.75.56","10.226.75.38","10.226.75.51","10.226.75.41","10.226.75.40","10.226.75.49"];

ipArr.forEach(function(ip) {
    var credAffGr = new GlideRecord('dscy_credentials_affinity');
    credAffGr.addQuery('credential_id','aa477b6ddb5aee00c445f2f9af961917');
    credAffGr.addQuery('ip_address',ip);
    credAffGr.deleteMultiple();
})