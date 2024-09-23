const express = require("express");
const { generateFile } = require("./generateFile");
const { executeCpp } = require("./executeCpp");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ hello: "world" });
});

app.post("/run", async (req, res) => {
  const { language = "cpp", code } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, error: "Empty code body!" });
  }

  try {
    const filePath = await generateFile(language, code);
    const output = await executeCpp(filePath);
    return res.json({ filePath, output });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      error: "An error occurred while executing the code.",
    });
  }
});

app.listen(5000, () => {
  console.log(`Listening at Port 5000`);
});
