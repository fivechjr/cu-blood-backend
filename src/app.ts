// 
// CU Blood Application Programming Interface (API)
// Patcharapat Chaijaroen
// 


import * as dotenv from 'dotenv'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as helmet from 'helmet'
import * as compression from 'compression'
import * as passport from 'passport'
import * as session from 'express-session'
import * as connectRedis from 'connect-redis'
import * as cors from 'cors'
import { config } from './config'
// import * as rateLimit from 'express-rate-limit'

const RedisStore = connectRedis(session)

dotenv.config()

import routes from './routes'
import { apiResponse } from './utils/util.response'

class App {
    public app: express.Application

    constructor () {
        this.app = express()
        this.config()
    }

    private config () : void {
        this.app.use(helmet())
        this.app.use(compression())
        this.app.use(cors({
            "origin": [...config.enableCORS],
            "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
            "preflightContinue": false,
            "optionsSuccessStatus": 204,
            "credentials": true
          }))
        // this.app.use(cors())
        this.app.set('trust proxy', 1)
        // this.app.use(rateLimit({
        //     windowMs: 15 * 60 * 1000,
        //     max: 100,
        //     handler: (req, res) => {
        //         apiResponse(res, 429)
        //         return
        //     }
        // }))
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({ extended: false }))
        this.app.use(session({
            proxy: true,
            store: new RedisStore({
                host: process.env.RD_HOST,
                port: process.env.RD_PORT
            }),
            secret: process.env.API_SECRET,
            saveUninitialized: false, // false
            resave: false,
            cookie: {
                // secure: true,
                // secureProxy: true,
                domain: '.' + process.env.API_URL,
                // domain: 'localhost',
                maxAge: 3 * 60 * 60 * 1000,
                // httpOnly: true,
            }
        }))
        this.app.use(passport.initialize())
        this.app.use(passport.session())
        this.app.use(process.env.API_ROOT, routes)
        this.app.all('*', (req: express.Request, res: express.Response) => {
            apiResponse(res, 501, {
                originalUrl: req.originalUrl,
                root: process.env.API_ROOT
            })
        })
    }
}

export default (new App()).app