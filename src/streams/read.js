import { pipeline } from "node:stream/promises";
import { createReadStream } from "node:fs";
import { stdout } from "node:process";

const read = async () => {
  const readable = createReadStream("./src/streams/files/fileToRead.txt", {
    encoding: "utf-8",
  });

  // readable.on("data", (chunk) => {
  //   stdout.write(`${chunk}\n`);
  // });
  //can use for reading of the message in terminal, while the code process is alive
  // .on("close", () => {
  //   setTimeout(() => {
  //     stdout.write("close");
  //   }, 1000);
  // });

  await pipeline(readable, async (source) => {
    for await (const chunk of source) stdout.write(`${chunk}\n`);
  });
};

await read();
