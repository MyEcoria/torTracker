import * as db from '../modules/db.mjs';

async function test() {
    const test = db.getAllLatest();
    console.log(test);
}