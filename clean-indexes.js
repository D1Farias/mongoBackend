const mongoose = require('mongoose');

async function run() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/bus_backend');
    console.log('Connected to DB');
    
    // First let's just drop the collection since it's just generated services
    // and it will auto-regenerate. This is the cleanest way.
    await mongoose.connection.db.collection('generatedservices').drop();
    console.log('Collection generatedservices completly dropped. New clean start.');
    
  } catch (err) {
    console.error('Error:', err.message);
    if(err.message === "ns not found") {
        console.log("Collection already dropped or doesnt exist, we are good.");
    }
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
