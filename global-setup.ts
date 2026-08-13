const fs = require('fs');
const path = require('path');

module.exports = async function globalSetup() {

    // Define the path to the session data file
    const sessionDataPath = path.join(__dirname, './sessiondata/sessionData.json');

    // Example data to be written to the session data file
  const sessionData = {
    // exampleKey: 'exampleValue',
    // setupTime: new Date().toISOString(),
  };

    // Check if the file already exists
    if (!fs.existsSync(path.dirname(sessionDataPath))) {
        // Write session data to the JSON file if it doesn't exist
        fs.mkdirSync(path.dirname(sessionDataPath), { recursive: true });
        console.log('Session data directory created:', path.dirname(sessionDataPath));
    }
    if (!fs.existsSync(sessionDataPath)) {
      // Write session data to the JSON file if it doesn't exist
      fs.writeFileSync(sessionDataPath, JSON.stringify(sessionData, null, 2));
      console.log('Session data file created:', sessionDataPath);
  }
  else {
        console.log('Session data file already exists:', sessionDataPath);
    }
    // You can also perform other setup tasks here
    console.log('Global setup complete.');
};