"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const model_user_1 = require("../models/model.user");
function forceSync() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let z = yield model_user_1.User.sync({ force: true, logging: console.log });
            process.exit();
        }
        catch (e) {
            console.log(e);
            process.exit();
        }
    });
}
forceSync();
//# sourceMappingURL=force-sync-user.js.map