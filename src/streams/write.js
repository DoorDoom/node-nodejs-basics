import { createWriteStream } from "node:fs";
import { stdin, exit } from "node:process";

const write = async () => {
  const writable = createWriteStream("./src/streams/files/fileToWrite.txt", {
    encoding: "utf-8",
  });

  stdin.once("data", (chunk) => {
    writable.write(chunk.toString());
    writable.end();
    exit();
  });
};

await write();
