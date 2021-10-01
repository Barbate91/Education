/**
 * Script 1/3
 */

// Run this script against a known working instance to get a correct table schema

var defaultTables = [];
var tableName;
var extendsFrom;
var grTables = new GlideRecord('sys_db_object');
grTables.query();

// Iterate all tables and gather name and table this is extended from in known working instance for later comparison
while (grTables.next()) {
    tableName = grTables.name + '';
    extendsFrom = grTables.super_class.name + '';
    var tableObj = {};
    tableObj.tableName = tableName;
    tableObj.extendsFrom = extendsFrom;
    defaultTables.push(tableObj);
}

gs.info(JSON.stringify(defaultTables));