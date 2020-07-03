#!/usr/bin/env node

const _debounce = require("lodash.debounce");
const chokidar = require("chokidar");
const program = require("caporal");
const fs = require("fs");
const { spawn } = require("child_process");

program
  .version("0.0.1")
  .argument("[filename]", "File to execute")
  .action(async ({ filename }) => {
    const name = filename || "index.js";

    try {
      await fs.promises.access(name);
    } catch (err) {
      throw new Error(`File '${name}'  was not found`);
    }

    let programProcess;
    const start = _debounce(() => {
      if (programProcess) {
        programProcess.kill();
      }
      console.log(">>> New process >>>");
      programProcess = spawn("node", [name], { stdio: "inherit" });
    }, 100);

    chokidar
      .watch(".")
      .on("add", start)
      .on("change", start)
      .on("unlink", start);
  });

program.parse(process.argv);
