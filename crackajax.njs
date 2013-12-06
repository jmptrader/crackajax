#!/usr/bin/env node

var crackajax = require('./crackajax');
var XLS = require('xlsjs'); 
var wb = XLS.readFile(process.argv[2] || 'Book1.xls');
var password = process.argv[3] || '';
if(!wb.Encryption) {
	console.error("File is not password-protected");
	process.exit(1);
}
var d = wb.Encryption.Data;
if(wb.Encryption.Type === 1 && wb.Encryption.Info === 1) {
	if(password === "::") {
		var tic, toc, iters;
		iters = parseInt(process.argv[4] || "1000");
		start = parseInt(process.argv[5] || "0000000000",16);
		
		var verifier = crackajax.unhexlify(d.EncryptedVerifier + d.EncryptedVerifierHash);
		tic = process.hrtime();
		var end = start + iters;
		for(; start != end; ++start)
			if(crackajax.verifyrc4key(start.toString(16), d.Salt, verifier)) { iters = 0; break; }
		toc = process.hrtime(tic);
		console.error(toc);
		if(iters === 0) console.error("Found Key: " + start.toString(16)); 
	}
	else console.log(crackajax.verifyrc4(password, d.Salt, d.EncryptedVerifier, d.EncryptedVerifierHash));
;
} else {
	console.error("File is encrypted using an unsupported format");
	process.exit(2);
}
