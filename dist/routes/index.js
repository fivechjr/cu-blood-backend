"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const listEndpoints = require("express-list-endpoints");
const getRepoInfo = require("git-repo-info");
const route_announcements_1 = require("./route.announcements");
const route_events_1 = require("./route.events");
const route_commons_1 = require("./route.commons");
const route_profile_1 = require("./route.profile");
const route_users_1 = require("./route.users");
class Routes {
    constructor() {
        this.router = express_1.Router();
    }
    bootstrap() {
        this.router.all('/endpoints', (req, res) => {
            let commit = getRepoInfo();
            res.status(200).json({
                version: '(' + commit.branch + ') ' + commit.sha,
                endpoints: listEndpoints(this.router)
            });
        });
        this.router.use('/announcements', route_announcements_1.default);
        this.router.use('/events', route_events_1.default);
        this.router.use('/profile', route_profile_1.default);
        this.router.use('/commons', route_commons_1.default);
        this.router.use('/users', route_users_1.default);
        return this.router;
    }
}
exports.default = (new Routes()).bootstrap();
//# sourceMappingURL=index.js.map