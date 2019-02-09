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
const model_announcement_1 = require("../models/model.announcement");
const model_event_1 = require("../models/model.event");
const model_session_1 = require("../models/model.session");
const model_project_1 = require("../models/model.project");
const model_location_1 = require("../models/model.location");
const model_school_1 = require("../models/model.school");
const model_time_1 = require("../models/model.time");
function forceSync() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let x = yield model_time_1.Time.sync({ force: true, logging: console.log });
            let z = yield model_location_1.Location.sync({ force: true, logging: console.log });
            let y = yield model_school_1.School.sync({ force: true, logging: console.log });
            let a = yield model_user_1.User.sync({ force: true, logging: console.log });
            let e = yield model_project_1.Project.sync({ force: true, logging: console.log });
            let b = yield model_session_1.Session.sync({ force: true, logging: console.log });
            let d = yield model_event_1.Event.sync({ force: true, logging: console.log });
            let c = yield model_announcement_1.Announcement.sync({ force: true, logging: console.log });
            process.exit();
        }
        catch (e) {
            process.exit();
        }
    });
}
forceSync();
//# sourceMappingURL=force-sync.js.map