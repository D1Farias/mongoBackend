const mongoose = require('mongoose');

async function run() {
    console.log("2026-05-01 falls on day: ", new Date(2026, 4, 1).getDay()); // May is index 4
    console.log("2026-05-04 falls on day: ", new Date(2026, 4, 4).getDay());
}
run();
