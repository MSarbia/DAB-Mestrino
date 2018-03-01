
var BARCODE_PREFIX = "";

function readBarcodeKey(event, caller, selectSerialCallback) {
    var keycode = event.keyCode;
    var barcodeBuffer = GetOrAddSession('barcodeBuffer','');
    if (keycode == 13) {   
        var bufferLength = barcodeBuffer.length; 
        var snIndex = barcodeBuffer.toUpperCase().indexOf(BARCODE_PREFIX);
        if (snIndex > -1) {                                              
            var barcode = barcodeBuffer.substring(snIndex + BARCODE_PREFIX.length, bufferLength);
            ClearSession('barcodeBuffer');
            if (barcode.length > BARCODE_PREFIX.length)
                selectSerial(barcode);
        }

        ClearSession('barcodeBuffer');    
    }
    else {
        if ((keycode >= 48 && keycode <= 57) //NUMERI
            ||
            (keycode >= 65 && keycode <= 90) // LETTERE MAIUSCOLE
            ||
            (keycode >= 97 && keycode <= 122) // MINUSCOLE
            ||
            (keycode == 32))  //SPAZIO
        {
            barcodeBuffer += '' + String.fromCharCode(keycode);
            SaveSession('barcodeBuffer', barcodeBuffer);
        }
    }
}
    