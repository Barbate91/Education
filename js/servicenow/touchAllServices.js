// Flags schedules for impact recalculation

gr = new GlideRecord("cmdb_ci_service_auto");
gr.addQuery("operational_status", "1");
gr.query();

while (gr.next()) {
	gr.setValue("operational_status", "2");
	gr.update();
	gr.setValue("operational_status", "1");
	gr.update();	
}