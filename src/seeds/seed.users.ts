import * as faker from 'faker'
import { User } from '../models/model.user'

function seedUsersTable () {
    return new Promise((resolve, reject) => {
        let entries = 100
        let data = []
        for (let i = 0; i < entries; i++) {
            let object = {
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                nickname: faker.name.firstName(),
                gender: faker.random.number({ 'min': 0, 'max': 1 }),
                bloodType: faker.random.number({ 'min': 0, 'max': 7 }),
                birthday: faker.date.recent(),
                username: faker.internet.userName(),
                password: '123456',
                medicalCondition: faker.lorem.sentence(),
                studentId: String(faker.random.number({ 'min': 3000000000, 'max': 6000000000 })),
                phoneNumber: faker.phone.phoneNumber(),
                weight: faker.random.number({ 'min': 40, 'max': 70 }),
                registrationPoint: faker.random.number({ 'min': 0, 'max': 1 }),
                status: faker.random.number({ 'min': 0, 'max': 3 }),
                shirtSize: faker.random.number({ 'min': 0, 'max': 6 }),
                onboarding: faker.random.number({ 'min': -1, 'max': 1 }),
                schoolId: faker.random.number({ 'min': 1, 'max': 23 }),
                nationality: faker.random.number({ 'min': 0, 'max': 1 }),
                academicYear: faker.random.number({ 'min': 0, 'max': 8 }),
                isDonated: faker.random.number({ 'min': 0, 'max': 1 }),
                isEnrolled: faker.random.number({ 'min': 0, 'max': 1 })
            }
            data.push(object)
        }

        User.bulkCreate(data, { individualHooks: true }).then(() => {
            resolve()
        }).catch(e => {
            reject()
        })
    })
}

seedUsersTable().then(() => {
    process.exit()
}).catch(e => {
    console.error(e)
    process.exit()
})