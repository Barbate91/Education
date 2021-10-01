var eccAgent = new GlideRecord('ecc_agent');
eccAgent.query();

while (eccAgent.next()) {
    var eccConfig = new GlideRecord('ecc_agent_config');
    eccConfig.addQuery('ecc_agent',eccAgent.getUniqueValue());
    eccConfig.addQuery('param_name','mid.ssh.use_snc');
    eccConfig.query();

    if (eccConfig.hasNext()) {
        while (eccConfig.next()) { 
            if (eccConfig.value == 'true') {
                continue;
            } else {
                eccConfig.setValue('value','true');
                eccConfig.update();
            }
        }
    } else {
        eccConfig.initialize();
        eccConfig.setValue('ecc_agent',eccAgent.getUniqueValue());
        eccConfig.setValue('param_name','mid.ssh.use_snc');
        eccConfig.setValue('value','true');
        eccConfig.insert();
    }
}

