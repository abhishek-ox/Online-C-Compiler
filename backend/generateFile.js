const fs = require("fs"); // Standard fs module for synchronous methods
const fsPromises = require("fs").promises; // Promises version
const path = require("path");
const { v4: uuid } = require("uuid");

const dirCodes = path.join(__dirname, "codes");

if (!fs.existsSync(dirCodes)) { // Check if the directory exists
  fs.mkdirSync(dirCodes, { recursive: true }); // Create directory if it doesn't exist
}

const generateFile = async (format, content) => {
  const jobId = uuid(); // Generate a unique job ID
  const filename = `${jobId}.${format}`; // Create filename with UUID and format
  const filePath = path.join(dirCodes, filename); // Full path for the file

  // Use the promises version to write the file
  await fsPromises.writeFile(filePath, content); // No callback needed

  return filePath; // Return the file path
};

module.exports = {
  generateFile,
};
