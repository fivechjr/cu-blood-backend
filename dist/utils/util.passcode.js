"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function verifyPasscode(passcode, req, res) {
    console.log('[*] req.body', req.body);
    console.log('[*] passcode', passcode);
    if (req.body.passcode) {
        console.log('[*] req.body.passcode', req.body.passcode);
        console.log('[*] passcode', passcode);
        return req.body.passcode === passcode;
    }
    return false;
}
exports.verifyPasscode = verifyPasscode;
//# sourceMappingURL=util.passcode.js.map