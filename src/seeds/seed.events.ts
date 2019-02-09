import * as faker from 'faker'
import { Event } from '../models/model.event'

function seedEventsTable () {
    return new Promise((resolve, reject) => {
        let entries = 100
        let data = []
        for (let i = 0; i < entries; i++) {
            let object = {
                title: faker.lorem.sentence(),
                body: faker.lorem.paragraph(),
                location: faker.address.city(),
                displayImage: faker.image.imageUrl(),
                startDate: faker.date.recent(),
                endDate: faker.date.recent()
            }
            data.push(object)
        }

        Event.bulkCreate(data).then(() => {
            resolve()
        }).catch(e => {
            reject()
        })
    })
}

seedEventsTable().then(() => {
    process.exit()
}).catch(e => {
    console.error(e)
    process.exit()
})