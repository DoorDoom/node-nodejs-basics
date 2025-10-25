import { cpus } from "node:os";
import { Worker } from "node:worker_threads";

const performCalculations = async () => {
  const cores = cpus().length;
  const result = [];

  for (let i = 0; i < cores; i++) {
    const worker = new Worker("./src/wt/worker.js", { workerData: i + 1 });

    worker.on("message", (data) => {
      result.push({ status: data ? "resolved" : "error", data });
    });

    worker.on("exit", () => {
      if (result.length == cores) console.log(result);
    });
  }
};

await performCalculations();
