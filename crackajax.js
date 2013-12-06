var crackajax;
(function(exports) {
if(typeof require !== 'undefined') {
	if(typeof crypto === 'undefined') var crypto = require('crypto');
}

//equivalent to crypto.createDecipheriv("rc4", key,'').update(data,'binary');
function rc4(key, data) {
	var S = new Array(256);
	var c = 0, i = 0; j = 0, t = 0;
	for(i = 0; i != 256; ++i) S[i] = i;
	for(i = 0; i != 256; ++i) {
		j = (j + S[i] + (key[i%key.length]).charCodeAt(0))%256; 
		t = S[i]; S[i] = S[j]; S[j] = t;
	}
	i = j = 0; out = Buffer(data.length); 
	for(c = 0; c != data.length; ++c) {
		i = (i + 1)%256;
		j = (j + S[i])%256;
		t = S[i]; S[i] = S[j]; S[j] = t;
		out[c] = (data[c] ^ S[(S[i]+S[j])%256]);
	}
	return out;
};

var unhexlify = exports.unhexlify = function unhexlify(x) { return Buffer(x.match(/../g).map(function(x) { return parseInt(x,16);})); };

exports.verifyrc4 = function verifyrc4(password, salt, encver, encverh) {
	var pass = new Buffer(password, 'utf16le');
	var h0 = crypto.createHash('md5').update(pass).digest('hex');
	return exports.verifyrc4key(h0.substr(0,10), salt, unhexlify(encver+encverh));
};

/* [MS-OFFCRYPTO] 2.3.3 */
exports.verifyrc4key = function verifyrc4key(h0, salt, verifier) {
	var IntermediateBuffer = (h0+salt);
	while(IntermediateBuffer.length < 42) IntermediateBuffer = "00" + IntermediateBuffer; 
	for(var i = 0; i != 4; ++i) IntermediateBuffer += IntermediateBuffer; // repeat string 16 types
	
	var h1 = crypto.createHash('md5').update(unhexlify(IntermediateBuffer)).digest('hex');
	var enckey = crypto.createHash('md5').update(unhexlify(h1.substr(0,10) + "00000000")).digest('binary');
	var decrypted = rc4(enckey, verifier);
	var newmd5h = crypto.createHash('md5').update(decrypted.slice(0,16)).digest('hex');
	return newmd5h === decrypted.slice(16).toString('hex');
};
})(typeof exports !== 'undefined' ? exports : crackajax);
