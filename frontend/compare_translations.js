const fs = require('fs');

const en = JSON.parse(fs.readFileSync('src/assets/i18n/en.json', 'utf8'));
const ar = JSON.parse(fs.readFileSync('src/assets/i18n/ar.json', 'utf8'));

function compareKeys(obj1, obj2, prefix = '') {
    let missing = [];
    for (let key in obj1) {
        const fullPath = prefix ? `${prefix}.${key}` : key;
        if (!(key in obj2)) {
            missing.push(fullPath);
        } else if (typeof obj1[key] === 'object' && obj1[key] !== null) {
            missing = missing.concat(compareKeys(obj1[key], obj2[key], fullPath));
        }
    }
    return missing;
}

const missingInAr = compareKeys(en, ar);
const missingInEn = compareKeys(ar, en);

console.log("Missing in Arabic:");
console.log(missingInAr.length ? missingInAr : "None");

console.log("\nMissing in English:");
console.log(missingInEn.length ? missingInEn : "None");
