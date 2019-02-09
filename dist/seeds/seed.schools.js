"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_school_1 = require("../models/model.school");
let schools = [
    {
        nameTH: 'คณะวิศวกรรมศาสตร์',
        nameEN: 'Faculty of Engineering'
    },
    {
        nameTH: 'คณะพาณิชยศาสตร์และการบัญชี',
        nameEN: 'Faculty of Commerce and Accountancy'
    },
    {
        nameTH: 'คณะวิทยาศาสตร์',
        nameEN: 'Faculty of Science'
    },
    {
        nameTH: 'คณะครุศาสตร์',
        nameEN: 'Faculty of Education'
    },
    {
        nameTH: 'คณะสหเวชศาสตร์',
        nameEN: 'Faculty of Allied Health Sciences'
    },
    {
        nameTH: 'คณะอักษรศาสตร์',
        nameEN: 'Faculty of Arts'
    },
    {
        nameTH: 'คณะเภสัชศาสตร์',
        nameEN: 'Faculty of Pharmaceutical Sciences'
    },
    {
        nameTH: 'คณะเศรษฐศาสตร์',
        nameEN: 'Faculty of Economics'
    },
    {
        nameTH: 'คณะทันตแพทยศาสตร์',
        nameEN: 'Faculty of Dentistry'
    },
    {
        nameTH: 'คณะรัฐศาสตร์',
        nameEN: 'Faculty of Political Science'
    },
    {
        nameTH: 'คณะนิเทศศาสตร์',
        nameEN: 'Faculty of Communication Arts'
    },
    {
        nameTH: 'คณะจิตวิทยา',
        nameEN: 'Faculty of Psychology'
    },
    {
        nameTH: 'คณะนิติศาสตร์',
        nameEN: 'Faculty of Law'
    },
    {
        nameTH: 'คณะพยาบาลศาสตร์',
        nameEN: 'Faculty of Nursing'
    },
    {
        nameTH: 'คณะแพทยศาสตร์',
        nameEN: 'Faculty of Medicine'
    },
    {
        nameTH: 'คณะศิลปกรรมศาสตร์',
        nameEN: 'Faculty of Fine and Applied Arts'
    },
    {
        nameTH: 'คณะสถาปัตยกรรมศาสตร์',
        nameEN: 'Faculty of Architecture'
    },
    {
        nameTH: 'คณะสัตวแพทยศาสตร์',
        nameEN: 'Faculty of Veterinary Science'
    },
    {
        nameTH: 'คณะวิทยาศาสตร์การกีฬา',
        nameEN: 'Faculty of Sports Science'
    },
    {
        nameTH: 'วิทยาลัยวิทยาศาสตร์สาธารณสุข',
        nameEN: 'College of Public Health Sciences'
    },
    {
        nameTH: 'บัณฑิตวิทยาลัย',
        nameEN: 'Graduate School'
    },
    {
        nameTH: 'สำนักวิชาทรัพยากรการเกษตร',
        nameEN: 'School of Agricultural'
    },
    {
        nameTH: 'อื่น ๆ',
        nameEN: 'Other'
    }
];
function seedSchoolsTable() {
    return new Promise((resolve, reject) => {
        model_school_1.School.bulkCreate(schools).then(() => {
            resolve();
        }).catch(e => {
            reject();
        });
    });
}
seedSchoolsTable().then(() => {
    process.exit();
}).catch(e => {
    console.error(e);
    process.exit();
});
//# sourceMappingURL=seed.schools.js.map