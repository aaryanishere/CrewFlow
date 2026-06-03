const fs = require('fs');
const path = require('path');

const srcLogo = path.join(__dirname, 'Assests', 'Logo.png');
const srcLogoTitle = path.join(__dirname, 'Assests', 'Logo with title.png');
const destDir = path.join(__dirname, 'frontend', 'public');
const destLogo = path.join(destDir, 'logo.png');
const destLogoTitle = path.join(destDir, 'logo-title.png');

try {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
    console.log('Created frontend/public directory');
  }

  if (fs.existsSync(srcLogo)) {
    fs.copyFileSync(srcLogo, destLogo);
    console.log('Copied Logo.png to frontend/public/logo.png');
  } else {
    console.error('Source Logo.png not found at: ' + srcLogo);
  }

  if (fs.existsSync(srcLogoTitle)) {
    fs.copyFileSync(srcLogoTitle, destLogoTitle);
    console.log('Copied Logo with title.png to frontend/public/logo-title.png');
  } else {
    console.error('Source Logo with title.png not found at: ' + srcLogoTitle);
  }
} catch (err) {
  console.error('Error during copy operations:', err);
}
