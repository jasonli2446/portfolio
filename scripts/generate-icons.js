const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const sizes = {
  "icon.png": 32,
  "apple-icon.png": 180,
};

async function generateIcons() {
  const svgPath = path.join(__dirname, "../public/globe.svg");

  // Generate PNG icons
  for (const [filename, size] of Object.entries(sizes)) {
    await sharp(svgPath)
      .resize(size, size)
      .toFile(path.join(__dirname, "../public", filename));
  }

  // Generate favicon.ico
  await sharp(svgPath)
    .resize(32, 32)
    .toFile(path.join(__dirname, "../public/favicon.ico"));

  console.log("Icons generated successfully!");
}

generateIcons().catch(console.error);
