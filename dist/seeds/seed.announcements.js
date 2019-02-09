"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faker = require("faker");
const model_announcement_1 = require("../models/model.announcement");
function seedAnnouncementsTable() {
    return new Promise((resolve, reject) => {
        let entries = 100;
        let data = [];
        for (let i = 0; i < entries; i++) {
            let object = {
                title: faker.lorem.sentence(),
                body: faker.lorem.paragraph(),
                displayImage: faker.image.imageUrl()
            };
            data.push(object);
        }
        model_announcement_1.Announcement.bulkCreate(data).then(() => {
            resolve();
        }).catch(e => {
            reject();
        });
    });
}
seedAnnouncementsTable().then(() => {
    process.exit();
}).catch(e => {
    console.error(e);
    process.exit();
});
//# sourceMappingURL=seed.announcements.js.map