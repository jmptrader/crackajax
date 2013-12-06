# crackajax

[MS-OFFCRYPTO] encryption tools (currently a password validator for `XLS` files)

## Installation

`npm install -g crackajax`

## Usage

```
$ crackajax password_protected_file.xls trial_password
```

will warn you if the file is not password protected, or print true/false.

```
$ crackajax password_protected_file.xls :: number_of_iterations [starting_key]
```

will attempt to perform a direct key attack on the XLS (40-bit key) by trying 
values starting from `starting_key` (expressed as 40-bit hexadecimal: 10 chars)
and running up to `starting_key + number_of_iterations - 1`.  It will print out
timing information for the attack.


In JS: (currently unsupported in the browser, but that is a goal)

```
var crackajax = require('crackajax');
crackajax.verifyrc4(password, salt, verifier, verifier_hash)
```

For more details, consult [MS-OFFCRYPTO](http://download.microsoft.com/download/2/4/8/24862317-78F0-4C4B-B355-C7B2C1D997DB/[MS-XLS].pdf)
