const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "output");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.out`);

  return new Promise((resolve, reject) => {
    exec(
      `g++ ${filepath} -o ${outPath} 2>&1 && cd ${outputPath} && ${jobId}.out`, // Redirect stderr to stdout
      (error, stdout, stderr) => {
        if (stderr) {
          return reject(stderr); // Return stderr as the error message
        }
        if (error) {
          return reject({ error: error.message, stderr }); // Capture and return the error
        }
        resolve(stdout); // Return the output if successful
      }
    );
  });
};

module.exports = {
  executeCpp,
};
