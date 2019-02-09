import { Location } from "../models/model.location"

async function forceSync () {
    try {
        let z = await Location.sync({ force: true, logging: console.log })
        process.exit()
    } catch (e) {
        process.exit()
    }
}

forceSync()