const express = require("express");
const router = express.Router();
const path = require("path");
const { spawn } = require("child_process");

const SCRIPT_PATH = path.join(__dirname, "scripts/script.py");

let values = {};

router.post("/", (req, res) => {
  values = req.body;
  res.redirect("/runPython");
});

router.get("/", function (req, res) {
  const passvalue = Object.values(values);
  let title = passvalue[passvalue.length - 1];

  console.log("Running script with arguments:", `working ${passvalue.join(" ")}`);
  const scriptProcess = runScript(`working ${passvalue.join(" ")}`, title);

  res.set("Content-Type", "application/json");
  let scriptOutput = '';

  scriptProcess.stdout.on("data", (data) => {
    console.log("Script output chunk:", data.toString());
    scriptOutput += data.toString();
  });

  scriptProcess.stdout.on("end", () => {
    console.log("Final script output:", scriptOutput);
    res.json({ output: scriptOutput });
  });

  scriptProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  scriptProcess.on("close", (code) => {
    console.log(`Child process exited with code ${code}`);
  });
});

/**
 * @param param {String}
 * @param title {String}
 * @return {ChildProcess}
 */
function runScript(param, title) {
  return spawn("python3", ["-u", SCRIPT_PATH, "--foo", param, title]);
}

module.exports = router;
