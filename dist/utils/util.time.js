"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
function utcOffset(time) {
    return time == null ? null : moment(time).utcOffset('420').format();
}
exports.utcOffset = utcOffset;
//# sourceMappingURL=util.time.js.map