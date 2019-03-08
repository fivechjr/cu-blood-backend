"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function verifyPasscode(passcode, req, res) {
    if (req.body.passcode) {
        return req.body.passcode == passcode;
    }
    return false;
}
exports.verifyPasscode = verifyPasscode;
//# sourceMappingURL=util.passcode.js.map