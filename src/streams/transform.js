import { pipeline } from "node:stream/promises";
import { createReadStream } from "node:fs";
import { stdin, stdout } from "node:process";
import { Transform } from "node:stream";

const transform = async () => {
  const revert = new Transform({
    transform(data, _, cb) {
      this.push(data.toString().split("").reverse().join(""));
      cb();
    },
  });

  await pipeline(stdin, revert, stdout);
};

await transform();
