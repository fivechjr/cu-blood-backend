import * as faker from 'faker'
import { Project } from '../models/model.project'

function seedProjectsTable () {
    return new Promise((resolve, reject) => {
        let entries = 100
        let data = []
        for (let i = 0; i < entries; i++) {
            let object = {
                name: faker.lorem.sentence(),
                registrationStartDate: faker.date.recent(),
                registrationEndDate: faker.date.recent(),
                startDate: faker.date.recent(),
                endDate: faker.date.recent()
            }
            data.push(object)
        }

        Project.bulkCreate(data).then(() => {
            resolve()
        }).catch(e => {
            reject()
        })
    })
}

seedProjectsTable().then(() => {
    process.exit()
}).catch(e => {
    console.error(e)
    process.exit()
})