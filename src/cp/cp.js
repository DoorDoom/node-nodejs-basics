import { fork } from "node:child_process";

const spawnChildProcess = async (args) => {
  fork(`./src/cp/files/script.js`, args);
};

// Put your arguments in function call to test this functionality
spawnChildProcess(["Hello", " World!"]);
