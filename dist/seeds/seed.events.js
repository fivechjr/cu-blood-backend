"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faker = require("faker");
const model_event_1 = require("../models/model.event");
function seedEventsTable() {
    return new Promise((resolve, reject) => {
        let entries = 100;
        let data = [];
        for (let i = 0; i < entries; i++) {
            let object = {
                title: faker.lorem.sentence(),
                body: faker.lorem.paragraph(),
                location: faker.address.city(),
                displayImage: faker.image.imageUrl(),
                startDate: faker.date.recent(),
                endDate: faker.date.recent()
            };
            data.push(object);
        }
        model_event_1.Event.bulkCreate(data).then(() => {
            resolve();
        }).catch(e => {
            reject();
        });
    });
}
seedEventsTable().then(() => {
    process.exit();
}).catch(e => {
    console.error(e);
    process.exit();
});
//# sourceMappingURL=seed.events.js.map