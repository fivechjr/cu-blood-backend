"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const compression = require("compression");
const passport = require("passport");
const session = require("express-session");
const connectRedis = require("connect-redis");
const cors = require("cors");
const config_1 = require("./config");
// import * as rateLimit from 'express-rate-limit'
const RedisStore = connectRedis(session);
dotenv.config();
const routes_1 = require("./routes");
const util_response_1 = require("./utils/util.response");
class App {
    constructor() {
        this.app = express();
        this.config();
    }
    config() {
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(cors({
            "origin": [...config_1.config.enableCORS],
            "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
            "preflightContinue": false,
            "optionsSuccessStatus": 204,
            "credentials": true
        }));
        // this.app.use(cors())
        this.app.set('trust proxy', 1);
        // this.app.use(rateLimit({
        //     windowMs: 15 * 60 * 1000,
        //     max: 100,
        //     handler: (req, res) => {
        //         apiResponse(res, 429)
        //         return
        //     }
        // }))
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(session({
            proxy: true,
            store: new RedisStore({
                host: process.env.RD_HOST,
                port: process.env.RD_PORT
            }),
            secret: process.env.API_SECRET,
            saveUninitialized: false,
            resave: false,
            cookie: {
                // secure: true,
                // secureProxy: true,
                domain: '.' + process.env.API_URL,
                // domain: 'localhost',
                maxAge: 3 * 60 * 60 * 1000,
            }
        }));
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        this.app.use(process.env.API_ROOT, routes_1.default);
        this.app.all('*', (req, res) => {
            util_response_1.apiResponse(res, 501, {
                originalUrl: req.originalUrl,
                root: process.env.API_ROOT
            });
        });
    }
}
exports.default = (new App()).app;
//# sourceMappingURL=app.js.map