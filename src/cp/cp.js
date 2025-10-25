import { fork } from "node:child_process";

const spawnChildProcess = async (args) => {
  // exec(`"./src/cp/files/script.js" ${args[0]}  ${args[1]}`);
  fork(`./src/cp/files/script.js`, args);
};

// Put your arguments in function call to test this functionality
spawnChildProcess(["Hello", " World!"]);
