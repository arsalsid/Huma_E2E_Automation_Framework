const fs = require('fs');
const path = require('path');

module.exports = async function globalTeardown() {
    // Define the path to the session data file
    const sessionDataPath = path.join(__dirname, './sessiondata/sessionData.json');

    // Check if the file exists
  if (fs.existsSync(sessionDataPath)) {
    // Delete the file
    fs.unlinkSync(sessionDataPath);
    console.log('Session data file deleted:', sessionDataPath);
  } else {
    console.log('Session data file does not exist:', sessionDataPath);
  }

    // You can also perform other teardown tasks here

    console.log('Global teardown complete.');


};