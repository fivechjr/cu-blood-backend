"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faker = require("faker");
const model_project_1 = require("../models/model.project");
function seedProjectsTable() {
    return new Promise((resolve, reject) => {
        let entries = 100;
        let data = [];
        for (let i = 0; i < entries; i++) {
            let object = {
                name: faker.lorem.sentence(),
                registrationStartDate: faker.date.recent(),
                registrationEndDate: faker.date.recent(),
                startDate: faker.date.recent(),
                endDate: faker.date.recent()
            };
            data.push(object);
        }
        model_project_1.Project.bulkCreate(data).then(() => {
            resolve();
        }).catch(e => {
            reject();
        });
    });
}
seedProjectsTable().then(() => {
    process.exit();
}).catch(e => {
    console.error(e);
    process.exit();
});
//# sourceMappingURL=seed.projects.js.map