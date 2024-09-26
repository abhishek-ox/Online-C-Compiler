const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "output");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = process.platform === "win32"
    ? path.join(outputPath, `${jobId}.exe`)
    : path.join(outputPath, `${jobId}.out`);

  return new Promise((resolve, reject) => {
    // Wrap file paths in double quotes to handle spaces
    const compileCommand = `g++ "${filepath}" -o "${outPath}"`;
    const executeCommand = process.platform === "win32"
      ? `"${outPath}"`  // Wrap the output path in quotes for Windows
      : `./${outPath}`;

    // Step 1: Compile the file
    exec(compileCommand, (compileError, compileStdout, compileStderr) => {
      if (compileError || compileStderr) {
        // Log compilation error and return it
        console.log("Compilation Error:", compileStderr);
        return reject({
          step: "compilation",
          error: compileError?.message || compileStderr
        });
      }

      // Step 2: Run the compiled executable
      exec(executeCommand, (runError, runStdout, runStderr) => {
        if (runError || runStderr) {
          // Log execution error and return it
          console.log("Execution Error:", runStderr);
          return reject({
            step: "execution",
            error: runError?.message || runStderr
          });
        }

        // Log and return the program's output
        console.log("Execution Output: ", runStdout);
        resolve(runStdout);
      });
    });
  });
};

module.exports = {
  executeCpp,
};
