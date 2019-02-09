import { User } from "../models/model.user"
import { Announcement } from "../models/model.announcement"
import { Event } from "../models/model.event"
import { Session } from "../models/model.session"
import { Project } from "../models/model.project"
import { Location } from "../models/model.location"
import { School } from "../models/model.school"
import { Time } from "../models/model.time";

async function forceSync () {
    try {
        let x = await Time.sync({ force: true, logging: console.log })
        let z = await Location.sync({ force: true, logging: console.log })
        let y = await School.sync({ force: true, logging: console.log })
        let a = await User.sync({ force: true, logging: console.log })
        let e = await Project.sync({ force: true, logging: console.log })
        let b = await Session.sync({ force: true, logging: console.log })
        let d = await Event.sync({ force: true, logging: console.log })
        let c = await Announcement.sync({ force: true, logging: console.log })
        process.exit()
    } catch (e) {
        process.exit()
    }
}

forceSync()