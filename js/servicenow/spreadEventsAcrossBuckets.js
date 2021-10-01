// Fix script for specific client issue
// Can be re-appropriated as needed

ar grSpectrum = new GlideRecord('em_alert');
grSpectrum.addQuery('source','=','Spectrum');
grSpectrum.addQuery('state','=','Ready');
grSpectrum.addQuery('bucket','=','66');
grSpectrum.query();

var bucketCounter = 0;

while (grSpectrum.next()) {
    grSpectrum.bucket = bucketCounter;
    grSpectrum.update();

    bucketCounter++;

    if (bucketCounter > 100)
        bucketCounter = 0;
}