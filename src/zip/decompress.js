import { createReadStream, createWriteStream } from "node:fs";
import { createUnzip } from "node:zlib";
import { pipeline } from "node:stream/promises";

const decompress = async () => {
  const gzip = createUnzip();
  const source = createReadStream("./src/zip/files/archive.gz");
  const destination = createWriteStream("./src/zip/files/fileToCompress.txt");

  await pipeline(source, gzip, destination);
};

await decompress();
