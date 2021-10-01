// When you need a high volume of range items for debugging

var counter = 0;
var counter1 = 0;
var counter2 = 0;
var counter3 = 10;

while (counter < 4000) {
    var rangeItem = new GlideRecord('discovery_range_item');
    rangeItem.initialize();
    rangeItem.parent = '4954d7aa1b58b410090e4376bc4bcbf2';
    rangeItem.name = 'HugeRangeTest' + counter;
    rangeItem.start_ip_address = '' + counter3 + '.' + counter2 + '.' + counter1 + '.0';
    rangeItem.end_ip_address = '' + counter3 + '.' + counter2 + '.' + counter1 + '.255';

    counter++;
    counter1++;
    if (counter1 >= 255) {
        counter2++;
        counter1 = 0;
    }
    if (counter2 >= 255) {
        counter3++;
        counter2 = 0;
    }
    rangeItem.insert();
}

var gr = new GlideRecord('discovery_range_item');
gr.addQuery('parent','=','4954d7aa1b58b410090e4376bc4bcbf2');
gr.query();
gr.deleteMultiple();