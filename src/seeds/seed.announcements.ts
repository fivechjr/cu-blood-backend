import * as faker from 'faker'
import { Announcement } from '../models/model.announcement'

function seedAnnouncementsTable () {
    return new Promise((resolve, reject) => {
        let entries = 100
        let data = []
        for (let i = 0; i < entries; i++) {
            let object = {
                title: faker.lorem.sentence(),
                body: faker.lorem.paragraph(),
                displayImage: faker.image.imageUrl()
            }
            data.push(object)
        }

        Announcement.bulkCreate(data).then(() => {
            resolve()
        }).catch(e => {
            reject()
        })
    })
}

seedAnnouncementsTable().then(() => {
    process.exit()
}).catch(e => {
    console.error(e)
    process.exit()
})