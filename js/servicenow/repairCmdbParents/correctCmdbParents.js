/**
 * Script 3/3
 */

// Run this script against the impacted instance to resolve the schema conflicts
// Ensure that "record for rollback" is unchecked for Scripts - Background
// Plug in array results from compareCmdbParents.js
var schemaForCorrection = [{}];

// Correct each table that we've identified has an incorrect mapping compared to known, working instance
schemaForCorrection.forEach(function(schema) {
    var correctSchema = SNC.CMDBUtil.reParentTable(schema.table,schema.oldParent,schema.newParent);
})