const fs = require('fs');
const path = require('path');

const resultsDir = path.join(__dirname, '..', 'allure-results');

if (fs.existsSync(resultsDir)) {
  fs.rmSync(resultsDir, { recursive: true, force: true });
  console.log('Cleaned old allure-results (previous browser runs removed).');
} else {
  console.log('No allure-results folder to clean.');
}
