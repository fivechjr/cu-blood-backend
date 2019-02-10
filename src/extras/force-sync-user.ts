import { User } from "../models/model.user"

async function forceSync () {
    try {
        let z = await User.sync({ force: true, logging: console.log })
        process.exit()
    } catch (e) {
        process.exit()
    }
}

forceSync()